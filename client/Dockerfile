from node
workdir /usr/src/app
copy package*.json ./
run npm install
copy . .
run npm run-script ng build --prod=true --statsJson=true --optimization=true --aot=true --buildOptimizer=true
volume /build
cmd ["cp", "-r", "/usr/src/app/dist/core", "/build/"]
