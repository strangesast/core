#!/bin/bash
#ssh -L 2181:localhost:2181 -L 9092:localhost:9092 -L 3003:localhost:3003 -L 3306:localhost:3306 work
#ssh -L 2181:localhost:2181 -L 9092:localhost:9092 -L 3003:localhost:3003 -L 3306:localhost:3306 production -N
ssh -L localhost:2181:production:2181 -L localhost:9092:production:9092 -L localhost:3003:timeclock:3003 -L localhost:3306:timeclock:3306 localhost -N
