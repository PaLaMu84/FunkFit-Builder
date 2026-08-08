# FunkFit Builder v0.7.4-alpha.31

## Nyt: Lege-modul
- Nyt hovedområde “Lege”.
- Legebibliotek og separat Indholdsadministration.
- Grundlege/masterlege gemmes centralt.
- Når en leg bruges i en træning, indsættes en kopi/instans.
- Træningsændringer påvirker ikke grundlegen.

## Grundleg
Kan gemme:
- navn
- emne/tema
- beskrivelse
- regler
- trænertips
- standardvarighed
- status
- målgruppe
- tags
- min./maks. deltagere
- organisering
- holdkrav, antal hold og holdstørrelse
- præcist udstyr + antal
- standardøvelser fra øvelsesbiblioteket

## Legebibliotek
- Søgning og emnefilter.
- Deltagerantal viser om legen passer.
- “Brug i træning”.
- Eksisterende Leg-sektion har “Vælg fra Legebibliotek”.
- Hvis deltagerantallet ligger uden for grundlegens ramme, vises advarsel.

## Træningsinstans
- Gemmer reference til grundlegen og versionen, men er en selvstændig kopi.
- Øvelser kan redigeres, fjernes og tilføjes i Finpuds.
- Ændringer går ikke tilbage til grundlegen.

## Udstyr
- Grundlegens præcise udstyrstal fødes ind i “Du skal bruge”.
- Udstyrstal fra legen multipliceres ikke automatisk med antal deltagere.

## Administration
- Grundlege kan oprettes, redigeres, duplikeres og slettes.
- Aktiv/Kladde-status.
- Admin-klar metadata: ownerId, ownerRole, visibility, version og timestamps.
- Ingen falsk server-backend: data er fortsat lokale i denne PWA.

## Migrering og backup
- Nye keys:
  - `funkfit-games-v1`
  - `funkfit-games-backup-v1`
- Tidligere Leg-elementer i Mit bibliotek importeres én gang som grundleg uden at blive slettet.
- Workout-storage er fortsat `funkfit-workouts-v074a`.
