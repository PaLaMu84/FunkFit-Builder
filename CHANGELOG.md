# FunkFit Builder v0.7.4-alpha.26

## TIDAL
- Ny hovedhandling: “Hent CSV + åbn TuneMyMusic”.
- Klikket downloader playlist-CSV og åbner direkte TuneMyMusics CSV→TIDAL-side.
- Brugeren skal kun vælge den netop hentede fil og logge ind på TIDAL.
- Appen forklarer tydeligt, at browserens sikkerhedsmodel forhindrer automatisk udfyldning af filfeltet.

## Spotify direkte
- Første fungerende Spotify OAuth/PKCE-flow er bygget ind.
- Client ID kan gemmes lokalt.
- Appen viser præcis Redirect URI til Spotify Dashboard.
- “Forbind Spotify” bruger Authorization Code with PKCE uden client secret.
- Access/refresh tokens gemmes kun i browserens session.
- “Opret playlist i Spotify”:
  - søger hvert AI-nummer i Spotify
  - opretter en privat playlist via `POST /me/playlists`
  - tilføjer URI'er via `POST /playlists/{id}/items`
  - gemmer playlist-linket i træningen
- Ikke-matchede numre springes over og rapporteres.

## Data
- Gemte træninger bruger fortsat samme lagernøgle.
