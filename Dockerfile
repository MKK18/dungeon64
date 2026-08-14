# Statisk site serveret af Caddy. Ingen build-trin, ingen dependencies.
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY public /srv

# Stempler stylesheet og script med en kort hash af deres eget indhold,
# så en rettelse ikke bliver skygget af browserens cache. Filerne på
# disken hedder stadig site.css og site.js, så den der redigerer siden
# skal ikke tænke på versionsnumre. Det sker her, ikke i redaktionen.
RUN CSS="$(md5sum /srv/assets/css/site.css | cut -c1-8)" && \
    JS="$(md5sum /srv/assets/js/site.js | cut -c1-8)" && \
    find /srv -name '*.html' -exec sed -i \
      -e "s|/assets/css/site\.css|/assets/css/site.css?v=$CSS|g" \
      -e "s|/assets/js/site\.js|/assets/js/site.js?v=$JS|g" {} + && \
    echo "cache-stempel: css=$CSS js=$JS"

# Railway sætter $PORT selv; 8080 er fallback til lokal kørsel.
ENV PORT=8080
EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
