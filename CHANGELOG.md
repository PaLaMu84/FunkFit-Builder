# FunkFit Builder v0.7.4-alpha.38

## Fælles Legebibliotek
- Brugerens eksporterede legebibliotek fra 9. august 2026 er optaget i selve appen.
- 5 eksisterende brugerlege er tilføjet som fælles grundleg:
- Superfly Superman Snap challenge
- Flip kegler
- Double stafet
- 3 på stribe
- Saml keglerne
- Fælles bibliotek indeholder nu 13 lege i alt.
- Originale gameId'er er bevaret, så eksisterende lokale versioner ikke giver dubletter.
- Beskrivelser, regler, trænertips, tider, udstyr og øvelsesreferencer er bevaret fra eksporten.
- Kun owner/source/visibility er ændret til fælles app-data.

## Udstyr
- Udstyrskataloget læser nu også redskabsnavne fra de fælles grundleg.
- Fx bliver “Stige” automatisk tilgængelig i leg-editoren på alle enheder.

## Data
- `data/sharedGames.json` er opdateret og caches fortsat af PWA'en.
- Lokale game/workout storage keys er uændrede.
