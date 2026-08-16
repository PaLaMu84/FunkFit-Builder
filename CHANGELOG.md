# FunkFit Builder v0.7.4-alpha.40

## Nyt: Udstyrsregister
- Nyt hovedområde “Udstyr”.
- Gymnastiksalen (inde) og Containeren (ude).
- Hver linje: sted, redskab, antal, kg, variant/farve og note.
- Kopiér/slet linjer.
- Opret nye redskaber frit.
- Autosave.
- Standardliste med almindeligt funktionelt træningsudstyr.
- Elastikker/minibands/powerbands har felt til faktisk farve/variant.

## Planlæg
- “📦 Udstyrsregister” åbner registeret.
- “↻ Hent fra register” bruger kun redskaber med antal >0 som stedets tilgængelige udstyr.
- Halvfærdig optælling overskriver ikke automatisk udstyrsprofilen.

## Lege
- Nye redskabsnavne fra Udstyrsregisteret bliver tilgængelige i Lege-editoren.

## Flytning
- Eksport/import af hele registeret som JSON.
- Nye storage keys:
  - `funkfit-equipment-inventory-v1`
  - `funkfit-equipment-inventory-backup-v1`
