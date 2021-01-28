from nginx
copy dev.conf /etc/nginx/nginx.conf
run rm -rf /usr/share/nginx/html
copy dev.html /usr/share/nginx/html/index.html
entrypoint ["nginx", "-g", "daemon off;"]
