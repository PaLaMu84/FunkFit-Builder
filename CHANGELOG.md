# FunkFit Builder v0.7.4-alpha.27

## Ny musik-AI-plan
- Gemini 2.5 Flash-Lite er fjernet.
- Primær model: `gemini-3.5-flash-lite`.
- Automatisk fallback: `gemini-3.1-flash-lite`, hvis Google afviser primærmodellen pga. modeladgang.
- Google Search-grounding er fjernet helt fra API-kaldet.
- Det holder almindelig musikgenerering på Free Tier og undgår den betalte Search-del på Gemini 3.

## Sangvalg
- Prompten kræver primært velkendte, officielt udgivne numre.
- AI må ikke opfinde sangtitler eller kunstnere.
- Obskure/usikre forslag skal erstattes af mere kendte alternativer.

## Spotify-verifikation
- Hvis Spotify er forbundet, kontrolleres AI-forslag automatisk mod Spotifys katalog.
- Matchede numre normaliseres til Spotifys titel, kunstner og album.
- UI viser “Spotify-verificeret” eller “Ikke matchet i Spotify”.
- Direkte playlist-oprettelse genbruger verificerede Spotify-URI'er.

## TIDAL
- TIDAL-flowet er uændret: CSV + TuneMyMusic, som foretager katalogmatch ved import.

## Data
- Gemte træninger bruger fortsat samme lagernøgle.
