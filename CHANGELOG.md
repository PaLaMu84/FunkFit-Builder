# FunkFit Builder v0.7.4-alpha.28

## Google AI – ny plan
- Musik-AI er flyttet fra Interactions API til det enklere `generateContent`-endpoint.
- Gemini 3.5 Flash-Lite er fortsat primær model.
- Gemini 3.1 Flash-Lite er fortsat automatisk fallback.
- Structured JSON-output er bevaret.
- Google Search-grounding er fortsat slået fra.

## Test Google-nøgle
- Ny knap: “Test Google-nøgle”.
- 401 forklares som ugyldig/udløbet/deaktiveret API-nøgle.
- 403 forklares som manglende projekt/API-adgang.
- 429 identificeres som gyldig nøgle men opbrugt kvote.
- Model-404 adskilles fra nøglefejl.
- Direkte knap til Google AI Studio API Keys.

## Sikkerhed
- Nøglen gemmes kun i sessionStorage.
- Den gemmes aldrig sammen med træningen.

## Data
- Gemte træninger bruger fortsat samme lagernøgle.
