#/bin/bash
./env/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic output \
  #--from-beginning
