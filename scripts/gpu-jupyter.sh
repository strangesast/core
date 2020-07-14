#!/bin/bash
docker run \
  --network=core_default \
  --name core_jupyter_1 \
  --gpus all \
  --hostname jupyter \
  -d \
  --volume $(pwd)/notebooks:/home/jovyan/work \
  strangesast/core_jupyter
