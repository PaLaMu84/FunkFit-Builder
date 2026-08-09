# Gentest – v0.7.4-alpha.37

## Fælles Legebibliotek
1. Åbn appen i en browser uden tidligere FunkFit-data.
2. Legebiblioteket skal stadig indeholde de fælles lege.
3. Kontroller mindst Kegletyven, Kortspils-stafet og Terninge-challenge.
4. Filtrér “Fælles i appen”.
5. Filtrér “Mine lege”.
6. Opret en ny lokal leg: den skal vises som “Min leg”.
7. Tilpas en fælles leg lokalt: den skal vises som “Min version af fælles”.
8. Nulstil fælles: appens grundversion skal komme tilbage.
9. En ren fælles leg må ikke kunne slettes.
10. En lokal leg skal kunne slettes normalt.
11. Fælles lege skal kunne indsættes som sektioner.
12. Udstyr/tider/standardøvelser skal følge med.

## Eksport/import
13. Eksportér mine lege: fælles bundled lege behøver ikke være i filen.
14. Importér på en anden enhed: lokale lege skal lægge sig oven på fællesbiblioteket.
15. Egne redskaber skal følge med.

## Gemte træninger
16. Junior-label = orange.
17. Familie-label = blå.
18. Funktionel voksen = grøn.
19. TRX = gul.
20. Hyrox = rød.
21. HIIT = lilla.
22. Labels skal også vise samme farvede emoji som Trin 1.1.

## PWA/regression
23. `data/sharedGames.json` findes og er gyldig JSON.
24. Service worker cacher `sharedGames.json`.
25. JavaScript syntax OK.
26. Ingen dublerede HTML-id'er.
27. `funkfit-workouts-v074a` uændret.
28. `funkfit-games-v1` uændret.
29. reset-cache må ikke rydde localStorage.
