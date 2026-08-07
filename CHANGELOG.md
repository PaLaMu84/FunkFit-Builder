# FunkFit Builder v0.7.4-alpha.22

## Musikplanlægning v1
- Musik er nu planlagt sektion for sektion i stedet for kun som et playlist-link.
- Brugeren vælger Spotify, TIDAL eller Telmore Musik.
- Brugeren vælger fra start mellem alle sektioner eller kun udvalgte sektioner.
- Hver sektion får en automatisk intensitetsprofil, BPM-mål og musikalsk stemning.
- Ledopvarmning har en hård regel mod dance/EDM/klubmusik og hurtige/aggressive beats.
- Opvarmning bygger energien gradvist op.
- Teknik holdes fokuseret og mindre distraherende.
- AMRAP/EMOM/HIIT/Hyrox/intervaller, teamchallenge og finisher får højere energi efter behov.
- Allerede valgte finisher-sange kan bevares.

## Google AI
- Google Gemini 3.6 Flash er koblet ind via Interactions API.
- Google Search er aktiveret for at reducere opdigtede musikforslag og hjælpe med aktuelle numre.
- API-nøglen gemmes kun i sessionStorage og aldrig i en gemt træning.
- Produktionsversionen bør senere bruge server-side proxy.

## Playlist-import
- Playlist CSV: title, artist, album, isrc.
- Spotify: CSV-flow via TuneMyMusic.
- TIDAL: CSV-flow via TuneMyMusic.
- Telmore Musik: CSV-flow via Soundiiz.
- Separat Sektionsplan CSV viser sektion, intensitet, BPM, nummer og begrundelse.
- Musikplanen gemmes sammen med træningen.

## Eksisterende funktion
- Manuelle Spotify/TIDAL/Telmore playlist-links er bevaret i et fold-ud-felt.
- Gemte træninger bruger fortsat samme lagernøgle.
