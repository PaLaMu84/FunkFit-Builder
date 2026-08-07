# Gentest – v0.7.4-alpha.23

1. Upload versionen og åbn reset-cache.html.
2. Kontrollér, at header/adresselinje viser alpha.23.
3. Opret en NY Gemini API-nøgle i Google AI Studio.
4. Indsæt nøglen på Musik-siden.
5. Vælg mindst én sektion og tryk “Planlæg musik med AI”.
6. Kontrollér, at `Failed to fetch` ikke længere opstår pga. Api-Revision-headeren.
7. Hvis Google returnerer 401/403/429, kontrollér at den konkrete Google-fejl vises.
8. Kontrollér, at musikplanen fortsat genereres som struktureret JSON.
9. Download Playlist CSV og Sektionsplan CSV.
10. Gem træningen og genåbn den.
11. Kontrollér, at Gemini-nøglen ikke er gemt sammen med træningen.
12. Kontrollér, at tidligere gemte træninger stadig findes.
