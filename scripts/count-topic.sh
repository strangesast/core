#!/bin/bash
<<<<<<< HEAD
docker run --rm -it --network=core_default wurstmeister/kafka /opt/kafka/bin/kafka-run-class.sh kafka.tools.GetOffsetShell \
  --broker-list kafka:9092 \
=======
docker run --rm -it --network=host wurstmeister/kafka /opt/kafka/bin/kafka-run-class.sh kafka.tools.GetOffsetShell \
  --broker-list localhost:9092 \
>>>>>>> dev
  --time -1 \
  --topic ${1:-input-text}
