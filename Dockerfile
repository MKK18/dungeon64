# Statisk site serveret af Caddy. Ingen build-trin, ingen dependencies.
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY public /srv

# Stempler hvert stylesheet og script med en kort hash af filens eget
# indhold, så en rettelse ikke bliver skygget af browserens cache.
# Caddy serverer /assets/css og /assets/js som immutable i et år, og den
# aftale holder kun hvis URL'en skifter når indholdet skifter.
#
# Trinnet finder selv filerne. Den tidligere udgave havde site.css og
# site.js skrevet ind med navn, og da de blev omdøbt til tavle.css og
# tavle.js stempledes der ingenting. Resultatet var et år gammel cache
# hos alle der havde været forbi før. Derfor: ingen navne hardcodet, og
# byggetrinnet fejler hvis der ikke blev stemplet noget.
RUN set -eu; \
    stemplet=0; \
    for fil in /srv/assets/css/*.css /srv/assets/js/*.js; do \
      [ -e "$fil" ] || continue; \
      sti="${fil#/srv}"; \
      hash="$(md5sum "$fil" | cut -c1-8)"; \
      motiv="$(printf '%s' "$sti" | sed 's|[.[\*^$/]|\\&|g')"; \
      find /srv -name '*.html' -exec sed -i "s|${motiv}|${sti}?v=${hash}|g" {} +; \
      echo "cache-stempel: ${sti} = ${hash}"; \
      stemplet=$((stemplet+1)); \
    done; \
    [ "$stemplet" -gt 0 ] || { echo "FEJL: ingen css/js fundet at stemple" >&2; exit 1; }

# Railway sætter $PORT selv; 8080 er fallback til lokal kørsel.
ENV PORT=8080
EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
