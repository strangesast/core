#!/bin/bash
<<<<<<< HEAD
docker run --rm -it --network=core_default wurstmeister/kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server kafka:9092 \
=======
docker run --rm -it --network=host wurstmeister/kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 \
>>>>>>> dev
  --list
