# Gentest – v0.7.4-alpha.30

## Musik
1. Gå til Musik uden at generere/tilknytte noget: PLAYLISTE må ikke vises.
2. Generér AI-playliste: PLAYLISTE skal vises.
3. Klik “Slet playlisten”: resultatkortet skal forsvinde.
4. Kontroller at AI-prompt/schema kræver vokal, nyere tracks og højere energi.
5. Kontroller at klassisk/instrumental/soundtrack filtreres fra.
6. Vælg TIDAL og generér en liste.

## Player
7. Afspil Junior: primær label = JUNIOR.
8. Afspil Familie: JUNIOR + VOKSEN.
9. Afspil Funktionel voksen: primær label = VOKSEN og voksen kg/reps.
10. Gentag for HIIT/HYROX/TRX.
11. Tilknyt kun TIDAL: kun TIDAL-knappen må vises i player.
12. Uden playlist-link: ingen musiktjenesteknapper.

## Gemte træninger
13. Træning uden link: “Playliste ikke tilknyttet”.
14. Klik den: Musik-trinnet åbnes.
15. Træning med link: “Playliste tilknyttet”.
16. Klik den: playlisten åbnes.

## HYROX
17. Generér HYROX med relevant udstyr: officielle stationer skal dominere.
18. Ingen SkiErg/romaskine i standardudstyr.
19. Kontroller “Løb mellem hver øvelse”.
20. Test 200/300/400/500/1000 m.
21. Test brugerdefineret distance.
22. Test “Start også med løb”.
23. Slå funktionen fra: auto-løb skal fjernes uden at fjerne arbejdsøvelser.
24. Player/PDF skal følge auto-løbene.

## TRX
25. Generér TRX: alle hovedøvelser skal kræve TRX.
26. Kontroller variation mellem plank/hinge/pull/squat/push/lunge/rotate.
27. Kontroller de fem nye TRX-øvelser.
28. Fjern TRX fra udstyr: AI må ikke kunne bygge en normal TRX-hovedblok med falske kropsvægtsalternativer.
29. TRX + måtte-øvelse må ikke vælges, hvis måtten mangler.

## HIIT
30. Generér HIIT: hovedblokke skal være intervaller.
31. Kontroller 30/30, 40/20 eller 20/40.
32. Mindst én engine-bevægelse pr. blok.
33. Ingen curls/deadlifts/balanceøvelser som standard.
34. KB swing/box jump/wall ball/devil press må kun komme ved øvet/erfaren intention.
35. Kontroller at samme kropsområde ikke dominerer alle stationer.
36. Warm-up skal nævne bevægelsesrehearsal.

## Regression
37. JavaScript starter uden fejl.
38. Ingen dublerede HTML-id'er.
39. Gemte træninger fra tidligere version findes stadig.
40. reset-cache.html må ikke rydde localStorage.

41. Redigér kg/reps i en Funktionel voksen-øvelse og afspil: player skal vise de redigerede metrics.
42. Redigér HYROX-distance/reps og TRX-kropsvinkel: player skal vise de redigerede sporfelter.
43. Fjern TRX fra udstyr og prøv at AI-generere TRX: appen skal stoppe med en tydelig fejl.
