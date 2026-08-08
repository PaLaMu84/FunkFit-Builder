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
Versionen bruger Google Gemini 3.5 Flash-Lite til musikforslag uden Google Search-grounding. I den nuværende testversion indsætter brugeren sin egen API-nøgle. Nøglen gemmes kun i browserens session og indgår ikke i den gemte træning.

I en produktionsversion bør AI-kaldet gå gennem en server-side proxy, så API-nøglen ikke sendes direkte fra klientappen.

### Playlistfil
FunkFit Builder eksporterer en universel CSV med felterne:
`title, artist, album, isrc`

- Spotify og TIDAL kan få CSV-filen matchet og importeret via TuneMyMusic.
- Telmore Musik kan importeres via Soundiiz.
- Den endelige importtjeneste matcher numrene mod destinationens aktuelle katalog. AI-forslaget er derfor ikke en garanti for, at alle numre findes i alle tjenester.

Der kan også downloades en separat **Sektionsplan CSV**, som viser sektion, intensitet, BPM-mål, sang og AI'ens begrundelse. Denne fil er til instruktøren og ikke til playlistimport.


## Gemini-browserfejl og CORS
I testversionen kaldes Gemini direkte fra browseren. Interactions API kan kaldes med `Content-Type` og `x-goog-api-key`. Der må ikke tilføjes unødvendige ekstra request-headere, da de kan udløse en CORS preflight-fejl i browseren.

v0.7.4-alpha.23 fjerner den tidligere `Api-Revision`-header, som kunne give `Failed to fetch` på mobil og desktop.

Hvis en rigtig API-fejl returneres fra Google, vises Googles fejlbesked. Hvis browseren slet ikke kan etablere forbindelsen, vises en særskilt netværks-/CORS-besked.

Gemini API-nøgler skal behandles som passwords. En nøgle, der er blevet delt eller eksponeret, bør tilbagekaldes og erstattes.

## Design – otte punkter
AI-designet af en hel træning er opdelt i otte tydelige punkter:

1. Hvem træner?
2. Hvor foregår træningen?
3. Rammer
4. Hvad skal fylde i træningen?
5. Tilgængeligt udstyr
6. Din idé eller særlige ønsker
7. Ekstra valg til træningsforslaget
8. Træningens struktur

Punkt 7 er bevidst et selvstændigt trin, så valg som **Undgå ventetid og kø**, **Fast ledopvarmning**, **Planlæg en finisher**, **Medtag en leg** og **Prioritér elementer i Mit bibliotek** ikke overses.

## Playlist-resultat – ikke CSV som hovedflow
Fra v0.7.4-alpha.25 er selve resultatet en **playliste i FunkFit Builder**.

Playlisten:
- har et navn
- er opdelt efter træningens sektioner
- viser sangtitel og kunstner
- viser intensitet/BPM og hvorfor nummeret passer
- kan redigeres ved at fjerne enkelte numre
- kan kopieres som en almindelig trackliste
- har direkte “Find”-links til den valgte musiktjeneste

CSV findes kun under **Avanceret eksport** som teknisk reservefunktion. Brugeren skal ikke behøve at forstå eller håndtere CSV for at bruge musikplanlægningen.

### Direkte oprettelse hos musiktjenesten
At oprette en rigtig bruger-playliste direkte i Spotify/TIDAL/Telmore kræver en understøttet login-/API-integration hos den pågældende tjeneste. Det kan ikke laves pålideligt ved blot at generere en fil eller et anonymt link.

Spotify understøtter OAuth/PKCE og playlist-oprettelse, så en direkte Spotify-integration kan bygges som næste trin. TIDAL og Telmore skal vurderes særskilt ud fra deres aktuelle developer-vilkår og API-muligheder.

## TIDAL via CSV og TuneMyMusic
TIDAL-flowet er gjort så kort som browseren tillader:

1. FunkFit genererer playlisten.
2. Tryk **Hent CSV + åbn TuneMyMusic**.
3. Browseren downloader CSV-filen og åbner TuneMyMusics side til CSV → TIDAL.
4. Vælg den netop hentede CSV-fil.
5. Log ind på TIDAL og gennemfør overførslen.

TuneMyMusic matcher titel, kunstner, album og eventuelt ISRC mod TIDAL-kataloget og genopbygger playlisten.

En almindelig webapp må af browserens sikkerhedsregler ikke automatisk indsætte en lokal downloadet fil i et andet websites `<input type=file>`. Derfor kan selve filvalget hos TuneMyMusic ikke automatiseres fra FunkFit uden en anden serverbaseret integrationsmodel.

## Spotify direkte integration
Spotify-sporet bruger **Authorization Code with PKCE**, som er Spotifys anbefalede OAuth-flow til JavaScript-webapps, hvor et client secret ikke kan gemmes sikkert.

### Første opsætning
- Opret en FunkFit-app i Spotify Developer Dashboard.
- Kopiér Spotify Client ID ind i FunkFit Builder.
- Tilføj den Redirect URI, som FunkFit viser, præcis i Spotify-dashboardet.
- Tryk **Forbind Spotify** og godkend adgang til at oprette/redigere playlister.

Client ID er ikke en hemmelighed og kan gemmes lokalt. Der gemmes intet Spotify client secret i appen.

### Opret playliste
Når Spotify er forbundet:
1. AI genererer FunkFit-playlisten.
2. FunkFit søger hvert foreslået nummer i Spotify-kataloget.
3. FunkFit opretter en privat playliste via `POST /me/playlists`.
4. De matchede Spotify-URI'er indsættes via `POST /playlists/{id}/items`.
5. Den færdige Spotify-playliste åbnes og linket gemmes sammen med træningen.

Numre, der ikke kan matches sikkert i Spotify, springes over og rapporteres til instruktøren.

Spotify-metadata bruges kun til at matche og oprette playlisten efter AI-forslaget. Spotify-katalogdata sendes ikke tilbage til AI-modellen.

## Musik-AI – gratis og robust modelstrategi
Fra v0.7.4-alpha.27 bruger musikplanlægningen først **Gemini 3.5 Flash-Lite**. Hvis Google afviser modellen som utilgængelig for projektet, prøver appen automatisk **Gemini 3.1 Flash-Lite**.

Begge modeller kan bruges på Gemini API's Free Tier til almindelig tekstgenerering. **Google Search-grounding er bevidst slået fra**, fordi Search-grounding på Gemini 3 ikke indgår i Free Tier.

AI'ens opgave er derfor at vælge velkendte, eksisterende numre ud fra træningens sektioner og intensitet. Den endelige katalogkontrol sker tættere på musiktjenesten:

- **Spotify:** Hvis Spotify er forbundet, verificerer FunkFit automatisk AI-forslagene mod Spotifys katalog og normaliserer titel, kunstner og album før playlisten oprettes.
- **TIDAL:** TuneMyMusic matcher CSV-listen mod TIDAL-kataloget under importen.

Det reducerer afhængigheden af Google Search og gør gratis-sporet mere stabilt.

## Google API-diagnostik
Fra v0.7.4-alpha.28 bruger musikplanlægningen Googles almindelige `generateContent`-endpoint i stedet for Interactions API. `generateContent` er fortsat fuldt understøttet af Gemini API og er tilstrækkeligt til FunkFits enkeltstående strukturerede musikforslag.

Der er tilføjet **Test Google-nøgle**:

- **Grøn / virker:** nøglen er accepteret af Google og mindst én af FunkFits modeller svarer.
- **401:** nøglen er manglende, ugyldig, udløbet eller deaktiveret. Opret en ny Auth key i Google AI Studio.
- **403:** nøglen findes, men projektet mangler adgang/tilladelse til Gemini API.
- **429:** nøglen er accepteret, men kvoten er opbrugt.
- **404/model:** nøglen virker, men den pågældende model er ikke tilgængelig.

Nye nøgler oprettet i Google AI Studio er Auth keys. FunkFit bruger fortsat `x-goog-api-key`-headeren, som er Googles dokumenterede autentificeringsmetode til Gemini API.

Google API-nøglen gemmes kun i `sessionStorage` og gemmes ikke sammen med træningen.

## Musik v2 – AI eller byg selv
Musiktrinnet starter nu med et tydeligt valg:

### Brug AI til at lave min playliste
Brugeren vælger genrer og øvrige musikønsker. AI'en skal primært holde sig til de valgte genrer, men intensitetsreglerne for den enkelte træningssektion har højeste prioritet.

Valgbare genrer omfatter bl.a. pop, rock, hiphop, R&B, soul/funk, indie/alternative, dance/elektronisk, dansk pop/rock, latin, reggae, country og metal/punk.

AI-playlisten gemmes som en struktureret del af træningen, inklusive:
- playlistens navn
- sektionstilknytning
- sangtitel og kunstner
- album
- intensitets-/BPM-kontekst
- Spotify-verifikation, når den findes
- brugerens genrevalg

### Jeg vil selv bygge playlisten
Der er to manuelle arbejdsgange:

**Byg sang for sang**
- Nummeret tilknyttes direkte en træningssektion.
- Titel, kunstner og eventuelt album gemmes i FunkFit.
- Hvis Spotify er forbundet, kontrolleres titel/kunstner mod Spotify ved tilføjelse.
- Den manuelle trackliste gemmes med træningen på samme måde som en AI-genereret liste.

**Tilknyt eksisterende playliste**
- Brugeren vælger Spotify, TIDAL eller Telmore.
- Playlistens navn og URL gemmes direkte med træningen.
- Det er den bedste løsning, når brugeren allerede har bygget playlisten i musiktjenesten.
- Linket vises igen, når træningen åbnes.

## Skift nummer
Alle tracklister – både AI og manuelle – har en **Skift**-funktion.

Brugeren kan:
- rette sangtitel, kunstner og album manuelt
- gemme det nye nummer på samme plads i den samme træningssektion
- ved forbundet Spotify hente alternative, rigtige Spotify-numre fra de valgte genrer
- beholde resten af playlisten urørt

Spotify-matchning kræver nu både titel- og kunstnermatch med en minimumsscore. Et nummer med korrekt titel men forkert kunstner accepteres derfor ikke længere som et sikkert match.


# Udviklingsopdatering – august 2026

Dette afsnit samler de vigtigste rettelser og udviklingsbeslutninger fra de seneste versioner. Manualen er den gældende beskrivelse af appens adfærd.

## Versioner alpha.19–alpha.30

### alpha.19 – mobil og tekst
- Bred mobil-overflowgennemgang.
- Udstyrsgrid, gemte kort, formularfelter og lange tekster blev gjort responsive.
- Teksten blev ændret til **Prioritér elementer i Mit bibliotek**.
- Legereglen blev ændret fra et fast “INCOMING!”-råb til det generelle **På instruktørens signal**.

### alpha.20 – kontekstafhængige felter
- “Funktionel voksen” vises kun som særskilt overskrift i Familietræning.
- Voksen-, HIIT-, HYROX- og TRX-spor viser kun relevante træningsfelter.
- Mobilregler gælder både Android og iPhone.

### alpha.21 – React Lights
- React Lights blev oprettet som udstyr/modalitet til Junior og Familie.
- Der blev tilføjet reaktions-, agility-, squat-, lunge-, core-, makker- og holdøvelser.
- React Lights regnes som fælles sæt udstyr, ikke ét sæt pr. deltager.

### alpha.22–alpha.28 – musikfundament
- Musikplanlægning blev gjort sektionsbaseret.
- Brugeren kan vælge alle eller udvalgte sektioner.
- Gemini blev koblet på med API-nøgletest og præcise fejl for 401/403/429/modeladgang.
- Musikresultatet blev ændret fra “CSV som produkt” til en reel playlistemodel i FunkFit.
- Spotify fik OAuth/PKCE-spor til direkte playlist-oprettelse.
- TIDAL fik CSV → TuneMyMusic-flow.
- Google Search-grounding blev fjernet for at holde AI-sporet enklere og billigere.

### alpha.29 – AI eller byg selv
Musik starter med et valg:
1. **Brug AI til at lave min playliste**
2. **Jeg vil selv bygge playlisten**

AI-sporet har genrevalg. Det manuelle spor kan enten bygge sang for sang eller gemme et eksisterende playlist-link. Alle numre kan skiftes individuelt.

### alpha.30 – samlet gennemgang
- Playlistens resultatkort vises kun, hvis der faktisk findes tracks eller et tilknyttet playlist-link.
- Playlisten kan slettes/fjernes fra træningen.
- AI-musik må ikke bruge klassisk, instrumental, soundtrack/score, ambient, meditation, karaoke eller tribute/cover-albums.
- AI-musik prioriterer nyere, energiske tracks. Som standard skal mindst 80 % være fra 2018 eller senere, og tracks før 2010 fravælges.
- TIDAL-forespørgsler prioriterer mainstream-tracks, der sandsynligvis findes i TIDAL-kataloget.
- Afspil viser voksenordinationer ved Funktionel voksen, HIIT, HYROX og TRX; Junior-visning bruges ikke i voksenspor.
- Afspil viser kun knappen til den musiktjeneste, der faktisk er tilknyttet træningen.
- Gemte træninger viser **Playliste tilknyttet** eller **Playliste ikke tilknyttet**. Tilknyttet åbner playlisten; ikke tilknyttet åbner Musik-trinnet.

# HYROX – gældende principper

## HYROX-kerne
Når SkiErg og romaskine ikke er til rådighed, er de primære officielle HYROX-stationer i FunkFit:
- Sled push
- Sled pull
- Burpee broad jumps
- Farmers carry
- Sandbag walking lunges
- Wall balls
- Løb mellem arbejdsstationerne

Disse øvelser har højeste AI-prioritet i HYROX-sporet.

## Hyrox-inspirerede støtteøvelser
Når der er behov for variation, eller udstyret begrænser de officielle stationer, kan AI sekundært bruge:
- KB swings
- Goblet squats
- Burpees
- Hand release push-ups / push-ups
- Sit-ups og V-ups
- Squat jumps
- Plank shoulder taps
- Air squats
- Reverse/walking lunges
- Mountain climbers
- Shuttle run
- Devil press for øvede

Appen skelner internt mellem **officiel HYROX** og **Hyrox-inspireret**.

## Løb mellem hver øvelse
HYROX-sektioner har nu strukturfunktionen **Løb mellem hver øvelse**.
- Standarddistancer: 200, 300, 400, 500 og 1000 m.
- Der kan vælges brugerdefineret distance.
- **Start også med løb** giver klassisk: løb → station → løb → station.
- Løbene indsættes automatisk og følger sektionen gennem player, PDF og redigering.
- Man skal derfor ikke manuelt oprette det samme løb flere gange.

AI-genererede HYROX-hovedblokke bruger som udgangspunkt løb mellem stationerne.

# TRX – gældende principper

TRX er nu et **TRX-first** spor. Hoveddelen af arbejdsøvelserne kræver fysisk en TRX Suspension Trainer.

## Syv TRX-grundbevægelser
Biblioteket organiseres efter:
1. Plank
2. Hinge
3. Pull
4. Squat
5. Push
6. Lunge
7. Rotate

Eksempler er low/mid/high row, chest press/fly, squat/single-leg squat, reverse/split/lateral lunge, hamstring curl/hip press, plank/body saw/knee tuck/pike/mountain climber, Y/T-fly, biceps/triceps, power pull og atomic push-up.

## Programmeringsregel
- Rene TRX-arbejdssektioner skal som udgangspunkt bestå af TRX-øvelser.
- Ledopvarmning må være uden TRX.
- En finisher eller en særskilt løbe-/konditionsopgave kan være uden TRX, hvis det er et bevidst valg.
- Belastning skaleres primært med kropsvinkel, fodplacering, stabilitet og bevægeudslag.

## Udstyrslogik
Udstyrsfiltrering skelner nu mellem:
- **Alternativt udstyr**: fx Kettlebell *eller* håndvægt.
- **Alt kræves**: fx Wall ball = medicinbold + væg, sled pull = slæde + reb, TRX atomic push-up = TRX + måtte.

En øvelse med flere nødvendige redskaber godkendes ikke længere, bare fordi ét af redskaberne findes.

# HIIT – gældende principper

HIIT er ikke en bestemt samling øvelser. Det er en intervalmetode med høj relativ intensitet og reel recovery.

## Standardøvelser
AI prioriterer teknisk enkle, hurtigt skalerbare bevægelser, fx:
- Shuttle run
- Burpee
- Mountain climber
- High knees
- Jumping jack
- Fast feet
- Air squat / squat jump
- Reverse/walking lunge
- Skater jumps
- Step-ups
- Push-ups / hand release push-ups
- Battle rope
- Plank jack

## Kræver erfaring
Disse bruges ikke som automatiske standardvalg og kræver, at brugerens ønsker tydeligt peger på øvet/erfaren træning:
- Kettlebell swing
- Box jump
- Wall ball
- Dumbbell push press
- Burpee broad jump
- Devil press

## Ikke standard i HIIT
AI skal som udgangspunkt undgå:
- Olympiske løft
- tunge/maximale løft
- teknisk komplekse barbell-løft
- langsomme isolationsøvelser
- ustabile balanceøvelser
- øvelser hvor tidspres sandsynligvis ødelægger teknikken

## Work:rest og intensitet
AI-genererede HIIT-blokke bruger realistiske intervaller som:
- 20/40 ved meget høj intensitet
- 30/30 som hård standard
- 40/20 ved kontrolleret HIIT

Arbejdsperioderne styres omkring RPE 8–9/10. Recovery er en del af programmeringen. Lange næsten pauseløse circuits skal ikke kaldes HIIT, hvis deltagerne reelt falder ned i moderat intensitet.

## Balance
En HIIT-blok skal skifte bevægelsesmønster og kropsområde. AI undgår fx at lægge squat jump, wall ball, thruster og goblet squat efter hinanden som fire ben-dominante stationer. Der prioriteres mindst én reel engine-/pulsbevægelse.

## Opvarmning
HIIT skal have en gradvis warm-up og kort rehearsal af de bevægelser, der senere udføres hurtigt. Bevægelseskvalitet prioriteres over “all-out”.

## Player – voksenspor og redigerede værdier
Ved Funktionel voksen, HIIT, HYROX og TRX læser playeren nu de **redigerede sporfelter** først. Hvis brugeren fx har ændret kg, reps, distance, intensitet eller TRX-kropsvinkel i Finpuds, er det disse værdier der vises under afspilning. Juniorstandarder bruges kun som fallback i Junior/Familie, ikke som primær ordination i voksenspor.

## Musik – automatisk kvalitetsfilter
Hvis brugeren ikke specifikt beder om retro/ældre musik, filtrerer FunkFit nu AI-resultatet til **2018 eller nyere**. Hovedblokke kræver mindst energi 7/10, Teamchallenge/Finisher mindst 8/10, mens Ledopvarmning fortsat må ligge roligt på 3–5/10. Et udtrykkeligt ønske om fx 80'erne, 90'erne, oldies eller retro ophæver årstalsfilteret, men ikke forbuddet mod instrumental/klassisk/score/ambient.


# Lege-modul – alpha.31

## Hvorfor lege er et selvstændigt modul
Lege er ikke længere kun almindelige sektioner gemt i **Mit bibliotek**. FunkFit har nu et selvstændigt **Lege**-område med en tydelig skelnen mellem:

1. **Grundleg / masterleg** – den centrale definition, som vedligeholdes i Indholdsadministration.
2. **Træningsinstans** – en selvstændig kopi af grundlegen, når den bruges i en konkret træning.

Det betyder, at en instruktør kan ændre, fjerne eller tilføje øvelser i den konkrete træning uden at overskrive grundlegen.

## Legebibliotek
Legebiblioteket viser aktive grundleg og kan filtreres på:
- navn, emne og tags
- emne/tema
- aktuelt deltagerantal

Hvert kort viser bl.a.:
- navn og emne
- minimum/maksimum deltagere
- organisering og holdkrav
- standardvarighed
- målgruppe
- udstyr og antal
- standardøvelser

En leg kan bruges som ny Leg-sektion eller vælges direkte fra en eksisterende Leg-sektion i Finpuds.

## Byg en leg / Indholdsadministration
En grundleg indeholder:
- navn
- emne/tema
- beskrivelse
- regler
- trænertips
- standardvarighed
- status: Aktiv eller Kladde
- målgruppe
- tags
- minimum antal deltagere
- valgfrit maksimum
- organisering: fælles, individuel, makker, hold eller stafet
- om legen kræver hold
- minimum antal hold
- anbefalet deltagere pr. hold
- nødvendigt udstyr og præcist antal af hvert redskab
- standardøvelser valgt fra FunkFits øvelsesbibliotek

Grundlegen kan redigeres, duplikeres eller slettes centralt. Redigering øger versionsnummeret på grundlegen.

## Udstyr fra lege
Udstyr angivet i en grundleg føres direkte ind i træningens **Du skal bruge**.

Eksempel:
- 12 kegler
- 2 React Lights
- 4 medicinbolde

Disse tal behandles som krav til selve legen og må derfor ikke automatisk multipliceres med antal deltagere.

## Deltagerkontrol
Hvis en leg er bygget til fx minimum 10 deltagere, og den indsættes i en træning med 7 deltagere, advarer FunkFit før indsættelse. Brugeren kan stadig vælge at indsætte legen og selv skalere den.

## Standardøvelser og træningskopier
Grundlegen gemmer referencer til standardøvelser i FunkFits øvelsesbibliotek.

Ved indsættelse i en træning oprettes normale træningsaktiviteter fra disse øvelser. Derefter kan instruktøren:
- tilføje øvelser
- fjerne øvelser
- skifte øvelser
- ændre reps, kg, tid og andre relevante felter

Disse ændringer gælder kun træningen.

## Admin- og backend-arkitektur
Alpha.31 introducerer et lokalt **Indholdsadministration**-lag. Den nuværende GitHub Pages/PWA har ingen server-login eller central database, så rollen “Lokal administrator” er kun lokal på enheden.

Datamodellen er forberedt med:
- `ownerId`
- `ownerRole`
- `visibility`
- `status`
- versionsnummer
- created/updated timestamps

Når FunkFit senere får rigtig backend og login, kan dette udvides til roller som:
- Instruktør
- Legeansvarlig
- Admin

uden at ændre princippet om masterleg kontra træningsinstans.

## Datasikkerhed
Grundlege gemmes i:
- `funkfit-games-v1`
- backup: `funkfit-games-backup-v1`

`reset-cache.html` rydder ikke disse data.

Ved første opgradering forsøger FunkFit desuden at importere tidligere Leg-elementer fra **Mit bibliotek** som grundleg. De gamle elementer slettes ikke.


# Lege-modul – alpha.32

## Egne redskaber
Legemodulet har nu et lokalt redskabskatalog, som brugeren selv kan udvide.

Hvis et redskab ikke findes på standardlisten, kan brugeren skrive navnet – fx **Ringe** – og vælge **Tilføj eget redskab**. Redskabet gemmes derefter og kan vælges igen i andre grundleg.

Egne redskaber gemmes i:
- `funkfit-game-custom-equipment-v1`

Det påvirker ikke øvelsesbibliotekets faste udstyrstyper. Det er et fleksibelt katalog til grundlegenes konkrete udstyrsbehov.

**Ringe** er samtidig tilføjet til standardlisten.

## Tid i en leg
En grundleg har ikke længere kun ét samlet tidsfelt. Tiden opdeles i:

1. **Forklaring + forberedelse** – tid til at forklare regler, dele hold, stille redskaber op og gøre deltagerne klar.
2. **Aktiv leg** – den tid deltagerne faktisk leger.
3. **Samlet varighed** – beregnes automatisk som forklaring/forberedelse + aktiv leg.

Eksempel: 3 min forklaring/forberedelse + 8 min aktiv leg = 11 min samlet.

Det er den **samlede varighed**, der føres ind som sektionens tid, når legen indsættes i en træning. Legebiblioteket og træningsinstansen viser også tidsfordelingen.

## Bagudkompatibilitet
Ældre grundleg, der kun har et samlet `minutes`-felt, behandles som 0 min forklaring/forberedelse og hele den tidligere tid som aktiv leg. Dermed mister tidligere gemte lege ikke deres varighed.


# Lege-modul – alpha.33

## OBS – redskab skal selv skaffes
Hvert redskab i en grundleg kan nu markeres med:

**OBS – skal selv skaffes**

Det bruges til ting, som ikke nødvendigvis findes i FunkFits normale udstyrslager, fx:
- kortspil
- terninger
- balloner
- papir/kort
- små præmier
- særlige rekvisitter

Markeringen ligger på det enkelte redskab – ikke på hele legen. En leg kan derfor fx kræve:
- 12 kegler
- 2 React Lights
- 1 kortspil **⚠ skal selv skaffes**

Markeringen gemmes i grundlegen og følger med træningsinstansen.

## Visning
OBS-markeringen vises:
- i Legebiblioteket
- i den indsatte leg i Finpuds
- i administrationsoversigten
- i **Du skal bruge**, hvor noten indeholder “OBS – skal selv skaffes”

Det gør det muligt at skelne mellem almindeligt træningsudstyr og små rekvisitter, som instruktøren selv skal huske at medbringe.


# Lege-modul – alpha.34

## Rettelse: redigering af eksisterende grundleg
Redigeringsflowet er gjort robust for grundleg, der er oprettet i alpha.31, alpha.32 og alpha.33.

Tidligere kunne Lege-modulet i særlige tilfælde nulstille formularen som **Ny grundleg** under skiftet fra Legebibliotek til Administration. Hvis der samtidig opstod en fejl under game-initialisering, kunne hele FunkFit vise den generelle besked “Appen kunne ikke starte”.

Fra alpha.34 gælder:
- Den valgte `gameId` låses før faneskift.
- Formularen nulstilles kun ved et bevidst valg af **Ny leg** / annullering.
- Alle formularfelter udfyldes defensivt fra den gemte master.
- Ældre grundleg får automatisk den nye tidsmodel:
  - mangler `setupMinutes` → 0 min
  - tidligere `minutes` → aktiv legetid
- Ældre udstyrsdata får automatisk `selfSource: false`.
- Game-data repareres til den aktuelle schema-version ved opstart.
- En fejl i Lege-modulet må ikke længere afbryde hele FunkFit Builder.
- Hvis den overordnede app stadig får en startup-fejl, vises den konkrete fejltekst i dialogen for lettere fejlfinding.

Ingen grundleg eller træninger slettes af schema-reparationen.


# Lege-modul – alpha.35

## Indsæt en leg direkte fra Finpuds
Finpuds har nu den selvstændige handling:

**🎲 Indsæt leg fra Legebibliotek**

Når den bruges:
1. FunkFit åbner Legebiblioteket i en særlig indsæt-tilstand.
2. Den ønskede grundleg vælges med **Indsæt som ny sektion**.
3. Grundlegen kopieres til træningen som en ny **Leg-sektion**.
4. FunkFit vender automatisk tilbage til Finpuds.

Den nye leg **erstatter ikke** en eksisterende sektion. Hvis træningen allerede har en Finisher, placeres legen umiddelbart før Finisheren, så Finisher fortsat ligger sidst.

Den indsatte leg er en selvstændig træningsinstans og kan tilpasses i Finpuds uden at ændre grundlegen.

### Tre forskellige legehandlinger
- **Indsæt leg fra Legebibliotek** → indsætter en eksisterende grundleg som ny sektion.
- **Byg en leg med AI** → bygger et nyt legforslag til træningen.
- **Vælg fra Legebibliotek** inde i en eksisterende Leg-sektion → erstatter netop den sektion med en kopi af en grundleg.
