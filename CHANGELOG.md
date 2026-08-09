# FunkFit Builder v0.7.4-alpha.37

## Fælles Legebibliotek
- Nyt bundlet `data/sharedGames.json`.
- Fælles grundleg følger nu selve appen og findes for alle brugere/enheder.
- 8 fælles starterlege medfølger.
- Lokale brugerlege ligger som et separat overlay oven på fællesbiblioteket.
- Legebiblioteket viser kilde: Fælles i appen / Min leg / Min version af fælles.
- Nyt filter: Alle / Fælles i appen / Mine lege.
- Fælles lege kan tilpasses lokalt, men ikke slettes fra appen.
- “Nulstil fælles” fjerner en lokal override.
- Eksport/import omhandler nu brugerens lokale lege, da fællesbiblioteket allerede følger appen.

## Gemte træninger
Farvekoder matcher nu Trin 1.1 præcist:
- 🟠 Junior
- 🔵 Familie
- 🟢 Funktionel voksen
- 🟡 TRX
- 🔴 Hyrox
- 🟣 HIIT

## PWA
- `sharedGames.json` caches i service worker.
- Eksisterende workout/game storage keys er uændrede.
