# FunkFit Builder v0.7.4-alpha.29

## Musik v2 – første valg
- Musiktrinnet starter nu med:
  - “Brug AI til at lave min playliste”
  - “Jeg vil selv bygge playlisten”
- De to flows er visuelt adskilt.

## AI
- Ny klikbar genrevælger med 12 genregrupper.
- Genrevalgene indgår som stærke præferencer i musikprompten.
- Genrevalg gemmes med træningen.
- Spotify-match er strammet, så korrekt sangtitel + forkert kunstner ikke accepteres som sikkert match.

## Byg selv
- “Byg sang for sang”:
  - vælg træningssektion
  - titel
  - kunstner
  - album
  - tilføj direkte til samme playlistemodel som AI
- Hvis Spotify er forbundet, verificeres manuelle numre mod Spotify.
- “Tilknyt eksisterende playliste”:
  - Spotify / TIDAL / Telmore
  - navn + URL
  - gemmes med træningen

## Skift nummer
- Alle numre har nu “Skift”.
- Titel, kunstner og album kan udskiftes uden at ændre resten af playlisten.
- Ved forbundet Spotify kan brugeren hente alternative katalognumre ud fra de valgte genrer.
- Spotify-alternativer vælges fra rigtige Spotify-resultater.

## Persistens
- Musikmode, manuel mode, genrer, linked playlist og trackliste gemmes med træningen.
- Eksisterende lagernøgle til gemte træninger er uændret.
