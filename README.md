# FunkFit Builder v0.6.2

## Ny arbejdsgang
Appen starter nu med en træningsassistent frem for en tom editor.

Vælg:
- FunkFit Junior
- Familie
- Funktionel voksen
- Hyrox
- HIIT
- Inde i gymnastiksalen eller ude ved containeren
- Varighed, deltagere og antal stationer
- Træningsmål
- Det udstyr der faktisk er til rådighed
- Særlige ønsker

Appen laver derefter et komplet første udkast med sektioner, tider, øvelser,
arbejde/pause og runder. Udkastet åbnes i den eksisterende editor, hvor det
kan finpudses.

## Beholdt
- Billede- og tekstimport
- Visuel sektionseditor
- Familievariationer
- Deltager- og instruktør-PDF
- Spotify, TIDAL og Telmore Musik
- Gemte pas og workout-player


## Rettelse i v0.6.1
- Gendanner de manglende inde-/ude-udstyrsprofiler, som forhindrede appen i at starte.


## Rettelse i v0.6.2

- Sikrer at `EQUIPMENT_PROFILES` er defineret før planlæggeren starter.
- Tilføjer versionsparametre til JavaScript, CSS og manifest, så GitHub Pages ikke genbruger den gamle `app.js`.
- Service worker bruger nu network-first til appens kode og data.
- Ny service worker overtager straks og sletter tidligere FunkFit-caches.
- `reset-cache.html` sender tilbage til v0.6.2.
