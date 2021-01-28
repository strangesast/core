from node as builder

workdir /usr/src/app

copy client/package*.json ./
run npm install

copy client/ .
run npm run-script ng build --prod=true --statsJson=true --optimization=true --aot=true --buildOptimizer=true

from nginx

copy --from=builder /usr/src/app/dist/core /usr/share/nginx/html/
copy nginx/default.conf.template /etc/nginx/templates/
