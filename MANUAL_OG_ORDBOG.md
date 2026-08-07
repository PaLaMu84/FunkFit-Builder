# FunkFit Builder – manual og begrebsordbog

## Den nye sektionsmodel
En sektion beskrives i seks adskilte lag. De må ikke blandes sammen.

1. **Formål** – hvorfor sektionen findes: Ledopvarmning, Opvarmning, Teknik, Hovedelement, Leg, Teamchallenge eller Finisher.
2. **Arbejdsformat** – hvordan arbejdet forløber: Fælles flow, Kvalitetsarbejde, AMRAP, EMOM, Intervaller, Fast antal runder, For time, Sætbaseret eller Sang.
3. **Opgavestruktur** – hvordan opgaverne er bygget: Frit flow, Rundebaseret, Opgave pr. tidsblok, Chipper, Stationer, Enkeltøvelse, Øvelsesblok eller Leg/mission.
4. **Repetitionsmodel** – hvordan mængden udvikler sig: Faste reps, stigende/faldende ladder, pyramide, tid, distance eller kvalitetsgentagelser.
5. **Organisering** – hvordan deltagerne arbejder: Individuelt, Samtidigt, Makker sammen, YGIG, Hold, Stafet, Fast/Fri rotation eller Fælles.
6. **Styring** – hvad der afslutter arbejdet: Samlet tid, Tidsblokke, Intervaller, Runder, Time cap, Sæt og pause, Kvalitet eller Sang.

## Regler
- **AMRAP:** Fast tid og gentagelig runde. Ingen sæt pr. øvelse.
- **EMOM:** Opgave pr. minut/tidsblok. Ingen sæt pr. øvelse.
- **For time:** Fast opgave; tiden varierer. Time cap kan anvendes.
- **Chipper:** Opgavestruktur med én gennemgang af en fast liste. Normalt For time.
- **Ladder:** Repetitionsmodel, ikke arbejdsformat.
- **Fast antal runder:** Runder gælder hele rækken, ikke sæt ved hver øvelse.
- **YGIG:** Organisering. Makkere skifter efter opgaven; det er ikke automatisk et interval.
- **Stationer:** Opgavestruktur. Organisering er rotation, og formatet er typisk intervaller.




### Visning af øvelsesfelter
- Teksten **Funktionel voksen** vises kun i Familietræning, hvor den er nødvendig for at skelne voksenalternativet fra juniorøvelsen.
- I Funktionel voksen, HIIT, Hyrox og TRX vises der ikke en ekstra overskrift med træningssporets navn over felterne. Kun de felter, der er relevante for den konkrete øvelse og det konkrete format, vises.
- Feltlogikken ændres ikke: fx kan kg, reps, sæt, tempo, pause, distance, kropsvinkel eller intensitet stadig vises, når de fagligt er relevante.
- Felterne skal være kompakte. Korte værdier som `3`, `8-10` eller `3-1-1` skal ikke fylde en hel kolonne. Feltet må vokse, når indholdet kræver mere plads.
- De responsive regler er viewport-baserede og gælder både Android og iPhone.



## React Lights
React Lights er tilgængeligt som udstyr/modalitet i **FunkFit Junior** og **Familie**.

Det bruges især til reaktion, koordination, retningsskift, leg, makkerarbejde og korte intensive intervaller. React Lights skal vælges under **Tilgængeligt udstyr**, før AI må bruge øvelserne automatisk.

Kataloget indeholder:
- React Lights – farvejagt
- React Lights – sprint til lys
- React Lights – side shuffle
- React Lights – squat & touch
- React Lights – lunge reach
- React Lights – plank touch
- React Lights – bear crawl
- React Lights – burpee & touch
- React Lights – makkerduel
- React Lights – holdstafet
- React Lights – husk rækkefølgen
- React Lights – bevægelse + signal

### Programmeringsregler
- React Lights regnes som **et fælles sæt udstyr**, ikke ét redskab pr. deltager.
- Ved én aktiv React Lights-station viser “Du skal bruge” som udgangspunkt **1 sæt React Lights**.
- Ved flere samtidige stationer lægges antallet af nødvendige sæt sammen.
- AI prioriterer React Lights ved ønsker om reaktion, koordination og agility, men kun når udstyret er markeret som tilgængeligt.
- Ved store hold bør React Lights oftest bruges som station, makkerøvelse, holdchallenge eller stafet, så ventetid undgås.
- I Familietræning kan barn og voksen lave samme opgave eller få hver sin sværhedsgrad gennem afstand, tempo og kompleksitet.


## Udstyrsoversigten: “Du skal bruge”
Til sidst i planlægningen viser boksen **Klar til at gemme** en samlet udstyrsoversigt.

Deltagertallet kan ændres direkte i boksen. Oversigten genberegnes med det samme, så instruktøren kan åbne en gemt træning kort før start, rette antallet af deltagere og se det opdaterede behov.

### Beregningsprincipper
- Oversigten viser det **højeste samtidige behov** for hver udstyrstype.
- Udstyr, som anvendes i forskellige sektioner, tælles ikke dobbelt, fordi det kan genbruges.
- Ved individuel og samtidig træning beregnes som udgangspunkt ét sæt udstyr pr. aktiv deltager.
- Ved YGIG beregnes som udgangspunkt udstyr til halvdelen af deltagerne, fordi makkere skiftes.
- Ved stationer beregnes behovet pr. gruppe og lægges sammen på tværs af samtidige stationer.
- Ved stafet og holdarbejde beregnes udstyr efter et praktisk antal hold.
- En håndvægtøvelse kan kræve én eller to håndvægte pr. aktiv deltager afhængigt af øvelsen.
- Farmer carry med kettlebells beregnes med to kettlebells pr. aktiv deltager.
- Kegler beregnes efter baner, stationer og vendepunkter frem for én kegle pr. person.
- Kropsvægt vises ikke som udstyr. Væg vises som adgang til væg.

Eksempel ved 20 samtidige deltagere:
- 20 kettlebells, når alle bruger én
- 40 håndvægte, når alle bruger to
- 20 måtter, når alle skal have én

Oversigten følger også med i instruktør-PDF’en.

## Beskyttelse af gemte træninger
Gemte træninger ligger i browserens lokale lager og må ikke slettes ved versionsskift eller almindelig cache-nulstilling.

Appen gemmer derfor en ekstra lokal sikkerhedskopi af listen over gemte træninger. Hvis den normale lagernøgle mangler, forsøger appen at gendanne træningerne fra sikkerhedskopien. En træning slettes kun, når brugeren aktivt vælger **Slet** på den konkrete træning.


## Ledopvarmning
Ledopvarmning er rolig, systematisk mobilisering – ikke puls- eller styrketræning.

Arbejd gennem hele kroppen enten nedefra og op eller oppefra og ned. Husk:
- nakke: rolige bevægelser op og ned
- skuldre og arme
- rotation i øvre ryg
- hofter
- knæ
- ankler/fodled
- håndled

Varigheden er normalt cirka fem minutter. Bevæg roligt og kontrolleret uden at skabe høj puls.

## Regelpakke for AI-balance
AI må ikke kun vælge de øvelser, der scorer højest enkeltvis. Den skal også vurdere variationen i den samlede sektion og i resten af træningen.

### Opvarmning med fire øvelser
AI forsøger som udgangspunkt at dække:
1. puls og bevægelse
2. underkrop
3. overkrop
4. core eller helkrop

Der må som udgangspunkt højst være to øvelser med samme primære bevægelsesmønster eller primære kropsområde. En opvarmning må derfor ikke ende med fire næsten ens skulder-, core- eller konditionsøvelser.

### Primært fokus
- Core som sekundær stabilisator tæller ikke som en egentlig coreøvelse.
- Øvelsens kategori og primære bevægelsesmønster vægter højere end alle sekundære kropsområder.
- Push, pull, squat, hinge, lunge, carry, hop/løb og core behandles som forskellige bevægelsesmønstre.

### Balance i hele træningen
Når AI bygger næste sektion, nedprioriterer den bevægelsesmønstre og kropsområder, der allerede fylder meget. Det reducerer fx:
- mange presøvelser uden træk
- flere squatvarianter uden hinge
- gentagne skuldertunge sektioner
- unødvendigt mange direkte coreøvelser

Et tydeligt brugerønske kan tilsidesætte standardbalancen. Beder brugeren specifikt om fx ben, skuldre eller meget core, må dette fokus fylde mere.


## Regelpakke for relevante øvelsesfelter
Finpuds viser kun felter, der giver mening for både sektionens arbejdsformat og den konkrete øvelse. Styring, der gælder hele sektionen, skal ikke gentages på hvert øvelseskort.

### 1. AMRAP, EMOM, For time og fast antal runder
- Vis **kg/belastning**, når øvelsen faktisk bruger ekstern vægt.
- Vis én relevant mængde: **reps**, **tid** eller **distance**.
- Vis ikke **sæt**, individuel **pause** eller **tempo** som standard.
- EMOM kan kalde mængden “reps pr. tidsblok”.

Eksempel: Kettlebell clean i en AMRAP viser **kg og reps**. Tempo, pause og sæt skjules. I en sætbaseret styrkeblok kan **kg, reps, sæt og pause** vises, mens tempo fortsat skjules, fordi clean er eksplosiv.

### 2. Intervaller og stationer
- **Arbejde, pause og runder** styres for hele sektionen.
- De skal derfor ikke gentages på hver øvelse.
- Øvelseskortet viser kun relevant belastning og eventuelt mål pr. interval.
- Ved HIIT kan intensitet vises på øvelsen.
- Hvis en øvelse udføres i hele arbejdsintervallet, er et ekstra tidsfelt overflødigt.

### 3. Sætbaseret styrke
- Vis **kg**, **reps**, **sæt**, **tempo** og **pause**, når felterne er relevante.
- Tempo skjules ved eksplosive øvelser, spring, kast og konditionsarbejde.
- Pause vises kun, når pausen faktisk hører til det enkelte sæt.

### 4. Teknik og kvalitetsarbejde
- Vis relevante reps eller tid og eventuel belastning.
- Tempo kan vises ved kontrollerede styrkeøvelser.
- Tempo skjules ved eksplosive bevægelser og konditionsøvelser.

### 5. Øvelsestypen bestemmer mængdefeltet
- **Reps:** almindelige styrkeøvelser, hop, kast og dynamiske coreøvelser.
- **Tid:** planker, wall sit og andre statiske hold.
- **Distance:** carry, crawl, slædearbejde, løb og ergometer.
- **Kg:** kun ved øvelser med relevant ekstern belastning.

### 6. Træningsspecifikke felter
- **TRX:** kropsvinkel; reps eller tid; tempo kun ved kontrolleret styrkearbejde; ensidig/tosidig kun ved relevante øvelser.
- **Hyrox:** vægt plus reps eller distance; ergometer viser meter. Løb oprettes som løbeaktivitet.
- **HIIT:** intensitet samt eventuel vægt eller mål. Arbejde, pause og runder ligger på sektionsniveau.
- **Familietræning:** junior- og voksenfelter følger hver sin valgte øvelse. Voksenalternativet kan derfor have andre relevante felter end juniorøvelsen.

### 7. Grundregel
Et felt skal kun vises, når instruktøren med rimelighed kan bruge det til at planlægge eller gennemføre netop den øvelse i netop det format. Skjulte felter må ikke udskrives i instruktør-PDF’en.



## Finisher – sang eller andet format
En Finisher er sektionens **formål**: en kort, tydelig afslutning på træningen. Den er ikke automatisk en sang.

### Valg 1: Sang
- Varigheden følger sangen.
- Sangtitel, kunstner og link kan gemmes.
- Kataloget indeholder forskellige sangmekanikker, fx omkvæds-burpees, planke i versene og en fælles high-five-finale.
- En sangbaseret finisher bruger ikke den almindelige øvelsesliste.

### Valg 2: Andet format
En finisher kan bl.a. være:
- kort AMRAP eller EMOM
- Tabata eller andre intervaller
- stigende eller faldende ladder
- chipper eller For time-opgave
- stafet, makkerchallenge eller holdmission
- carry-, løbe-, core-, TRX- eller Hyrox-afslutning
- en fælles reaktionsleg eller personlig kvalitetsudfordring

### Katalog og AI-forslag
Appen indeholder **25 forskellige finishere**. Hvert katalogelement kan indsætte navn, varighed, arbejdsformat, organisering, opgave, regler, trænertips og relevante aktiviteter.

AI-forslaget vurderer:
- træningssporet: Junior, Familie, Funktionel voksen, TRX, HIIT eller Hyrox
- tilgængeligt udstyr
- deltagerantal og risiko for kø
- brugerens mål og tekstønsker
- variation i forhold til resten af træningens kropsområder
- nyligt foreslåede finishere, så kataloget bruges mere varieret

Et forslag er et udgangspunkt. Finisherens navn, struktur, regler, trænertips og aktiviteter kan fortsat redigeres i Finpuds.


## Musikplanlægning
Musik er en del af træningens intensitetsstyring. Musikplanen bygges **sektion for sektion**, så hele træningen ikke automatisk får samme tempo og energi.

### Arbejdsgang
1. Vælg musiktjeneste: Spotify, TIDAL eller Telmore Musik.
2. Vælg om AI skal planlægge **alle sektioner** eller **kun udvalgte sektioner**.
3. Angiv musikønsker og musik, der skal undgås.
4. Google Gemini kan derefter foreslå eksisterende numre og knytte dem til træningens sektioner.
5. Kontrollér forslagene, fjern evt. numre og download playlistfilen.
6. Importér playlistfilen til den valgte musiktjeneste.

### Intensitetsregler
- **Ledopvarmning:** ca. 65-95 BPM. Rolig og samtalevenlig musik. Ingen dance, EDM, techno, klubmusik, hård rock eller hurtige/aggressive beats.
- **Opvarmning:** ca. 95-120 BPM. Energien må stige gradvist.
- **Teknik:** ca. 85-115 BPM. Musikken må ikke stjæle opmærksomhed fra instruktion.
- **Styrke:** typisk ca. 95-125 BPM. Motiverende, men ikke hektisk.
- **AMRAP/EMOM/HIIT/Hyrox/intervaller:** typisk ca. 120-150 BPM med tydeligt drive.
- **Leg:** typisk 110-140 BPM med sjov og genkendelig energi.
- **Teamchallenge:** typisk 125-155 BPM.
- **Finisher:** kan få træningens største musikalske løft. Hvis en sang allerede er valgt til finisheren, kan den bevares.

BPM er et styringsmål og ikke et absolut krav. Det vigtigste er musikalsk energi, tydelig rytme og at musikken passer til opgaven.

### Junior og Familie
Indstillingen **Undgå explicit lyrics** er som standard aktiv for Junior og Familie. Instruktøren kan ændre den.

### Google Gemini
Versionen bruger Google Gemini 3.6 Flash med Google Search til musikforslag. I den nuværende testversion indsætter brugeren sin egen API-nøgle. Nøglen gemmes kun i browserens session og indgår ikke i den gemte træning.

I en produktionsversion bør AI-kaldet gå gennem en server-side proxy, så API-nøglen ikke sendes direkte fra klientappen.

### Playlistfil
FunkFit Builder eksporterer en universel CSV med felterne:
`title, artist, album, isrc`

- Spotify og TIDAL kan få CSV-filen matchet og importeret via TuneMyMusic.
- Telmore Musik kan importeres via Soundiiz.
- Den endelige importtjeneste matcher numrene mod destinationens aktuelle katalog. AI-forslaget er derfor ikke en garanti for, at alle numre findes i alle tjenester.

Der kan også downloades en separat **Sektionsplan CSV**, som viser sektion, intensitet, BPM-mål, sang og AI'ens begrundelse. Denne fil er til instruktøren og ikke til playlistimport.
