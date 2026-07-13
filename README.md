
# FunkFit Builder

Første MVP til planlægning af funktionel træning for FunkFit Junior og pårørende.

## Funktioner

- Øvelsesbibliotek med filtre
- Junior- og voksenskalaer
- Træningsbygger med sektioner
- Lokalt gemte træninger
- Printvisning
- Grundlæggende PWA/offline-understøttelse

## Sådan starter du lokalt

Appen skal åbnes gennem en lille webserver, fordi browseren ellers kan blokere JSON-filerne.

### Med VS Code
Installér udvidelsen **Live Server**, højreklik på `index.html`, og vælg **Open with Live Server**.

### Med Python
Kør i projektmappen:

```bash
python -m http.server 8000
```

Åbn derefter:

```text
http://localhost:8000
```

## GitHub

1. Opret et nyt privat repository i GitHub Desktop.
2. Vælg denne mappe som lokal projektmappe.
3. Commit alle filer.
4. Push repository til GitHub.
5. Aktivér eventuelt GitHub Pages under repository settings.

## Næste oplagte trin

- Flere øvelser
- Egne øvelser
- Drag-and-drop mellem sektioner
- Udstyrsberegner
- Automatisk træningsgenerator
- Timer og stationsskærm
- Billeder/video
