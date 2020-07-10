#!/bin/bash
docker run --rm -it --network=core_default wurstmeister/kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server kafka:9092 \
  --list
