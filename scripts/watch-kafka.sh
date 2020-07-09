#/bin/bash
# --property print.timestamp=true \
docker run --rm -it --network=core_default wurstmeister/kafka /opt/kafka/bin/kafka-console-consumer.sh \
  --from-beginning \
  --property print.key=true \
  --bootstrap-server kafka:9092 \
  --topic ${1:-input-text}
