#!/bin/sh
# entrypoint.sh

envsubst '$VITE_BASE_URL' \
  < /usr/share/nginx/html/index.html.template \
  > /usr/share/nginx/html/index.html

exec nginx -g 'daemon off;'
