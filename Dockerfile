FROM nginx:alpine

COPY Index.html /usr/share/nginx/html/index.html
COPY script.js /usr/share/nginx/html/script.js

EXPOSE 80