# FunkFit Builder v0.7.4-alpha.30

## Samlet gennemgang
Denne version samler de ventende rettelser til musik/player/gemte træninger og en faglig opgradering af HYROX, HIIT og TRX.

## Musik
- PLAYLISTE vises kun ved reelt indhold eller tilknyttet link.
- Ny “Slet playlisten”.
- AI må ikke vælge klassisk, instrumental, soundtrack/score, ambient, meditation, karaoke eller tribute/cover-albums.
- Højere energi i alle sektioner bortset fra den rolige ledopvarmning.
- Nyere musik prioriteres: 80 % fra 2018+, ingen pre-2010 som standard.
- Track-schema indeholder releaseYear, energy og hasVocals.
- TIDAL får særlig mainstream/katalogregel.

## Player
- Funktionel voksen, HIIT, HYROX og TRX viser voksenordination/vægt som primær visning.
- Familie viser fortsat Junior + Voksen.
- Junior viser kun Junior.
- Kun den faktisk tilknyttede musiktjeneste vises.

## Gemte træninger
- “Playliste tilknyttet” åbner playlisten.
- “Playliste ikke tilknyttet” åbner træningen direkte på Musik-trinnet.

## HYROX
- Officielle stationer uden SkiErg/romaskine prioriteres: sled push/pull, burpee broad jumps, farmer carry, sandbag lunges, wall balls.
- Hyrox-inspirerede støtteøvelser bruges sekundært.
- “Løb mellem hver øvelse” med 200/300/400/500/1000 m eller brugerdefineret.
- “Start også med løb” giver klassisk løb → station struktur.
- AI-HYROX bruger automatisk løb mellem stationerne.
- Romaskine/SkiErg fjernes fra standardudstyrsprofilen i denne installation.

## TRX
- TRX-first: hovedarbejdet filtreres til øvelser, der faktisk kræver TRX.
- Bibliotek udvidet med low row, mid row, chest fly, single-leg squat og atomic push-up.
- TRX-øvelser tagges efter de 7 grundbevægelser.
- Udstyrsfiltrering understøtter “alle redskaber kræves”.

## HIIT
- AI bruger intervalstruktur frem for AMRAP forklædt som HIIT.
- Standardprofiler: 30/30, 40/20 og 20/40.
- Primær pulje er enkel og skalerbar.
- Teknisk krævende øvelser kræver øvet/erfaren intention.
- Tunge/komplekse/isolationsprægede standardvalg filtreres fra.
- Mindst én engine-bevægelse prioriteres.
- Hård lokal muskeludtrætning straffes ekstra i balancealgoritmen.

## Manual
- Udviklingen fra alpha.19 til alpha.30 er samlet.
- HYROX-, HIIT-, TRX-, musik- og player-regler er dokumenteret.

## Data
- Gemte træninger bruger fortsat `funkfit-workouts-v074a`.
