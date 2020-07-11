#/bin/bash
# --property print.timestamp=true \
<<<<<<< HEAD
docker run --rm -it --network=core_default wurstmeister/kafka /opt/kafka/bin/kafka-console-consumer.sh \
  --from-beginning \
  --property print.key=true \
  --bootstrap-server kafka:29092 \
=======
docker run --rm -it --network=host wurstmeister/kafka /opt/kafka/bin/kafka-console-consumer.sh \
  --from-beginning \
  --property print.key=true \
  --bootstrap-server localhost:9092 \
>>>>>>> dev
  --topic ${1:-input-text}
