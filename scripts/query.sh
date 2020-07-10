docker run -e PGPASSWORD=password --network=core_default --rm -it postgres psql \
  -U postgres \
  -h postgres \
  -d ${1:-production}
