from nginx
copy nginx.conf /etc/nginx/nginx.conf
run mkdir /certs && rm -rf /usr/share/nginx/html
volume /usr/share/nginx/html
volume /certs
entrypoint ["nginx", "-g", "daemon off;"]
