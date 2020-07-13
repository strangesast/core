from nginx
copy dev.conf /etc/nginx/nginx.conf
run rm -rf /usr/share/nginx/html
entrypoint ["nginx", "-g", "daemon off;"]
