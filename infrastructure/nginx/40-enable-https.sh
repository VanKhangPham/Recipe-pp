#!/bin/sh
set -eu

DOMAIN="${TLS_DOMAIN:-}"
CERT="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
KEY="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"
TEMPLATE="/etc/nginx/templates-custom/https.conf"
TARGET="/etc/nginx/conf.d/https.conf"

if [ -n "$DOMAIN" ] && [ -f "$CERT" ] && [ -f "$KEY" ] && [ -f "$TEMPLATE" ]; then
    echo "40-enable-https.sh: Enabling HTTPS for ${DOMAIN}"
    sed "s/__TLS_DOMAIN__/${DOMAIN}/g" "$TEMPLATE" > "$TARGET"
else
    echo "40-enable-https.sh: No TLS cert found for '${DOMAIN:-unset}'; running in HTTP mode."
    rm -f "$TARGET"
fi
