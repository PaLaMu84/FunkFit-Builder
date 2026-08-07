# FunkFit Builder v0.7.4-alpha.23

## Gemini / musikplanlægning
- Fjernet `Api-Revision` fra browserens Gemini-request.
- Request bruger nu kun `Content-Type` og `x-goog-api-key`.
- Retter den kendte CORS/preflight-situation, som kan vise `Failed to fetch`.
- Netværks-/CORS-fejl får nu en mere brugbar fejlbesked.
- API-fejl fra Google vises fortsat med den konkrete fejltekst.
- Gemini-nøglen gemmes fortsat kun i sessionStorage og aldrig i den gemte træning.

## Sikkerhed
- Browserbaseret API-nøgle er fortsat kun en testløsning.
- Produktionsløsningen skal senere bruge server-side proxy.

## Data
- Eksisterende lagernøgle til gemte træninger er uændret.
