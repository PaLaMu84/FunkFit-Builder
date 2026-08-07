# FunkFit Builder v0.7.4-alpha.25

## Gemini
- Musik-AI er skiftet til `gemini-2.5-flash-lite`.
- Modellen har gratis Gemini API-tier og understøtter Search grounding og structured output.
- 429/quota-fejl får nu en kort dansk forklaring.

## Playlist-first
- Resultatet hedder nu “Playliste” og vises direkte i appen.
- Sangene er fortsat opdelt efter træningens sektioner.
- Hvert nummer har “Find”-link til den valgte musiktjeneste.
- Hele playlisten kan kopieres som almindelig tekst.
- “Åbn Spotify/TIDAL/Telmore Musik” er en primær handling.
- CSV er flyttet til “Avanceret eksport” og er ikke længere hovedflowet.

## Næste integration
- Direkte oprettelse af Spotify-playliste kræver OAuth/PKCE og en registreret Spotify-app.
- TIDAL/Telmore-direkte oprettelse kræver særskilt understøttet API/adgang og er ikke simuleret.

## Data
- Gemte træninger bruger fortsat samme lagernøgle.
