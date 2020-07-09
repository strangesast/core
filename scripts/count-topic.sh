#!/bin/bash
docker run --rm -it --network=core_default wurstmeister/kafka /opt/kafka/bin/kafka-run-class.sh kafka.tools.GetOffsetShell \
  --broker-list kafka:9092 \
  --time -1 \
  --topic ${1:-input-text}
