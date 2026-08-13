# Dungeon 64 · designkoncept

Uofficielt redesign af [dungeon64.dk](https://www.dungeon64.dk) som et rigtigt flersidet site. Statiske filer, ingen build, ingen dependencies.

**Dette er ikke foreningens officielle side.** Alle sider har en tydelig disclaimer i footeren, og `robots.txt` blokerer indeksering, så konceptet ikke konkurrerer med den rigtige side i søgeresultater.

---

## Sider

Samme struktur som det rigtige site, som har fire sider.

| Rute | Fil | Indhold |
|---|---|---|
| `/` | `public/index.html` | Hero, hvad vi spiller, ugens program, medlemskaber, kodeks, besøg |
| `/indmeldelse/` | `public/indmeldelse/index.html` | De tre medlemskaber, betaling og tilmelding |
| `/kalender/` | `public/kalender/index.html` | Faste aktiviteter, levende Google-kalender, bookingregler |
| `/regler/` | `public/regler/index.html` | De syv ordensregler, tryghed, vedtægter og referater |
| `404` | `public/404.html` | Fejlside |

## Filer

```
dungeon64/
├── public/
│   ├── index.html · indmeldelse/ · kalender/ · regler/ · 404.html
│   ├── favicon.svg · robots.txt
│   └── assets/
│       ├── css/site.css          fælles stylesheet
│       ├── js/site.js            mobilmenu, d20
│       ├── fonts/                Playfair Display (woff2, OFL)
│       └── img/                  3 public domain-malerier
├── Dockerfile                    Caddy, ingen build
├── Caddyfile
└── railway.json
```

## Lokal kørsel

Alt der kan servere en mappe virker.

```bash
npx serve public -l 8747
```

Eller præcis som i produktion:

```bash
docker build -t dungeon64 . && docker run --rm -p 8080:8080 -e PORT=8080 dungeon64
```

---

## Deploy på Railway

`Dockerfile` og `railway.json` ligger klar. Caddy lytter på `$PORT`, som Railway sætter selv.

```bash
railway login
railway link          # vælg eller opret projekt
railway up
```

Eller via GitHub, hvilket er det der er sat op her:

1. **New Project** → **Deploy from GitHub repo** → vælg `MKK18/dungeon64`
2. Railway finder selv `Dockerfile` i roden. Ingen Root Directory at sætte, fordi repoet kun indeholder dette projekt.
3. **Settings** → **Networking** → **Generate Domain**
4. Deploy sker automatisk ved hvert push til `main`

Egen adresse: tilføj domænet under **Settings** → **Networking** → **Custom Domain** og læg den viste CNAME hos din DNS-udbyder. Railway håndterer certifikatet.

### Efter deploy

Ret domænet i de fire `<head>`-blokke. Der står `https://dungeon64-koncept.example` i `canonical`, `og:url` og `og:image`. Absolutte URL'er er et krav for Open Graph, så link-previews i Messenger og Slack virker først når det er rettet.

```bash
cd public
grep -rl "dungeon64-koncept.example" . | xargs sed -i '' 's|https://dungeon64-koncept.example|https://DIT-DOMÆNE|g'
```

### Er Railway det rigtige valg?

Kort svar: det virker fint, og at have det samme sted som dine andre projekter er en reel fordel. Men det er værd at kende afvejningen.

Det her er 100 % statiske filer. Railway kører en container døgnet rundt for at sende dem ud, og du betaler for oppetid. Cloudflare Pages, Netlify og GitHub Pages er gratis for det her, ligger på et globalt CDN i stedet for én region, og har ingen container der kan falde ned. For et klubsite med dansk trafik betyder CDN'et ikke meget, men prisen og de nul vedligeholdelsespunkter gør.

Modargumentet, som holder: du kender Railway, deployment-pipelinen er sat op, og du slipper for endnu en konto og endnu et sted at holde øje med. For et koncept der måske lever et par måneder er det den rigtige prioritering.

Skifter du mening, er der intet at migrere. Peg Cloudflare Pages på `dungeon64/public` som output-mappe uden build-kommando, og det er samme site. `Dockerfile` og `Caddyfile` er de eneste filer der bliver overflødige.

---

## Åbne punkter

Ting der skal afklares med foreningen, før noget af dette peger på et rigtigt domæne.

| Punkt | Status |
|---|---|
| **Tilmeldingslink** | Mangler. Medlemskaberne betales online med kort eller MobilePay, men linket til medlemssystemet er ikke offentligt endnu. Der står en tydelig rød note på `/indmeldelse/` hvor det skal ind. |
| **Varemærker** | "Dungeons & Dragons", "Warhammer 40K", "Age of Sigmar", "The Old World" og "Magic: The Gathering" står som ren tekst, hvilket normalt er i orden. Farvepalet og guldkort-mønster ligger tæt på D&D Beyond, og logoet er en rød d20, hvilket er deres eget mærke. Bør ændres før publicering på et rigtigt domæne. |
| **Mailadresse** | `dungeond64@gmail.com` er kopieret ordret fra foreningens side. Det ekstra `d` skal bekræftes. |
| **Egne billeder** | De tre malerier er public domain-stand-ins. Foreningens egne fotos af malede figurer vil være et markant løft. |
| **Programdata** | Hentet fra foreningens offentlige Google-kalender, ikke gættet. Se noten nedenfor om uoverensstemmelsen med indmeldelsessiden. |

### Note om holdtider

Programtabellen er bygget på foreningens egen offentlige kalender (`dungeond64@gmail.com`), hvor de faste hold ligger som gentagne begivenheder. Den siger:

| Dag | Hold | Tid | Kadence |
|---|---|---|---|
| Søndag | Old World Søndag | 11:00–18:00 | hver 2. uge |
| Søndag | Åben tabletop-dag | 11:00–16:00 | hver 2. uge |
| Mandag | D&D hold 1 | 17:00–18:30 | ugentligt |
| Tirsdag | D&D hold 2 | 16:30–18:00 | ugentligt |
| Tirsdag | D&D hold 3 | 18:30–20:00 | ugentligt |
| Onsdag | D&D 2770 Drengene | 18:00–22:00 | hver 2. uge |
| Torsdag | D&D hold 4 | 17:30–21:00 | hver 2. uge |
| Lørdag | MtG Legacy Draft | 12:00–16:00 | hver 2. uge |
| Fredag | D64 Fredagsbar | aften | sidste fredag i måneden |

Den nuværende indmeldelsesside på dungeon64.dk siger noget andet: mandag 17:00–18:30 og 19:00–20:30, tirsdag 16:00–17:30 og 18:00–19:30. Mandagens andet hold står i kalenderen som afsluttet i juni 2025 og var markeret "IKKE BESAT". Kalenderen er altså nyere end indmeldelsessiden. Det bør foreningen selv rette op i, uanset hvilket design de lander på.
