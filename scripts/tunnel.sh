#!/bin/bash
ssh -L 2181:localhost:2181 -L 9092:localhost:9092 -L 3003:localhost:3003 -L 3306:localhost:3306 work
