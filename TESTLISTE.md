# Gentest – v0.7.4-alpha.31

## Lege – navigation
1. Hovednavigationen viser Lege.
2. Lege åbner Legebibliotek som standard.
3. Skift mellem Legebibliotek og Administration.
4. Mobilnavigation må ikke give vandret overflow.

## Byg en grundleg
5. Opret en leg med navn og emne.
6. Gem beskrivelse, regler og trænertips.
7. Sæt standardvarighed.
8. Sæt min. deltagere.
9. Sæt maksimum deltagere og kontroller validation.
10. Vælg organisering Hold og kontroller at holdfelter vises.
11. Sæt min. antal hold og anbefalet holdstørrelse.
12. Tilføj 2-3 redskaber med præcise antal.
13. Tilknyt 3 standardøvelser.
14. Gem som Aktiv.
15. Opret en anden som Kladde: den må ikke vises i Legebibliotek.

## Administration
16. Redigér en bestehende grundleg.
17. Kontroller at versionsnummeret stiger.
18. Duplikér en leg: kopi skal være Kladde.
19. Slet en grundleg og kontroller bekræftelse.

## Legebibliotek
20. Søg på navn.
21. Søg på emne/tag.
22. Filtrér på emne.
23. Skift deltagerantal og kontroller “Passer/Tjek deltagerantal”.
24. Brug en leg i træningen.

## Instans i træning
25. Indsat leg viser “Fra legebiblioteket”.
26. Tilføj en øvelse i Finpuds.
27. Fjern/skift en standardøvelse.
28. Åbn grundlegen igen: den må ikke være ændret.
29. Redigér grundlegen centralt: en allerede gemt træningsinstans må ikke ændres.

## Eksisterende Leg-sektion
30. Opret/åbn en Leg-sektion.
31. Tryk “Vælg fra Legebibliotek”.
32. Vælg en leg: sektionen skal erstattes af en kopi.

## Deltagere
33. Sæt træningen til færre deltagere end grundlegens minimum.
34. Brug legen: appen skal advare, men tillade brugerens bevidste valg.

## Udstyr
35. Opret leg med 12 kegler + 2 React Lights.
36. Indsæt i træning.
37. “Du skal bruge” skal mindst vise 12 kegler og 2 React Lights.
38. Tallene må ikke multipliceres med antal deltagere.

## Storage/migrering
39. Grundlege overlever reload.
40. `funkfit-games-backup-v1` opdateres sammen med hovedkey.
41. Eksisterende `funkfit-workouts-v074a` er uændret.
42. reset-cache må ikke rydde localStorage.
43. Tidligere gemte Leg-elementer fra Mit bibliotek importeres kun én gang.

## Regression
44. JavaScript syntax OK.
45. Ingen dublerede HTML-id'er.
46. Øvelsesbibliotek og Mit bibliotek virker fortsat.
47. Musik/Player/HYROX/HIIT/TRX fra alpha.30 virker fortsat.
