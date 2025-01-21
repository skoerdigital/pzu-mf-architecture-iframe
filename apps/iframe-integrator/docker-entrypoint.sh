#!/bin/sh

JS_FILES_DIR="/usr/share/nginx/html"

echo "===> Podmieniamy placeholdery w formacie #{VAR}# na wartości zmiennych środowiskowych..."

for var_name in $(env | cut -d= -f1); do
  value="$(printenv "$var_name")"

  find "$JS_FILES_DIR" -type f -name '*.js' -exec \
    sed -i "s|#{$var_name}#|$value|g" {} \;
done

exec nginx -g 'daemon off;'
