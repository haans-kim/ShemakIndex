FROM nginx:alpine

COPY ["HTML/0. Shemak-Control-Tower.html", "/usr/share/nginx/html/index.html"]

EXPOSE 80
