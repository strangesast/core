package main

import (
	"bufio"
	"context"
	"github.com/Shopify/sarama"
	"github.com/gogo/protobuf/proto"
	ptypes "github.com/golang/protobuf/ptypes"
	pb "github.com/strangesast/core/serial-monitoring/proto"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"fmt"
	"log"
	"net"
	"os"
	"strings"
	"time"
)

const timestampFormat = "2006-01-02T15:04:05.999Z"

func main() {
	// kafka stuff
	kafkaVersion, err := sarama.ParseKafkaVersion(getEnv("KAFKA_VERSION", "2.4.1"))
	if err != nil {
		log.Fatalln("failed to parse kafka version string")
	}

	config := sarama.NewConfig()
	config.Net.DialTimeout = 5 * time.Minute
	config.Version = kafkaVersion
	config.Producer.Return.Successes = true
	config.ClientID = "golang-serial-monitoring-producer"

	kafkaHosts := strings.Split(getEnv("KAFKA_HOSTS", "localhost:9092"), ",")
	log.Printf("using KAFKA_VERSION='%v', KAFKA_HOSTS='%v'\n", kafkaVersion, kafkaHosts)

	kafkaClient, err := sarama.NewClient(kafkaHosts, config)

	if err != nil {
		log.Fatalf("failed to create sarama kafka client: %v", err)
	}
	// should eventually use async
	// producer, err := sarama.NewAsyncProducerFromClient(kafkaClient)
	producer, err := sarama.NewSyncProducerFromClient(kafkaClient)

	// mongo stuff
	mongoURI := getEnv("MONGO_URI", "mongodb://localhost:27017")
	log.Printf("using MONGO_URI='%s'", mongoURI)
	client := newMongoClient(mongoURI)
	if err != nil {
		log.Fatalf("failed to connect to mongodb database: %v", err)
	}
	collection := client.Database("monitoring").Collection("input")

	// tcp socket stuff
	adapterHost := getEnv("ADAPTER_HOST", "localhost:7878")

	machineID := getEnv("MACHINE_ID", "unknown")
	log.Printf("using MACHINE_ID='%s'\n", machineID)

	var d net.Dialer
	conn, err := d.DialContext(context.Background(), "tcp", adapterHost)
	if err != nil {
		log.Fatalf("Failed to dial: %v", err)
	}
	defer conn.Close()
	log.Printf("using ADAPTER_HOST='%s'", adapterHost)

	ticker := time.NewTicker(10 * time.Second)

	quit := make(chan struct{})
	go func() {
		for {
			select {
			case <- ticker.C:
				fmt.Fprintf(conn, "* PING")
			case <- quit:
			    ticker.Stop()
			    return
			}
		}
	 }()

	reader := bufio.NewReader(conn)
	for {
		buf, err := reader.ReadBytes('\n')
		if err != nil {
			log.Fatalf("Error while reading: %v", err)
			continue
		}

		line := strings.TrimSuffix(string(buf), "\n")

		values := strings.Split(line, "|")
		timestampString, values := values[0], values[1:]

		if strings.HasPrefix(line, "* PONG") {
			continue
		}

		timestamp, err := time.Parse(timestampFormat, timestampString)
		if err != nil {
			log.Printf("failed to parse timestamp: %s (%s)\n", timestampString, timestampFormat)
			continue
		}

		timestampProto, err := ptypes.TimestampProto(timestamp)
		if err != nil {
			log.Printf("failed to parse proto timestamp: %+v\n", timestamp)
			continue
		}

		msg := &pb.Sample{
			Timestamp: timestampProto,
			Values:    values,
		}

		bytes, err := proto.Marshal(msg)
		if err != nil {
			log.Printf("failed to marshall proto: %+v\n", msg)
			continue
		}

		_, err = collection.InsertOne(context.Background(), bson.M{
			"timestamp": timestamp.Format(time.RFC3339),
			"values":    values,
		})
		if err != nil {
			// ignore
		}

		kMessage := &sarama.ProducerMessage{Topic: "input", Value: sarama.ByteEncoder(bytes), Key: sarama.StringEncoder(machineID)}
		// producer.Input() <- kMessage
		_, _, err = producer.SendMessage(kMessage)
		// partition, offset, err := producer.SendMessage(kMessage)
		if err != nil {
			log.Println("failed to write message to kafka")
			// ignore
		}
		// log.Printf("partition: %d, offset: %d\n", partition, offset)
	}
}

func newMongoClient(uri string) *mongo.Client {
	client, err := mongo.NewClient(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("failed to create mongodb client config: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	err = client.Connect(ctx)

	return client
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
