# Statisk site serveret af Caddy. Ingen build-trin, ingen dependencies.
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY public /srv

# Railway sætter $PORT selv; 8080 er fallback til lokal kørsel.
ENV PORT=8080
EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
