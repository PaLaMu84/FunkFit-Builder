# Gentest – v0.7.4-alpha.27

## Google AI
1. Upload versionen og åbn reset-cache.html.
2. Kontrollér, at Google AI viser Gemini 3.5 Flash-Lite.
3. Brug den nuværende Gemini API-nøgle.
4. Generér en playliste.
5. Kontrollér, at fejlen “gemini-2.5-flash-lite is no longer available” er væk.
6. Kontrollér, at requesten ikke indeholder Google Search-værktøjet.
7. Hvis 3.5 Flash-Lite afvises som modeladgang, skal appen automatisk prøve 3.1 Flash-Lite.
8. Ved kvote-429 skal appen vise dansk kvotefejl.

## Spotify
9. Forbind Spotify.
10. Generér en ny playliste med Spotify valgt.
11. Kontrollér, at numrene efter generation bliver verificeret mod Spotify.
12. Matchede numre skal vise “Spotify-verificeret”.
13. Klik “Opret playlist i Spotify”.
14. Kontrollér, at verificerede URI'er genbruges.

## TIDAL
15. Generér en playliste med TIDAL valgt.
16. Klik “Hent CSV + åbn TuneMyMusic”.
17. Kontrollér, at CSV downloades og TuneMyMusic åbnes.

## Data
18. Gem og genåbn træningen.
19. Kontrollér, at eksisterende gemte træninger stadig findes.
