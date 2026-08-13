# dungeon64.dk

Hjemmeside for **Dungeon 64**, folkeoplysende forening på Amagerbro for figurrollespil, wargaming og miniaturehobby.

Statiske filer. Ingen build, ingen dependencies, ingen database. Rediger HTML, push, og siden er opdateret.

| | |
|---|---|
| Produktion | https://www.dungeon64.dk |
| Hosting | Railway (Caddy i Docker) |
| Repo | https://github.com/MKK18/dungeon64 |
| Sprog | Dansk (`lang="da"`) |

---

## Sider

| Rute | Fil | Indhold |
|---|---|---|
| `/` | `public/index.html` | Hero, hvad vi spiller, ugens program, medlemskaber, kodeks, besøg |
| `/indmeldelse/` | `public/indmeldelse/index.html` | De tre medlemskaber, betaling og tilmelding |
| `/kalender/` | `public/kalender/index.html` | Faste aktiviteter, levende Google-kalender, bookingregler |
| `/regler/` | `public/regler/index.html` | De syv ordensregler, tryghed, vedtægter og referater |
| `404` | `public/404.html` | Fejlside |

```
.
├── public/
│   ├── index.html · indmeldelse/ · kalender/ · regler/ · 404.html
│   ├── favicon.svg · robots.txt · sitemap.xml
│   └── assets/
│       ├── css/site.css          fælles stylesheet
│       ├── js/site.js            mobilmenu, d20
│       ├── fonts/                Playfair Display (woff2, OFL)
│       └── img/                  3 public domain-malerier
├── Dockerfile                    Caddy, ingen build
├── Caddyfile
└── railway.json
```

Der er ingen templating. Topbar og footer står i hver fil, så en ændring i menuen skal laves fem steder. Det er bevidst: fem filer uden værktøjskæde er lettere at overtage for en frivillig end et statisk site-generator-setup, der skal holdes opdateret. Bliver det til flere end otte-ti sider, er afvejningen en anden.

---

## Ret indhold

De ting der oftest skal opdateres.

| Hvad | Hvor |
|---|---|
| Priser og medlemskaber | `.classes`-blokken i `index.html` og `indmeldelse/index.html`. Findes to steder, hold dem ens. |
| Faste holdtider | `.quest-board`-tabellen i `index.html` og `kalender/index.html`. Findes to steder. |
| Ordensregler | `.rules-list` i `regler/index.html` |
| Links til vedtægter og referater | Footeren i alle fire sider, plus `.doc-links` i `regler/index.html` |
| Adresse og mail | Footeren i alle fire sider |

Kalenderen skal ikke opdateres. Den henter direkte fra foreningens Google-kalender (`dungeond64@gmail.com`), så det bestyrelsen skriver ind i kalenderen, står på siden med det samme. Programtabellen ovenfor er derimod håndskrevet og skal rettes manuelt, når faste hold ændrer sig.

---

## Lokal kørsel

```bash
npx serve public -l 8747
```

Eller præcis som i produktion:

```bash
docker build -t dungeon64 . && docker run --rm -p 8080:8080 -e PORT=8080 dungeon64
```

Docker-versionen er den der gælder, hvis noget opfører sig forskelligt. Den tester også pæne URL'er (`/kalender` uden skråstreg) og at 404-siden svarer med en rigtig 404-status.

---

## Deploy

Railway bygger `Dockerfile` og deployer automatisk ved hvert push til `main`. Caddy lytter på `$PORT`, som Railway sætter.

Førstegangsopsætning i Railway:

1. **New Project** → **Deploy from GitHub repo** → `MKK18/dungeon64`
2. Railway finder selv `Dockerfile` i roden
3. **Settings** → **Networking** → **Custom Domain** → `www.dungeon64.dk`
4. Læg den viste CNAME hos DNS-udbyderen. Railway håndterer certifikatet.

Rollback: **Deployments** → vælg et tidligere deploy → **Redeploy**.

### Omdirigeringer fra den gamle side

Den tidligere WordPress-side brugte to andre stier. `Caddyfile` sender dem videre med 301, så gamle bogmærker og links ikke ender i en 404:

| Gammel | Ny |
|---|---|
| `/kalender-og-booking/` | `/kalender/` |
| `/ordenregler-vedtaegter-og-moder/` | `/regler/` |

`/` og `/indmeldelse/` er uændrede.

### Er Railway det rigtige valg?

Det virker, men det er værd at kende afvejningen nu hvor det er den rigtige side.

Det her er 100 % statiske filer. Railway kører en container døgnet rundt for at sende dem ud, og der betales for oppetid. Cloudflare Pages og Netlify er gratis for præcis det her, ligger på et globalt CDN i stedet for én region, og har ingen container der kan falde ned klokken to om natten. For en forening uden driftsvagt er "der er ingen server" en reel fordel frem for en teknisk detalje.

Modargumentet: Railway er kendt terræn, pipelinen kører, og der skal ikke oprettes endnu en konto. For et site med denne trafik er forskellen i praksis mest et spørgsmål om pris, og om hvem der får besked hvis noget stopper.

Skifter I mening, er der intet at migrere. Peg Cloudflare Pages på `public` som output-mappe uden build-kommando, og det er samme site. `Dockerfile` og `Caddyfile` er de eneste filer der bliver overflødige.

---

## Identitet

Logomærket er en hvælvet dør med husnummeret i åbningen, og den røde er `#b0222a`.

Begge dele blev ændret bevidst. Den tidligere version brugte `#e40712`, som er D&D Beyond's signaturrøde, og et logo der var en rød d20, hvilket er D&D Beyond's eget mærke. På et uofficielt udkast var det en detalje. På foreningens officielle site ville helheden kunne læses som et Wizards of the Coast-produkt.

Døren løser samtidig et indholdsproblem: klubben spiller fem systemer, og en d20 binder identiteten til ét af dem. En dør gør ikke, og "Dungeon 64" er i forvejen et sted man går ind i.

Terningen i heroen er stadig en d20. Den er et spilobjekt man kan kaste, ikke et bomærke, den er guld og ikke rød, og den bruges af mange systemer. Den bliver.

Farverne ligger i `:root` i `public/assets/css/site.css`:

| Token | Værdi | Bruges til |
|---|---|---|
| `--red` | `#b0222a` | knapper, chips, logomærke |
| `--red-hover` | `#c93038` | hover på røde knapper |
| `--accent` | `#f0787e` | glyffer og fleuroner på mørk bund |

`--accent` findes, fordi `--red` er for mørk til at læses som tekst mod baggrunden. De to jobs var før slået sammen i `--red-hover`, hvilket gav en farve der hverken var god som knapbund eller som tekst.

## Åbne punkter

### 1. Tilmeldingslink mangler

Medlemskaberne betales online med kort eller MobilePay Online, men linket til medlemssystemet er ikke lagt ind. Knapperne på `/indmeldelse/` peger indtil videre på `#betaling`-afsnittet på samme side, hvor der står en mailadresse.

Det er den største enkeltstående konverteringsblokering på siden. Når linket findes, skal det ind i seks knapper: tre i `index.html` og tre i `indmeldelse/index.html`.

### 2. Foreningens egne billeder

De tre baggrunde er public domain-malerier af John Martin og Caspar David Friedrich, valgt som stand-ins. Fotos af medlemmernes egne malede figurer vil være et markant løft, og det er den slags billede der får en forælder til at forstå hvad klubben er. Warhammers eget site bygger på præcis det.

Erstattes i `public/assets/img/`. Filnavnene refereres i `site.css`.

### 3. Mailadressen

`dungeond64@gmail.com` er kopieret ordret fra den tidligere side. Det ekstra `d` bør bekræftes, inden den står seks steder på et officielt site.

### 4. Assets har ingen cache-busting

`site.css` og `site.js` hedder det samme ved hver udgivelse, og Caddy sætter `Cache-Control: public, max-age=3600`. Efter en rettelse kan besøgende derfor se den gamle stil eller det gamle script i op til en time. Det ramte under test.

En time er et bevidst kompromis frem for et års cache, men skal en rettelse ud med det samme, er den enkle løsning at tilføje en version i stien, for eksempel `site.css?v=2`, i de fem HTML-filer.

### 5. Holdtiderne bør bekræftes

Programtabellen er bygget på foreningens egen offentlige Google-kalender, hvor de faste hold ligger som gentagne begivenheder:

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

Den tidligere indmeldelsesside sagde noget andet: mandag 17:00–18:30 og 19:00–20:30, tirsdag 16:00–17:30 og 18:00–19:30. Mandagens andet hold står i kalenderen som afsluttet i juni 2025 og var markeret "IKKE BESAT", så kalenderen er nyere. Tabellen følger kalenderen, men bestyrelsen bør bekræfte den, før den står som officiel information.

---

## Teknisk

**Tilgængelighed.** Springlink til indhold, synlige fokusmarkeringer, `aria-live` på terningeresultatet, dekorativ SVG skjult for skærmlæsere, programmet som rigtig `<table>` med `<th scope="col">`, og fuld `prefers-reduced-motion`-understøttelse.

**Kontrast.** Alt målt mod baggrunden `#131a22`, og alt består AA.

| Element | Kontrast |
|---|---|
| Brødtekst | 8,1:1 |
| Guld (eyebrows, stat-labels) | 6,4 til 7,5:1 |
| Hvid på `--red` | 6,8:1 |
| Hvid på `--red-hover` | 5,3:1 |
| `--accent` på baggrund | 6,4:1 |

Den nye røde forbedrede knapkontrasten fra 4,8:1 til 6,8:1, så farveskiftet var ikke kun et spørgsmål om varemærker.

**Ydelse.** Ingen eksterne kald overhovedet, bortset fra Google-kalenderens iframe på `/kalender/`. Skrifttypen er selvhostet. Sider vejer 9–19 KB HTML plus et fælles stylesheet på 25 KB. Billederne (145–270 KB) hentes kun på de sider der bruger dem.

**Browserunderstøttelse.** `aspect-ratio`, `clip-path` og `text-wrap: balance` kræver nyere browsere. Alt degraderer pænt: layoutet holder, ornamenter og balanceret ombrydning falder bare væk.

**SEO.** Hver side har `<title>`, `meta description`, canonical og Open Graph med absolutte URL'er, så link-previews i Messenger og Slack virker. `sitemap.xml` og `robots.txt` peger på produktionsdomænet. Ændres domænet, skal det rettes i begge filer og i de fire `<head>`-blokke:

```bash
cd public && grep -rl "www.dungeon64.dk" . | xargs sed -i '' 's|https://www.dungeon64.dk|https://NYT-DOMÆNE|g'
```

---

## Kunst og skrifttype

Baggrundsmalerierne er public domain, hentet fra Wikimedia Commons, og krediteres i footeren.

| Placering | Værk | Kunstner | År |
|---|---|---|---|
| Hero | *Manfred and the Alpine Witch* (spejlvendt) | John Martin (d. 1854) | 1837 |
| Medlemskab | *Pandemonium* | John Martin (d. 1854) | 1841 |
| Besøg | *Vandreren over tågehavet* | Caspar David Friedrich (d. 1840) | 1818 |

Playfair Display er under SIL Open Font License, som tillader indlejring og selvhosting.
