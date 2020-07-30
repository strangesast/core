#!/bin/bash
docker run --network=host --rm -it mariadb mysql \
  -h 10.0.0.62 \
  -P 3306 \
  --user=root \
  --password=password \
  -D tam
