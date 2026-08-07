
const $=s=>document.querySelector(s);
const byId=id=>document.getElementById(id);
const on=(id,event,handler)=>{
  const el=byId(id);
  if(!el){console.warn(`Mangler element #${id}`);return false}
  el.addEventListener(event,handler);
  return true;
};
const ELEMENT_TYPES=['Ledopvarmning','Opvarmning','Leg','AMRAP','EMOM','YGIG','Chipper','Stationer','Teknik','Styrke','Finisher']; // interne presets og bagudkompatibilitet
const SECTION_PURPOSES=['Ledopvarmning','Opvarmning','Teknik','Hovedelement','Leg','Teamchallenge','Finisher'];
const FORMATS=['Fælles flow','Kvalitetsarbejde','AMRAP','EMOM','Intervaller','Fast antal runder','For time','Sætbaseret','Sang'];
const TASK_STRUCTURES=['Frit flow','Rundebaseret','Opgave pr. tidsblok','Chipper','Stationer','Enkeltøvelse','Øvelsesblok','Leg/mission'];
const REPETITION_MODELS=['Ikke relevant','Faste reps','Stigende ladder','Faldende ladder','Pyramide','Tid pr. øvelse','Distance pr. øvelse','Kvalitetsgentagelser'];
const ORGANIZATIONS=['Individuelt','Samtidigt','Makker sammen','You go, I go','Hold','Stafet','Fast rotation','Fri rotation','Fælles'];
const CONTROL_TYPES=['Samlet tid','Tidsblokke','Intervaller','Runder','Time cap','Sæt og pause','Kvalitet','Sang'];
const STYLES=['Funktionel','CrossFit-inspireret','HIIT / Hyrox-inspireret','Teknik','Leg','Mobilitet','Kondition'];
const RUN_LIBRARY=[
  {id:'run-50',label:'50 m løb',type:'Almindeligt løb',value:50,unit:'meter',intensity:'Hurtigt',route:'Kort bane eller til kegle og tilbage'},
  {id:'run-100',label:'100 m løb',type:'Almindeligt løb',value:100,unit:'meter',intensity:'Hurtigt',route:'Ude eller korte shuttle-længder'},
  {id:'run-200',label:'200 m løb',type:'Almindeligt løb',value:200,unit:'meter',intensity:'Moderat',route:'Rundt om bygningen eller banen'},
  {id:'run-400',label:'400 m løb',type:'Almindeligt løb',value:400,unit:'meter',intensity:'Moderat',route:'Udendørs rute'},
  {id:'run-800',label:'800 m løb',type:'Almindeligt løb',value:800,unit:'meter',intensity:'Moderat',route:'Udendørs rute'},
  {id:'run-30s',label:'30 sek. løb',type:'Almindeligt løb',value:30,unit:'sekunder',intensity:'Hurtigt',route:'Frit område'},
  {id:'run-60s',label:'60 sek. løb',type:'Almindeligt løb',value:60,unit:'sekunder',intensity:'Moderat',route:'Frit område'},
  {id:'run-shuttle',label:'10 × 10 m shuttle run',type:'Shuttle run',value:100,unit:'meter',intensity:'Hurtigt',route:'10 meter mellem to kegler'},
  {id:'run-zigzag',label:'Zigzag mellem kegler',type:'Zigzag mellem kegler',value:30,unit:'sekunder',intensity:'Hurtigt',route:'5-8 kegler i zigzag'},
  {id:'run-sprint',label:'Sprint til kegle og tilbage',type:'Sprint',value:40,unit:'meter',intensity:'Sprint',route:'20 meter ud og tilbage'},
  {id:'run-hill',label:'Bakkeløb',type:'Bakkeløb',value:45,unit:'sekunder',intensity:'Hurtigt',route:'Kort bakke'},
  {id:'run-stairs',label:'Trappeløb',type:'Trappeløb',value:30,unit:'sekunder',intensity:'Hurtigt',route:'Sikker trappe med fri passage'},
  {id:'run-relay',label:'Stafetløb',type:'Stafetløb',value:60,unit:'sekunder',intensity:'Hurtigt',route:'Holdbane med kegle'},
  {id:'run-reaction',label:'Reaktionsløb',type:'Reaktionsløb',value:30,unit:'sekunder',intensity:'Hurtigt',route:'Instruktøren kalder retning eller farve'}
];

const FINISHER_CATALOG=[{"id":"song-free-choice","mode":"song","title":"Fri afslutningssang","category":"Sang","format":"Sang","minutes":4,"organization":"Fælles","taskStructure":"Frit flow","repetitionModel":"Ikke relevant","control":"Sang","equipment":[],"trainingTypes":["junior","family","adult","trx","hyrox","hiit"],"bodyAreas":["helkrop"],"tags":["musik","fælles","fri"],"description":"Afslut træningen samlet til en valgfri sang. Instruktøren vælger selv bevægelse, stemning eller blot fælles fejring.","rules":"Finisheren starter med sangen og slutter, når sangen slutter.","coachTips":"Vælg en sang, som passer til holdet og den ønskede afslutning. Hold instruktionen meget enkel.","activities":[]},{"id":"song-chorus-burpees","mode":"song","title":"Omkvæds-burpees","category":"Sang","format":"Sang","minutes":4,"organization":"Fælles","taskStructure":"Frit flow","repetitionModel":"Ikke relevant","control":"Sang","equipment":[],"trainingTypes":["junior","family","adult","hiit"],"bodyAreas":["helkrop","kondition"],"tags":["musik","burpees","puls"],"description":"Deltagerne bevæger sig roligt i versene og laver burpees i omkvædene.","rules":"Vers: gå, jog eller step-touch. Omkvæd: burpees i eget tempo. Stop, når sangen slutter.","coachTips":"Vælg en sang med tydelige omkvæd. Skalér til squat thrust eller hænder på boks.","activities":[]},{"id":"song-plank-verses","mode":"song","title":"Planke på verset","category":"Sang","format":"Sang","minutes":4,"organization":"Fælles","taskStructure":"Frit flow","repetitionModel":"Ikke relevant","control":"Sang","equipment":["Måtte"],"trainingTypes":["junior","family","adult","trx"],"bodyAreas":["core"],"tags":["musik","core","kontrol"],"description":"Hold en skaleret planke i versene og bevæg dig frit eller hvil i omkvædene.","rules":"Vers: plankevariant. Omkvæd: rejs dig, bevæg dig og ryst kroppen. Gentag gennem sangen.","coachTips":"Korte gode plankehold er bedre end at hænge i lænden. Brug knæ eller hænder på boks ved behov.","activities":[]},{"id":"song-squat-beat","mode":"song","title":"Squat til beatet","category":"Sang","format":"Sang","minutes":4,"organization":"Fælles","taskStructure":"Frit flow","repetitionModel":"Ikke relevant","control":"Sang","equipment":[],"trainingTypes":["junior","family","adult","hiit"],"bodyAreas":["ben"],"tags":["musik","squat","rytme"],"description":"Arbejd med rolige squats til musikkens beat og korte hold, når instruktøren giver signal.","rules":"Squat i en kontrolleret rytme. På signal holdes bundpositionen kort eller der laves små pulses.","coachTips":"Brug moderat tempo og stop pulses, hvis knæ eller teknik bliver ustabil.","activities":[]},{"id":"song-team-highfive","mode":"song","title":"High-five-finale","category":"Sang","format":"Sang","minutes":4,"organization":"Hold","taskStructure":"Leg/mission","repetitionModel":"Ikke relevant","control":"Sang","equipment":[],"trainingTypes":["junior","family"],"bodyAreas":["helkrop"],"tags":["musik","leg","fællesskab"],"description":"En fælles, energisk afslutning med simple bevægelser og high-fives på instruktørens signal.","rules":"Bevæg jer frit i området. På signal finder alle en ny makker, laver den aftalte bevægelse og giver high-five.","coachTips":"Hold området frit og brug bevægelser, som alle kan være med til.","activities":[]},{"id":"kb-clean-burpee-amrap","mode":"format","title":"Clean & burpee – 4 min","category":"AMRAP","format":"AMRAP","minutes":4,"organization":"Individuelt","taskStructure":"Rundebaseret","repetitionModel":"Faste reps","control":"Samlet tid","equipment":["Kettlebell"],"trainingTypes":["adult","hiit","hyrox","junior","family"],"bodyAreas":["helkrop","hofte","kondition"],"tags":["kettlebell","amrap","burpees","puls"],"description":"Kort AMRAP med kettlebell clean og burpees.","rules":"Så mange kvalitetsrunder som muligt på 4 minutter: 6 kettlebell cleans og 4 burpees.","coachTips":"Skift arm efter 3 cleans eller hver runde. Skalér burpees og vægt, så deltagerne kan arbejde uden lange stop.","activities":[{"exerciseId":"kb-clean","juniorReps":"6","adultReps":"6"},{"exerciseId":"burpee","juniorReps":"4","adultReps":"4"}]},{"id":"row-sprint","mode":"format","title":"3 minutters romaskine-sprint","category":"Kondition","format":"Fælles flow","minutes":3,"organization":"Individuelt","taskStructure":"Enkeltøvelse","repetitionModel":"Distance pr. øvelse","control":"Samlet tid","equipment":["Romaskine"],"trainingTypes":["adult","hyrox","hiit"],"bodyAreas":["kondition","helkrop"],"tags":["romaskine","meter","sprint"],"description":"Saml flest mulige kontrollerede meter på romaskinen på 3 minutter.","rules":"Arbejd i 3 minutter. Registrér meter ved slutsignalet.","coachTips":"Start hårdt, men ikke maksimalt. Sørg for, at teknikken ikke falder sammen det sidste minut.","activities":[{"exerciseId":"row-erg","metrics":{"ergMeters":"Maks. meter"}}]},{"id":"death-by-burpees","mode":"format","title":"Death by burpees","category":"EMOM","format":"EMOM","minutes":8,"organization":"Samtidigt","taskStructure":"Opgave pr. tidsblok","repetitionModel":"Stigende ladder","control":"Tidsblokke","equipment":[],"trainingTypes":["adult","hiit","hyrox"],"bodyAreas":["helkrop","kondition"],"tags":["emom","burpees","ladder"],"description":"En stigende burpee-ladder, hvor antallet øges hvert minut.","rules":"Minut 1: 2 burpees. Læg 1 burpee til hvert minut. Resten af minuttet er pause.","coachTips":"Sæt et realistisk starttal. Stop stigningen eller hold antallet fast, hvis kvaliteten forsvinder.","activities":[{"exerciseId":"burpee","juniorReps":"Start 2, +1/min","adultReps":"Start 2, +1/min"}]},{"id":"tabata-squat-jumps","mode":"format","title":"Tabata squat jumps","category":"Intervaller","format":"Intervaller","minutes":4,"organization":"Samtidigt","taskStructure":"Enkeltøvelse","repetitionModel":"Tid pr. øvelse","control":"Intervaller","equipment":[],"trainingTypes":["junior","family","adult","hiit"],"bodyAreas":["ben","kondition"],"tags":["tabata","hop","ben"],"description":"Klassisk 20/10-finisher med squat jumps eller air squats.","rules":"8 runder: 20 sekunders arbejde og 10 sekunders pause.","coachTips":"Land blødt. Skift til air squat eller squat til boks, når hopkvaliteten falder.","work":20,"rest":10,"rounds":8,"activities":[{"exerciseId":"squat-jump"}]},{"id":"farmer-shuttle","mode":"format","title":"Farmer carry shuttle","category":"Carry","format":"AMRAP","minutes":5,"organization":"Individuelt","taskStructure":"Rundebaseret","repetitionModel":"Distance pr. øvelse","control":"Samlet tid","equipment":["Kettlebell","Kegler"],"trainingTypes":["junior","family","adult","hyrox"],"bodyAreas":["greb","core","helkrop"],"tags":["carry","greb","shuttle"],"description":"Korte farmer carry-shuttles med vendinger mellem to kegler.","rules":"Gå 20 meter farmer carry, sæt vægtene kontrolleret og lav 5 air squats. Gentag i 5 minutter.","coachTips":"Brug flere baner og passende vægte, så der ikke opstår kø.","activities":[{"exerciseId":"farmer-carry","metrics":{"distance":"20 m"}},{"exerciseId":"air-squat","juniorReps":"5","adultReps":"5"}]},{"id":"team-100-chipper","mode":"format","title":"Holdets 100-reps chipper","category":"Teamchallenge","format":"For time","minutes":7,"organization":"Hold","taskStructure":"Chipper","repetitionModel":"Faste reps","control":"Time cap","equipment":["Medicinbold"],"trainingTypes":["junior","family","adult"],"bodyAreas":["helkrop"],"tags":["hold","chipper","samarbejde"],"description":"Holdet fordeler 100 samlede gentagelser mellem sig.","rules":"Gennemfør samlet: 30 air squats, 25 medicinbold slams, 25 sit-ups og 20 burpees. Kun én eller to arbejder ad gangen efter plads.","coachTips":"Tilpas totalen til holdstørrelsen. Alle skal bidrage, men gentagelserne behøver ikke fordeles ligeligt.","timeCap":7,"activities":[{"exerciseId":"air-squat","juniorReps":"30 i alt","adultReps":"30 i alt"},{"exerciseId":"medball-slam","juniorReps":"25 i alt","adultReps":"25 i alt"},{"exerciseId":"sit-up","juniorReps":"25 i alt","adultReps":"25 i alt"},{"exerciseId":"burpee","juniorReps":"20 i alt","adultReps":"20 i alt"}]},{"id":"wall-sit-last","mode":"format","title":"Sidste hold i wall sit","category":"Hold","format":"Fælles flow","minutes":4,"organization":"Hold","taskStructure":"Enkeltøvelse","repetitionModel":"Tid pr. øvelse","control":"Samlet tid","equipment":["Væg"],"trainingTypes":["junior","family","adult"],"bodyAreas":["ben"],"tags":["wall sit","hold","konkurrence"],"description":"Holdene samler længst mulig samlet wall sit-tid.","rules":"Én deltager pr. hold arbejder ad gangen. Når personen rejser sig, skifter holdet straks. Fortsæt i 4 minutter.","coachTips":"Knævinklen må gerne være højere end 90 grader. Fokusér på god position frem for smerte-konkurrence.","activities":[{"exerciseId":"wall-sit","juniorReps":"Tid","adultReps":"Tid"}]},{"id":"partner-slam-ygig","mode":"format","title":"YGIG medicinbold-slam","category":"Makker","format":"AMRAP","minutes":5,"organization":"You go, I go","taskStructure":"Rundebaseret","repetitionModel":"Faste reps","control":"Samlet tid","equipment":["Medicinbold"],"trainingTypes":["junior","family","adult","hiit"],"bodyAreas":["helkrop","kondition"],"tags":["ygig","medicinbold","makker"],"description":"Makkere skiftes til korte sæt medicinbold-slam.","rules":"Makker A laver 8 slams. Derefter laver makker B 8. Fortsæt skiftevis i 5 minutter.","coachTips":"Bolden skal kunne kontrolleres. Brug flere bolde eller små grupper for at undgå kø.","activities":[{"exerciseId":"medball-slam","juniorReps":"8 pr. tur","adultReps":"8 pr. tur"}]},{"id":"core-gauntlet","mode":"format","title":"Core-gauntlet 30/10","category":"Core","format":"Intervaller","minutes":4,"organization":"Samtidigt","taskStructure":"Øvelsesblok","repetitionModel":"Tid pr. øvelse","control":"Intervaller","equipment":["Måtte"],"trainingTypes":["junior","family","adult","trx"],"bodyAreas":["core"],"tags":["core","intervaller","kontrol"],"description":"Tre coreøvelser roteres i korte intervaller.","rules":"30 sekunder arbejde, 10 sekunder skift. Kør dead bug, sideplanke og hollow hold i to runder.","coachTips":"Skalér tidligt. Målet er spænding og kontrol – ikke at holde en dårlig position.","work":30,"rest":10,"rounds":2,"activities":[{"exerciseId":"dead-bug"},{"exerciseId":"side-plank"},{"exerciseId":"hollow-hold"}]},{"id":"reaction-cone-race","mode":"format","title":"Reaktionsrace ved kegler","category":"Leg","format":"Intervaller","minutes":5,"organization":"Hold","taskStructure":"Leg/mission","repetitionModel":"Tid pr. øvelse","control":"Intervaller","equipment":["Kegler"],"trainingTypes":["junior","family","adult"],"bodyAreas":["kondition","koordination"],"tags":["reaktion","kegler","leg"],"description":"Korte reaktionsløb, hvor instruktøren kalder farve eller retning.","rules":"Arbejd i 20 sekunder og hvil/skift i 20 sekunder. Ét point for korrekt kegle – ikke for at skubbe eller blokere.","coachTips":"Lav flere identiske baner og små grupper. Brug tydelige stopzoner.","work":20,"rest":20,"rounds":6,"activities":[{"exerciseId":"cone-touch-reaction"}]},{"id":"trx-burnout","mode":"format","title":"TRX burnout","category":"TRX","format":"AMRAP","minutes":5,"organization":"Individuelt","taskStructure":"Rundebaseret","repetitionModel":"Faste reps","control":"Samlet tid","equipment":["TRX"],"trainingTypes":["trx","adult"],"bodyAreas":["ryg","ben","core"],"tags":["trx","amrap","helkrop"],"description":"Kort TRX-runde med træk, squat og core.","rules":"5 TRX rows, 8 TRX squats og 5 TRX knee tucks. Gentag i 5 minutter.","coachTips":"Justér kropsvinkel og fodplacering, så alle kan holde et stabilt flow.","activities":[{"exerciseId":"trx-row","adultReps":"5"},{"exerciseId":"trx-squat","adultReps":"8"},{"exerciseId":"trx-knee-tuck","adultReps":"5"}]},{"id":"hyrox-mini","mode":"format","title":"Mini-Hyrox-finale","category":"Hyrox","format":"For time","minutes":6,"organization":"Individuelt","taskStructure":"Chipper","repetitionModel":"Faste reps","control":"Time cap","equipment":["Kettlebell","Medicinbold","Løbebane"],"trainingTypes":["hyrox","adult","hiit"],"bodyAreas":["helkrop","kondition"],"tags":["hyrox","løb","carry","wall ball"],"description":"En kort Hyrox-inspireret chipper med løb, carry og wall balls.","rules":"200 meter løb, 40 meter farmer carry og 15 wall balls. Én gennemgang for time med 6 minutters time cap.","coachTips":"Skalér løbedistance og wall ball-højde. Lav parallelle carry-baner.","timeCap":6,"activities":[{"kind":"run","runType":"Almindeligt løb","value":200,"unit":"meter","intensity":"Hurtigt","route":"Kort rute"},{"exerciseId":"farmer-carry","metrics":{"distance":"40 m"}},{"exerciseId":"wall-ball","adultReps":"15"}]},{"id":"medball-countdown","mode":"format","title":"Medicinbold 10-1","category":"Ladder","format":"For time","minutes":6,"organization":"Individuelt","taskStructure":"Rundebaseret","repetitionModel":"Faldende ladder","control":"Time cap","equipment":["Medicinbold"],"trainingTypes":["junior","family","adult","hiit"],"bodyAreas":["helkrop","ben"],"tags":["ladder","medicinbold","slams"],"description":"Faldende ladder af medicinbold-slam og air squats.","rules":"Start med 10 slams og 10 squats. Gå derefter 9-9, 8-8 og så videre ned til 1-1.","coachTips":"Vælg en let bold. Stop ved time cap, også selv om ladder’en ikke er færdig.","timeCap":6,"ladderStart":10,"ladderStep":1,"ladderEnd":1,"activities":[{"exerciseId":"medball-slam"},{"exerciseId":"air-squat"}]},{"id":"burpee-broad-jump-line","mode":"format","title":"Burpee broad jump-linje","category":"For time","format":"For time","minutes":5,"organization":"Individuelt","taskStructure":"Enkeltøvelse","repetitionModel":"Distance pr. øvelse","control":"Time cap","equipment":["Kegler"],"trainingTypes":["adult","hyrox","hiit"],"bodyAreas":["helkrop","kondition"],"tags":["burpee broad jump","distance","hyrox"],"description":"Gennemfør en kort bane med burpee broad jumps.","rules":"Arbejd fremad mellem to markeringer. Gennemfør 20-40 meter afhængigt af niveau og plads.","coachTips":"Kræv kontrollerede landinger og fri bane. Skalér til burpee plus to almindelige skridt frem.","timeCap":5,"activities":[{"exerciseId":"burpee-broad-jump","metrics":{"distance":"20-40 m"}}]},{"id":"sandbag-relay","mode":"format","title":"Sandbag-stafet","category":"Stafet","format":"Fast antal runder","minutes":6,"organization":"Stafet","taskStructure":"Rundebaseret","repetitionModel":"Distance pr. øvelse","control":"Runder","equipment":["Sandsæk","Kegler"],"trainingTypes":["junior","family","adult","hyrox"],"bodyAreas":["helkrop","ben"],"tags":["stafet","sandsæk","hold"],"description":"Holdstafet med bear hug carry og tydelig overlevering.","rules":"Én deltager pr. hold bærer sandsækken 20 meter og tilbage. Overlever bag startlinjen. Fortsæt i 3 runder pr. deltager eller i aftalt tid.","coachTips":"Brug passende vægte og én bane pr. hold. Ingen kast med sandsækken.","rounds":3,"activities":[{"exerciseId":"bear-hug-carry","metrics":{"distance":"40 m pr. tur"}}]},{"id":"coach-calls","mode":"format","title":"Coach calls","category":"Fælles","format":"Fælles flow","minutes":4,"organization":"Fælles","taskStructure":"Leg/mission","repetitionModel":"Ikke relevant","control":"Samlet tid","equipment":[],"trainingTypes":["junior","family","adult"],"bodyAreas":["helkrop","koordination"],"tags":["coach calls","reaktion","fælles"],"description":"Instruktøren kalder korte bevægelser og skift, som hele holdet følger.","rules":"Brug 4-6 aftalte signaler, fx squat, gulv, hop, højre, venstre og high-five. Ingen deltagere udgår.","coachTips":"Start enkelt og øg kun tempoet, hvis alle kan følge med sikkert.","activities":[]},{"id":"dice-finisher","mode":"format","title":"Terningefinisher","category":"Leg","format":"AMRAP","minutes":6,"organization":"Hold","taskStructure":"Leg/mission","repetitionModel":"Faste reps","control":"Samlet tid","equipment":[],"trainingTypes":["junior","family","adult"],"bodyAreas":["helkrop"],"tags":["terning","leg","variation"],"description":"Holdet slår med en terning og udfører den bevægelse, som hører til tallet.","rules":"1 squat, 2 lunges, 3 mountain climbers, 4 sit-ups, 5 line hops, 6 burpees. Brug fx 6 gentagelser eller tallet som antal.","coachTips":"Brug store skumterninger eller en digital terning. Hold gentagelserne lave og flowet højt.","activities":[{"exerciseId":"air-squat"},{"exerciseId":"reverse-lunge"},{"exerciseId":"mountain-climber"},{"exerciseId":"sit-up"},{"exerciseId":"line-hops"},{"exerciseId":"burpee"}]},{"id":"plank-highfive-relay","mode":"format","title":"Planke-high-five challenge","category":"Makker","format":"AMRAP","minutes":4,"organization":"Makker sammen","taskStructure":"Rundebaseret","repetitionModel":"Faste reps","control":"Samlet tid","equipment":["Måtte"],"trainingTypes":["junior","family","adult"],"bodyAreas":["core","skuldre"],"tags":["makker","planke","high five"],"description":"Makkere arbejder sammen i en enkel plankechallenge.","rules":"Lav 10 skiftevis high-fives i planke, rejs jer og løb til en kegle og tilbage. Gentag i 4 minutter.","coachTips":"Brug hænder på boks eller knæ i gulvet ved behov. Hofterne skal holdes så rolige som muligt.","activities":[{"exerciseId":"partner-high-five-plank","juniorReps":"10","adultReps":"10"},{"kind":"run","runType":"Shuttle run","value":20,"unit":"meter","intensity":"Hurtigt","route":"10 m ud og tilbage"}]},{"id":"sprint-ladder","mode":"format","title":"Sprint-ladder","category":"Løb","format":"Intervaller","minutes":6,"organization":"Hold","taskStructure":"Stationer","repetitionModel":"Distance pr. øvelse","control":"Intervaller","equipment":["Kegler"],"trainingTypes":["junior","family","adult","hyrox","hiit"],"bodyAreas":["kondition","ben"],"tags":["sprint","ladder","løb"],"description":"Korte shuttleløb med stigende distance.","rules":"Løb 10, 20, 30 og 40 meter shuttle. Gå tilbage til 10 meter, hvis der er tid. Start deltagere forskudt.","coachTips":"Lav flere baner og tydelige vendepunkter. Brems før stregen og hold afstand.","work":30,"rest":20,"rounds":6,"activities":[{"kind":"run","runType":"Shuttle run","value":10,"unit":"meter","intensity":"Sprint","route":"Stigende shuttle-distance"}]},{"id":"unbroken-challenge","mode":"format","title":"Unbroken challenge","category":"Udfordring","format":"Fælles flow","minutes":5,"organization":"Individuelt","taskStructure":"Enkeltøvelse","repetitionModel":"Kvalitetsgentagelser","control":"Samlet tid","equipment":[],"trainingTypes":["junior","family","adult","trx"],"bodyAreas":["valgfrit"],"tags":["kvalitet","personlig udfordring","skalering"],"description":"Hver deltager vælger én sikker øvelse og forsøger at lave en ubrudt serie med god teknik.","rules":"Vælg en øvelse og et realistisk mål. Stop serien, når teknikken falder. Der må skaleres mellem forsøg.","coachTips":"Finisheren skal føles som en succes. Undgå maxforsøg i risikofyldte eller tunge øvelser.","activities":[]}];
const FUNKFIT_FUNDAMENTALS={
  squat:{
    icon:'🟠',label:'Sætte sig',english:'Squat',exerciseIds:['air-squat','box-squat','goblet-squat'],
    description:'Lær at sætte hoften bagud og ned med hele foden i gulvet, knæ over tæer og en stabil overkrop.',
    rules:'Arbejd langsomt og stop serien, når positionen ikke længere kan holdes.',
    coachTips:'Start med Air squat. Brug boks som tydeligt mål og tilføj først let goblet-belastning, når bevægelsen er sikker.'
  },
  hinge:{
    icon:'🟢',label:'Samle op',english:'Hinge',exerciseIds:['hip-hinge-wall-touch','kb-deadlift','romanian-deadlift'],
    description:'Lær at skubbe hoften bagud og samle noget op med en lang ryg og belastningen tæt på kroppen.',
    rules:'Hoften bevæger sig mere end knæene. Genstanden holdes tæt på kroppen.',
    coachTips:'Begynd uden vægt med Hinge til væg. Gå derefter til en let kettlebell deadlift fra en passende højde.'
  },
  push:{
    icon:'🔵',label:'Skubbe',english:'Push',exerciseIds:['incline-push-up','push-up','db-shoulder-press'],
    description:'Lær at skubbe med en stærk kropslinje, kontrollerede skuldre og albuer i en naturlig vinkel.',
    rules:'Vælg en højde og belastning, hvor hele bevægelsen kan udføres uden at miste kropslinjen.',
    coachTips:'Start med incline push-up. Sænk højden gradvist og brug først gulv-push-up, når kvaliteten er god.'
  },
  pull:{
    icon:'🟣',label:'Trække',english:'Pull',exerciseIds:['band-row','trx-row','db-row'],
    description:'Lær at trække albuerne bagud, holde skuldrene væk fra ørerne og samle skulderbladene kontrolleret.',
    rules:'Kroppen holdes stabil, og trækket afsluttes uden at skuldrene løftes.',
    coachTips:'Elastik row er nem at lære samlet. TRX row giver tydelig skalering via kropsvinklen.'
  },
  carry:{
    icon:'🟡',label:'Bære',english:'Carry',exerciseIds:['farmer-carry','suitcase-carry','front-rack-carry'],
    description:'Lær at bære med rank krop, stabile skuldre, rolig vejrtrækning og kontrollerede skridt.',
    rules:'Gå – løb ikke. Vælg en belastning, der ikke trækker kroppen skæv.',
    coachTips:'Start med farmer carry. Brug derefter suitcase carry til at lære at modstå sidebøjning.'
  },
  'jump-land':{
    icon:'🔴',label:'Hoppe og lande',english:'Jump/Land',exerciseIds:['jump-and-stick','line-hops','box-jump'],
    description:'Lær at skabe kraft i et hop og lande blødt, stabilt og klar til næste bevægelse.',
    rules:'Hver landing skal kunne fryses i to sekunder. Kvalitet kommer før højde og fart.',
    coachTips:'Start med Hop og frys. Brug lave linjehop og først senere en lav boks, hvis landingen er stabil.'
  },
  'run-cod':{
    icon:'⚫',label:'Løbe og vende',english:'Run/Change of direction',exerciseIds:['shuttle-run','cone-touch-reaction','fast-feet'],
    description:'Lær at accelerere, bremse og skifte retning med korte skridt, lavt tyngdepunkt og kontrol.',
    rules:'Brems før vendepunktet. Sæt ydre fod i gulvet og skub kontrolleret tilbage.',
    coachTips:'Brug korte shuttle-afstande. Markér vendepunkter tydeligt og øg først tempoet, når bremsningen fungerer.'
  },
  core:{
    icon:'⭐',label:'Holde kroppen stærk',english:'Core',exerciseIds:['dead-bug','plank','side-plank'],
    description:'Lær at holde bækken, ryg og ribben stabile, mens arme og ben bevæger sig eller kroppen belastes.',
    rules:'Stop eller gør øvelsen lettere, hvis lænden svajer, eller vejrtrækningen holdes.',
    coachTips:'Start med dead bug. Gå videre til korte plankehold og sideplanke med god spænding.'
  }
};

const read=(key,fallback)=>{
  try{
    const raw=localStorage.getItem(key);
    return raw===null?fallback:JSON.parse(raw);
  }catch(error){
    console.warn(`Kunne ikke læse lokal data for ${key}`,error);
    return fallback;
  }
};
const APP_VERSION='0.7.4-alpha.21';
function updateAddressVersion(){
  try{
    const url=new URL(window.location.href);
    if(url.searchParams.get('v')!==APP_VERSION){
      url.searchParams.set('v',APP_VERSION);
      window.history.replaceState(window.history.state,'',url.pathname+url.search+url.hash);
    }
  }catch(error){
    console.warn('Kunne ikke opdatere versionsnummeret i adresselinjen.',error);
  }
}
const WKEY='funkfit-workouts-v074a',CKEY='funkfit-custom-v074a',FKEY='funkfit-favorites-v074a',EKEY='funkfit-library-v074a',HKEY='funkfit-ai-history-v074a',PKEY='funkfit-profile-v074a',EQKEY='funkfit-equipment-profiles-v074a';
const WBACKUPKEY='funkfit-workouts-backup-v1';
let exercises=[],templates=[],sections=[],currentId=null,pickerSection=0,playerItems=[],playerIndex=0;
let plannerConcept='junior',plannerVenue='indoor';
const EQUIPMENT_PROFILES={
  indoor:['Kropsvægt','Måtte','Kettlebell','Håndvægt','Boks','Bænk','Medicinbold','Væg','Kegler','Sjippetov','Elastik','Romaskine'],
  trx:['Kropsvægt','TRX','Måtte'],
  outdoor:['Kropsvægt','Kettlebell','Håndvægt','Kegler','Sjippetov','Sandsæk','Battle rope','Traktordæk','Slæde','Pull-up stativ','Løbebane','Bakke']
};
function equipmentProfiles(){return read(EQKEY,{})}
function defaultEquipmentProfile(venue){return [...(EQUIPMENT_PROFILES[venue]||EQUIPMENT_PROFILES.indoor)]}
function loadEquipmentProfile(venue){
  const saved=equipmentProfiles()[venue];
  return Array.isArray(saved)&&saved.length?saved:defaultEquipmentProfile(venue);
}
function persistEquipmentProfile(venue,items){
  const all=equipmentProfiles();
  all[venue]=[...new Set(items)].sort((a,b)=>a.localeCompare(b,'da'));
  localStorage.setItem(EQKEY,JSON.stringify(all));
}
function resetEquipmentProfile(venue){
  const all=equipmentProfiles();
  delete all[venue];
  localStorage.setItem(EQKEY,JSON.stringify(all));
  plannerEquipment=new Set(defaultEquipmentProfile(venue));
  renderEquipmentChoices();
}
let plannerEquipment=new Set(loadEquipmentProfile('indoor'));

const DEFAULT_PROFILE={
  id:'local-paw',
  name:'Paw',
  preferredMode:'manual',
  fieldSets:{
    junior:['juniorKg','juniorReps','juniorNote'],
    family:['juniorKg','juniorReps','juniorNote','adultExercise','adultKg','adultReps','adultNote'],
    adult:['weight','reps','sets','tempo','pause'],
    hiit:['work','rest','rounds','intensity'],
    hyrox:['distance','ergMeters','weight','reps','runDistance'],
    trx:['bodyAngle','repsOrTime','tempo','laterality']
  }
};
const userProfile=()=>read(PKEY,DEFAULT_PROFILE);
const saveUserProfile=p=>localStorage.setItem(PKEY,JSON.stringify(p));
const aiHistory=()=>read(HKEY,[]);
const saveAiHistory=x=>localStorage.setItem(HKEY,JSON.stringify(x.slice(-20)));
const PROGRAMMING_PROFILES={
  junior:{label:'FunkFit Junior',supportsTheme:true,defaultStructure:['Ledopvarmning','Opvarmning','Leg','Hoveddel','Hoveddel','Teamchallenge','Finisher']},
  family:{label:'Familie',supportsTheme:true,defaultStructure:['Ledopvarmning','Opvarmning','Leg','Hoveddel','Hoveddel','Teamchallenge','Finisher']},
  adult:{label:'Funktionel voksen',supportsTheme:false,defaultStructure:['Ledopvarmning','Opvarmning','Styrke','Kondition','Finisher']},
  trx:{label:'TRX',supportsTheme:false,defaultStructure:['Ledopvarmning','Opvarmning','Teknik','TRX blok','TRX blok','Finisher']},
  hyrox:{label:'Hyrox',supportsTheme:false,defaultStructure:['Ledopvarmning','Opvarmning','Teknik','Hyrox blok','Hyrox blok','Finisher']},
  hiit:{label:'HIIT',supportsTheme:false,defaultStructure:['Ledopvarmning','Opvarmning','HIIT blok','HIIT blok','Finisher']}
};
let creationMode='choice',structureChoice='auto',singleSectionTarget=null,activeRunPlan=null,clearUndoInterval=null,addSectionType='Hovedelement',sectionEditIndex=null,sectionEditMode='structure',sectionEditDraft=null;



function validWorkoutList(value){
  return Array.isArray(value)?value.filter(item=>item&&typeof item==='object'&&item.id):[];
}
function saveWorkouts(value){
  const safe=validWorkoutList(value);
  const payload=JSON.stringify(safe);
  localStorage.setItem(WKEY,payload);
  localStorage.setItem(WBACKUPKEY,payload);
}
function workouts(){
  const current=validWorkoutList(read(WKEY,[]));
  const backup=validWorkoutList(read(WBACKUPKEY,[]));
  if(current.length){
    if(JSON.stringify(current)!==JSON.stringify(backup)){
      localStorage.setItem(WBACKUPKEY,JSON.stringify(current));
    }
    return current;
  }
  if(backup.length){
    localStorage.setItem(WKEY,JSON.stringify(backup));
    return backup;
  }
  return [];
}
const customs=()=>read(CKEY,[]);
const favorites=()=>new Set(read(FKEY,[]));
const elementLibrary=()=>read(EKEY,[]);
const saveElementLibrary=x=>localStorage.setItem(EKEY,JSON.stringify(x));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

const collapsedSections=new Set();



function inferElementType(s){
  const text=`${s?.name||''} ${s?.format||''} ${s?.style||''} ${s?.sectionPurpose||''}`.toLowerCase();
  if(text.includes('ledopvarm')||text.includes('mobilitet led'))return 'Ledopvarmning';
  if(text.includes('opvarm'))return 'Opvarmning';
  if(text.includes('finisher')||text.includes('afslutningssang'))return 'Finisher';
  if(text.includes('leg')||text.includes('stafet'))return 'Leg';
  if(text.includes('emom'))return 'EMOM';
  if(text.includes('you go')||text.includes('ygig'))return 'YGIG';
  if(text.includes('chipper'))return 'Chipper';
  if(text.includes('station'))return 'Stationer';
  if(text.includes('teknik'))return 'Teknik';
  if(text.includes('amrap'))return 'AMRAP';
  return 'Styrke';
}
function inferSectionPurpose(s){
  if(SECTION_PURPOSES.includes(s?.sectionPurpose))return s.sectionPurpose;
  const type=s?.type||inferElementType(s);
  if(['Ledopvarmning','Opvarmning','Teknik','Leg','Finisher'].includes(type))return type;
  const text=`${s?.name||''} ${s?.organization||''}`.toLowerCase();
  if(text.includes('teamchallenge')||text.includes('team challenge')||text.includes('holdchallenge'))return 'Teamchallenge';
  return 'Hovedelement';
}
function normalizeLegacyFormat(format=''){
  const value=String(format||'');
  const lower=value.toLowerCase();
  if(['Sang','Musik'].includes(value))return 'Sang';
  if(lower.includes('amrap'))return 'AMRAP';
  if(lower.includes('emom')||lower.includes('e2mom'))return 'EMOM';
  if(lower.includes('chipper')||lower.includes('for time')||lower.includes('hyrox station'))return 'For time';
  if(lower.includes('interval')||lower.includes('tabata')||lower.includes('station')||lower.includes('cirkel'))return 'Intervaller';
  if(lower.includes('team workout')||lower.includes('stafet'))return 'Fast antal runder';
  if(lower.includes('teknik'))return 'Kvalitetsarbejde';
  if(lower.includes('styrke')||lower.includes('sæt'))return 'Sætbaseret';
  if(lower.includes('fælles flow'))return 'Fælles flow';
  return FORMATS.includes(value)?value:'AMRAP';
}
function inferTaskStructure(s){
  if(TASK_STRUCTURES.includes(s?.taskStructure))return s.taskStructure;
  const text=`${s?.type||''} ${s?.name||''} ${s?.format||''}`.toLowerCase();
  if(text.includes('chipper'))return 'Chipper';
  if(text.includes('station')||text.includes('cirkel'))return 'Stationer';
  if(text.includes('emom')||text.includes('e2mom'))return 'Opgave pr. tidsblok';
  if(text.includes('leg')||text.includes('mission')||s?.sectionPurpose==='Leg')return 'Leg/mission';
  if(text.includes('teknik'))return 'Øvelsesblok';
  if(text.includes('styrke'))return 'Øvelsesblok';
  if(text.includes('amrap')||text.includes('runde')||s?.organization==='You go, I go')return 'Rundebaseret';
  return 'Frit flow';
}
function inferRepetitionModel(s){
  if(REPETITION_MODELS.includes(s?.repetitionModel))return s.repetitionModel;
  const text=`${s?.name||''} ${s?.description||''} ${s?.rules||''}`.toLowerCase();
  if(text.includes('faldende ladder')||text.includes('descending ladder'))return 'Faldende ladder';
  if(text.includes('ladder')||text.includes('stige'))return 'Stigende ladder';
  if(text.includes('pyramide'))return 'Pyramide';
  if(s?.sectionPurpose==='Teknik'||s?.type==='Teknik')return 'Kvalitetsgentagelser';
  if(['Fælles flow','Sang'].includes(s?.format))return 'Ikke relevant';
  return 'Faste reps';
}
function inferOrganization(s){
  const text=`${s?.organization||''} ${s?.format||''} ${s?.name||''}`.toLowerCase();
  if(text.includes('you go')||text.includes('ygig'))return 'You go, I go';
  if(text.includes('stafet'))return 'Stafet';
  if(text.includes('station'))return 'Fast rotation';
  if(text.includes('makker'))return 'Makker sammen';
  if(text.includes('team')||text.includes('hold'))return 'Hold';
  if(text.includes('fælles'))return 'Fælles';
  return 'Individuelt';
}
function inferControl(s){
  const format=normalizeLegacyFormat(s?.format);
  if((s?.type==='Finisher'&&s?.finisherMode!=='format')||format==='Sang')return 'Sang';
  if(s?.organization==='You go, I go'||s?.type==='YGIG')return 'Samlet tid';
  if(format==='EMOM')return 'Tidsblokke';
  if(format==='Intervaller')return 'Intervaller';
  if(format==='Fast antal runder')return 'Runder';
  if(format==='For time')return 'Time cap';
  if(format==='Sætbaseret')return 'Sæt og pause';
  if(format==='Kvalitetsarbejde')return 'Kvalitet';
  return 'Samlet tid';
}
function normalizeActivity(it){
  if(it?.kind==='run'){
    return {kind:'run',runType:it.runType||'Almindeligt løb',value:Number(it.value||200),unit:it.unit||'meter',intensity:it.intensity||'Moderat',route:it.route||'',note:it.note||''};
  }
  return {...it,kind:'exercise'};
}
function validFormatsForPurpose(purpose){
  if(purpose==='Finisher')return ['Sang','Fælles flow','AMRAP','EMOM','Intervaller','Fast antal runder','For time','Kvalitetsarbejde'];
  if(purpose==='Ledopvarmning'||purpose==='Opvarmning')return ['Fælles flow','Intervaller'];
  if(purpose==='Teknik')return ['Kvalitetsarbejde','Sætbaseret','Intervaller'];
  if(purpose==='Leg')return ['Fælles flow','Intervaller','Fast antal runder'];
  if(purpose==='Teamchallenge')return ['AMRAP','Intervaller','Fast antal runder','For time'];
  return ['AMRAP','EMOM','Intervaller','Fast antal runder','For time','Sætbaseret','Kvalitetsarbejde'];
}
function validTaskStructuresForFormat(format,purpose){
  if(purpose==='Leg')return ['Leg/mission','Stationer','Rundebaseret'];
  if(format==='EMOM')return ['Opgave pr. tidsblok'];
  if(format==='Intervaller')return ['Stationer','Øvelsesblok','Rundebaseret'];
  if(format==='For time')return ['Chipper','Rundebaseret','Stationer'];
  if(format==='Sætbaseret')return ['Enkeltøvelse','Øvelsesblok'];
  if(format==='Kvalitetsarbejde')return ['Øvelsesblok','Enkeltøvelse'];
  if(format==='Fælles flow')return ['Frit flow','Leg/mission'];
  return ['Rundebaseret','Øvelsesblok','Stationer'];
}
function validRepetitionModelsForFormat(format){
  if(['Fælles flow','Sang'].includes(format))return ['Ikke relevant'];
  if(format==='Kvalitetsarbejde')return ['Kvalitetsgentagelser','Faste reps','Tid pr. øvelse'];
  if(format==='Intervaller'||format==='EMOM')return ['Faste reps','Tid pr. øvelse','Distance pr. øvelse'];
  if(format==='Sætbaseret')return ['Faste reps','Kvalitetsgentagelser'];
  return ['Faste reps','Stigende ladder','Faldende ladder','Pyramide','Tid pr. øvelse','Distance pr. øvelse'];
}
function validOrganizationsForTask(task,purpose){
  if(task==='Stationer')return ['Fast rotation','Fri rotation','Makker sammen','Hold'];
  if(task==='Leg/mission')return ['Hold','Stafet','Makker sammen','Fælles'];
  return ['Individuelt','Samtidigt','Makker sammen','You go, I go','Hold','Stafet','Fælles'];
}
function validControlsForFormat(format){
  const map={
    'Fælles flow':['Samlet tid'],'Kvalitetsarbejde':['Kvalitet','Samlet tid'],'AMRAP':['Samlet tid'],
    'EMOM':['Tidsblokke'],'Intervaller':['Intervaller'],'Fast antal runder':['Runder'],
    'For time':['Time cap'],'Sætbaseret':['Sæt og pause'],'Sang':['Sang']
  };
  return map[format]||['Samlet tid'];
}
function applySectionRules(s){
  s.type=s.type||inferElementType(s);
  s.sectionPurpose=inferSectionPurpose(s);
  s.format=normalizeLegacyFormat(s.format);
  s.taskStructure=inferTaskStructure(s);
  s.repetitionModel=inferRepetitionModel(s);
  s.organization=s.organization||inferOrganization(s);
  s.control=s.control==='Til opgaven er løst'?'Time cap':(s.control||inferControl(s));

  const allowedFormats=validFormatsForPurpose(s.sectionPurpose);
  if(!allowedFormats.includes(s.format))s.format=allowedFormats[0];
  const allowedTasks=validTaskStructuresForFormat(s.format,s.sectionPurpose);
  if(!allowedTasks.includes(s.taskStructure))s.taskStructure=allowedTasks[0];
  const allowedReps=validRepetitionModelsForFormat(s.format);
  if(!allowedReps.includes(s.repetitionModel))s.repetitionModel=allowedReps[0];
  const allowedOrgs=validOrganizationsForTask(s.taskStructure,s.sectionPurpose);
  if(!allowedOrgs.includes(s.organization))s.organization=allowedOrgs[0];
  const allowedControls=validControlsForFormat(s.format);
  if(!allowedControls.includes(s.control))s.control=allowedControls[0];

  if(s.organization==='You go, I go'){
    s.format='AMRAP';s.taskStructure='Rundebaseret';s.control='Samlet tid';
    s.work=0;s.rest=0;s.rounds=1;s.taskPerTurn=s.taskPerTurn||'Byt, når den aftalte opgave er løst';
  }
  if(s.taskStructure==='Chipper'){
    s.format='For time';s.control='Time cap';s.repetitionModel='Faste reps';s.rounds=1;
  }
  if(s.taskStructure==='Stationer'){
    s.format='Intervaller';s.control='Intervaller';
    if(!['Fast rotation','Fri rotation','Makker sammen','Hold'].includes(s.organization))s.organization='Fast rotation';
  }
  if(['Stigende ladder','Faldende ladder','Pyramide'].includes(s.repetitionModel)){
    if(!['AMRAP','Fast antal runder','For time'].includes(s.format))s.format='AMRAP';
    if(s.taskStructure==='Frit flow')s.taskStructure='Rundebaseret';
    s.ladderStart=Number(s.ladderStart||1);s.ladderStep=Number(s.ladderStep||1);s.ladderEnd=Number(s.ladderEnd||10);
  }
  if(s.format==='AMRAP'){s.control='Samlet tid';s.rounds=1;}
  if(s.format==='EMOM'){s.control='Tidsblokke';s.taskStructure='Opgave pr. tidsblok';s.rounds=1;}
  if(s.format==='Intervaller')s.control='Intervaller';
  if(s.format==='Fast antal runder')s.control='Runder';
  if(s.format==='For time'){s.control='Time cap';s.rounds=1;}
  if(s.format==='Sætbaseret')s.control='Sæt og pause';
  if(s.format==='Kvalitetsarbejde')s.control='Kvalitet';
  if(s.type==='Leg'||s.sectionPurpose==='Leg'){
    s.sectionPurpose='Leg';s.style='Leg';if(s.organization==='Individuelt')s.organization='Hold';
  }
  if(s.type==='Finisher'||s.sectionPurpose==='Finisher'){
    s.type='Finisher';s.sectionPurpose='Finisher';
    s.finisherMode=s.finisherMode==='format'?'format':'song';
    if(s.finisherMode==='song'){
      s.format='Sang';s.taskStructure='Frit flow';s.repetitionModel='Ikke relevant';s.organization=s.organization||'Fælles';s.control='Sang';
      s.work=0;s.rest=0;s.rounds=1;s.exercises=[];
      s.songMinutes=Number(s.songMinutes||s.minutes||4);s.minutes=s.songMinutes;
    }else{
      if(s.format==='Sang')s.format='AMRAP';
      const tasks=validTaskStructuresForFormat(s.format,s.sectionPurpose);if(!tasks.includes(s.taskStructure))s.taskStructure=tasks[0];
      const reps=validRepetitionModelsForFormat(s.format);if(!reps.includes(s.repetitionModel))s.repetitionModel=reps[0];
      const orgs=validOrganizationsForTask(s.taskStructure,s.sectionPurpose);if(!orgs.includes(s.organization))s.organization=orgs[0];
      const controls=validControlsForFormat(s.format);if(!controls.includes(s.control))s.control=controls[0];
      s.minutes=Number(s.minutes||4);s.exercises=s.exercises||[];
    }
  }
  return s;
}
function normalizeSection(s){
  s.type=s.type||inferElementType(s);
  s.description=s.description||'';s.rules=s.rules||'';s.coachTips=s.coachTips||'';
  s.songTitle=s.songTitle||'';s.songArtist=s.songArtist||'';s.songUrl=s.songUrl||'';
  s.finisherMode=s.finisherMode||((s.format==='Sang'||s.songTitle||s.songUrl)?'song':'format');
  s.finisherTemplateId=s.finisherTemplateId||'';s.finisherCategory=s.finisherCategory||'';
  s.songMinutes=Number(s.songMinutes||s.minutes||4);s.minutes=Number(s.minutes||0);s.rounds=Number(s.rounds||1);
  s.work=Number(s.work||0);s.rest=Number(s.rest||0);s.timeCap=Number(s.timeCap||s.minutes||0);
  s.ladderStart=Number(s.ladderStart||1);s.ladderStep=Number(s.ladderStep||1);s.ladderEnd=Number(s.ladderEnd||10);
  const rawFundamentals=Array.isArray(s.fundamentalKeys)?s.fundamentalKeys:(s.fundamentalKey?[s.fundamentalKey]:[]);
  s.fundamentalKeys=[...new Set(rawFundamentals.filter(key=>FUNKFIT_FUNDAMENTALS[key]))];s.fundamentalKey=s.fundamentalKeys[0]||'';
  s.exercises=(s.exercises||[]).map(normalizeActivity);
  if(s.type==='Ledopvarmning'||s.sectionPurpose==='Ledopvarmning'){
    const legacyRule=!s.rules||s.rules==='Arbejd roligt fra ankler og knæ til hofter, ryg, skuldre og håndled.';
    const legacyDescription=!s.description||s.description==='Kort fælles mobilisering af de store led før pulsopvarmningen.';
    const legacyTip=!s.coachTips||s.coachTips==='Ca. 5 minutter. Ingen høj puls endnu.';
    if(legacyDescription)s.description='Rolig, systematisk mobilisering af hele kroppen før pulsopvarmningen.';
    if(legacyRule)s.rules='Arbejd roligt gennem hele kroppen enten nedefra og op eller oppefra og ned. Husk nakke (op/ned), skuldre og arme, rotation i øvre ryg, hofter, knæ, ankler/fodled og håndled.';
    if(legacyTip)s.coachTips='Ca. 5 minutter. Ingen høj puls. Bevæg roligt og kontrolleret gennem alle centrale led.';
  }
  return applySectionRules(s);
}
function normalizeSections(){sections.forEach(normalizeSection)}
function enforceJointWarmupFirst(){
  const joints=sections.filter(s=>normalizeSection(s).type==='Ledopvarmning');
  const others=sections.filter(s=>normalizeSection(s).type!=='Ledopvarmning');
  if(joints.length)sections=[joints[0],...others];
}
function enforceWorkoutStructure(){enforceJointWarmupFirst();enforceFinisherLast()}
function enforceFinisherLast(){
  const finishers=sections.filter(s=>normalizeSection(s).sectionPurpose==='Finisher');
  const others=sections.filter(s=>normalizeSection(s).sectionPurpose!=='Finisher');
  sections=[...others,...finishers];
}

function defaultSection(type='Hovedelement'){
  const map={
    'Ledopvarmning':{legacyType:'Ledopvarmning',sectionPurpose:'Ledopvarmning',name:'Ledopvarmning',minutes:5,format:'Fælles flow',taskStructure:'Frit flow',repetitionModel:'Ikke relevant',organization:'Fælles',control:'Samlet tid',style:'Mobilitet',work:0,rest:0,rounds:1,description:'Rolig, systematisk mobilisering af hele kroppen før pulsopvarmningen.',rules:'Arbejd roligt gennem hele kroppen enten nedefra og op eller oppefra og ned. Husk nakke (op/ned), skuldre og arme, rotation i øvre ryg, hofter, knæ, ankler/fodled og håndled.',coachTips:'Ca. 5 minutter. Ingen høj puls. Bevæg roligt og kontrolleret gennem alle centrale led.'},
    'Opvarmning':{legacyType:'Opvarmning',sectionPurpose:'Opvarmning',name:'Pulsopvarmning',minutes:8,format:'Fælles flow',taskStructure:'Frit flow',repetitionModel:'Ikke relevant',organization:'Fælles',control:'Samlet tid',style:'Funktionel',work:0,rest:0,rounds:1},
    'Teknik':{legacyType:'Teknik',sectionPurpose:'Teknik',name:'Teknik',minutes:10,format:'Kvalitetsarbejde',taskStructure:'Øvelsesblok',repetitionModel:'Kvalitetsgentagelser',organization:'Fælles',control:'Kvalitet',style:'Teknik',work:0,rest:0,rounds:1},
    'Hovedelement':{legacyType:'AMRAP',sectionPurpose:'Hovedelement',name:'Hovedelement',minutes:12,format:'AMRAP',taskStructure:'Rundebaseret',repetitionModel:'Faste reps',organization:'Individuelt',control:'Samlet tid',style:'Funktionel',work:0,rest:0,rounds:1},
    'Leg':{legacyType:'Leg',sectionPurpose:'Leg',name:'Ny leg',minutes:8,format:'Fælles flow',taskStructure:'Leg/mission',repetitionModel:'Ikke relevant',organization:'Hold',control:'Samlet tid',style:'Leg',work:0,rest:0,rounds:1,description:'Beskriv legens idé og formål.',rules:'Skriv de vigtigste regler.',coachTips:'Skriv opstilling, variationer og sikkerhed.'},
    'Teamchallenge':{legacyType:'Styrke',sectionPurpose:'Teamchallenge',name:'Teamchallenge',minutes:10,format:'Fast antal runder',taskStructure:'Rundebaseret',repetitionModel:'Faste reps',organization:'Hold',control:'Runder',style:'Funktionel',work:0,rest:0,rounds:3},
    'Finisher':{legacyType:'Finisher',sectionPurpose:'Finisher',finisherMode:'song',finisherTemplateId:'song-free-choice',finisherCategory:'Sang',name:'Finisher',minutes:4,songMinutes:4,songTitle:'',songArtist:'',songUrl:'',format:'Sang',taskStructure:'Frit flow',repetitionModel:'Ikke relevant',organization:'Fælles',control:'Sang',style:'Kondition',work:0,rest:0,rounds:1,description:'Afslut træningen samlet til en valgfri sang.',rules:'Finisheren starter med sangen og slutter, når sangen slutter.',coachTips:'Vælg en sang, der passer til holdet og den ønskede afslutning.'},
    'AMRAP':{legacyType:'AMRAP',sectionPurpose:'Hovedelement',name:'AMRAP',minutes:12,format:'AMRAP',taskStructure:'Rundebaseret',repetitionModel:'Faste reps',organization:'Individuelt',control:'Samlet tid',style:'Funktionel',work:0,rest:0,rounds:1},
    'EMOM':{legacyType:'EMOM',sectionPurpose:'Hovedelement',name:'EMOM',minutes:12,format:'EMOM',taskStructure:'Opgave pr. tidsblok',repetitionModel:'Faste reps',organization:'Individuelt',control:'Tidsblokke',style:'Funktionel',work:0,rest:0,rounds:1},
    'YGIG':{legacyType:'YGIG',sectionPurpose:'Hovedelement',name:'You go, I go',minutes:12,format:'AMRAP',taskStructure:'Rundebaseret',repetitionModel:'Faste reps',organization:'You go, I go',control:'Samlet tid',style:'Funktionel',work:0,rest:0,rounds:1,taskPerTurn:'Byt, når den aftalte opgave er løst',description:'Makker A arbejder, mens makker B restituerer eller hepper. Byt efter den aftalte opgave – ikke efter et 40/20-interval.'},
    'Chipper':{legacyType:'Chipper',sectionPurpose:'Hovedelement',name:'Chipper',minutes:15,timeCap:15,format:'For time',taskStructure:'Chipper',repetitionModel:'Faste reps',organization:'Individuelt',control:'Time cap',style:'Funktionel',work:0,rest:0,rounds:1},
    'Stationer':{legacyType:'Stationer',sectionPurpose:'Hovedelement',name:'Stationstræning',minutes:18,format:'Intervaller',taskStructure:'Stationer',repetitionModel:'Tid pr. øvelse',organization:'Fast rotation',control:'Intervaller',style:'Funktionel',work:40,rest:20,rounds:3},
    'Styrke':{legacyType:'Styrke',sectionPurpose:'Hovedelement',name:'Styrkeblok',minutes:15,format:'Sætbaseret',taskStructure:'Øvelsesblok',repetitionModel:'Faste reps',organization:'Individuelt',control:'Sæt og pause',style:'Funktionel',work:0,rest:0,rounds:3}
  };
  const preset=map[type]||map.Hovedelement;
  return normalizeSection({...preset,type:preset.legacyType||type,exercises:[]});
}


function finisherTemplates(mode='all'){
  return FINISHER_CATALOG.filter(item=>mode==='all'||item.mode===mode);
}
function finisherTemplateById(id){return FINISHER_CATALOG.find(item=>item.id===id)||null}
function finisherModeLabel(mode){return mode==='format'?'Andet format':'Sang'}
function finisherCatalogOptions(mode,selected=''){
  return finisherTemplates(mode).map(item=>`<option value="${item.id}" ${item.id===selected?'selected':''}>${esc(item.title)} · ${esc(item.category)}</option>`).join('');
}
function workoutAreaCounts(){
  const counts={};
  sections.forEach(section=>(section.exercises||[]).forEach(item=>{
    if(item.kind==='run'){counts.kondition=(counts.kondition||0)+1;return}
    const ex=exercises.find(x=>x.id===item.exerciseId);const areas=(ex?.bodyAreas||ex?.focus||[]).slice(0,2);
    areas.forEach(area=>{const key=normalizeText(area);counts[key]=(counts[key]||0)+1});
  }));
  return counts;
}
function finisherTemplateScore(template,mode='all',options={}){
  if(mode!=='all'&&template.mode!==mode)return -9999;
  let score=0;const type=selectedTrainingType();
  if((template.trainingTypes||[]).includes(type))score+=12;else score-=8;
  const available=new Set([...plannerEquipment,'Kropsvægt']);
  const missing=(template.equipment||[]).filter(item=>!available.has(item));
  score-=missing.length*18;
  const participants=Math.max(1,+$('#plannerParticipants')?.value||+$('#participantCount')?.value||20);
  if(participants>=16&&['Hold','Stafet','Fælles','Samtidigt'].includes(template.organization))score+=5;
  if($('#avoidWaiting')?.checked&&participants>=12&&(template.equipment||[]).length===0)score+=4;
  const request=normalizeText([$('#plannerBrief')?.value||'',...goalValues()].join(' '));
  (template.tags||[]).forEach(tag=>{if(request.includes(normalizeText(tag)))score+=5});
  if(!options.ignoreWorkout){
    const counts=workoutAreaCounts();
    (template.bodyAreas||[]).forEach(area=>{const used=counts[normalizeText(area)]||0;score+=Math.max(-4,3-used)});
  }
  const recent=aiHistory().filter(item=>item&&item.kind==='finisher').slice(-4).map(item=>item.templateId);
  if(recent.includes(template.id))score-=7;
  return score;
}
function suggestedFinisherTemplate(mode='all',options={}){
  const ranked=finisherTemplates(mode).map(item=>({item,score:finisherTemplateScore(item,mode,options)})).sort((a,b)=>b.score-a.score);
  const viable=ranked.filter(row=>row.score>-30).slice(0,Math.min(4,ranked.length));
  const picked=(viable[Math.floor(Math.random()*Math.max(1,viable.length))]||ranked[0])?.item||FINISHER_CATALOG[0];
  const history=aiHistory();history.push({kind:'finisher',templateId:picked.id,date:new Date().toISOString()});saveAiHistory(history);
  return picked;
}
function finisherActivityFromSpec(spec){
  if(spec.kind==='run')return normalizeActivity(structuredClone(spec));
  const ex=exercises.find(item=>item.id===spec.exerciseId);
  const item=ex?makeItem(ex):normalizeActivity({kind:'exercise',exerciseId:spec.exerciseId});
  Object.entries(spec).forEach(([key,value])=>{if(key!=='exerciseId')item[key]=structuredClone(value)});
  item.metrics={...(item.metrics||{}),...(spec.metrics||{})};
  return normalizeActivity(item);
}
function buildFinisherFromTemplate(templateId,overrides={}){
  const template=finisherTemplateById(templateId)||FINISHER_CATALOG[0];
  const section={
    ...defaultSection('Finisher'),
    type:'Finisher',sectionPurpose:'Finisher',finisherMode:template.mode,finisherTemplateId:template.id,finisherCategory:template.category,
    name:template.title,minutes:Number(template.minutes||4),songMinutes:Number(template.minutes||4),format:template.format,
    taskStructure:template.taskStructure,repetitionModel:template.repetitionModel,organization:template.organization,control:template.control,
    work:Number(template.work||0),rest:Number(template.rest||0),rounds:Number(template.rounds||1),timeCap:Number(template.timeCap||template.minutes||0),
    ladderStart:Number(template.ladderStart||1),ladderStep:Number(template.ladderStep||1),ladderEnd:Number(template.ladderEnd||10),
    description:template.description||'',rules:template.rules||'',coachTips:template.coachTips||'',
    equipment:structuredClone(template.equipment||[]),
    exercises:(template.activities||[]).map(finisherActivityFromSpec),
    songTitle:overrides.songTitle||'',songArtist:overrides.songArtist||'',songUrl:overrides.songUrl||''
  };
  if(template.mode==='song'){
    section.songMinutes=Number(overrides.songMinutes||template.minutes||4);section.minutes=section.songMinutes;
  }
  return normalizeSection(section);
}
function applyFinisherTemplate(index,templateId){
  const current=normalizeSection(sections[index]);
  const next=buildFinisherFromTemplate(templateId,{
    songTitle:current.songTitle,songArtist:current.songArtist,songUrl:current.songUrl,songMinutes:current.songMinutes
  });
  sections[index]=next;collapsedSections.delete(index);renderFramework();renderExerciseSections();updateReview();
}
function changeFinisherMode(index,mode){
  const current=normalizeSection(sections[index]);
  if(mode==='song'&&current.finisherMode==='format'&&(current.exercises||[]).length){
    if(!confirm('Skift til sang? Aktiviteterne fra det nuværende finisher-format bliver erstattet.')){renderExerciseSections();return}
  }
  const template=mode==='format'?suggestedFinisherTemplate('format'):finisherTemplateById('song-free-choice');
  const next=buildFinisherFromTemplate(template.id,{
    songTitle:current.songTitle,songArtist:current.songArtist,songUrl:current.songUrl,songMinutes:current.songMinutes
  });
  sections[index]=next;collapsedSections.delete(index);renderFramework();renderExerciseSections();updateReview();
}
function finisherValidationMessage(section){
  const s=normalizeSection(section);
  if(s.finisherMode==='song'&&!String(s.songTitle||'').trim())return 'Vælg sangtitel til finisheren.';
  if(s.finisherMode==='format'&&!String(s.description||'').trim()&&!(s.exercises||[]).length)return 'Vælg et finisher-format eller beskriv opgaven.';
  return '';
}
function finisherTemplatePreview(template){
  if(!template)return '';
  return `<div><strong>${esc(template.title)}</strong><span>${esc(template.category)} · ${template.minutes} min</span></div><p>${esc(template.description)}</p>`;
}
function refreshFinisherForm(prefix,current=null){
  const modeEl=byId(`${prefix}FinisherMode`),catalogEl=byId(`${prefix}FinisherCatalog`);if(!modeEl||!catalogEl)return;
  const mode=current?.finisherMode||modeEl.value||'song';modeEl.value=mode;
  const preferred=current?.finisherTemplateId||catalogEl.value||finisherTemplates(mode)[0]?.id||'';
  catalogEl.innerHTML=finisherCatalogOptions(mode,preferred);
  if(!catalogEl.value&&finisherTemplates(mode)[0])catalogEl.value=finisherTemplates(mode)[0].id;
  byId(`${prefix}FinisherSongFields`)?.classList.toggle('hidden',mode!=='song');
  const preview=byId(`${prefix}FinisherPreview`);if(preview)preview.innerHTML=finisherTemplatePreview(finisherTemplateById(catalogEl.value));
  if(current){
    byId(`${prefix}FinisherTitle`).value=current.songTitle||'';byId(`${prefix}FinisherArtist`).value=current.songArtist||'';
    byId(`${prefix}FinisherMinutes`).value=current.songMinutes||current.minutes||4;byId(`${prefix}FinisherUrl`).value=current.songUrl||'';
  }
}
function suggestFinisherIntoForm(prefix){
  const mode=byId(`${prefix}FinisherMode`)?.value||'all';const template=suggestedFinisherTemplate(mode);
  byId(`${prefix}FinisherMode`).value=template.mode;refreshFinisherForm(prefix);
  byId(`${prefix}FinisherCatalog`).value=template.id;
  const preview=byId(`${prefix}FinisherPreview`);if(preview)preview.innerHTML=finisherTemplatePreview(template);
}
function finisherFromForm(prefix){
  const mode=byId(`${prefix}FinisherMode`)?.value||'song';
  const templateId=byId(`${prefix}FinisherCatalog`)?.value||(mode==='format'?suggestedFinisherTemplate('format').id:'song-free-choice');
  return buildFinisherFromTemplate(templateId,{
    songTitle:byId(`${prefix}FinisherTitle`)?.value.trim()||'',songArtist:byId(`${prefix}FinisherArtist`)?.value.trim()||'',
    songMinutes:+byId(`${prefix}FinisherMinutes`)?.value||4,songUrl:byId(`${prefix}FinisherUrl`)?.value.trim()||''
  });
}
function renderFinisherEditor(s,si,fam){
  const mode=s.finisherMode||'song';const template=finisherTemplateById(s.finisherTemplateId);
  const song=mode==='song';
  return `<div class="finisher-editor">
    <div class="finisher-choice-bar">
      <label>Finisher-type<select data-finisher-mode="${si}"><option value="song" ${song?'selected':''}>🎵 Sang</option><option value="format" ${!song?'selected':''}>🏁 Andet format</option></select></label>
      <label>Katalog – 25 forslag<select data-finisher-template="${si}">${finisherCatalogOptions(mode,s.finisherTemplateId)}</select></label>
      <button type="button" class="secondary" data-suggest-finisher="${si}">✨ Foreslå finisher</button>
    </div>
    ${template?`<div class="finisher-template-preview">${finisherTemplatePreview(template)}</div>`:''}
    ${song?`<div class="finisher-song-summary finisher-inline-editor">
      <h4>🎵 Sangbaseret finisher</h4>
      <div class="finisher-inline-grid">
        <label>Sangtitel *<input data-finisher-field="songTitle" data-finisher-index="${si}" value="${esc(s.songTitle||'')}" placeholder="Fx Uptown Funk"></label>
        <label>Kunstner<input data-finisher-field="songArtist" data-finisher-index="${si}" value="${esc(s.songArtist||'')}" placeholder="Fx Mark Ronson feat. Bruno Mars"></label>
        <label>Længde (min)<input data-finisher-field="songMinutes" data-finisher-index="${si}" type="number" min="1" max="12" step=".1" value="${s.songMinutes||4}"></label>
        <label class="span-2">Link til sang<div class="song-link-field"><input data-finisher-field="songUrl" data-finisher-index="${si}" type="url" value="${esc(s.songUrl||'')}" placeholder="https://..."><button type="button" class="secondary" data-open-finisher-url="${si}">Åbn link</button></div></label>
      </div>
    </div>`:`<div class="finisher-format-summary">
      <div class="finisher-format-badges"><span>${esc(s.format)}</span><span>${esc(sectionTimingText(s))}</span><span>${esc(s.organization)}</span></div>
      ${s.description?`<section class="section-guidance-card finisher-task-card"><div class="guidance-icon">🏁</div><div><h4>Finisher-opgave</h4><p>${esc(s.description)}</p></div></section>`:''}
      <div class="exercise-list exercise-list-primary">${s.exercises?.length?s.exercises.map((it,ai)=>activityRow(it,si,ai,fam)).join(''):'<div class="empty">Formatet har ingen faste øvelser. Opgaven står ovenfor.</div>'}</div>
      ${s.rules?`<section class="section-guidance-card rules-card"><div class="guidance-icon">📋</div><div><h4>Regler</h4><p>${esc(s.rules)}</p></div></section>`:''}
      ${s.coachTips?`<section class="section-guidance-card coach-card"><div class="guidance-icon">💡</div><div><h4>Trænertips</h4><p>${esc(s.coachTips)}</p></div></section>`:''}
      <div class="section-add-row"><button data-add-ex="${si}">+ Tilføj øvelse</button><button class="secondary" data-add-run="${si}">🏃 Tilføj løb</button></div>
    </div>`}
  </div>`;
}

function saveSectionToLibrary(index){
  const s=structuredClone(normalizeSection(sections[index]));
  s.libraryId=crypto.randomUUID();s.savedAt=new Date().toISOString();
  const all=elementLibrary();all.unshift(s);saveElementLibrary(all);renderElementLibrary();
  alert(`“${s.name}” er gemt i Mit bibliotek.`);
}
function useLibraryElement(id){
  const item=elementLibrary().find(x=>x.libraryId===id);if(!item)return;
  const copy=structuredClone(item);delete copy.libraryId;delete copy.savedAt;
  normalizeSection(copy);
  if(copy.type==='Finisher')sections.push(copy);else{
    const fi=sections.findIndex(s=>normalizeSection(s).sectionPurpose==='Finisher');
    fi<0?sections.push(copy):sections.splice(fi,0,copy);
  }
  enforceWorkoutStructure();renderFramework();renderExerciseSections();updateReview();showView('designView');showStep(2);
}
function deleteLibraryElement(id){saveElementLibrary(elementLibrary().filter(x=>x.libraryId!==id));renderElementLibrary()}
function renderElementLibrary(){
  const host=$('#elementLibrary');if(!host)return;const all=elementLibrary();
  host.innerHTML=all.length?all.map(x=>`<article class="saved-card"><p class="eyebrow">${esc(normalizeSection(x).sectionPurpose)}</p><h3>${esc(x.name)}</h3><p>${x.type==='Finisher'?`${finisherModeLabel(x.finisherMode)} · ${x.minutes||0} min`:`${x.minutes||0} min · ${(x.exercises||[]).length} aktiviteter`}</p><p>${esc(x.description||'Ingen beskrivelse')}</p><div class="actions"><button data-use-element="${x.libraryId}">Brug i træning</button><button class="ghost" data-delete-element="${x.libraryId}">Slet</button></div></article>`).join(''):'<div class="empty">Mit bibliotek er tomt. Gem et element fra editoren.</div>';
  host.querySelectorAll('[data-use-element]').forEach(b=>b.onclick=()=>useLibraryElement(b.dataset.useElement));
  host.querySelectorAll('[data-delete-element]').forEach(b=>b.onclick=()=>deleteLibraryElement(b.dataset.deleteElement));
}

function activityLabel(it){
  if(it?.kind==='run')return `${it.runType} · ${it.value} ${it.unit}`;
  return exercises.find(x=>x.id===it?.exerciseId)?.name||'Ukendt øvelse';
}
function makeRunItem(presetId='run-200'){
  const p=RUN_LIBRARY.find(x=>x.id===presetId)||RUN_LIBRARY[2];
  return normalizeActivity({kind:'run',runType:p.type,value:p.value,unit:p.unit,intensity:p.intensity,route:p.route,note:''});
}
function parseRunPlan(text=''){
  const value=String(text||'').toLowerCase();
  const deny=/\b(ingen|uden)\s+(løb|løbe|løbetur|run|running)\b/.test(value)
    ||/\b(ikke|må ikke|skal ikke)\b.{0,18}\b(løbe|løb|run|running)\b/.test(value);
  const repeat=/\b(pr\.?\s*(runde|sektion|blok)|hver\s+(runde|sektion|blok))\b/.test(value);
  const amountMatch=value.match(/(\d+(?:[.,]\d+)?)\s*(km|kilometer|m|meter)\b.{0,25}\b(løb|løbe|run|running)\b/)
    ||value.match(/\b(løb|løbe|run|running)\b.{0,25}(\d+(?:[.,]\d+)?)\s*(km|kilometer|m|meter)\b/);
  let amount=null,unit='meter';
  if(amountMatch){
    if(/^\d/.test(amountMatch[1])){
      amount=parseFloat(amountMatch[1].replace(',','.'));
      unit=amountMatch[2];
    }else{
      amount=parseFloat(amountMatch[2].replace(',','.'));
      unit=amountMatch[3];
    }
    if(unit==='km'||unit==='kilometer')amount=Math.round(amount*1000);
  }
  const explicitRun=/\b(løb|løbe|løbetur|run|running|sprint|shuttle)\b/.test(value);
  return {deny,repeat,explicit:explicitRun&&!deny,amount:amount?Math.round(amount):null,inserted:false};
}
function requestedRunItem(plan){
  const item=makeRunItem(plan?.amount&&plan.amount>=350?'run-400':plan?.amount&&plan.amount<=120?'run-100':'run-200');
  if(plan?.amount){
    item.value=plan.amount;
    item.unit='meter';
    item.note=plan.repeat?'Gentages som angivet i ønsket.':'Samlet ønsket løbemængde – indsættes én gang i træningen.';
  }
  return item;
}
function shouldSuggestRun(section,focus=''){
  const localPlan=parseRunPlan(focus);
  const plan=activeRunPlan||localPlan;
  const text=`${section?.type||''} ${section?.format||''} ${section?.style||''} ${focus}`.toLowerCase();

  if(plan.deny)return false;
  if(plan.explicit){
    return plan.repeat||!plan.inserted;
  }
  if(plannerConcept==='hyrox')return true;
  if(strongCoreRequest([focus]))return false;
  return plannerVenue==='outdoor'&&['AMRAP','Chipper'].includes(section?.format);
}
function suggestOneExercise(index){
  const s=normalizeSection(sections[index]);
  if(s.type==='Finisher'&&s.finisherMode==='song')return alert('En sangbaseret finisher indeholder ikke øvelser. Skift til Andet format først.');
  const used=new Set(sections.flatMap(x=>(x.exercises||[]).filter(a=>a.kind!=='run').map(a=>a.exerciseId)));
  const picked=pickExercises(1,goalValues(),s.type==='Leg'?'team':s.type==='Opvarmning'?'warmup':'main',used);
  if(!picked.length)return alert('Jeg kunne ikke finde en ny øvelse med det valgte udstyr.');
  s.exercises.push(makeItem(picked[0]));
  renderExerciseSections();renderFramework();updateReview();
}
function buildGameSuggestion(minutes=8,focus='',theme=''){
  const used=new Set(sections.flatMap(s=>(s.exercises||[]).filter(a=>a.kind!=='run').map(a=>a.exerciseId)));
  const picked=pickExercises(3,[...goalValues(),'Sjov','Samarbejde',focus],'team',used);
  const mission=theme?.trim()||'Alarmmissionen';
  const activityNames=picked.map(x=>x.name).filter(Boolean);
  const taskText=activityNames.length?activityNames.join(', '):'tre korte bevægelsesopgaver';

  return normalizeSection({
    type:'Leg',
    name:`${mission} – red holdet`,
    minutes,
    format:'Team workout',
    organization:'Hold',
    control:'Samlet tid',
    style:'Leg',
    description:`Historie: Holdene er på en mission i “${mission}”. De skal løse ${taskText}, hente markører og få hele holdet sikkert tilbage, før tiden løber ud.`,
    rules:`1. Del deltagerne i 2-4 hold og giv hvert hold en base.
2. Én deltager eller ét makkerpar løser næste bevægelsesopgave og henter én markør.
3. På instruktørens signal skal alle straks fryse i en stærk position. Bevægelse efter signalet koster markøren.
4. Deltageren vender tilbage og sender næste afsted.
5. Ingen elimineres. Flest markører ved tidens udløb vinder – eller alle hold vinder, hvis en fælles målsætning nås.`,
    coachTips:'Vis en prøverunde og øv signalet først. Brug flere parallelle baner, så der ikke opstår kø. Hold afstandene korte og udskift en øvelse med et kropsvægtsalternativ, hvis udstyret bliver en flaskehals.',
    variations:'Lettere: gå i stedet for at løbe, én enkel opgave og ingen straf. Sværere: makkertransport, hemmelig kode eller to markører pr. perfekt runde.',
    exercises:picked.map(makeItem)
  });
}
function avoidWaitingEnabled(){
  return $('#avoidWaiting')?.checked!==false;
}
function waitingFriendlyExerciseCount(type,participants){
  if(type==='Stationer')return avoidWaitingEnabled()?Math.min(8,Math.max(5,Math.ceil(participants/3))):6;
  if(type==='Chipper')return 5;
  if(type==='Teknik')return 3;
  return 4;
}
function applyWaitingRules(section,participants){
  if(!avoidWaitingEnabled()||section.type==='Finisher')return section;
  const count=Math.max(1,(section.exercises||[]).length);

  if(section.type==='Stationer'){
    const groupSize=Math.max(2,Math.ceil(participants/count));
    section.organization='Fast rotation';
    section.stationCount=count;
    section.coachTips=[
      section.coachTips,
      `Fordel deltagerne på ${count} stationer med ca. ${groupSize} pr. station.`,
      groupSize>4?'Duplikér stationer med simpelt udstyr eller brug et kropsvægtsalternativ, så ingen station får mere end fire deltagere.':'Stationerne kan startes samtidig uden en central kø.'
    ].filter(Boolean).join(' ');
  }else if(section.organization==='Individuelt'&&participants>=12){
    section.organization='Makker sammen';
    section.coachTips=[
      section.coachTips,
      'Arbejd i makkerpar med hver sit tempo eller skiftevis, så alle er aktive og udstyret deles.'
    ].filter(Boolean).join(' ');
  }else{
    section.coachTips=[
      section.coachTips,
      'Brug parallelle startsteder og et kropsvægtsalternativ ved knapt udstyr.'
    ].filter(Boolean).join(' ');
  }
  return section;
}
function buildSectionSuggestion(type='AMRAP',minutes=12,focus='',theme=''){
  if(type==='Leg')return buildGameSuggestion(minutes,focus,theme);
  if(type==='Teknik'&&isJuniorFamilyContext()){
    return buildFundamentalSection(fundamentalsFromFocus(focus),minutes);
  }
  const s=defaultSection(type);
  s.minutes=minutes;
  if(type==='Chipper')s.timeCap=minutes;
  const used=new Set(sections.flatMap(x=>(x.exercises||[]).filter(a=>a.kind!=='run').map(a=>a.exerciseId)));
  const participants=Math.max(1,+$('#plannerParticipants')?.value||+$('#participantCount')?.value||20);
  const count=waitingFriendlyExerciseCount(type,participants);
  const picked=pickExercises(count,[...goalValues(),focus],type==='Opvarmning'?'warmup':'main',used);
  s.exercises=picked.map(makeItem);
  if(shouldSuggestRun(s,focus)){
    const plan=activeRunPlan||parseRunPlan(focus);
    const preset=plannerConcept==='hyrox'?'run-400':plannerVenue==='outdoor'?'run-200':'run-shuttle';
    const runItem=plan.explicit?requestedRunItem(plan):makeRunItem(preset);
    s.exercises.splice(type==='Chipper'?0:Math.min(1,s.exercises.length),0,runItem);
    if(plan.explicit&&!plan.repeat)plan.inserted=true;
  }
  if(type==='YGIG'){
    s.format='AMRAP';s.organization='You go, I go';s.control='Samlet tid';s.work=0;s.rest=0;
    s.description='Makkerne arbejder skiftevis i den samlede tid. Byt, når den aftalte mængde eller distance er gennemført.';
    s.rules='Makker A udfører den aftalte opgave. Makker B restituerer eller holder en enkel position. Byt efter opgaven – ikke efter et fast interval.';
  }else{
    s.description=`AI-forslag til ${type.toLowerCase()}${focus?` med fokus på ${focus}`:''}.`;
  }
  s.coachTips=s.coachTips||'Kontrollér belastning, plads og flow. Skalér før start og hold forklaringen kort.';
  applyWaitingRules(s,participants);
  return normalizeSection(s);
}
function regenerateSection(index){
  const old=normalizeSection(sections[index]);
  if(old.type==='Finisher'){
    const suggestion=suggestedFinisherTemplate(old.finisherMode||'all');
    sections[index]=buildFinisherFromTemplate(suggestion.id,{songTitle:old.songTitle,songArtist:old.songArtist,songUrl:old.songUrl,songMinutes:old.songMinutes});
  }else{
    const fresh=buildSectionSuggestion(old.type,old.minutes,old.description||'', '');
    fresh.name=old.name;
    fresh.organization=old.organization;
    fresh.control=old.control;
    fresh.format=old.format;
    sections[index]=applySectionRules(fresh);
  }
  renderFramework();renderExerciseSections();updateReview();
}

function sectionVisual(section){
  const n=(section.name||'').toLowerCase();
  const style=(section.style||'').toLowerCase();
  const format=(section.format||'').toLowerCase();
  if(n.includes('opvarm')||n.includes('warm'))return{color:'var(--section-warmup)',icon:'🔥',label:'Opvarmning'};
  if(n.includes('teknik')||style.includes('teknik'))return{color:'var(--section-technique)',icon:'🎯',label:'Teknik'};
  if(n.includes('hyrox')||style.includes('hyrox')||format.includes('hyrox'))return{color:'var(--section-hyrox)',icon:'🏃',label:'Hyrox'};
  if(n.includes('hiit')||style.includes('hiit')||format.includes('hiit')||format.includes('tabata'))return{color:'var(--section-hiit)',icon:'⚡',label:'HIIT'};
  if(n.includes('finisher'))return{color:'var(--section-finisher)',icon:'🏁',label:'Finisher'};
  if(n.includes('team')||n.includes('stafet')||style.includes('leg'))return{color:'var(--section-team)',icon:'🤝',label:'Team'};
  if(n.includes('nedkøl')||n.includes('cool')||style.includes('mobilitet'))return{color:'var(--section-cooldown)',icon:'😌',label:'Nedkøling'};
  if(style.includes('crossfit')||style.includes('funktionel'))return{color:'var(--section-strength)',icon:'🏋️',label:'Funktionel'};
  return{color:'var(--section-default)',icon:'●',label:'Sektion'};
}
function moveSection(from,to){
  if(to<0||to>=sections.length||from===to)return;
  const [item]=sections.splice(from,1);
  sections.splice(to,0,item);
  renderFramework();renderExerciseSections();updateReview();
}
function duplicateSection(index){
  const copy=structuredClone(sections[index]);copy.name=`${copy.name} – kopi`;
  sections.splice(index+1,0,copy);collapsedSections.delete(index+1);
  renderFramework();renderExerciseSections();updateReview();
  setTimeout(()=>{const field=document.querySelector(`[data-inline-name="${index+1}"]`)||document.querySelector(`[data-section-index="${index+1}"][data-section-field="name"]`);field?.focus();field?.select?.()},60);
}
function collapseAllSections(){
  collapsedSections.clear();
  sections.forEach((_,index)=>collapsedSections.add(index));
}
function expandAllSections(){
  collapsedSections.clear();
}
function toggleSectionCollapse(index){
  collapsedSections.has(index)?collapsedSections.delete(index):collapsedSections.add(index);
  renderFramework();renderExerciseSections();
}



function prepareTemplateSections(rawSections){
  const prepared=structuredClone(rawSections||[]).map(normalizeSection);
  if(!prepared.some(s=>s.type==='Ledopvarmning'))prepared.unshift(defaultSection('Ledopvarmning'));
  if(!prepared.some(s=>s.type==='Finisher'))prepared.push(defaultSection('Finisher'));
  return prepared;
}

async function init(){
  updateAddressVersion();
  const base=await fetch('data/exercises.json').then(r=>r.json());
  templates=await fetch('data/workoutTemplates.json').then(r=>r.json());
  exercises=[...customs(),...base];
  renderAdultExerciseOptions();
  $('#templateSelect').innerHTML=templates.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  $('#workoutDate').value=new Date().toISOString().slice(0,10);
  sections=prepareTemplateSections(templates[0].sections);
  populatePickerFilters();bind();syncManualChoiceButtons();setCreationMode('choice');verifyInteractiveControls();normalizeSections();enforceWorkoutStructure();renderFramework();renderExerciseSections();renderSaved();renderElementLibrary();updateReview();
}


function renderAddSectionTypes(){
  const labels={Ledopvarmning:'Rolig mobilisering',Opvarmning:'Puls og bevægelse',Teknik:'Lær bevægelsen ordentligt',Hovedelement:'Træningens primære arbejdsblok',Leg:'Historie, regler og mission',Teamchallenge:'Fælles udfordring for holdet',Finisher:'Én afsluttende sang'};
  $('#addSectionTypeGrid').innerHTML=SECTION_PURPOSES.map(type=>`
    <button type="button" class="section-type-choice ${type===addSectionType?'selected':''}" data-add-section-type="${type}">
      <strong>${esc(type)}</strong><small>${esc(labels[type]||'')}</small>
    </button>`).join('');
  $('#addSectionTypeGrid').querySelectorAll('[data-add-section-type]').forEach(button=>button.onclick=()=>{
    addSectionType=button.dataset.addSectionType;
    $('#addSectionName').value=defaultSection(addSectionType).name;
    renderAddSectionTypes();
  });
}
function openAddSectionDialog(){
  addSectionType='Hovedelement';
  $('#addSectionName').value=defaultSection(addSectionType).name;
  renderAddSectionTypes();
  $('#addSectionDialog').showModal();
}
function submitAddSection(event){
  event.preventDefault();
  const item=defaultSection(addSectionType);
  item.name=$('#addSectionName').value.trim()||item.name;
  if(addSectionType==='Ledopvarmning'){
    sections.unshift(item);
  }else if(addSectionType==='Finisher'){
    const existing=sections.findIndex(s=>normalizeSection(s).sectionPurpose==='Finisher');
    if(existing>=0){
      $('#addSectionDialog').close();
      return alert('Træningen har allerede en finisher. Redigér den eksisterende eller slet den først.');
    }
    sections.push(item);
  }else{
    const finisherIndex=sections.findIndex(s=>normalizeSection(s).sectionPurpose==='Finisher');
    finisherIndex<0?sections.push(item):sections.splice(finisherIndex,0,item);
  }
  enforceWorkoutStructure();
  $('#addSectionDialog').close();
  renderFramework();renderExerciseSections();updateReview();
}
function syncManualSetup(){
  if($('#manualTrainingType'))plannerConcept=$('#manualTrainingType').value;
  if($('#manualVenue')){
    const nextVenue=$('#manualVenue').value;
    if(nextVenue!==plannerVenue){plannerVenue=nextVenue;plannerEquipment=new Set(loadEquipmentProfile(plannerVenue));renderEquipmentChoices()}
  }
  const family=plannerConcept==='family';
  $('#familyMode').checked=family;
  $('#manualFamilyCard')?.classList.toggle('hidden',!['junior','family'].includes(plannerConcept));
  $('#adultCountLabel').classList.toggle('hidden',!family);
  document.querySelectorAll('#conceptChoices .choice-card').forEach(x=>x.classList.toggle('selected',x.dataset.value===plannerConcept));
  document.querySelectorAll('#venueChoices .choice-card').forEach(x=>x.classList.toggle('selected',x.dataset.value===plannerVenue));
  syncManualChoiceButtons();populateTypeDefaults();updateSingleFundamentalVisibility();
  renderFramework();renderExerciseSections();updateReview();
}

function goToStep(step){
  if(step===3){
    const finisherIndex=sections.findIndex(section=>normalizeSection(section).type==='Finisher');
    const message=finisherIndex>=0?finisherValidationMessage(sections[finisherIndex]):'';
    if(message){
      collapsedSections.delete(finisherIndex);renderExerciseSections();showStep(2);
      setTimeout(()=>document.querySelector(`[data-finisher-mode="${finisherIndex}"]`)?.focus(),100);
      return alert(`${message} Ret finisheren, før du går videre til Musik.`);
    }
  }
  showStep(step);
}
function isDefaultWorkoutName(value=''){
  return !String(value).trim()||/^(ny |funkfit junior – dagens træning)/i.test(String(value).trim());
}
function syncManualChoiceButtons(){
  document.querySelectorAll('[data-manual-concept]').forEach(button=>button.classList.toggle('selected',button.dataset.manualConcept===plannerConcept));
  document.querySelectorAll('[data-manual-venue]').forEach(button=>button.classList.toggle('selected',button.dataset.manualVenue===plannerVenue));
  if($('#manualTrainingType'))$('#manualTrainingType').value=plannerConcept;
  if($('#manualVenue'))$('#manualVenue').value=plannerVenue;
}
function populateTypeDefaults(){
  const type=selectedTrainingType();
  sections.forEach(section=>(section.exercises||[]).forEach(item=>{
    if(item.kind==='run')return;
    item.metrics=item.metrics||{};
    if(type==='hiit')Object.assign(item.metrics,{work:item.metrics.work||'40',rest:item.metrics.rest||'20',rounds:item.metrics.rounds||'3',intensity:item.metrics.intensity||'Høj'});
    if(type==='hyrox')Object.assign(item.metrics,{distance:item.metrics.distance||'',ergMeters:item.metrics.ergMeters||'',weight:item.metrics.weight||item.adultKg||'',reps:item.metrics.reps||item.adultReps||'',runDistance:item.metrics.runDistance||''});
    if(type==='trx')Object.assign(item.metrics,{bodyAngle:item.metrics.bodyAngle||'Mellem',repsOrTime:item.metrics.repsOrTime||item.adultReps||'8-12',tempo:item.metrics.tempo||'',laterality:item.metrics.laterality||'Tosidig'});
    if(type==='adult')Object.assign(item.metrics,{weight:item.metrics.weight||item.adultKg||'',reps:item.metrics.reps||item.adultReps||'',sets:item.metrics.sets||'3',tempo:item.metrics.tempo||'',pause:item.metrics.pause||''});
  }));
}
function addFinisher(){
  const existing=sections.findIndex(section=>normalizeSection(section).type==='Finisher');
  if(existing>=0){
    collapsedSections.delete(existing);renderExerciseSections();
    setTimeout(()=>document.querySelector(`[data-finisher-mode="${existing}"]`)?.focus(),50);
    return alert('Træningen har allerede en finisher. Den er åbnet til redigering.');
  }
  const template=suggestedFinisherTemplate('all');
  sections.push(buildFinisherFromTemplate(template.id));enforceWorkoutStructure();
  const index=sections.length-1;collapsedSections.delete(index);
  renderFramework();renderExerciseSections();updateReview();
  setTimeout(()=>document.querySelector(`[data-finisher-mode="${index}"]`)?.focus(),50);
}
function openSongUrl(index){
  const input=document.querySelector(`[data-finisher-index="${index}"][data-finisher-field="songUrl"]`);
  const url=String(input?.value||sections[index]?.songUrl||'').trim();
  if(!url)return alert('Indsæt først et link til sangen.');
  try{
    const parsed=new URL(url);
    if(!['http:','https:'].includes(parsed.protocol))throw new Error('protocol');
    window.open(parsed.href,'_blank','noopener');
  }catch{return alert('Linket skal begynde med http:// eller https://');}
}
function sectionTypeDefaults(index,newType){
  const current=normalizeSection(sections[index]);
  const fresh=defaultSection(newType);
  const genericNames=ELEMENT_TYPES.map(type=>defaultSection(type).name).concat([`${current.name} – kopi`]);
  const keepName=current.name&&!genericNames.includes(current.name);
  const exercises=newType==='Finisher'?[]:(current.exercises||[]);
  sections[index]=normalizeSection({
    ...current,
    type:newType,sectionPurpose:fresh.sectionPurpose,
    name:keepName?current.name:fresh.name,
    format:fresh.format,taskStructure:fresh.taskStructure,repetitionModel:fresh.repetitionModel,organization:fresh.organization,control:fresh.control,style:fresh.style,
    minutes:current.minutes||fresh.minutes,work:fresh.work,rest:fresh.rest,rounds:fresh.rounds,timeCap:fresh.timeCap,
    finisherMode:newType==='Finisher'?(current.finisherMode||fresh.finisherMode):'',finisherTemplateId:newType==='Finisher'?(current.finisherTemplateId||fresh.finisherTemplateId):'',
    songMinutes:fresh.songMinutes,songTitle:newType==='Finisher'?(current.songTitle||''):'',songArtist:newType==='Finisher'?(current.songArtist||''):'',songUrl:newType==='Finisher'?(current.songUrl||''):'',
    exercises
  });
  enforceWorkoutStructure();
}
function applyPurposeDefaults(index,purpose){
  const current=normalizeSection(sections[index]);
  const fresh=defaultSection(purpose);
  const keepName=current.name&&!['AMRAP','EMOM','Chipper','Stationstræning','Styrkeblok','Hovedelement','Ny leg','Teknik','Pulsopvarmning','Ledopvarmning','Teamchallenge','Finisher – én sang'].includes(current.name);
  sections[index]=normalizeSection({
    ...current,
    type:fresh.type,
    sectionPurpose:purpose,
    name:keepName?current.name:fresh.name,
    format:fresh.format,taskStructure:fresh.taskStructure,repetitionModel:fresh.repetitionModel,
    organization:fresh.organization,control:fresh.control,style:fresh.style,
    work:fresh.work,rest:fresh.rest,rounds:fresh.rounds,timeCap:fresh.timeCap,
    finisherMode:purpose==='Finisher'?(current.finisherMode||fresh.finisherMode):'',finisherTemplateId:purpose==='Finisher'?(current.finisherTemplateId||fresh.finisherTemplateId):'',
    exercises:purpose==='Finisher'&&current.finisherMode!=='format'?[]:(current.exercises||[])
  });
  enforceWorkoutStructure();
}
function optionTags(values,selected){return values.map(value=>`<option ${value===selected?'selected':''}>${esc(value)}</option>`).join('')}
function structureEditorFields(s,index,prefix='section'){
  const dataIndex=prefix==='inline'?`data-inline-index="${index}"`:`data-section-index="${index}"`;
  const dataField=field=>prefix==='inline'?`data-inline-field="${field}"`:`data-section-field="${field}"`;
  return `<label>Formål<select ${dataIndex} ${dataField('sectionPurpose')}>${optionTags(SECTION_PURPOSES,s.sectionPurpose)}</select></label>
    <label>Arbejdsformat<select ${dataIndex} ${dataField('format')}>${optionTags(validFormatsForPurpose(s.sectionPurpose),s.format)}</select></label>
    <label>Opgavestruktur<select ${dataIndex} ${dataField('taskStructure')}>${optionTags(validTaskStructuresForFormat(s.format,s.sectionPurpose),s.taskStructure)}</select></label>
    <label>Repetitionsmodel<select ${dataIndex} ${dataField('repetitionModel')}>${optionTags(validRepetitionModelsForFormat(s.format),s.repetitionModel)}</select></label>
    <label>Organisering<select ${dataIndex} ${dataField('organization')}>${optionTags(validOrganizationsForTask(s.taskStructure,s.sectionPurpose),s.organization)}</select></label>
    <label>Styring<select ${dataIndex} ${dataField('control')}>${optionTags(validControlsForFormat(s.format),s.control)}</select></label>`;
}

function closeSectionMenuFrom(element){
  element?.closest('.section-card-menu')?.removeAttribute('open');
}
function renderSectionEditStructure(){
  if(!sectionEditDraft)return;
  const s=applySectionRules(sectionEditDraft);
  const host=$('#sectionEditStructureFields');
  host.innerHTML=`
    <label>Formål<select data-section-dialog-field="sectionPurpose">${optionTags(SECTION_PURPOSES,s.sectionPurpose)}</select></label>
    <label>Arbejdsformat<select data-section-dialog-field="format">${optionTags(validFormatsForPurpose(s.sectionPurpose),s.format)}</select></label>
    <label>Opgavestruktur<select data-section-dialog-field="taskStructure">${optionTags(validTaskStructuresForFormat(s.format,s.sectionPurpose),s.taskStructure)}</select></label>
    <label>Repetitionsmodel<select data-section-dialog-field="repetitionModel">${optionTags(validRepetitionModelsForFormat(s.format),s.repetitionModel)}</select></label>
    <label>Organisering<select data-section-dialog-field="organization">${optionTags(validOrganizationsForTask(s.taskStructure,s.sectionPurpose),s.organization)}</select></label>
    <label>Styring<select data-section-dialog-field="control">${optionTags(validControlsForFormat(s.format),s.control)}</select></label>`;
  host.querySelectorAll('[data-section-dialog-field]').forEach(select=>select.onchange=()=>{
    const field=select.dataset.sectionDialogField;
    sectionEditDraft[field]=select.value;
    if(field==='sectionPurpose'){
      const fresh=defaultSection(select.value);
      sectionEditDraft={...sectionEditDraft,type:fresh.type,sectionPurpose:fresh.sectionPurpose,format:fresh.format,taskStructure:fresh.taskStructure,repetitionModel:fresh.repetitionModel,organization:fresh.organization,control:fresh.control,style:fresh.style};
    }
    applySectionRules(sectionEditDraft);
    renderSectionEditStructure();
  });
}
function openSectionEditDialog(index,mode='structure'){
  sectionEditIndex=index;
  sectionEditMode=mode;
  sectionEditDraft=structuredClone(normalizeSection(sections[index]));
  const structure=mode==='structure';
  $('#sectionEditTitle').textContent=structure?'Redigér struktur':'Redigér regler og trænertips';
  $('#sectionEditHelp').textContent=structure
    ?'Tilpas formål, arbejdsformat, opgavestruktur, repetitionsmodel, organisering og styring.'
    :'Ret de instruktioner, som vises i sektionen og bruges i instruktørmaterialet.';
  $('#sectionEditStructureFields').classList.toggle('hidden',!structure);
  $('#sectionEditGuidanceFields').classList.toggle('hidden',structure);
  if(structure)renderSectionEditStructure();
  else{
    $('#sectionEditRules').value=sectionEditDraft.rules||'';
    $('#sectionEditCoachTips').value=sectionEditDraft.coachTips||'';
  }
  $('#sectionEditDialog').showModal();
}
function submitSectionEdit(event){
  event.preventDefault();
  if(sectionEditIndex===null||!sections[sectionEditIndex])return;
  if(sectionEditMode==='structure'){
    const original=normalizeSection(sections[sectionEditIndex]);
    sections[sectionEditIndex]=normalizeSection({...original,
      type:sectionEditDraft.type,
      sectionPurpose:sectionEditDraft.sectionPurpose,
      format:sectionEditDraft.format,
      taskStructure:sectionEditDraft.taskStructure,
      repetitionModel:sectionEditDraft.repetitionModel,
      organization:sectionEditDraft.organization,
      control:sectionEditDraft.control,
      style:sectionEditDraft.style
    });
    enforceWorkoutStructure();
  }else{
    sections[sectionEditIndex].rules=$('#sectionEditRules').value.trim();
    sections[sectionEditIndex].coachTips=$('#sectionEditCoachTips').value.trim();
  }
  $('#sectionEditDialog').close();
  renderFramework();renderExerciseSections();updateReview();
}
function regenerateSectionWithConfirm(index){
  const name=sections[index]?.name||'sektionen';
  if(!confirm(`Lav et helt nyt forslag til “${name}”? De nuværende aktiviteter og AI-indhold i sektionen bliver erstattet.`))return;
  regenerateSection(index);
}
function deleteSectionWithConfirm(index){
  if(sections.length<=1)return alert('Træningen skal indeholde mindst én sektion.');
  const name=sections[index]?.name||'sektionen';
  if(!confirm(`Vil du slette “${name}”?`))return;
  sections.splice(index,1);
  collapsedSections.clear();
  renderFramework();renderExerciseSections();updateReview();
}

function bind(){
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>showView(b.dataset.view));
  document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>goToStep(+b.dataset.step));
  document.querySelectorAll('[data-next-step]').forEach(b=>b.onclick=()=>goToStep(+b.dataset.nextStep));
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).close());
  on('homeBrandBtn','click',()=>{showView('designView');setCreationMode('choice');showStep(1)});
  if($('#addSectionForm'))$('#addSectionForm').onsubmit=submitAddSection;
  if($('#sectionEditForm'))$('#sectionEditForm').onsubmit=submitSectionEdit;
  if($('#manualTrainingType'))$('#manualTrainingType').onchange=syncManualSetup;
  if($('#manualVenue'))$('#manualVenue').onchange=syncManualSetup;
  document.querySelectorAll('[data-manual-concept]').forEach(button=>button.onclick=()=>{
    $('#manualTrainingType').value=button.dataset.manualConcept;syncManualSetup();
  });
  document.querySelectorAll('[data-manual-venue]').forEach(button=>button.onclick=()=>{
    $('#manualVenue').value=button.dataset.manualVenue;syncManualSetup();
  });
  on('addFinisherBtn','click',addFinisher);

  $('#familyMode').onchange=()=>{
    $('#adultCountLabel').classList.toggle('hidden',!$('#familyMode').checked);
    if($('#familyMode').checked)plannerConcept='family';
    else if(plannerConcept==='family')plannerConcept='junior';
    updateSingleFundamentalVisibility();
    renderFramework();renderExerciseSections();
  };
  $('#loadTemplateBtn').onclick=()=>{sections=prepareTemplateSections(templates.find(t=>t.id===$('#templateSelect').value).sections);enforceWorkoutStructure();renderFramework();renderExerciseSections();updateReview()};
  $('#addSectionBtn').onclick=openAddSectionDialog;
  $('#saveWorkoutBtn').onclick=saveCurrent;
  $('#playCurrentBtn').onclick=()=>startPlayer(collect());
  on('reviewParticipants','input',event=>{
    const value=Math.max(1,+event.target.value||1);
    $('#participantCount').value=value;
    if($('#plannerParticipants'))$('#plannerParticipants').value=value;
    updateReview();
  });
  on('participantCount','input',event=>{
    const value=Math.max(1,+event.target.value||1);
    if($('#plannerParticipants'))$('#plannerParticipants').value=value;
    updateReview();
  });
  $('#newWorkoutBtn').onclick=newWorkout;
  on('clearWorkoutBtn','click',clearCurrentWorkout);
  on('undoClearWorkoutBtn','click',undoClearWorkout);
  $('#openSpotifyBtn').onclick=()=>openPlaylist($('#spotifyPlaylistUrl').value,'Spotify');
  $('#openTidalBtn').onclick=()=>openPlaylist($('#tidalPlaylistUrl').value,'TIDAL');
  $('#openTelmoreBtn').onclick=()=>openPlaylist($('#telmorePlaylistUrl').value,'Telmore Musik');

  $('#pickerSearch').oninput=renderPicker;
  $('#pickerBody').onchange=renderPicker;
  $('#pickerStyle').onchange=renderPicker;
  $('#pickerFavorites').onchange=renderPicker;
  $('#pickerCreateBtn').onclick=()=>{$('#exercisePickerDialog').close();$('#newExerciseDialog').showModal()};
  $('#newExerciseForm').onsubmit=createExercise;
  $('#workoutImageInput').onchange=handleWorkoutImage;

  on('manualModeBtn','click',()=>{console.info('Skifter til Builder');setCreationMode('manual')});
  on('aiModeBtn','click',()=>{console.info('Skifter til AI-forslag');setCreationMode('ai')});
  on('singleSectionModeBtn','click',()=>startSingleSectionPlanner(null));
  $('#workoutCameraInput').onchange=handleWorkoutImage;
  document.querySelectorAll('#structureChoices .structure-chip').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#structureChoices .structure-chip').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');structureChoice=b.dataset.value;
  });

  $('#workoutTextFileInput').onchange=handleWorkoutTextFile;
  $('#analyzeImportBtn').onclick=analyzeImportedWorkout;
  $('#clearImportBtn').onclick=clearImportedWorkout;
  bindPlanner();

  on('aiBuildSectionBtn','click',()=>startSingleSectionPlanner(null));
  on('aiBuildGameBtn','click',()=>startSingleSectionPlanner(null,'Leg'));
  on('runPreset','change',e=>fillRunPreset(e.target.value));
  if($('#runForm'))$('#runForm').onsubmit=submitRun;
  if($('#aiSectionForm'))$('#aiSectionForm').onsubmit=submitAISection;
  if($('#aiSectionType'))$('#aiSectionType').onchange=updateInlineAIFields;
  on('singleFinisherMode','change',()=>refreshFinisherForm('single'));
  on('singleFinisherCatalog','change',()=>{const preview=byId('singleFinisherPreview');if(preview)preview.innerHTML=finisherTemplatePreview(finisherTemplateById(byId('singleFinisherCatalog').value))});
  on('singleFinisherSuggestBtn','click',()=>suggestFinisherIntoForm('single'));
  on('inlineFinisherMode','change',()=>refreshFinisherForm('inline'));
  on('inlineFinisherCatalog','change',()=>{const preview=byId('inlineFinisherPreview');if(preview)preview.innerHTML=finisherTemplatePreview(finisherTemplateById(byId('inlineFinisherCatalog').value))});
  on('inlineFinisherSuggestBtn','click',()=>suggestFinisherIntoForm('inline'));

  $('#playerPrevBtn').onclick=()=>movePlayer(-1);
  $('#playerNextBtn').onclick=()=>movePlayer(1);
  $('#playerTapArea').onclick=()=>movePlayer(1);
  $('#playerCloseBtn').onclick=closePlayer;
  $('#playerFullscreenBtn').onclick=toggleFullscreen;
  $('#playerSpotifyBtn').onclick=()=>openPlaylist($('#spotifyPlaylistUrl').value,'Spotify');
  $('#playerTidalBtn').onclick=()=>openPlaylist($('#tidalPlaylistUrl').value,'TIDAL');
  $('#playerTelmoreBtn').onclick=()=>openPlaylist($('#telmorePlaylistUrl').value,'Telmore Musik');
  document.addEventListener('keydown',e=>{if(!$('#workoutPlayer').open)return;if(e.code==='Space'||e.code==='ArrowRight'){e.preventDefault();movePlayer(1)}else if(e.code==='ArrowLeft'){e.preventDefault();movePlayer(-1)}});
}


function setCreationMode(mode){
  creationMode=['ai','section','manual'].includes(mode)?mode:'choice';

  const manualBtn=byId('manualModeBtn');
  const aiBtn=byId('aiModeBtn');
  const singleBtn=byId('singleSectionModeBtn');
  const aiTrack=byId('aiPlannerTrack');
  const manualTrack=byId('manualBuilderTrack');
  const isPlanner=creationMode==='ai'||creationMode==='section';
  const isSection=creationMode==='section';
  const isManual=creationMode==='manual';

  manualBtn?.classList.toggle('selected',isManual);
  aiBtn?.classList.toggle('selected',creationMode==='ai');
  singleBtn?.classList.toggle('selected',isSection);

  if(aiTrack){
    aiTrack.classList.toggle('hidden',!isPlanner);
    aiTrack.setAttribute('aria-hidden',String(!isPlanner));
  }
  if(manualTrack){
    if(isManual){syncManualChoiceButtons();populateTypeDefaults();}
    manualTrack.classList.toggle('hidden',!isManual);
    manualTrack.open=isManual;
    manualTrack.setAttribute('aria-hidden',String(!isManual));
  }

  byId('plannerStructureBlock')?.classList.toggle('hidden',isSection);
  byId('singleSectionConfig')?.classList.toggle('hidden',!isSection);
  byId('includeJointWarmupWrap')?.classList.toggle('hidden',isSection);
  byId('includeFinisherWrap')?.classList.toggle('hidden',isSection);
  byId('includeGameWrap')?.classList.toggle('hidden',isSection);

  const duration=byId('plannerDuration');
  if(duration){
    if(isSection){
      duration.min='3';duration.max='45';
      if(+duration.value>45||+duration.value<3)duration.value='12';
    }else{
      duration.min='20';duration.max='120';
      if(+duration.value<20)duration.value='60';
    }
  }
  if(byId('plannerDurationUnit')){
    byId('plannerDurationUnit').textContent=isSection?'minutter i sektionen':'minutter';
  }

  if(byId('plannerHeroTitle'))byId('plannerHeroTitle').textContent=isSection?'Byg én sektion med AI':'Fra idé til færdigt udkast';
  if(byId('plannerHeroText'))byId('plannerHeroText').textContent=isSection
    ?'Besvar punkt 1–6. AI bruger målgruppe, sted, deltagere, mål, udstyr og dine ønsker til at bygge én sektion.'
    :'Vælg rammerne. Appen sammensætter et forslag, der passer til sted, udstyr, deltagere og træningsmål.';
  if(byId('plannerTimeStrong'))byId('plannerTimeStrong').textContent=isSection?'Én sektion':'Ca. 2 min';
  if(byId('plannerTimeText'))byId('plannerTimeText').textContent=isSection?'uden ledopvarmning eller finisher':'til første udkast';

  if(byId('plannerGenerateTitle'))byId('plannerGenerateTitle').textContent=isSection?'Klar til at bygge sektionen?':'Klar til at bygge?';
  if(byId('plannerGenerateText'))byId('plannerGenerateText').textContent=isSection
    ?'AI indsætter kun én sektion og ændrer ikke resten af træningen.'
    :'Forslaget bliver sat direkte ind i editoren og kan ændres bagefter.';
  if(byId('generateSmartWorkoutBtn'))byId('generateSmartWorkoutBtn').textContent=isSection?'✨ Lav sektionsforslag':'✨ Lav træningsforslag';

  // Gem kun et aktivt valg. "choice" er startvisningen og må ikke
  // få Builder-panelet til at åbne automatisk næste gang.
  if(creationMode!=='choice'){
    const profile=userProfile();
    profile.preferredMode=creationMode;
    saveUserProfile(profile);
  }

  updateTimeControl();
  if(isPlanner||isManual){
    setTimeout(()=>{(isPlanner?aiTrack:manualTrack)?.scrollIntoView({behavior:'smooth',block:'start'})},50);
  }
}
function selectedTrainingType(){return plannerConcept||'junior'}

function verifyInteractiveControls(){
  const required=['manualModeBtn','aiModeBtn','singleSectionModeBtn','manualBuilderTrack','aiPlannerTrack','saveWorkoutBtn','playCurrentBtn','newWorkoutBtn','workoutImageInput','workoutCameraInput','workoutTextFileInput','generateSmartWorkoutBtn','aiBuildSectionBtn','aiBuildGameBtn','clearWorkoutBtn','undoClearWorkoutBtn','runDialog','aiSectionDialog','exerciseInfoDialog','addSectionDialog','manualTrainingType','manualVenue','resetEquipmentProfileBtn','singleFundamentalChoices','adultExerciseOptions','addFinisherBtn','homeBrandBtn','aiSectionContext','inlineFundamentalChoices','inlineFinisherWrap','singleFinisherMode','singleFinisherCatalog','singleFinisherSuggestBtn','inlineFinisherMode','inlineFinisherCatalog','inlineFinisherSuggestBtn','sectionEditDialog','sectionEditForm','sectionEditStructureFields','sectionEditGuidanceFields'];
  const missing=required.filter(id=>!byId(id));
  if(missing.length)console.error('Manglende interaktive elementer:',missing);
  else console.info('FunkFit interaktive kontroller: OK');
}
function showView(id){
  document.querySelectorAll('.app-view').forEach(v=>v.classList.toggle('active',v.id===id));
  document.querySelectorAll('.nav-tab').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
}
function showStep(n){
  document.querySelectorAll('.step-panel').forEach((p,i)=>p.classList.toggle('active',i===n-1));
  document.querySelectorAll('.step').forEach(b=>b.classList.toggle('active',+b.dataset.step===n));
  if(n===2){
    expandAllSections();
    renderExerciseSections();
  }
  if(n===3)updateReview();
  window.scrollTo({top:0,behavior:'smooth'});
}



function isJuniorFamilyContext(){
  return ['junior','family'].includes(selectedTrainingType())||!!$('#familyMode')?.checked;
}
function fundamentalTitle(key){
  const f=FUNKFIT_FUNDAMENTALS[key];
  return f?`${f.icon} ${f.label} (${f.english})`:'';
}
function fundamentalsFromFocus(focus=''){
  const text=String(focus||'').toLowerCase();
  const matchers=[
    ['squat',/(squat|sætte sig|sæt dig|knæbøj)/],
    ['hinge',/(hinge|samle op|dødløft|deadlift|hoftehængsel|bagkæde)/],
    ['push',/(push|skub|push-up|armstræk|pres)/],
    ['pull',/(pull|træk|trække|row|roning)/],
    ['carry',/(carry|bære|farmer|suitcase)/],
    ['jump-land',/(jump|hop|lande|landing|plyometri)/],
    ['run-cod',/(run|løb|løbe|vende|retningsskift|change of direction|agility)/],
    ['core',/(core|mave|abs|holde kroppen|stabil)/]
  ];
  const found=matchers.filter(([,pattern])=>pattern.test(text)).map(([key])=>key);
  return found.length?found:['squat'];
}
function fundamentalFromFocus(focus=''){
  return fundamentalsFromFocus(focus)[0];
}
function makeFundamentalActivity(exerciseId){
  const ex=exercises.find(x=>x.id===exerciseId);
  const junior=splitPrescription(ex||{},false),adult=splitPrescription(ex||{},true);
  return normalizeActivity({kind:'exercise',exerciseId,
    juniorKg:junior.weight,juniorReps:junior.reps||'5-8 rolige kvalitetsgentagelser',juniorNote:'Fokus på teknik – ikke tempo.',
    adultExerciseId:exerciseId,adultKg:adult.weight,adultReps:adult.reps||'8-10 kontrollerede gentagelser',
    adultNote:'Skalér, så bevægelseskvaliteten bevares.'
  });
}
function buildFundamentalSection(keys='squat',minutes=10){
  const selected=[...new Set((Array.isArray(keys)?keys:[keys]).filter(key=>FUNKFIT_FUNDAMENTALS[key]))];
  if(!selected.length)selected.push('squat');

  const perMovement=selected.length===1?3:2;
  const chosenIds=[];
  selected.forEach(key=>{
    FUNKFIT_FUNDAMENTALS[key].exerciseIds
      .filter(id=>exercises.some(x=>x.id===id))
      .slice(0,perMovement)
      .forEach(id=>{if(!chosenIds.includes(id))chosenIds.push(id)});
  });

  const labels=selected.map(key=>FUNKFIT_FUNDAMENTALS[key]);
  const s=defaultSection('Teknik');
  s.fundamentalKeys=selected;
  s.fundamentalKey=selected[0];
  s.name=`Teknik – ${labels.map(f=>f.label).join(' + ')}`;
  s.minutes=Math.max(6,+minutes||10);
  s.description=labels.map(f=>`${f.icon} ${f.label}: ${f.description}`).join('\n');
  s.rules='Arbejd med få, rolige kvalitetsgentagelser. Stop og skalér, når positionen ikke længere kan holdes.';
  s.coachTips=labels.map(f=>`${f.icon} ${f.coachTips}`).join(' ');
  s.exercises=chosenIds.map(makeFundamentalActivity);
  applyWaitingRules(s,Math.max(1,+$('#plannerParticipants')?.value||+$('#participantCount')?.value||20));
  return normalizeSection(s);
}
function applyFundamentalToSection(index,key){
  const current=normalizeSection(sections[index]);
  if(current.type!=='Teknik')return;

  const selected=new Set(current.fundamentalKeys||[]);
  const hasFundamentalSelection=selected.size>0;
  if(!hasFundamentalSelection&&(current.exercises||[]).length){
    if(!confirm('Vil du erstatte de nuværende aktiviteter med FunkFit Fundamentals-øvelser?'))return;
  }

  selected.has(key)?selected.delete(key):selected.add(key);
  if(!selected.size){
    const blank=defaultSection('Teknik');
    blank.name='Teknik';
    blank.minutes=current.minutes||10;
    sections[index]=blank;
  }else{
    sections[index]=buildFundamentalSection([...selected],current.minutes||10);
  }
  renderFramework();renderExerciseSections();updateReview();
}
function renderFundamentalsPicker(s,index,compact=false){
  if(s.type!=='Teknik'||!isJuniorFamilyContext())return '';
  const selected=new Set(s.fundamentalKeys||[]);
  return `<section class="fundamentals-card ${compact?'compact':''}">
    <div class="fundamentals-heading">
      <div>
        <p class="eyebrow">FUNKFIT FUNDAMENTALS</p>
        <h4>Vælg én eller flere grundbevægelser</h4>
      </div>
      ${selected.size?`<div class="fundamental-selected-list">${[...selected].map(key=>`<span class="fundamental-selected">${esc(fundamentalTitle(key))}</span>`).join('')}</div>`:''}
    </div>
    <p class="field-help">Ved flere valg indsættes to klassiske øvelser pr. grundbevægelse. Klik igen for at fjerne et valg.</p>
    <div class="fundamentals-grid">
      ${Object.entries(FUNKFIT_FUNDAMENTALS).map(([key,f])=>`
        <button type="button" class="fundamental-btn ${selected.has(key)?'selected':''}" data-fundamental-section="${index}" data-fundamental-key="${key}" aria-pressed="${selected.has(key)}">
          <span>${f.icon}</span><strong>${esc(f.label)}</strong><small>${esc(f.english)}</small>
        </button>`).join('')}
    </div>
  </section>`;
}

function sectionActivityCount(s){return s.type==='Finisher'&&s.finisherMode==='song'?0:(s.exercises||[]).length}
function sectionTimingText(s){
  s=normalizeSection(s);
  if(s.sectionPurpose==='Finisher'&&s.finisherMode==='song')return `Én sang${s.songTitle?` · ${s.songTitle}`:''}`;
  if(s.sectionPurpose==='Finisher')return `${s.minutes||4} min · ${s.format}`;
  if(s.organization==='You go, I go')return `${s.minutes} min · byt efter opgave`;
  if(s.control==='Intervaller')return `${s.work||40}/${s.rest||20} sek. · ${s.rounds||1} runder`;
  if(s.control==='Tidsblokke')return `${s.minutes} min · opgave pr. tidsblok`;
  if(s.control==='Runder')return `${s.rounds||1} runder`;
  if(s.control==='Time cap')return s.timeCap?`Time cap ${s.timeCap} min`:'For time';
  if(s.control==='Sæt og pause')return `${s.rounds||3} sæt`;
  if(s.control==='Kvalitet')return `${s.minutes||10} min · kvalitet`;
  return `${s.minutes} min`;
}
function sectionSummaryText(s){
  s=normalizeSection(s);
  const parts=[s.format,s.taskStructure,s.repetitionModel!=='Ikke relevant'?s.repetitionModel:null,s.organization].filter(Boolean);
  return parts.join(' · ');
}
function sectionDynamicFields(s,i){
  if(s.sectionPurpose==='Finisher'){
    return `<div class="finisher-song-card">
      <h4>${s.finisherMode==='song'?'🎵 Sangbaseret finisher':'🏁 Finisher-format'}</h4>
      <p class="field-help">Valg og katalog redigeres i Finpuds.</p>
      <label>Type<input value="${esc(finisherModeLabel(s.finisherMode))}" disabled></label>
      <label>Katalog<input value="${esc(finisherTemplateById(s.finisherTemplateId)?.title||s.name)}" disabled></label>
      <label>Længde (min)<input data-section-index="${i}" data-section-field="${s.finisherMode==='song'?'songMinutes':'minutes'}" type="number" min="1" max="12" step=".1" value="${s.finisherMode==='song'?(s.songMinutes||4):(s.minutes||4)}"></label>
    </div>`;
  }
  let timing='';
  if(s.control==='Intervaller')timing=`<label>Arbejde (sek.)<input data-section-index="${i}" data-section-field="work" type="number" min="1" value="${s.work||40}"></label><label>Pause (sek.)<input data-section-index="${i}" data-section-field="rest" type="number" min="0" value="${s.rest||20}"></label><label>Runder<input data-section-index="${i}" data-section-field="rounds" type="number" min="1" value="${s.rounds||1}"></label>`;
  else if(s.control==='Runder'||s.control==='Sæt og pause')timing=`<label>${s.control==='Runder'?'Runder':'Sæt'}<input data-section-index="${i}" data-section-field="rounds" type="number" min="1" value="${s.rounds||1}"></label>`;
  else if(s.control==='Time cap')timing=`<label>Time cap (min)<input data-section-index="${i}" data-section-field="timeCap" type="number" min="0" value="${s.timeCap||s.minutes||0}"></label>`;
  else timing=`<label>Samlet tid (min)<input data-section-index="${i}" data-section-field="minutes" type="number" min="1" value="${s.minutes||1}"></label>`;
  const ladder=['Stigende ladder','Faldende ladder','Pyramide'].includes(s.repetitionModel)?`<label>Start-reps<input data-section-index="${i}" data-section-field="ladderStart" type="number" min="1" value="${s.ladderStart||1}"></label><label>Ændring pr. trin<input data-section-index="${i}" data-section-field="ladderStep" type="number" min="1" value="${s.ladderStep||1}"></label><label>Slut/top<input data-section-index="${i}" data-section-field="ladderEnd" type="number" min="1" value="${s.ladderEnd||10}"></label>`:'';
  const ygig=s.organization==='You go, I go'?`<label class="span-2">Opgave pr. tur<input data-section-index="${i}" data-section-field="taskPerTurn" value="${esc(s.taskPerTurn||'Byt, når opgaven er løst')}" placeholder="Fx 10 squats eller 200 m løb – derefter byt"></label><p class="span-2 field-help">YGIG er organiseringen. Makkere bytter efter opgaven – ikke automatisk efter et 40/20-interval.</p>`:'';
  const fundamentals=s.sectionPurpose==='Teknik'?renderFundamentalsPicker(s,i):'';
  return fundamentals+timing+ladder+ygig;
}
function renderFramework(){
  normalizeSections();enforceWorkoutStructure();
  $('#frameworkSections').innerHTML=sections.map((s,i)=>{
    const v=sectionVisual(s),collapsed=collapsedSections.has(i),count=sectionActivityCount(s);
    return `<article class="framework-card ${collapsed?'collapsed':''}" style="--section-color:${v.color}">
      <div class="section-card-header">
        <div class="section-title-group"><div class="section-icon">${v.icon}</div><div class="section-title-text">
          <h3>${esc(s.name)}</h3><small>${esc(s.sectionPurpose)} · element ${i+1} af ${sections.length}</small>
          <div class="section-badges"><span class="section-stat">${esc(sectionTimingText(s))}</span>${s.sectionPurpose!=='Finisher'?`<span class="section-stat">${count} aktiviteter</span>`:''}<span class="section-stat structure-summary-chip">${esc(sectionSummaryText(s))}</span></div>
        </div></div>
        <div class="section-card-actions"><button class="collapse-btn" data-collapse-framework="${i}">${collapsed?'Fold ud':'Fold sammen'}</button><details class="section-card-menu"><summary>⋮</summary><div class="section-menu-popover">
          ${s.sectionPurpose!=='Finisher'?`<button data-ai-section="${i}">✨ AI-forslag til sektionen</button><button data-regenerate="${i}">🔄 Regenerér sektionen</button><button data-suggest-one="${i}">+ Foreslå én øvelse</button>`:''}
          <button data-save-element="${i}">Gem i Mit bibliotek</button><button data-move-up="${i}">↑ Flyt op</button><button data-move-down="${i}">↓ Flyt ned</button><button data-duplicate="${i}">⧉ Duplikér</button><button data-del-sec="${i}">Slet element</button>
        </div></details></div>
      </div>
      <div class="framework-settings simplified-framework-settings">
        <label>Formål<select data-section-index="${i}" data-section-field="sectionPurpose">${optionTags(SECTION_PURPOSES,s.sectionPurpose)}</select><span>Hvorfor er sektionen med?</span></label>
        <label>Navn<input data-section-index="${i}" data-section-field="name" value="${esc(s.name)}"></label>
        ${sectionDynamicFields(s,i)}
        ${s.sectionPurpose!=='Finisher'?`<details class="span-2 advanced-section-options"><summary>Rediger struktur</summary><div class="advanced-section-grid">${structureEditorFields(s,i,'section')}<label>Sektionens fokus<select data-section-index="${i}" data-section-field="style">${STYLES.map(x=>`<option ${x===s.style?'selected':''}>${x}</option>`).join('')}</select></label></div></details>`:''}
        ${s.sectionPurpose!=='Finisher'?`<label class="span-2">Beskrivelse<textarea data-section-index="${i}" data-section-field="description" rows="3">${esc(s.description)}</textarea></label><label class="span-2">Regler<textarea data-section-index="${i}" data-section-field="rules" rows="3">${esc(s.rules)}</textarea></label><label class="span-2">Trænertips<textarea data-section-index="${i}" data-section-field="coachTips" rows="3">${esc(s.coachTips)}</textarea></label>`:''}
      </div>
      <div class="element-actions">${s.sectionPurpose!=='Finisher'?`<button data-ai-section="${i}">✨ AI-forslag til denne sektion</button><button class="secondary" data-regenerate="${i}">🔄 Regenerér</button>`:''}<button class="secondary" data-save-element="${i}">Gem i Mit bibliotek</button></div>
    </article>`;
  }).join('');

  const host=$('#frameworkSections');
  host.querySelectorAll('[data-fundamental-section]').forEach(b=>b.onclick=()=>applyFundamentalToSection(+b.dataset.fundamentalSection,b.dataset.fundamentalKey));
  host.querySelectorAll('[data-collapse-framework]').forEach(b=>b.onclick=()=>toggleSectionCollapse(+b.dataset.collapseFramework));
  host.querySelectorAll('[data-move-up]').forEach(b=>b.onclick=()=>moveSection(+b.dataset.moveUp,+b.dataset.moveUp-1));
  host.querySelectorAll('[data-move-down]').forEach(b=>b.onclick=()=>moveSection(+b.dataset.moveDown,+b.dataset.moveDown+1));
  host.querySelectorAll('[data-duplicate]').forEach(b=>b.onclick=()=>duplicateSection(+b.dataset.duplicate));
  host.querySelectorAll('[data-regenerate]').forEach(b=>b.onclick=()=>regenerateSection(+b.dataset.regenerate));
  host.querySelectorAll('[data-suggest-one]').forEach(b=>b.onclick=()=>suggestOneExercise(+b.dataset.suggestOne));
  host.querySelectorAll('[data-ai-section]').forEach(b=>b.onclick=()=>openAISectionDialog('section',+b.dataset.aiSection));
  host.querySelectorAll('[data-save-element]').forEach(b=>b.onclick=()=>saveSectionToLibrary(+b.dataset.saveElement));
  host.querySelectorAll('[data-del-sec]').forEach(b=>b.onclick=()=>{if(sections.length>1){sections.splice(+b.dataset.delSec,1);renderFramework();renderExerciseSections();updateReview()}});
  host.querySelectorAll('[data-section-field]').forEach(el=>{
    const structural=['sectionPurpose','format','taskStructure','repetitionModel','organization','control'].includes(el.dataset.sectionField);
    const event=el.tagName==='TEXTAREA'||el.tagName==='INPUT'?'input':'change';
    el.addEventListener(event,()=>{
      const i=+el.dataset.sectionIndex,field=el.dataset.sectionField;
      const numeric=['minutes','work','rest','rounds','songMinutes','timeCap','ladderStart','ladderStep','ladderEnd'].includes(field);
      if(field==='sectionPurpose'){applyPurposeDefaults(i,el.value);renderFramework();renderExerciseSections();updateReview();return;}
      sections[i][field]=numeric?(+el.value||0):el.value;if(field==='songMinutes')sections[i].minutes=+el.value||4;
      applySectionRules(sections[i]);if(structural){renderFramework();renderExerciseSections();}else if(['name','minutes','songTitle','songArtist','songMinutes'].includes(field)){renderExerciseSections();}updateReview();
    });
  });
}

function inlineTimingControls(s,si){
  if(s.sectionPurpose==='Finisher'&&s.finisherMode==='song')return `<span class="section-stat">Én sang</span>`;
  if(s.sectionPurpose==='Finisher')return `<label>Tid <input data-inline-field="minutes" data-inline-index="${si}" type="number" min="1" value="${s.minutes||4}"> min</label><span class="section-stat">${esc(s.format)}</span>`;
  if(s.organization==='You go, I go')return `<label>Samlet tid <input data-inline-field="minutes" data-inline-index="${si}" type="number" min="1" value="${s.minutes}"> min</label><span class="ygig-note">Byt efter opgaven</span>`;
  if(s.control==='Intervaller')return `<label>Arbejde <input data-inline-field="work" data-inline-index="${si}" type="number" min="1" value="${s.work||40}"></label><label>Pause <input data-inline-field="rest" data-inline-index="${si}" type="number" min="0" value="${s.rest||20}"></label><label>Runder <input data-inline-field="rounds" data-inline-index="${si}" type="number" min="1" value="${s.rounds||1}"></label>`;
  if(s.control==='Runder'||s.control==='Sæt og pause')return `<label>${s.control==='Runder'?'Runder':'Sæt'} <input data-inline-field="rounds" data-inline-index="${si}" type="number" min="1" value="${s.rounds||1}"></label>`;
  if(s.control==='Time cap')return `<label>Time cap <input data-inline-field="timeCap" data-inline-index="${si}" type="number" min="0" value="${s.timeCap||s.minutes||0}"> min</label>`;
  return `<label>Tid <input data-inline-field="minutes" data-inline-index="${si}" type="number" min="1" value="${s.minutes}"> min</label>`;
}
function inlineStructureEditor(s,si){return structureEditorFields(s,si,'inline')}

function renderExerciseSections(){
  const fam=$('#familyMode').checked;
  $('#totalMinutes').textContent=sections.reduce((n,s)=>n+(+s.minutes||0),0);
  $('#exerciseSections').innerHTML=sections.map((s,si)=>{
    normalizeSection(s);
    const v=sectionVisual(s),collapsed=collapsedSections.has(si),count=sectionActivityCount(s);
    const progress=Math.round(((si+1)/sections.length)*100);
    const finisher=s.sectionPurpose==='Finisher';
    const canMoveUp=si>0&&s.sectionPurpose!=='Ledopvarmning';
    const canMoveDown=si<sections.length-1&&s.sectionPurpose!=='Finisher';
    return `<article class="exercise-section ${collapsed?'collapsed':''}" style="--section-color:${v.color}">
      <div class="section-progress section-progress-top">
        <span>Sektion ${si+1} af ${sections.length} · ${esc(s.sectionPurpose||v.label)}</span>
        <div class="section-progress-bar" aria-label="Sektion ${si+1} af ${sections.length}"><span style="width:${progress}%"></span></div>
      </div>
      <div class="section-card-header">
        <div class="section-title-group">
          <div class="section-icon">${finisher?(s.finisherMode==='song'?'🎵':'🏁'):v.icon}</div>
          <div class="section-title-text">
            <input class="inline-section-name" data-inline-name="${si}" value="${esc(s.name)}" aria-label="Sektionens navn">
            <div class="inline-section-controls simple-inline-controls">
              ${inlineTimingControls(s,si)}
              ${(!finisher||s.finisherMode==='format')?`<span class="section-stat">${count} aktiviteter</span>`:''}
              ${(!finisher||s.finisherMode==='format')?`<span class="inline-structure-summary">${esc(sectionSummaryText(s))}</span>`:''}
            </div>
          </div>
        </div>
        <div class="section-card-actions">
          <button class="collapse-btn" data-collapse-exercise="${si}">${collapsed?'Fold ud':'Fold ind'}</button>
          <details class="section-card-menu"><summary aria-label="Flere handlinger">⋮</summary><div class="section-menu-popover">
            ${(!finisher||s.finisherMode==='format')?`<button data-edit-structure="${si}">Redigér struktur</button>`:''}
            <button data-edit-guidance="${si}">Redigér regler og trænertips</button>
            <div class="section-menu-divider"></div>
            <button data-ai-exercise-section="${si}">✨ Tilpas sektionen med AI</button>
            <button data-regenerate-section="${si}">Lav et helt nyt forslag</button>
            ${(!finisher||s.finisherMode==='format')?`<button data-suggest-one="${si}">Foreslå én øvelse</button>`:''}
            <div class="section-menu-divider"></div>
            <button data-move-up="${si}" ${canMoveUp?'':'disabled'}>Flyt op</button>
            <button data-move-down="${si}" ${canMoveDown?'':'disabled'}>Flyt ned</button>
            <button data-duplicate="${si}">Duplikér</button>
            <div class="section-menu-divider"></div>
            <button class="menu-danger" data-delete-section="${si}">Slet sektion</button>
          </div></details>
        </div>
      </div>
      <div class="section-expanded-content">
        ${finisher?renderFinisherEditor(s,si,fam):`
          <div class="exercise-list exercise-list-primary">${s.exercises?.length?s.exercises.map((it,ai)=>activityRow(it,si,ai,fam)).join(''):'<div class="empty">Ingen aktiviteter endnu.</div>'}</div>
          ${s.sectionPurpose==='Teknik'?renderFundamentalsPicker(s,si,true):''}
          ${s.rules?`<section class="section-guidance-card rules-card"><div class="guidance-icon">📋</div><div><h4>Regler</h4><p>${esc(s.rules)}</p></div></section>`:''}
          ${s.coachTips?`<section class="section-guidance-card coach-card"><div class="guidance-icon">💡</div><div><h4>Trænertips</h4><p>${esc(s.coachTips)}</p></div></section>`:''}
          <div class="section-add-row">
            <button data-add-ex="${si}">+ Tilføj øvelse</button>
            <button class="secondary" data-add-run="${si}">🏃 Tilføj løb</button>
          </div>`}
        <div class="section-library-row"><button class="secondary" data-save-exercise-element="${si}">Gem sektion i Mit bibliotek</button></div>
      </div>
    </article>`;
  }).join('');

  const host=$('#exerciseSections');
  host.querySelectorAll('[data-fundamental-section]').forEach(b=>b.onclick=()=>applyFundamentalToSection(+b.dataset.fundamentalSection,b.dataset.fundamentalKey));
  host.querySelectorAll('[data-collapse-exercise]').forEach(b=>b.onclick=()=>toggleSectionCollapse(+b.dataset.collapseExercise));
  host.querySelectorAll('[data-edit-structure]').forEach(b=>b.onclick=()=>{closeSectionMenuFrom(b);openSectionEditDialog(+b.dataset.editStructure,'structure')});
  host.querySelectorAll('[data-edit-guidance]').forEach(b=>b.onclick=()=>{closeSectionMenuFrom(b);openSectionEditDialog(+b.dataset.editGuidance,'guidance')});
  host.querySelectorAll('[data-move-up]').forEach(b=>b.onclick=()=>moveSection(+b.dataset.moveUp,+b.dataset.moveUp-1));
  host.querySelectorAll('[data-move-down]').forEach(b=>b.onclick=()=>moveSection(+b.dataset.moveDown,+b.dataset.moveDown+1));
  host.querySelectorAll('[data-duplicate]').forEach(b=>b.onclick=()=>duplicateSection(+b.dataset.duplicate));
  host.querySelectorAll('[data-delete-section]').forEach(b=>b.onclick=()=>deleteSectionWithConfirm(+b.dataset.deleteSection));
  host.querySelectorAll('[data-regenerate-section]').forEach(b=>b.onclick=()=>regenerateSectionWithConfirm(+b.dataset.regenerateSection));
  host.querySelectorAll('[data-add-ex]').forEach(b=>b.onclick=()=>openPicker(+b.dataset.addEx));
  host.querySelectorAll('[data-add-run]').forEach(b=>b.onclick=()=>openRunDialog(+b.dataset.addRun));
  host.querySelectorAll('[data-del-activity]').forEach(b=>b.onclick=()=>{
    const[a,c]=b.dataset.delActivity.split('-').map(Number);
    sections[a].exercises.splice(c,1);renderExerciseSections();renderFramework();updateReview();
  });
  host.querySelectorAll('[data-save-exercise-element]').forEach(b=>b.onclick=()=>saveSectionToLibrary(+b.dataset.saveExerciseElement));
  host.querySelectorAll('[data-ai-exercise-section]').forEach(b=>b.onclick=()=>{closeSectionMenuFrom(b);openAISectionDialog('section',+b.dataset.aiExerciseSection)});
  host.querySelectorAll('[data-suggest-one]').forEach(b=>b.onclick=()=>suggestOneExercise(+b.dataset.suggestOne));
  host.querySelectorAll('[data-finisher-mode]').forEach(select=>select.onchange=()=>changeFinisherMode(+select.dataset.finisherMode,select.value));
  host.querySelectorAll('[data-finisher-template]').forEach(select=>select.onchange=()=>applyFinisherTemplate(+select.dataset.finisherTemplate,select.value));
  host.querySelectorAll('[data-suggest-finisher]').forEach(button=>button.onclick=()=>applyFinisherTemplate(+button.dataset.suggestFinisher,suggestedFinisherTemplate(sections[+button.dataset.suggestFinisher]?.finisherMode||'all').id));
  host.querySelectorAll('[data-open-finisher-url]').forEach(button=>button.onclick=()=>openSongUrl(+button.dataset.openFinisherUrl));
  host.querySelectorAll('[data-finisher-field]').forEach(el=>{
    const event=el.tagName==='SELECT'?'change':'input';
    el.addEventListener(event,()=>{
      const i=+el.dataset.finisherIndex;
      const field=el.dataset.finisherField;
      const value=field==='songMinutes'?(+el.value||4):el.value;
      sections[i][field]=value;
      if(field==='songMinutes')sections[i].minutes=value;
      applySectionRules(sections[i]);updateTimeControl();updateReview();
    });
  });
  host.querySelectorAll('[data-inline-name]').forEach(input=>{
    input.oninput=()=>{sections[+input.dataset.inlineName].name=input.value;updateReview()};
    input.onchange=()=>renderFramework();
  });
  host.querySelectorAll('[data-inline-field]').forEach(el=>el.onchange=()=>{
    const i=+el.dataset.inlineIndex,field=el.dataset.inlineField;
    if(field==='sectionPurpose'){applyPurposeDefaults(i,el.value);renderFramework();renderExerciseSections();updateReview();return;}
    sections[i][field]=['minutes','work','rest','rounds','timeCap','ladderStart','ladderStep','ladderEnd'].includes(field)?(+el.value||0):el.value;
    applySectionRules(sections[i]);renderFramework();renderExerciseSections();updateReview();
  });
  bindExerciseInfoButtons(host);
  updateTimeControl();
  bindActivityInputs();
}
function compactMetricSize(value,type='text'){
  if(type==='number')return 5;
  const length=String(value??'').trim().length;
  return Math.min(18,Math.max(5,length+2));
}
function metricInput(label,key,value,si,ei,type='text',options=[]){
  if(options.length)return `<label class="compact-metric-label">${label}<select class="compact-metric-control" data-metric="${si}-${ei}-${key}">${options.map(x=>`<option ${x===value?'selected':''}>${x}</option>`).join('')}</select></label>`;
  return `<label class="compact-metric-label">${label}<input class="compact-metric-control" data-metric="${si}-${ei}-${key}" type="${type}" size="${compactMetricSize(value,type)}" value="${esc(value||'')}"></label>`;
}
function exerciseFieldContext(ex,rawSection,trainingType=selectedTrainingType()){
  const section=rawSection||{};
  const text=normalizeText(`${ex?.name||''} ${ex?.category||''} ${(ex?.focus||[]).join(' ')} ${(ex?.bodyAreas||[]).join(' ')}`);
  const equipment=(ex?.equipment||[]).map(normalizeText);
  const format=section.format||'';
  const repetitionModel=section.repetitionModel||'';
  const setBased=format==='Sætbaseret';
  const technique=format==='Kvalitetsarbejde'||section.sectionPurpose==='Teknik';
  const intervals=format==='Intervaller';
  const commonFlow=format==='Fælles flow';
  const weighted=equipment.some(value=>['kettlebell','håndvægt','medicinbold','sandsæk','vægtskive','slæde'].some(token=>value.includes(token)))||/\b(kettlebell|dumbbell|kb |db |wall ball|sandbag|sandsæk|slæde|vægt)\b/.test(text);
  const ergometer=String(ex?.category||'').toLowerCase()==='ergometer'||equipment.some(value=>value.includes('romaskine')||value.includes('skierg'))||/\b(row|rowing|ski erg|skierg|romaskine)\b/.test(text);
  const carry=String(ex?.category||'').toLowerCase()==='carry'||/\b(carry|bære|suitcase|farmer)\b/.test(text);
  const locomotion=carry||ergometer||['kondition','agility','motorik','reaktion'].includes(String(ex?.category||'').toLowerCase())||/\b(crawl|shuttle|løb|run|sprint|slæde skub|sled push|sled pull|broad jump)\b/.test(text);
  const hold=String(ex?.category||'').toLowerCase().includes('isometrisk')||/\b(plank|wall sit|hollow hold|dead hang|isometrisk|statisk hold|hold)\b/.test(text);
  const explosive=['power','plyometri','jump/land'].includes(String(ex?.category||'').toLowerCase())||/\b(jump|hop|slam|clean|snatch|swing|burpee|kast)\b/.test(text);
  const conditioning=ergometer||locomotion||['kondition','agility','motorik','reaktion','core puls'].includes(String(ex?.category||'').toLowerCase());
  const unilateral=/\b(enarms|enarm|enbens|enben|single|ensidig|pr side|sideplanke|suitcase|split squat|lunge|step-up)\b/.test(text);

  let quantity='reps';
  if(repetitionModel==='Tid pr. øvelse'||hold)quantity='time';
  else if(repetitionModel==='Distance pr. øvelse'||locomotion)quantity='distance';
  if(intervals&&quantity==='time')quantity='none'; // Arbejdstiden styres allerede på sektionsniveau.
  if(commonFlow)quantity='none';

  const showTempo=(setBased||technique)&&!explosive&&!conditioning&&!hold;
  return {
    trainingType,weighted,ergometer,carry,locomotion,hold,explosive,conditioning,unilateral,
    quantity,showSets:setBased,showPause:setBased,showTempo,
    sectionControlsTiming:['AMRAP','EMOM','Intervaller','Fast antal runder','For time'].includes(format)
  };
}
function quantityFieldLabel(context,section){
  if(context.quantity==='distance')return context.ergometer?'Meter':'Distance';
  if(context.quantity==='time')return 'Tid';
  if(section?.format==='EMOM')return 'Reps pr. tidsblok';
  if(section?.format==='Intervaller')return 'Mål pr. interval';
  return 'Reps';
}
function visibleMetricDefinitions(it,ex,section,trainingType=selectedTrainingType()){
  it.metrics=it.metrics||{};
  const m=it.metrics,context=exerciseFieldContext(ex,section,trainingType),fields=[];
  const add=(label,key,value,type='text',options=[])=>fields.push({label,key,value,type,options});

  if(trainingType==='adult'){
    if(context.weighted)add('Kg','weight',m.weight);
    if(context.quantity!=='none')add(quantityFieldLabel(context,section),'reps',m.reps);
    if(context.showSets)add('Sæt','sets',m.sets,'number');
    if(context.showTempo)add('Tempo','tempo',m.tempo);
    if(context.showPause)add('Pause','pause',m.pause);
  }else if(trainingType==='hiit'){
    if(context.weighted)add('Kg','weight',m.weight);
    if(context.quantity!=='none')add(quantityFieldLabel(context,section),'reps',m.reps);
    add('Intensitet','intensity',m.intensity||'Høj','text',['Moderat','Høj','Maksimal']);
  }else if(trainingType==='hyrox'){
    if(context.weighted)add('Kg','weight',m.weight);
    if(context.ergometer)add('Meter','ergMeters',m.ergMeters||m.reps,'number');
    else if(context.quantity==='distance')add('Distance','distance',m.distance||m.reps);
    else if(context.quantity!=='none')add(quantityFieldLabel(context,section),'reps',m.reps);
  }else if(trainingType==='trx'){
    add('Kropsvinkel','bodyAngle',m.bodyAngle||'Mellem','text',['Let','Mellem','Stejl']);
    if(context.quantity!=='none')add(quantityFieldLabel(context,section),'repsOrTime',m.repsOrTime||m.reps);
    if(context.showTempo)add('Tempo','tempo',m.tempo);
    if(context.unilateral)add('Udførelse','laterality',m.laterality||'Ensidig','text',['Tosidig','Ensidig']);
  }
  return {context,fields};
}
function renderMetricFields(fields,si,ei){
  return fields.map(field=>metricInput(field.label,field.key,field.value,si,ei,field.type,field.options)).join('');
}
function trainingFields(it,si,ei){
  const type=selectedTrainingType();
  if(!['adult','hiit','hyrox','trx'].includes(type))return '';
  const ex=exercises.find(item=>item.id===it.exerciseId);
  const section=normalizeSection(sections[si]);
  const {fields}=visibleMetricDefinitions(it,ex,section,type);
  if(!fields.length)return '';
  return `<div class="type-fields contextual-fields compact-metric-fields">${renderMetricFields(fields,si,ei)}</div>`;
}

function runActivityRow(it,si,ai){
  return `<div class="exercise-row run-activity">
    <div class="run-activity-head">
      <div class="run-icon">🏃</div>
      <div><strong>${esc(it.runType)}</strong><small>${esc(`${it.value} ${it.unit} · ${it.intensity}`)}</small></div>
      <button class="ghost activity-remove-btn" data-del-activity="${si}-${ai}">Fjern</button>
    </div>
    <div class="type-fields run-fields">
      <label>Type<select data-run-field="runType" data-run-index="${si}-${ai}">${['Almindeligt løb','Jog','Sprint','Shuttle run','Zigzag mellem kegler','Slalom','Baglæns løb','Sidestep','Bakkeløb','Trappeløb','Stafetløb','Reaktionsløb'].map(x=>`<option ${x===it.runType?'selected':''}>${x}</option>`).join('')}</select></label>
      <label>Mængde<input data-run-field="value" data-run-index="${si}-${ai}" type="number" min="1" value="${it.value}"></label>
      <label>Enhed<select data-run-field="unit" data-run-index="${si}-${ai}">${['meter','sekunder','minutter','omgange'].map(x=>`<option ${x===it.unit?'selected':''}>${x}</option>`).join('')}</select></label>
      <label>Intensitet<select data-run-field="intensity" data-run-index="${si}-${ai}">${['Roligt','Moderat','Hurtigt','Sprint','Progressivt'].map(x=>`<option ${x===it.intensity?'selected':''}>${x}</option>`).join('')}</select></label>
      <label class="span-2">Rute<input data-run-field="route" data-run-index="${si}-${ai}" value="${esc(it.route)}"></label>
      <label class="span-2">Note<input data-run-field="note" data-run-index="${si}-${ai}" value="${esc(it.note)}"></label>
    </div>
  </div>`;
}

function exerciseInfoButton(exerciseId,label='Vis beskrivelse'){
  if(!exerciseId)return '';
  return `<button type="button" class="exercise-info-btn" data-exercise-info="${esc(exerciseId)}" title="${esc(label)}" aria-label="${esc(label)}">?</button>`;
}
function exerciseInfoSection(title,text,kind=''){
  if(!text||String(text).trim()==='')return '';
  return `<section class="exercise-info-section ${kind?`info-${kind}`:''}"><h3>${esc(title)}</h3><p>${esc(String(text))}</p></section>`;
}
function exerciseInfoList(title,items=[]){
  const values=(items||[]).filter(Boolean);
  if(!values.length)return '';
  return `<section class="exercise-info-section"><h3>${esc(title)}</h3><p>${values.map(esc).join(' · ')}</p></section>`;
}
function openExerciseInfo(exerciseId){
  const ex=exercises.find(x=>x.id===exerciseId);
  if(!ex)return alert('Beskrivelsen af denne øvelse kunne ikke findes.');

  const content=$('#exerciseInfoContent');
  content.innerHTML=`
    <div class="exercise-info-header">
      <p class="eyebrow">ØVELSESBESKRIVELSE</p>
      <h2>${esc(ex.name||'Ukendt øvelse')}</h2>
      <div class="exercise-info-badges">
        ${ex.category?`<span>${esc(ex.category)}</span>`:''}
        ${ex.difficulty?`<span>${esc(ex.difficulty)}</span>`:''}
        ${ex.intensity?`<span>${esc(ex.intensity)} intensitet</span>`:''}
      </div>
    </div>
    ${exerciseInfoSection('🎯 Sådan udføres øvelsen',ex.description||'Der er endnu ikke skrevet en beskrivelse til denne øvelse.','primary')}
    ${exerciseInfoSection('🟠 Junior – forslag',ex.junior)}
    ${exerciseInfoSection('🔵 Voksen – forslag',ex.adult)}
    ${exerciseInfoSection('↘ Gør den lettere',ex.easier)}
    ${exerciseInfoSection('↗ Gør den sværere',ex.harder)}
    ${exerciseInfoSection('⚠️ Typiske fejl',ex.mistakes,'warning')}
    ${exerciseInfoList('Træner især',ex.bodyAreas)}
    ${exerciseInfoList('Udstyr',ex.equipment)}
    ${exerciseInfoList('Passer til',ex.trainingForms||ex.styles)}
  `;
  $('#exerciseInfoDialog').showModal();
}
function bindExerciseInfoButtons(host=document){
  host.querySelectorAll('[data-exercise-info]').forEach(button=>{
    button.onclick=()=>openExerciseInfo(button.dataset.exerciseInfo);
  });
  host.querySelectorAll('[data-adult-exercise-info]').forEach(button=>{
    button.onclick=()=>{
      const select=host.querySelector(`[data-aex="${button.dataset.adultExerciseInfo}"]`);
      if(select)openExerciseInfo(select.value);
    };
  });
}

function audiencePrescriptionFields(it,ex,section,audience,si,ai){
  const context=exerciseFieldContext(ex,section,audience==='adult'?'adult':'junior');
  const prefix=audience==='adult'?'Voksen':'Junior';
  const fields=[];
  if(context.weighted){
    const key=audience==='adult'?'akg':'jkg',value=audience==='adult'?it.adultKg:it.juniorKg;
    fields.push(`<label>${prefix} kg<input data-${key}="${si}-${ai}" value="${esc(value||'')}"></label>`);
  }
  if(context.quantity!=='none'){
    const key=audience==='adult'?'areps':'jreps',value=audience==='adult'?it.adultReps:it.juniorReps;
    fields.push(`<label>${prefix} ${quantityFieldLabel(context,section).toLowerCase()}<input data-${key}="${si}-${ai}" value="${esc(value||'')}"></label>`);
  }
  const noteKey=audience==='adult'?'anote':'jnote',noteValue=audience==='adult'?it.adultNote:it.juniorNote;
  fields.push(`<label>${prefix} note<input data-${noteKey}="${si}-${ai}" value="${esc(noteValue||'')}"></label>`);
  return fields.join('');
}
function exerciseActivityRow(it,si,ai,fam){
  const ex=exercises.find(x=>x.id===it.exerciseId),type=selectedTrainingType();
  const section=normalizeSection(sections[si]);
  const identity=`<div class="exercise-identity">
    <div><strong>${esc(ex?.name||'Ukendt')}</strong><small>${esc((ex?.bodyAreas||[]).join(' · '))}</small></div>
    ${exerciseInfoButton(ex?.id,`Vis beskrivelse af ${ex?.name||'øvelsen'}`)}
  </div>`;

  const juniorFields=['junior','family'].includes(type)?`<div class="exercise-main contextual-exercise-main">
    ${identity}
    ${audiencePrescriptionFields(it,ex,section,'junior',si,ai)}
    <button class="ghost activity-remove-btn" data-del-activity="${si}-${ai}">Fjern</button>
  </div>`:`<div class="exercise-main compact-exercise">${identity}<button class="ghost activity-remove-btn" data-del-activity="${si}-${ai}">Fjern</button></div>`;

  const adultExerciseId=it.adultExerciseId||it.exerciseId;
  const adultEx=exercises.find(x=>x.id===adultExerciseId)||ex;
  return `<div class="exercise-row">${juniorFields}${type==='family'?`<div class="adult-settings">
    <h4 class="family-adult-heading">Funktionel voksen</h4>
    <div class="adult-grid contextual-adult-grid">
    <label>Voksenøvelse
      <div class="adult-exercise-choice">
        <input data-aex-search="${si}-${ai}" list="adultExerciseOptions" value="${esc(adultEx?.name||'')}" placeholder="Søg efter voksenøvelse">
        <input type="hidden" data-aex="${si}-${ai}" value="${esc(adultExerciseId)}">
        <button type="button" class="exercise-info-btn" data-adult-exercise-info="${si}-${ai}" title="Vis beskrivelse af voksenøvelsen" aria-label="Vis beskrivelse af voksenøvelsen">?</button>
      </div>
    </label>
    ${audiencePrescriptionFields(it,adultEx,section,'adult',si,ai)}
  </div></div>`:''}${trainingFields(it,si,ai)}</div>`;
}
function activityRow(it,si,ai,fam){
  return it?.kind==='run'?runActivityRow(it,si,ai):exerciseActivityRow(it,si,ai,fam);
}


function bindActivityInputs(){
  const host=$('#exerciseSections');
  const bind=(sel,key,prop,ev='input')=>host.querySelectorAll(sel).forEach(e=>e['on'+ev]=()=>{
    const[a,b]=(e.dataset[key]).split('-').map(Number);
    sections[a].exercises[b][prop]=e.value;
  });
  host.querySelectorAll('[data-metric]').forEach(e=>{
    const resize=()=>{
      if(!e.classList.contains('compact-metric-control')||e.tagName==='SELECT'||e.type==='number')return;
      e.size=compactMetricSize(e.value,e.type);
    };
    e.oninput=resize;
    e.onchange=()=>{
      const [a,b,key]=e.dataset.metric.split('-');
      sections[+a].exercises[+b].metrics=sections[+a].exercises[+b].metrics||{};
      sections[+a].exercises[+b].metrics[key]=e.value;
      resize();
    };
  });
  host.querySelectorAll('[data-run-field]').forEach(e=>e.onchange=()=>{
    const [a,b]=e.dataset.runIndex.split('-').map(Number);
    const field=e.dataset.runField;
    sections[a].exercises[b][field]=field==='value'?(+e.value||1):e.value;
    renderFramework();updateReview();
  });
  bind('[data-jkg]','jkg','juniorKg');
  bind('[data-jreps]','jreps','juniorReps');
  bind('[data-jnote]','jnote','juniorNote');
  host.querySelectorAll('[data-aex-search]').forEach(input=>input.onchange=()=>{
    const [a,b]=input.dataset.aexSearch.split('-').map(Number);
    const query=normalizeText(input.value);
    const exact=exercises.find(ex=>normalizeText(ex.name)===query);
    const partial=exercises.find(ex=>normalizeText(ex.name).includes(query));
    const match=exact||partial;
    if(!match){
      const current=exercises.find(ex=>ex.id===(sections[a].exercises[b].adultExerciseId||sections[a].exercises[b].exerciseId));
      input.value=current?.name||'';
      return alert('Vælg en øvelse fra søgelisten.');
    }
    sections[a].exercises[b].adultExerciseId=match.id;
    const hidden=host.querySelector(`[data-aex="${a}-${b}"]`);
    if(hidden)hidden.value=match.id;
    input.value=match.name;
    renderExerciseSections();updateReview();
  });
  bind('[data-akg]','akg','adultKg');
  bind('[data-areps]','areps','adultReps');
  bind('[data-anote]','anote','adultNote');
}

function renderAdultExerciseOptions(){
  const host=$('#adultExerciseOptions');
  if(!host)return;
  host.innerHTML=[...exercises]
    .sort((a,b)=>a.name.localeCompare(b.name,'da'))
    .map(ex=>`<option value="${esc(ex.name)}"></option>`).join('');
}
function populatePickerFilters(){
  [...new Set(exercises.flatMap(x=>x.bodyAreas||[]))].sort().forEach(x=>$('#pickerBody').add(new Option(x,x)));
  [...new Set(exercises.flatMap(x=>x.styles||[]))].sort().forEach(x=>$('#pickerStyle').add(new Option(x,x)));
}
function openPicker(si){pickerSection=si;$('#pickerSearch').value='';renderPicker();$('#exercisePickerDialog').showModal()}
function renderPicker(){
  const q=$('#pickerSearch').value.toLowerCase(),body=$('#pickerBody').value,style=$('#pickerStyle').value,favOnly=$('#pickerFavorites').checked,favs=favorites();
  const list=exercises.filter(x=>{const h=[x.name,x.category,x.description,...(x.bodyAreas||[]),...(x.styles||[])].join(' ').toLowerCase();return(!q||h.includes(q))&&(!body||(x.bodyAreas||[]).includes(body))&&(!style||(x.styles||[]).includes(style))&&(!favOnly||favs.has(x.id))});
  $('#pickerGrid').innerHTML=list.map(x=>`<div class="picker-item">
    <div><strong>${esc(x.name)}</strong><small>${esc((x.bodyAreas||[]).join(' · '))}</small></div>
    <div class="picker-item-actions">
      ${exerciseInfoButton(x.id,`Vis beskrivelse af ${x.name}`)}
      <button data-pick="${x.id}">Tilføj</button>
    </div>
  </div>`).join('');
  bindExerciseInfoButtons($('#pickerGrid'));
  $('#pickerGrid').querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{sections[pickerSection].exercises=sections[pickerSection].exercises||[];sections[pickerSection].exercises.push({kind:'exercise',exerciseId:b.dataset.pick,juniorKg:'',juniorReps:'',juniorNote:'',adultExerciseId:b.dataset.pick,adultKg:'',adultReps:'',adultNote:''});$('#exercisePickerDialog').close();renderExerciseSections();updateReview()});
}
function createExercise(e){
  e.preventDefault();const d=Object.fromEntries(new FormData(e.target)),split=s=>s.split(',').map(x=>x.trim()).filter(Boolean);
  const x={id:'custom-'+crypto.randomUUID(),name:d.name,category:d.category,bodyAreas:split(d.bodyAreas),equipment:split(d.equipment),styles:split(d.styles),difficulty:d.difficulty,description:d.description,junior:d.junior,adult:d.adult};
  const all=customs();all.unshift(x);localStorage.setItem(CKEY,JSON.stringify(all));exercises=[x,...exercises];e.target.reset();$('#newExerciseDialog').close();renderPicker();
}




let runTargetSection=0;
let aiTargetSection=null;
function openRunDialog(sectionIndex){
  if(sections[sectionIndex]?.type==='Finisher'&&normalizeSection(sections[sectionIndex]).finisherMode==='song')return alert('En sangbaseret finisher kan ikke indeholde løb eller øvelser. Skift til Andet format først.');
  runTargetSection=sectionIndex;
  const preset=RUN_LIBRARY[2];
  $('#runPreset').innerHTML=RUN_LIBRARY.map(x=>`<option value="${x.id}">${esc(x.label)}</option>`).join('');
  $('#runPreset').value=preset.id;
  fillRunPreset(preset.id);
  $('#runDialog').showModal();
}
function fillRunPreset(id){
  const p=RUN_LIBRARY.find(x=>x.id===id)||RUN_LIBRARY[2];
  $('#runType').value=p.type;$('#runValue').value=p.value;$('#runUnit').value=p.unit;
  $('#runIntensity').value=p.intensity;$('#runRoute').value=p.route;$('#runNote').value='';
}
function submitRun(e){
  e.preventDefault();
  const item=normalizeActivity({
    kind:'run',runType:$('#runType').value,value:+$('#runValue').value||1,unit:$('#runUnit').value,
    intensity:$('#runIntensity').value,route:$('#runRoute').value.trim(),note:$('#runNote').value.trim()
  });
  sections[runTargetSection].exercises=sections[runTargetSection].exercises||[];
  sections[runTargetSection].exercises.push(item);
  $('#runDialog').close();renderExerciseSections();renderFramework();updateReview();
}
function renderInlineFundamentalChoices(selectedKeys=['squat']){
  const host=$('#inlineFundamentalChoices');if(!host)return;
  const selected=new Set(selectedKeys);
  host.innerHTML=Object.entries(FUNKFIT_FUNDAMENTALS).map(([key,f])=>`<label class="single-fundamental-option ${selected.has(key)?'selected':''}"><input type="checkbox" value="${key}" ${selected.has(key)?'checked':''}><span>${f.icon}</span><strong>${esc(f.label)}</strong><small>${esc(f.english)}</small></label>`).join('');
  host.querySelectorAll('input').forEach(input=>input.onchange=()=>{input.closest('label').classList.toggle('selected',input.checked);if(!host.querySelector('input:checked')){input.checked=true;input.closest('label').classList.add('selected')}});
}
function selectedInlineFundamentals(){return [...document.querySelectorAll('#inlineFundamentalChoices input:checked')].map(x=>x.value)}
function updateInlineAIFields(){
  const type=$('#aiSectionType').value;
  $('#aiGameTheme').closest('label').classList.toggle('hidden',type!=='Leg');
  $('#inlineFundamentalWrap').classList.toggle('hidden',type!=='Teknik'||!isJuniorFamilyContext());
  $('#inlineFinisherWrap').classList.toggle('hidden',type!=='Finisher');
  if(type==='Finisher')refreshFinisherForm('inline');
  $('#aiSectionFocus').closest('label').classList.toggle('hidden',type==='Finisher');
}
function openAISectionDialog(mode='section',target=null){
  aiTargetSection=Number.isInteger(target)?target:null;
  const isGame=mode==='game';
  const current=aiTargetSection!==null?normalizeSection(sections[aiTargetSection]):null;
  const type=isGame?'Leg':(current?.type==='Ledopvarmning'?'Opvarmning':current?.type||'AMRAP');
  $('#aiSectionDialogTitle').textContent=isGame?'🎲 Byg en leg':aiTargetSection!==null?'AI-forslag direkte i denne sektion':'Byg en sektion';
  $('#aiSectionType').value=type;$('#aiSectionType').disabled=isGame;
  $('#aiSectionMinutes').value=current?.minutes||(isGame?8:12);
  $('#aiSectionFocus').value=current?.description||'';$('#aiGameTheme').value='';
  $('#aiSectionContext').innerHTML=`<span>${esc(({junior:'FunkFit Junior',family:'Familie',adult:'Voksen',trx:'TRX',hyrox:'Hyrox',hiit:'HIIT'})[selectedTrainingType()]||selectedTrainingType())}</span><span>${plannerVenue==='indoor'?'Inde':'Ude'}</span><span>${+$('#participantCount').value||+$('#plannerParticipants').value||20} deltagere</span><span>${plannerEquipment.size} udstyrstyper</span>`;
  renderInlineFundamentalChoices(current?.fundamentalKeys?.length?current.fundamentalKeys:['squat']);
  if(current?.type==='Finisher')refreshFinisherForm('inline',current);
  else{byId('inlineFinisherMode').value='song';refreshFinisherForm('inline');$('#inlineFinisherTitle').value='';$('#inlineFinisherArtist').value='';$('#inlineFinisherMinutes').value=4;$('#inlineFinisherUrl').value='';}
  $('#aiSectionDialog').dataset.mode=isGame?'game':'section';updateInlineAIFields();$('#aiSectionDialog').showModal();
}

function submitAISection(e){
  e.preventDefault();
  const type=$('#aiSectionDialog').dataset.mode==='game'?'Leg':$('#aiSectionType').value;
  const minutes=+$('#aiSectionMinutes').value||12;
  const focus=$('#aiSectionFocus').value.trim();const theme=$('#aiGameTheme').value.trim();
  let section=type==='Finisher'
    ?finisherFromForm('inline')
    :type==='Teknik'&&isJuniorFamilyContext()?buildFundamentalSection(selectedInlineFundamentals(),minutes)
    :buildSectionSuggestion(type,minutes,focus,theme);
  if(aiTargetSection!==null){sections[aiTargetSection]=section;}
  else if(type==='Finisher'){
    const existing=sections.findIndex(s=>normalizeSection(s).sectionPurpose==='Finisher');
    if(existing>=0)sections[existing]=section;else sections.push(section);
  }else{const fi=sections.findIndex(s=>normalizeSection(s).sectionPurpose==='Finisher');fi<0?sections.push(section):sections.splice(fi,0,section);}
  enforceWorkoutStructure();$('#aiSectionDialog').close();renderFramework();renderExerciseSections();updateReview();
}

function bindPlanner(){
  renderEquipmentChoices();
  document.querySelectorAll('#conceptChoices .choice-card').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#conceptChoices .choice-card').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');plannerConcept=b.dataset.value;
    if(plannerConcept==='trx'){plannerEquipment=new Set(loadEquipmentProfile('trx'));renderEquipmentChoices()}
    const family=plannerConcept==='family';
    $('#plannerAdultsWrap').classList.toggle('hidden',!family);
    $('#familyMode').checked=family;
    $('#adultCountLabel').classList.toggle('hidden',!family);
    $('#plannerThemeWrap').classList.toggle('hidden',!['junior','family'].includes(plannerConcept));
    $('#includeGame').closest('label').classList.toggle('hidden',!['junior','family'].includes(plannerConcept));
    if(plannerConcept==='adult'||plannerConcept==='trx'||plannerConcept==='hyrox'||plannerConcept==='hiit'){
      $('#participantCount').value=$('#plannerParticipants').value;
    }
    updateSingleFundamentalVisibility();
    renderFramework();
    renderExerciseSections();
  });
  document.querySelectorAll('#venueChoices .choice-card').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#venueChoices .choice-card').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');plannerVenue=b.dataset.value;
    plannerEquipment=new Set(loadEquipmentProfile(plannerVenue));
    $('#venueHint').textContent=plannerVenue==='indoor'
      ?'Indendørs profil: gulv, vægge, bokse, måtter og salens udstyr.'
      :'Udendørs profil: containerudstyr, løbeområde, slæder, sandsække og større redskaber.';
    $('#equipmentProfileText').textContent=plannerVenue==='indoor'?'Standardprofil: Gymnastiksalen':'Standardprofil: Containeren';
    renderEquipmentChoices();
  });
  document.querySelectorAll('#goalChoices .goal-chip').forEach(b=>b.onclick=()=>b.classList.toggle('selected'));
  $('#selectAllEquipmentBtn').onclick=()=>{
    const all=[...new Set(exercises.flatMap(x=>x.equipment||[]).concat(EQUIPMENT_PROFILES.indoor,EQUIPMENT_PROFILES.outdoor,EQUIPMENT_PROFILES.trx))];
    plannerEquipment.size===all.length?plannerEquipment.clear():all.forEach(x=>plannerEquipment.add(x));
    persistEquipmentProfile(plannerVenue,[...plannerEquipment]);
    renderEquipmentChoices();
  };
  $('#resetEquipmentProfileBtn').onclick=()=>{
    if(confirm('Vil du nulstille udstyrsprofilen til standardlisten for dette sted?'))resetEquipmentProfile(plannerVenue);
  };
  $('#generateSmartWorkoutBtn').onclick=()=>creationMode==='section'?generateSingleSectionFromPlanner():generateSmartWorkout();
  $('#singleSectionType').onchange=updateSingleFundamentalVisibility;
  $('#plannerDuration').oninput=updateTimeControl;
  updateSingleFundamentalVisibility();
}
function renderEquipmentChoices(){
  if(!$('#equipmentChoices'))return;
  const standard=defaultEquipmentProfile(plannerVenue);
  const fromExercises=[...new Set(exercises.flatMap(x=>x.equipment||[]))];
  const all=[...new Set([...standard,...plannerEquipment,...fromExercises])].sort((a,b)=>{
    const ai=standard.includes(a)?0:1,bi=standard.includes(b)?0:1;
    return ai-bi||a.localeCompare(b,'da');
  });
  const profileNames={indoor:'Gymnastiksalen',outdoor:'Containeren/udeområdet',trx:'TRX-profilen'};
  const custom=Array.isArray(equipmentProfiles()[plannerVenue]);
  $('#equipmentProfileText').textContent=`${custom?'Din gemte profil':'Standardprofil'}: ${profileNames[plannerVenue]||'Udstyr'}`;
  $('#equipmentProfileStatus').textContent=`${plannerEquipment.size} valgte typer · ændringer gemmes automatisk.`;
  $('#equipmentChoices').innerHTML=all.map(eq=>`<label class="equipment-option ${plannerEquipment.has(eq)?'active':''}">
    <input type="checkbox" data-equipment="${esc(eq)}" ${plannerEquipment.has(eq)?'checked':''}>${esc(eq)}
  </label>`).join('');
  $('#equipmentChoices').querySelectorAll('[data-equipment]').forEach(c=>c.onchange=()=>{
    c.checked?plannerEquipment.add(c.dataset.equipment):plannerEquipment.delete(c.dataset.equipment);
    c.closest('.equipment-option').classList.toggle('active',c.checked);
    persistEquipmentProfile(plannerVenue,[...plannerEquipment]);
    $('#equipmentProfileStatus').textContent=`${plannerEquipment.size} valgte typer · gemt automatisk.`;
  });
}

function goalValues(){return [...document.querySelectorAll('#goalChoices .goal-chip.selected')].map(x=>x.dataset.value)}
function exerciseAvailable(ex){
  const req=ex.equipment||['Kropsvægt'];
  return req.some(eq=>eq==='Kropsvægt'||plannerEquipment.has(eq));
}
function normalizedIntentTerms(values=[]){
  const raw=(values||[]).filter(Boolean).join(' ').toLowerCase();
  const cleaned=raw
    .replace(/[.,;:!?()\/+-]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
  const terms=new Set(cleaned.split(' ').filter(x=>x.length>2));

  const synonymGroups={
    core:['core','mave','maven','mavemuskler','abs','abdominal','bugstabilitet'],
    kondition:['kondition','kondi','cardio','puls'],
    styrke:['styrke','stærk','styrketræning'],
    samarbejde:['samarbejde','makker','team','hold'],
    eksplosivitet:['eksplosivitet','eksplosiv','power'],
    balance:['balance','stabilitet'],
    teknik:['teknik','teknisk'],
    reaktion:['reaktion','reaktionstid','react','lights','reaktionslys'],
    koordination:['koordination','koordineret','motorik','agility']
  };
  Object.entries(synonymGroups).forEach(([canonical,words])=>{
    if(words.some(word=>cleaned.includes(word)))terms.add(canonical);
  });
  return [...terms];
}
function exerciseHaystack(ex){
  return [ex.name,ex.category,ex.intensity,...(ex.focus||[]),...(ex.bodyAreas||[]),...(ex.styles||[]),...(ex.format||[]),...(ex.trainingForms||[])]
    .join(' ').toLowerCase();
}
function isPrimaryCoreExercise(ex){
  const name=(ex.name||'').toLowerCase();
  const category=(ex.category||'').toLowerCase();
  const primaryNames=['plank','sit-up','situp','dead bug','hollow','russian twist','v-up','crunch','bird dog','mountain climber','knee tuck','bear crawl'];
  return category.includes('core')||primaryNames.some(word=>name.includes(word));
}
function strongCoreRequest(values=[]){
  const text=(values||[]).filter(Boolean).join(' ').toLowerCase();
  const coreWord='(?:mave(?:muskler)?|core|abs|abdominal)';
  return new RegExp(`(?:masser\\s+af|meget|mange|ekstra|primært|primært fokus på|hovedfokus på|fokus på)\\s+(?:\\w+\\s+){0,2}${coreWord}`).test(text)
    ||new RegExp(`${coreWord}\\s+(?:skal fylde|i fokus|som hovedfokus)`).test(text);
}
function scoreExercise(ex,goals,sectionType){
  let score=0;
  const hay=exerciseHaystack(ex);
  const terms=normalizedIntentTerms(goals);

  terms.forEach(term=>{
    if(term==='core'){
      if(isPrimaryCoreExercise(ex))score+=12;
      else if(hay.includes('core'))score+=4;
    }else if(hay.includes(term)){
      score+=4;
    }
  });

  if(strongCoreRequest(goals)){
    if(isPrimaryCoreExercise(ex))score+=28;
    else if(hay.includes('core'))score+=5;
  }
  if(sectionType==='warmup'&&(hay.includes('kondition')||hay.includes('koordination')||hay.includes('agility')||hay.includes('kropsvægt')))score+=5;
  if(sectionType==='main'&&(hay.includes('funktionel')||hay.includes('styrke')||hay.includes('helkrop')))score+=3;
  if(sectionType==='team'&&(hay.includes('makker')||hay.includes('stafet')||hay.includes('teamchallenge')))score+=7;
  if((goals||[]).join(' ').toLowerCase().match(/reaktion|react lights|reaktionslys|koordination|agility/)
      &&(ex.equipment||[]).includes('React Lights'))score+=14;
  if(plannerConcept==='trx'&&(hay.includes('trx')||(ex.equipment||[]).includes('TRX')))score+=12;
  if(plannerConcept==='hyrox'&&hay.includes('hyrox'))score+=8;
  if(plannerConcept==='hiit'&&hay.includes('hiit'))score+=8;
  if(plannerConcept==='adult'&&(ex.audience||[]).includes('Voksen'))score+=2;
  if(plannerVenue==='outdoor'&&(hay.includes('løb')||hay.includes('carry')||hay.includes('stafet')))score+=3;
  if(plannerVenue==='indoor'&&(ex.equipment||[]).some(x=>['Måtte','Boks','Bænk','Væg'].includes(x)))score+=2;
  if(avoidWaitingEnabled()&&(+$('#plannerParticipants')?.value||20)>=16){
    const equipment=ex.equipment||['Kropsvægt'];
    const queueFriendly=['Kropsvægt','Måtte','Kegler','Elastik','Væg','Løbebane'];
    if(equipment.some(item=>!queueFriendly.includes(item)))score-=5;
    if(equipment.every(item=>queueFriendly.includes(item)))score+=3;
  }
  if($('#useFavoritesFirst').checked&&favorites().has(ex.id))score+=10;

  const recent=aiHistory().flatMap(x=>x.exerciseIds||[]);
  const uses=recent.filter(id=>id===ex.id).length;
  score-=uses*3.5;
  const jitter=(Math.sin((Date.now()/86400000)+(ex.id||'').length*17)+1)*0.9;
  return score+jitter;
}
function exerciseMovementPattern(ex){
  const category=normalizeText(ex?.category||'');
  const hay=normalizeText(`${ex?.name||''} ${ex?.category||''} ${(ex?.focus||[]).join(' ')} ${(ex?.bodyAreas||[]).join(' ')}`);

  if(/squat|isometrisk ben/.test(category)||/\bsquat\b|wall sit/.test(hay))return 'squat';
  if(/hinge|bagkæde|bagkaede/.test(category)||/deadlift|dødløft|dodloft|good morning|kettlebell swing|\bhinge\b/.test(hay))return 'hinge';
  if(/lunge/.test(category)||/lunge|step-up|step up/.test(hay))return 'lunge';
  if(/pull|træk|traek|trx træk|trx traek/.test(category)||/\brow\b|roning|pull-up|pull up|træk|traek/.test(hay))return 'pull';
  if(/push|pres|skulder|trx arme|trx skulder/.test(category)||/push-up|push up|shoulder press|overhead press|\bdip\b/.test(hay))return 'push';
  if(/carry/.test(category)||/carry|bære|baere|slæde|slaede/.test(hay))return 'carry';
  if(/jump|plyometri/.test(category)||/\bhop\b|jump|broad jump|box jump|line hops/.test(hay))return 'jump';
  if(/kondition|ergometer|agility|motorik|reaktion/.test(category)||/løb|loeb|\brun\b|shuttle|sprint|bike|cykel|romaskine|ski erg|ergometer/.test(hay))return 'locomotion';
  if(/core|rotation/.test(category)||/plank|sit-up|situp|dead bug|hollow|crunch|v-up|russian twist|bird dog|knee tuck|mountain climber/.test(hay))return 'core';
  if(/helkrop|power|makker/.test(category)||/burpee|thruster|devil press|slam/.test(hay))return 'full-body';
  if(/ben|balder|balance/.test(category))return 'lower-other';
  return 'other';
}
function exercisePrimaryArea(ex){
  const pattern=exerciseMovementPattern(ex);
  if(['squat','hinge','lunge','jump','lower-other'].includes(pattern))return 'underkrop';
  if(['push','pull'].includes(pattern))return 'overkrop';
  if(pattern==='core')return 'core';
  if(pattern==='locomotion')return 'kondition';
  if(['carry','full-body'].includes(pattern))return 'helkrop';
  const category=normalizeText(ex?.category||'');
  if(/trx ben|trx balder|ben|balder/.test(category))return 'underkrop';
  if(/trx arme|trx skulder|skulder|pres|træk|traek/.test(category))return 'overkrop';
  return 'andet';
}
function requestedBalanceFocus(goals,pattern,area){
  const text=normalizeText((goals||[]).filter(Boolean).join(' '));
  const aliases={
    squat:['squat','ben','underkrop'],
    hinge:['hinge','bagkæde','bagkaede','baglår','baglar','balder'],
    lunge:['lunge','udfald','ben','underkrop'],
    push:['push','pres','bryst','triceps','skulder','overkrop'],
    pull:['pull','træk','traek','ryg','biceps','overkrop'],
    carry:['carry','bære','baere','greb'],
    jump:['hop','spring','plyometri','eksplosiv'],
    locomotion:['kondition','puls','løb','loeb','sprint','cardio'],
    core:['core','mave','abs','stabilitet'],
    'full-body':['helkrop','hele kroppen'],
    underkrop:['ben','underkrop','balder'],
    overkrop:['overkrop','skulder','arme','bryst','ryg'],
    kondition:['kondition','puls','løb','loeb','cardio'],
    helkrop:['helkrop','hele kroppen']
  };
  return [...(aliases[pattern]||[]),...(aliases[area]||[])].some(word=>text.includes(word));
}
function workoutBalanceCounts(){
  const patterns={},areas={};
  sections.forEach(section=>{
    if(normalizeSection(section).sectionPurpose==='Ledopvarmning')return;
    (section.exercises||[]).forEach(item=>{
      if(item.kind==='run'){
        patterns.locomotion=(patterns.locomotion||0)+1;
        areas.kondition=(areas.kondition||0)+1;
        return;
      }
      const ex=exercises.find(x=>x.id===item.exerciseId);
      if(!ex)return;
      const pattern=exerciseMovementPattern(ex);
      const area=exercisePrimaryArea(ex);
      patterns[pattern]=(patterns[pattern]||0)+1;
      areas[area]=(areas[area]||0)+1;
    });
  });
  return {patterns,areas};
}
function adjustedBalanceScore(entry,chosen,goals,type,globalCounts,targetBucket=''){
  const ex=entry.ex;
  const pattern=exerciseMovementPattern(ex);
  const area=exercisePrimaryArea(ex);
  const localPattern=chosen.filter(item=>exerciseMovementPattern(item)===pattern).length;
  const localArea=chosen.filter(item=>exercisePrimaryArea(item)===area).length;
  const explicit=requestedBalanceFocus(goals,pattern,area);
  let score=entry.score;

  if(!explicit){
    score-=localPattern*11;
    score-=localArea*8;
    if(localPattern>=2)score-=40;
    if(localArea>=2)score-=28;
    score-=(globalCounts.patterns[pattern]||0)*1.8;
    score-=(globalCounts.areas[area]||0)*1.1;
  }

  if(type==='warmup'){
    const bucket=warmupBalanceBucket(ex);
    if(targetBucket&&bucket===targetBucket)score+=30;
    if(pattern==='core'&&localPattern>=1&&!explicit)score-=24;
    if(area==='overkrop'&&localArea>=1&&!explicit)score-=12;
  }
  return score;
}
function warmupBalanceBucket(ex){
  const pattern=exerciseMovementPattern(ex);
  const area=exercisePrimaryArea(ex);
  if(pattern==='locomotion'||pattern==='jump')return 'kondition';
  if(area==='underkrop')return 'underkrop';
  if(area==='overkrop')return 'overkrop';
  if(['core','helkrop'].includes(area))return 'core-helkrop';
  return 'andet';
}
function chooseBestBalanced(ranked,chosen,goals,type,globalCounts,targetBucket=''){
  const available=ranked.filter(entry=>!chosen.some(item=>item.id===entry.ex.id));
  const target=targetBucket?available.filter(entry=>warmupBalanceBucket(entry.ex)===targetBucket):available;
  const pool=target.length?target:available;
  return pool
    .map(entry=>({entry,score:adjustedBalanceScore(entry,chosen,goals,type,globalCounts,targetBucket)}))
    .sort((a,b)=>b.score-a.score)[0]?.entry.ex||null;
}
function pickBalancedWarmup(ranked,count,goals,globalCounts){
  const chosen=[];
  const targets=['kondition','underkrop','overkrop','core-helkrop'];
  targets.slice(0,count).forEach(target=>{
    const ex=chooseBestBalanced(ranked,chosen,goals,'warmup',globalCounts,target);
    if(ex)chosen.push(ex);
  });
  while(chosen.length<count){
    const ex=chooseBestBalanced(ranked,chosen,goals,'warmup',globalCounts);
    if(!ex)break;
    chosen.push(ex);
  }
  return chosen.slice(0,count);
}
function pickBalancedGeneral(ranked,count,goals,type,globalCounts){
  const chosen=[];
  while(chosen.length<count){
    const ex=chooseBestBalanced(ranked,chosen,goals,type,globalCounts);
    if(!ex)break;
    chosen.push(ex);
  }
  return chosen;
}
function pickExercises(count,goals,type,used=new Set()){
  const ranked=exercises.filter(ex=>exerciseAvailable(ex)&&!used.has(ex.id))
    .map(ex=>({ex,score:scoreExercise(ex,goals,type)}))
    .sort((a,b)=>b.score-a.score);

  if(strongCoreRequest(goals)){
    const requiredCore=Math.min(count,Math.max(2,Math.ceil(count*.65)));
    const chosen=ranked.filter(x=>isPrimaryCoreExercise(x.ex)).slice(0,requiredCore);
    const chosenIds=new Set(chosen.map(x=>x.ex.id));
    ranked.filter(x=>!chosenIds.has(x.ex.id)).slice(0,count-chosen.length).forEach(x=>chosen.push(x));
    return chosen.slice(0,count).map(x=>x.ex);
  }

  const globalCounts=workoutBalanceCounts();
  if(type==='warmup')return pickBalancedWarmup(ranked,count,goals,globalCounts);
  return pickBalancedGeneral(ranked,count,goals,type,globalCounts);
}
function suggestedWeight(ex,adult=false){
  const equipment=(ex.equipment||[]).join(' ').toLowerCase();const hay=exerciseHaystack(ex);
  if(!/(dumbbell|kettlebell|kb|wall ball|wallball|vægt|barbell|sandbag)/.test(`${equipment} ${hay}`))return '';
  if(/carry|deadlift|dødløft|hinge/.test(hay))return adult?'Moderat (ca. 12–32 kg)':'Let/moderat (ca. 4–12 kg)';
  if(/wall ball|wallball/.test(`${equipment} ${hay}`))return adult?'Ca. 4–9 kg':'Ca. 2–4 kg';
  return adult?'Moderat (ca. 6–16 kg)':'Let (ca. 2–6 kg)';
}
function splitPrescription(ex,adult=false){
  let text=(adult?(ex.adult||'8-15 gentagelser'):(ex.junior||'8-12 gentagelser')).replace(/\.$/,'');
  const mentionsWeight=/(let|moderat|tung)\s+vægt|\d+(?:[.,]\d+)?\s*kg/i.test(text);
  text=text.replace(/med\s+(?:en\s+)?(?:let|moderat|tung)\s+vægt/ig,'').replace(/(?:let|moderat|tung)\s+vægt\s+(?:og|,)?\s*/ig,'').replace(/\s{2,}/g,' ').replace(/^og\s+/i,'').trim();
  return {reps:text||'8-12 gentagelser',weight:mentionsWeight?suggestedWeight(ex,adult):suggestedWeight(ex,adult)};
}
function prescriptionFor(ex,adult=false){return splitPrescription(ex,adult).reps}
function makeItem(ex){
  const junior=splitPrescription(ex,false),adult=splitPrescription(ex,true);
  return {
    exerciseId:ex.id,
    juniorKg:junior.weight,juniorReps:junior.reps,juniorNote:'',
    adultExerciseId:ex.id,adultKg:adult.weight,adultReps:adult.reps,adultNote:'',
    metrics:{
      weight:'',reps:'',sets:'3',tempo:'',pause:'',
      work:'40',rest:'20',rounds:'3',intensity:'Høj',
      distance:'',ergMeters:'',runDistance:'',
      bodyAngle:'Mellem',repsOrTime:prescriptionFor(ex,true),laterality:'Tosidig'
    }
  };
}



function selectedSingleFundamentals(){
  const selected=[...document.querySelectorAll('#singleFundamentalChoices input:checked')].map(x=>x.value);
  return selected.length?selected:['squat'];
}
function renderSingleFundamentalChoices(selectedKeys=['squat']){
  const selected=new Set(selectedKeys);
  const host=$('#singleFundamentalChoices');
  if(!host)return;
  host.innerHTML=Object.entries(FUNKFIT_FUNDAMENTALS).map(([key,f])=>`
    <label class="single-fundamental-option ${selected.has(key)?'selected':''}">
      <input type="checkbox" value="${key}" ${selected.has(key)?'checked':''}>
      <span>${f.icon}</span><strong>${esc(f.label)}</strong><small>${esc(f.english)}</small>
    </label>`).join('');
  host.querySelectorAll('input').forEach(input=>input.onchange=()=>{
    input.closest('.single-fundamental-option').classList.toggle('selected',input.checked);
    if(!host.querySelector('input:checked')){
      input.checked=true;
      input.closest('.single-fundamental-option').classList.add('selected');
    }
  });
}
function updateSingleFundamentalVisibility(){
  const type=$('#singleSectionType')?.value;
  const showFundamentals=type==='Teknik'&&isJuniorFamilyContext();
  const showFinisher=type==='Finisher';
  $('#singleFundamentalWrap')?.classList.toggle('hidden',!showFundamentals);
  $('#singleFinisherWrap')?.classList.toggle('hidden',!showFinisher);
  if(showFundamentals&&!$('#singleFundamentalChoices')?.children.length)renderSingleFundamentalChoices(['squat']);
  if(showFinisher)refreshFinisherForm('single');
  if($('#plannerDurationWrap'))$('#plannerDurationWrap').classList.toggle('hidden',showFinisher);
}
function startSingleSectionPlanner(target=null,presetType=null){
  singleSectionTarget=Number.isInteger(target)?target:null;

  if($('#participantCount')&&$('#plannerParticipants')){
    $('#plannerParticipants').value=Math.max(1,+$('#participantCount').value||20);
  }
  if($('#adultCount')&&$('#plannerAdults')){
    $('#plannerAdults').value=Math.max(0,+$('#adultCount').value||0);
  }

  let type=presetType;
  if(!type&&singleSectionTarget!==null){
    const current=normalizeSection(sections[singleSectionTarget]);
    type=current.type==='Ledopvarmning'?'AMRAP':current.type;
    $('#plannerDuration').value=Math.max(3,Math.min(45,current.minutes||12));
    if($('#plannerBrief')&&!$('#plannerBrief').value.trim()){
      $('#plannerBrief').value=current.description||'';
    }
  }
  if(!type)type='AMRAP';
  if($('#singleSectionType'))$('#singleSectionType').value=type;
  if(singleSectionTarget!==null&&sections[singleSectionTarget]?.fundamentalKeys?.length){
    renderSingleFundamentalChoices(sections[singleSectionTarget].fundamentalKeys);
  }else{renderSingleFundamentalChoices(['squat']);}
  if(type==='Finisher'&&singleSectionTarget!==null){
    refreshFinisherForm('single',normalizeSection(sections[singleSectionTarget]));
  }else if(type==='Finisher'){refreshFinisherForm('single');}
  updateSingleFundamentalVisibility();

  showView('designView');
  showStep(1);
  setCreationMode('section');
}
function generateSingleSectionFromPlanner(){
  const duration=Math.max(3,Math.min(45,+$('#plannerDuration').value||12));
  const participants=Math.max(1,+$('#plannerParticipants').value||20);
  const goals=goalValues();
  const brief=$('#plannerBrief').value.trim();
  const type=$('#singleSectionType').value;
  const theme=['junior','family'].includes(plannerConcept)?$('#plannerTheme').value.trim():'';
  const focus=[...goals,brief].filter(Boolean).join(', ');

  let section=type==='Finisher'
    ?finisherFromForm('single')
    :type==='Leg'?buildGameSuggestion(duration,focus,theme)
    :type==='Teknik'&&isJuniorFamilyContext()?buildFundamentalSection(selectedSingleFundamentals(),duration)
    :buildSectionSuggestion(type,duration,focus,theme);

  if(type!=='Finisher')section.minutes=duration;
  section.description=section.description||`AI-forslag til én ${type.toLowerCase()}-sektion.`;
  section.coachTips=[
    section.coachTips,
    `Planlagt til ${participants} deltagere ${plannerVenue==='indoor'?'indendørs':'udendørs'}.`,
    $('#avoidWaiting').checked?'Organisér sektionen, så ventetid og kø undgås.':''
  ].filter(Boolean).join(' ');

  // Ledopvarmning bygges fortsat som del af en hel træning. Finisher er tilladt.
  if(section.type==='Ledopvarmning')section=buildSectionSuggestion('AMRAP',duration,focus,theme);
  section.exercises=section.type==='Finisher'&&section.finisherMode==='song'?[]:(section.exercises||[]);

  if(singleSectionTarget!==null&&sections[singleSectionTarget]){
    sections[singleSectionTarget]=normalizeSection(section);
  }else if(section.type==='Finisher'){
    const finisherIndex=sections.findIndex(s=>normalizeSection(s).sectionPurpose==='Finisher');
    if(finisherIndex<0)sections.push(normalizeSection(section));
    else if(confirm('Træningen har allerede en finisher. Vil du erstatte den?'))sections[finisherIndex]=normalizeSection(section);
  }else{
    const finisherIndex=sections.findIndex(s=>normalizeSection(s).sectionPurpose==='Finisher');
    if(finisherIndex<0)sections.push(normalizeSection(section));else sections.splice(finisherIndex,0,normalizeSection(section));
  }

  enforceWorkoutStructure();
  $('#participantCount').value=participants;
  $('#familyMode').checked=plannerConcept==='family';
  $('#adultCountLabel').classList.toggle('hidden',plannerConcept!=='family');
  if(plannerConcept==='family')$('#adultCount').value=+$('#plannerAdults').value||0;

  renderFramework();
  renderExerciseSections();
  updateReview();

  $('#plannerResult').classList.remove('hidden');
  $('#plannerResult').innerHTML=`<h3>Sektionsforslag klar ✓</h3>
    <p><strong>${esc(section.name)}</strong> · ${duration} min · ${participants} deltagere</p>
    <div class="programming-note">Kun den valgte sektion er bygget. Resten af træningen er ikke ændret.</div>
    <ul>
      <li>Type: ${esc(section.type)}</li>
      <li>Format: ${esc(section.format)}</li>
      <li>Organisering: ${esc(section.organization)}</li>
      <li>Styring: ${esc(section.control)}</li>
    </ul>
    <button id="openGeneratedSectionBtn" type="button">Gennemgå sektionen i Finpuds →</button>`;
  $('#openGeneratedSectionBtn').onclick=()=>{
    singleSectionTarget=null;
    setCreationMode('choice');
    showStep(2);
  };
  $('#plannerResult').scrollIntoView({behavior:'smooth',block:'center'});
}

function generateSmartWorkout(){
  const duration=Math.max(20,+$('#plannerDuration').value||60);
  const participants=Math.max(1,+$('#plannerParticipants').value||20);
  const goals=goalValues();
  const plannerBrief=$('#plannerBrief').value.trim();
  activeRunPlan=parseRunPlan(plannerBrief);
  const includeFinisher=$('#includeTeamChallenge').checked;
  const suggestedFinisher=includeFinisher?suggestedFinisherTemplate('all',{ignoreWorkout:true}):null;
  const includeJoint=$('#includeJointWarmup')?.checked!==false;
  const includeGame=['junior','family'].includes(plannerConcept)&&($('#includeGame').checked||goals.includes('Sjov'));
  const theme=['junior','family'].includes(plannerConcept)?$('#plannerTheme').value.trim():'';

  const jointMinutes=includeJoint?5:0;
  const warmMinutes=Math.max(7,Math.round(duration*.13));
  const gameMinutes=includeGame?Math.max(7,Math.round(duration*.13)):0;
  const finisherMinutes=includeFinisher?Number(suggestedFinisher?.minutes||4):0;
  const available=Math.max(12,duration-jointMinutes-warmMinutes-gameMinutes-finisherMinutes);
  let mainCount=structureChoice==='one'?1:structureChoice==='two'?2:structureChoice==='three'?3:(available>=28?2:1);
  if(['hiit','hyrox','trx'].includes(plannerConcept))mainCount=Math.max(2,mainCount);
  const mainMinutes=Array.from({length:mainCount},(_,i)=>Math.floor(available/mainCount)+(i<available%mainCount?1:0));

  sections=[];
  if(includeJoint)sections.push(defaultSection('Ledopvarmning'));

  const warm=buildSectionSuggestion('Opvarmning',warmMinutes,'puls og bevægelseskvalitet','');
  warm.name='Pulsopvarmning';warm.format='Fælles flow';warm.organization='Fælles';warm.control='Samlet tid';
  sections.push(warm);

  if(includeGame)sections.push(buildGameSuggestion(gameMinutes,goals.join(', '),theme));

  const patterns={
    junior:['AMRAP','YGIG','Chipper'],
    family:['YGIG','Stationer','AMRAP'],
    adult:['Styrke','AMRAP','YGIG'],
    trx:['Stationer','YGIG','EMOM'],
    hyrox:['Chipper','YGIG','Stationer'],
    hiit:['EMOM','Stationer','AMRAP']
  };
  const choices=patterns[plannerConcept]||patterns.junior;
  for(let i=0;i<mainCount;i++){
    const type=choices[i%choices.length];
    const focus=[...goals,plannerBrief,plannerConcept==='hyrox'?'løb og Hyrox':plannerConcept==='trx'?'TRX':plannerConcept==='hiit'?'høj intensitet':''].filter(Boolean).join(', ');
    const s=buildSectionSuggestion(type,mainMinutes[i],focus,'');
    s.name=plannerConcept==='hiit'?`HIIT-blok ${i+1}`:plannerConcept==='hyrox'?`Hyrox-blok ${i+1}`:plannerConcept==='trx'?`TRX-blok ${i+1}`:`Hovedelement ${i+1} – ${type}`;
    if(type==='YGIG'){
      s.format='AMRAP';s.organization='You go, I go';s.control='Samlet tid';s.work=0;s.rest=0;
    }
    sections.push(s);
  }

  if(includeFinisher)sections.push(buildFinisherFromTemplate(suggestedFinisher.id));

  enforceWorkoutStructure();
  const conceptNames={junior:'FunkFit Junior',family:'Familietræning',adult:'Funktionel voksentræning',trx:'TRX-træning',hyrox:'Hyrox-træning',hiit:'HIIT-træning'};
  const suggestedName=`${conceptNames[plannerConcept]}${theme?' – '+theme:''} – ${plannerVenue==='indoor'?'inde':'ude'}`;
  if(isDefaultWorkoutName($('#workoutName').value))$('#workoutName').value=suggestedName;
  $('#participantCount').value=participants;
  $('#familyMode').checked=plannerConcept==='family';
  $('#adultCountLabel').classList.toggle('hidden',plannerConcept!=='family');
  if(plannerConcept==='family')$('#adultCount').value=+$('#plannerAdults').value||10;

  const history=aiHistory();
  history.push({date:new Date().toISOString(),concept:plannerConcept,exerciseIds:sections.flatMap(s=>(s.exercises||[]).filter(a=>a.kind!=='run').map(x=>x.exerciseId))});
  saveAiHistory(history);

  activeRunPlan=null;
  collapseAllSections();
  renderFramework();renderExerciseSections();updateReview();
  $('#plannerResult').classList.remove('hidden');
  $('#plannerResult').innerHTML=`<h3>Komplet forslag klar ✓</h3>
    <p><strong>${esc(conceptNames[plannerConcept])}</strong> · ${duration} min · ${participants} deltagere${theme?` · tema: ${esc(theme)}`:''}</p>
    <div class="programming-note">Forslaget er klar til gennemgang. Kontrollér især belastning, plads, udstyr og flow.</div>
    <ul><li>${sections.length} sektioner: ${sections.map(s=>esc(s.type)).join(' → ')}</li><li>Løb kan optræde som en aktivitet inde i AMRAP, Chipper og Hyrox.</li><li>Finisheren kan være en sang eller et kort afslutningsformat fra kataloget.</li></ul>
    <button id="openGeneratedEditorBtn" type="button">Gennemgå træningen →</button>`;
  $('#openGeneratedEditorBtn').onclick=()=>showStep(2);
  $('#plannerResult').scrollIntoView({behavior:'smooth',block:'center'});
}

function updateTimeControl(){
  const planned=Math.max(0,+$('#plannerDuration')?.value||0);
  const required=sections.filter(s=>normalizeSection(s).sectionPurpose!=='Finisher').reduce((n,s)=>n+(+s.minutes||0),0);
  const optional=sections.filter(s=>normalizeSection(s).sectionPurpose==='Finisher').reduce((n,s)=>{const f=normalizeSection(s);return n+(f.finisherMode==='song'?+(f.songMinutes||f.minutes||0):+(f.minutes||0));},0);
  const total=required+optional,diff=total-planned;
  if($('#plannedMinutes'))$('#plannedMinutes').textContent=planned;
  if($('#totalMinutes'))$('#totalMinutes').textContent=total;
  const el=$('#timeStatus');if(!el)return;
  el.className='time-status '+(required<=planned&&total>=planned-5?'ok':required>planned?'bad':'warn');
  el.textContent=optional
    ?`Fast program: ${required} min + finisher: ${optional} min. ${diff>0?`${diff} min over inkl. finisher`:diff<0?`${Math.abs(diff)} min ledig inkl. finisher`:'Tiden passer inkl. finisher'}`
    :(diff===0?'Tiden passer præcist':diff>0?`${diff} min for lang`:`${Math.abs(diff)} min ledig`);
}

async function loadTesseract(){
  if(window.Tesseract)return window.Tesseract;
  await new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.onload=resolve;
    script.onerror=()=>reject(new Error('OCR-biblioteket kunne ikke indlæses.'));
    document.head.appendChild(script);
  });
  return window.Tesseract;
}


async function preprocessImageVariants(file){
  const bitmap=await createImageBitmap(file);const maxWidth=2400,scale=Math.max(1.6,Math.min(3.2,maxWidth/bitmap.width));
  const base=document.createElement('canvas');base.width=Math.round(bitmap.width*scale);base.height=Math.round(bitmap.height*scale);const ctx=base.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0,base.width,base.height);
  const makeVariant=(mode)=>{const canvas=document.createElement('canvas');canvas.width=base.width;canvas.height=base.height;const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(base,0,0);const img=c.getImageData(0,0,canvas.width,canvas.height),d=img.data;
    for(let i=0;i<d.length;i+=4){const gray=.299*d[i]+.587*d[i+1]+.114*d[i+2];if(mode==='gray'){const v=Math.max(0,Math.min(255,(gray-128)*1.35+128));d[i]=d[i+1]=d[i+2]=v}else{const v=gray>170?255:gray<95?0:Math.max(0,Math.min(255,(gray-128)*2+128));d[i]=d[i+1]=d[i+2]=v}}c.putImageData(img,0,0);return new Promise(resolve=>canvas.toBlob(resolve,'image/png',1));};
  return Promise.all([makeVariant('gray'),makeVariant('threshold')]);
}
function mergeOcrResults(results){
  const lines=[];results.sort((a,b)=>(b.confidence||0)-(a.confidence||0)).forEach(result=>String(result.text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean).forEach(line=>{const normalized=normalizeText(line);if(normalized.length<2)return;const duplicate=lines.some(existing=>{const other=normalizeText(existing);return other===normalized||other.includes(normalized)||normalized.includes(other)});if(!duplicate)lines.push(line)}));return lines.join('\n');
}
function levenshtein(a,b){
  a=normalizeText(a);b=normalizeText(b);
  const m=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
  for(let i=0;i<=a.length;i++)m[i][0]=i;for(let j=0;j<=b.length;j++)m[0][j]=j;
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return m[a.length][b.length];
}

async function handleWorkoutImage(e){
  const file=e.target.files?.[0];if(!file)return;const preview=$('#importImagePreview');preview.src=URL.createObjectURL(file);preview.classList.remove('hidden');$('#ocrStatus').textContent='Forbedrer billedet og aflæser i to omgange…';$('#ocrStatus').classList.remove('hidden');
  try{
    const Tesseract=await loadTesseract();const variants=await preprocessImageVariants(file);const results=[];
    for(let i=0;i<variants.length;i++){
      const result=await Tesseract.recognize(variants[i]||file,'dan+eng',{tessedit_pageseg_mode:i===0?'11':'6',logger:m=>{if(m.status==='recognizing text')$('#ocrStatus').textContent=`Aflæsning ${i+1}/2 · ${Math.round((m.progress||0)*100)} %`;}});
      results.push({text:result.data.text,confidence:result.data.confidence||0});
    }
    const merged=mergeOcrResults(results);$('#importWorkoutText').value=merged;const confidence=Math.round(Math.max(...results.map(x=>x.confidence||0)));
    $('#ocrStatus').textContent=confidence>=60?`Teksten er aflæst i to billedvarianter. Bedste sikkerhed: ${confidence} %. Gennemgå teksten før import.`:`Lav aflæsningssikkerhed (${confidence} %). Beskær tættere på tavlen, tag billedet lige forfra og ret teksten manuelt før import.`;
  }catch(err){console.error(err);$('#ocrStatus').textContent='Automatisk billedaflæsning mislykkedes. Indsæt eller ret teksten manuelt.';}
}
async function handleWorkoutTextFile(e){
  const file=e.target.files?.[0];
  if(!file)return;
  try{
    $('#importWorkoutText').value=await file.text();
    $('#ocrStatus').textContent='Tekstfilen er indlæst.';
    $('#ocrStatus').classList.remove('hidden');
  }catch{
    alert('Tekstfilen kunne ikke læses.');
  }
}

function normalizeText(s){
  return String(s||'').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9æøå\s-]/g,' ')
    .replace(/\s+/g,' ').trim();
}

function matchExercise(line){
  const normalized=normalizeText(line);
  let best=null,bestScore=-999;
  for(const ex of exercises){
    const aliases=[ex.name,ex.category,...(ex.bodyAreas||[]),...(ex.aliases||[])].filter(Boolean);
    for(const raw of aliases){
      const name=normalizeText(raw);if(!name)continue;
      let score=0;
      if(normalized.includes(name))score=100+name.length;
      else{
        const words=normalized.split(' ').filter(x=>x.length>2);
        const distance=levenshtein(normalized,name);
        const similarity=1-distance/Math.max(normalized.length,name.length,1);
        score=similarity*80+words.filter(w=>name.includes(w)).length*8;
      }
      if(score>bestScore){bestScore=score;best=ex}
    }
  }
  return bestScore>=52?best:null;
}

function parseDuration(line){
  const m=line.match(/(\d+)\s*(min|minutter|minutes)/i);
  return m?Number(m[1]):null;
}

function parseRounds(line){
  const m=line.match(/(\d+)\s*(runder|rounds?)/i);
  return m?Number(m[1]):null;
}

function parsePrescription(line){
  const m=line.match(/^\s*(\d+)\s*(x|reps?|gentagelser)?\s+(.+)$/i);
  if(m)return{reps:m[1],text:m[3].trim()};
  const distance=line.match(/^\s*(\d+)\s*(m|meter|km)\s+(.+)$/i);
  if(distance)return{reps:`${distance[1]} ${distance[2]}`,text:distance[3].trim()};
  return{reps:'',text:line.trim()};
}

function inferSectionName(line){
  const n=normalizeText(line);
  const known=[
    ['opvarmning','Opvarmning'],
    ['warm up','Opvarmning'],
    ['warmup','Opvarmning'],
    ['teknik','Teknik'],
    ['hovedtræning','Hovedtræning'],
    ['workout','Hovedtræning'],
    ['wod','Hovedtræning'],
    ['hiit','HIIT'],
    ['hyrox','Hyrox'],
    ['finisher','Finisher'],
    ['teamchallenge','Teamchallenge'],
    ['stafet','Stafet'],
    ['nedkøling','Nedkøling'],
    ['cool down','Nedkøling']
  ];
  const found=known.find(([key])=>n.includes(key));
  return found?.[1]||null;
}

function importedSectionType(line,blockText=''){
  const text=normalizeText(`${line} ${blockText}`);
  if(text.includes('ledopvarm'))return 'Ledopvarmning';
  if(text.includes('partner finisher'))return 'YGIG';
  if(text.includes('finisher')||text.includes('afslutning'))return 'Finisher';
  if(text.includes('opvarm'))return 'Opvarmning';
  if(text.includes('ygig')||text.includes('wgyg')||text.includes('you go'))return 'YGIG';
  if(text.includes('amrap'))return 'AMRAP';if(text.includes('emom'))return 'EMOM';if(text.includes('chipper'))return 'Chipper';
  if(text.includes('station'))return 'Stationer';if(text.includes('teknik')||text.includes('fundamental'))return 'Teknik';if(text.includes('styrke'))return 'Styrke';
  if(/stafet|challenge|jagten|3 i pa stribe|flip kegler|spil|mission|bedst ud af|præmie|vinder|twist|1 mod 1|2 hold/.test(text))return 'Leg';
  if(text.includes('hiit'))return 'Stationer';if(text.includes('hyrox'))return 'Chipper';
  if(text.includes('hovedtræning')||text.includes('hoveddel')||text==='workout'||text==='wod')return 'AMRAP';
  return null;
}
function appendImportedField(section,field,text){section[field]=[section[field],text].filter(Boolean).join('\n')}
function activeDurationFromBlock(text){
  const patterns=[/aktiv(?:e)?\s*(?:tid)?\s*[:=]?\s*(\d+(?:[.,]\d+)?)\s*min/i,/(\d+(?:[.,]\d+)?)\s*min(?:utter)?\s*aktiv(?:e)?/i,/ca\.?\s*(\d+(?:[.,]\d+)?)\s*min(?:utter)?\s*aktiv/i];
  for(const pattern of patterns){const m=text.match(pattern);if(m)return Math.round(parseFloat(m[1].replace(',','.')))}
  const durations=[...text.matchAll(/(\d+(?:[.,]\d+)?)\s*min(?:utter)?/ig)].map(m=>({value:Math.round(parseFloat(m[1].replace(',','.'))),before:text.slice(Math.max(0,m.index-15),m.index).toLowerCase()}));
  const active=durations.find(x=>!/(forklar|forbered|intro)/.test(x.before));return active?.value||0;
}
function explanationDuration(text){const m=text.match(/(?:forklar(?:ing)?|forbered)\s*\+?\s*(\d+(?:[.,]\d+)?)\s*min/i)||text.match(/(\d+(?:[.,]\d+)?)\s*min[^\n]{0,12}(?:forklar|forbered)/i);return m?Math.round(parseFloat(m[1].replace(',','.'))):0}
function importedRunActivity(line){
  const text=normalizeText(line);const match=text.match(/(\d+(?:[.,]\d+)?)\s*(km|kilometer|m|meter)\s+(løb|løbe|run)/)||text.match(/(løb|løbe|run)\s+(\d+(?:[.,]\d+)?)\s*(km|kilometer|m|meter)/);
  if(!match)return null;const amountIndex=/^\d/.test(match[1])?1:2,unitIndex=amountIndex===1?2:3;let value=parseFloat(match[amountIndex].replace(',','.'));if(['km','kilometer'].includes(match[unitIndex]))value*=1000;
  return normalizeActivity({kind:'run',runType:'Almindeligt løb',value:Math.round(value),unit:'meter',intensity:'Hurtigt',route:'',note:''});
}
function importedExerciseMentions(text){
  const normalized=normalizeText(String(text).replace(/[❤♥]/g,' burpees '));const found=[];
  const aliases=[...exercises].map(ex=>({ex,terms:[ex.name,...(ex.aliases||[])].map(normalizeText).filter(term=>term.length>=4)}));
  aliases.forEach(({ex,terms})=>{if(terms.some(term=>normalized.includes(term))&&!found.some(item=>item.exerciseId===ex.id)){
    const term=terms.find(t=>normalized.includes(t));const index=normalized.indexOf(term);const before=normalized.slice(Math.max(0,index-16),index);const reps=before.match(/(\d+)\s*$/)?.[1]||'';
    const item=makeItem(ex);if(reps)item.juniorReps=`${reps} gentagelser`;found.push(normalizeActivity(item));
  }});return found;
}
function cleanImportedTitle(line,type){
  let title=String(line||'').replace(/^kl\.?\s*\d{1,2}[.:]\d{2}\s*/i,'').replace(/^['\"]|['\"]$/g,'').replace(/\b(?:forklar|aktiv(?:e)?|forbered)[^,.;]*/ig,'').replace(/\b\d+(?:[.,]\d+)?\s*min(?:utter)?\b/ig,'').replace(/[,;:\-–—]+\s*$/,'').trim();
  if(!title||title.length>85)return defaultSection(type).name;return title;
}
function parseImportedWorkoutText(text){
  const rawBlocks=text.replace(/\r/g,'').split(/\n\s*\n+/).map(x=>x.trim()).filter(Boolean);const proposal=[];let globalNotes=[];let optionalMode=false;
  const equipmentPattern=/\b(kegle|kegler|bold|bolde|ring|ringe|dumbbell|dumbells|wallball|wallballs|bord|stige|stiger|terning|terninger|måtte|måtter)\b/i;
  rawBlocks.forEach((rawBlock,blockIndex)=>{
    let lines=rawBlock.split('\n').map(x=>x.trim()).filter(Boolean);if(!lines.length)return;
    const normalizedBlock=normalizeText(rawBlock);
    if(/^hvis\s+(der\s+er\s+)?mere\s+tid/.test(normalizedBlock)){optionalMode=true;lines[0]=lines[0].replace(/^hvis\s+(der\s+er\s+)?mere\s+tid\s*:?/i,'').trim();if(!lines[0])lines.shift();}
    if(!proposal.length&&equipmentPattern.test(rawBlock)&&!importedSectionType(lines[0],rawBlock)&&lines.length<=3){globalNotes.push(`Udstyr: ${rawBlock.replace(/\n/g,' · ')}`);return;}
    const nonClock=lines.find(line=>!/^kl\.?\s*\d{1,2}[.:]\d{2}$/i.test(line))||lines[0];
    const type=importedSectionType(nonClock,rawBlock)||(/^(evt\.?|alternativ)/i.test(nonClock)?'Leg':'AMRAP');
    const duration=activeDurationFromBlock(rawBlock)||defaultSection(type).minutes||10;
    const section=defaultSection(type);section.name=optionalMode&&proposal.length===0?'Hvis der er mere tid':cleanImportedTitle(nonClock,type);section.minutes=duration;section.optional=optionalMode;section.exercises=[];section.unmatched=[];section.importNotes=[];
    const explain=explanationDuration(rawBlock);if(explain)appendImportedField(section,'coachTips',`Forklaring/forberedelse: ca. ${explain} min.`);
    if(/\b(?:wgyg|ygig|you go)\b/i.test(rawBlock)){section.type='YGIG';section.format='AMRAP';section.organization='You go, I go';section.control='Samlet tid'}
    else if(/\b1\s*(?:mod|:|til)\s*1\b/i.test(rawBlock)){section.organization='Makker sammen'}
    else if(/\b\d+\s*hold\b/i.test(rawBlock)||/\b\d+\s*mod\s*\d+\b/i.test(rawBlock)){section.organization='Hold'}
    lines.forEach((line,index)=>{
      if(line===nonClock||/^kl\.?\s*\d{1,2}[.:]\d{2}$/i.test(line))return;
      const cleaned=line.replace(/[❤♥]/g,' burpees ');
      const run=importedRunActivity(cleaned);if(run&&!section.exercises.some(x=>x.kind==='run'&&x.value===run.value))section.exercises.push(run);
      importedExerciseMentions(cleaned).forEach(item=>{if(!section.exercises.some(x=>x.kind!=='run'&&x.exerciseId===item.exerciseId))section.exercises.push(item)});
      if(equipmentPattern.test(line))appendImportedField(section,'coachTips',`Udstyr/opstilling: ${line}`);
      else if(/præmie|vinder|2\. plads|spiller om/i.test(line))appendImportedField(section,'coachTips',line);
      else if(/alternativ|twist|svær|let/i.test(line))appendImportedField(section,'coachTips',line);
      else if(section.type==='Leg'||section.type==='YGIG')appendImportedField(section,'rules',line);
      else appendImportedField(section,'importNotes',line);
    });
    const firstBody=lines.filter(line=>line!==nonClock&&!/^kl\.?\s*\d{1,2}[.:]\d{2}$/i.test(line)).find(line=>!equipmentPattern.test(line));
    if(firstBody&&(section.type==='Leg'||section.type==='YGIG'))section.description=`${section.name}: ${firstBody}`;
    if(optionalMode)appendImportedField(section,'coachTips','Valgfri ekstrasektion – bruges kun, hvis tidsplanen holder.');
    if(globalNotes.length){section.coachTips=[...globalNotes,section.coachTips].filter(Boolean).join('\n');globalNotes=[];}
    proposal.push(normalizeSection(section));
  });
  if(globalNotes.length&&proposal.length)proposal[0].coachTips=[...globalNotes,proposal[0].coachTips].filter(Boolean).join('\n');
  return proposal.filter(section=>section.exercises.length||section.description||section.rules||section.coachTips||section.type==='Finisher');
}
function analyzeImportedWorkout(){
  const text=$('#importWorkoutText').value.trim();
  if(!text)return alert('Indsæt, upload eller aflæs først en træningsplan.');
  const proposal=parseImportedWorkoutText(text);
  if(!proposal.length)return alert('Jeg kunne ikke finde en træningsstruktur i teksten.');

  window.__importProposal=proposal;
  $('#importProposal').classList.remove('hidden');
  $('#importProposal').innerHTML=`<h4>Forslag fundet</h4>
    ${proposal.map(s=>`<div class="proposal-section">
      <strong>${esc(s.name)} · ${s.minutes} min</strong>
      <ul>
        ${s.exercises.map(it=>{const ex=exercises.find(x=>x.id===it.exerciseId);return `<li class="proposal-match">✓ ${esc(ex?.name||'Ukendt')}${it.juniorReps?` · ${esc(it.juniorReps)}`:''}</li>`}).join('')}
        ${(s.importNotes||[]).map(x=>`<li class="proposal-note">📝 Bevarer som note: ${esc(x)}</li>`).join('')}
        ${s.unmatched.map(x=>`<li class="proposal-unmatched">⚠ Ikke genkendt som øvelse: ${esc(x)}</li>`).join('')}
      </ul>
      ${s.description?`<p><strong>Beskrivelse:</strong> ${esc(s.description)}</p>`:''}
      ${s.rules?`<p><strong>Regler:</strong> ${esc(s.rules)}</p>`:''}
    </div>`).join('')}
    <button id="useImportProposalBtn" type="button">Brug dette forslag</button>`;

  $('#useImportProposalBtn').onclick=()=>{
    sections=proposal.map(section=>{
      const copy=structuredClone(section);
      if(copy.importNotes?.length){
        copy.coachTips=[copy.coachTips,...copy.importNotes].filter(Boolean).join('\\n');
      }
      delete copy.unmatched;
      delete copy.importNotes;
      return normalizeSection(copy);
    });
    enforceWorkoutStructure();
    renderFramework();
    renderExerciseSections();
    updateReview();
    $('#importProposal').innerHTML='<strong>Forslaget er indsat. Gennemgå især ikke-genkendte linjer, tider og organisering.</strong>';
    showStep(1);
  };
}

function clearImportedWorkout(){
  $('#workoutImageInput').value='';
  $('#workoutTextFileInput').value='';
  $('#workoutCameraInput').value='';
  $('#importWorkoutText').value='';
  $('#importImagePreview').src='';
  $('#importImagePreview').classList.add('hidden');
  $('#ocrStatus').classList.add('hidden');
  $('#importProposal').classList.add('hidden');
  $('#importProposal').innerHTML='';
}


const EQUIPMENT_LABELS={
  'Kettlebell':['kettlebell','kettlebells'],
  'Håndvægt':['håndvægt','håndvægte'],
  'Måtte':['måtte','måtter'],
  'Boks':['boks','bokse'],
  'Medicinbold':['medicinbold','medicinbolde'],
  'Kegler':['kegle','kegler'],
  'Elastik':['elastik','elastikker'],
  'Bænk':['bænk','bænke'],
  'Sandsæk':['sandsæk','sandsække'],
  'Slæde':['slæde','slæder'],
  'SkiErg':['SkiErg','SkiErgs'],
  'Romaskine':['romaskine','romaskiner'],
  'Reb':['reb','reb'],
  'Vægtskive':['vægtskive','vægtskiver'],
  'TRX':['TRX','TRX'],
  'React Lights':['sæt React Lights','sæt React Lights'],
  'Væg':['væg','vægge']
};
const ONE_DUMBBELL_EXERCISES=new Set([
  'goblet-squat','db-row','single-leg-rdl','russian-twist',
  'triceps-extension','suitcase-carry','overhead-carry'
]);
const TWO_DUMBBELL_EXERCISES=new Set([
  'farmer-carry','romanian-deadlift','sumo-deadlift','calf-raise',
  'db-shoulder-press','floor-press','biceps-curl','lateral-raise',
  'front-raise','renegade-row','front-rack-carry','db-push-press',
  'db-thruster'
]);

function equipmentUnitMultiplier(ex,equipment){
  if(equipment==='Håndvægt'){
    if(ONE_DUMBBELL_EXERCISES.has(ex?.id))return 1;
    if(TWO_DUMBBELL_EXERCISES.has(ex?.id))return 2;
    return 1;
  }
  if(equipment==='Kettlebell'){
    return ex?.id==='farmer-carry'?2:1;
  }
  return 1;
}
function equipmentDisplay(name,quantity){
  const labels=EQUIPMENT_LABELS[name];
  if(!labels)return `${quantity} × ${name}`;
  const label=quantity===1?labels[0]:labels[1];
  return `${quantity} ${label}`;
}
function isFacilityEquipment(name){
  return name==='Væg';
}
function isSharedSetEquipment(name){
  return name==='React Lights';
}
function equipmentTeamCount(participants){
  return Math.min(6,Math.max(2,Math.ceil(participants/5)));
}
function sectionStationCount(section,activityCount){
  return Math.max(1,+section.stationCount||activityCount||1);
}
function activeCountForSection(section,participants,activityCount){
  const org=normalizeText(section.organization||'');
  const task=normalizeText(section.taskStructure||'');
  if(org.includes('you go')||org.includes('i go'))return Math.ceil(participants/2);
  if(org.includes('stafet')||org==='hold')return equipmentTeamCount(participants);
  if(org.includes('rotation')||task==='stationer'){
    return Math.ceil(participants/sectionStationCount(section,activityCount));
  }
  return participants;
}
function coneRequirement(section,participants,activityCount,activity){
  const org=normalizeText(section.organization||'');
  const task=normalizeText(section.taskStructure||'');
  const runText=normalizeText(`${activity?.runType||''} ${activity?.route||''}`);
  if(org.includes('stafet'))return Math.max(4,equipmentTeamCount(participants)*2);
  if(task==='stationer'||org.includes('rotation'))return Math.max(4,sectionStationCount(section,activityCount)*2);
  if(/zigzag|slalom|shuttle|reaktion|sprint|kegle/.test(runText)){
    return Math.max(4,Math.min(12,Math.ceil(participants/4)*2));
  }
  return 4;
}
function addRequirement(map,name,quantity,detail='',mode='max'){
  if(!name||name==='Kropsvægt'||quantity<=0)return;
  const current=map.get(name);
  if(!current){
    map.set(name,{name,quantity,detail});
    return;
  }
  if(mode==='sum'){
    current.quantity+=quantity;
    if(detail&&!current.detail)current.detail=detail;
    return;
  }
  if(quantity>current.quantity){
    map.set(name,{name,quantity,detail});
  }
}
function exerciseEquipmentMap(ex,activeCount,section,activity,participants,activityCount){
  const map=new Map();
  (ex?.equipment||[]).forEach(name=>{
    if(!name||name==='Kropsvægt')return;
    if(isFacilityEquipment(name)){
      addRequirement(map,name,1,'Adgang under træningen');
      return;
    }
    const quantity=name==='Kegler'
      ?coneRequirement(section,participants,activityCount,activity)
      :isSharedSetEquipment(name)
        ?1
        :activeCount*equipmentUnitMultiplier(ex,name);
    const multiplier=equipmentUnitMultiplier(ex,name);
    const detail=isSharedSetEquipment(name)
      ?'1 sæt pr. samtidig React Lights-station'
      :multiplier===2?'2 pr. aktiv deltager':'';
    addRequirement(map,name,quantity,detail);
  });
  return map;
}
function mergeActivityMaps(target,source,mode='max'){
  source.forEach(item=>addRequirement(target,item.name,item.quantity,item.detail,mode));
}
function activityEquipmentMap(activity,section,participants,activityCount,forcedActiveCount=null){
  const map=new Map();
  const activeCount=forcedActiveCount??activeCountForSection(section,participants,activityCount);

  if(activity?.kind==='run'){
    const runText=normalizeText(`${activity.runType||''} ${activity.route||''}`);
    if(/kegle|shuttle|zigzag|slalom|stafet|reaktion|sprint/.test(runText)){
      addRequirement(map,'Kegler',coneRequirement(section,participants,activityCount,activity),'Til baner og vendepunkter');
    }
    return map;
  }

  const juniorEx=exercises.find(ex=>ex.id===activity?.exerciseId);
  const family=selectedTrainingType()==='family'||$('#familyMode')?.checked;
  const adults=family?Math.min(participants,Math.max(0,+$('#adultCount')?.value||0)):0;
  const juniors=Math.max(0,participants-adults);
  const adultEx=family?exercises.find(ex=>ex.id===(activity?.adultExerciseId||activity?.exerciseId)):null;

  if(family&&adultEx&&adultEx.id!==juniorEx?.id){
    const juniorActive=activeCountForSection(section,juniors,activityCount);
    const adultActive=activeCountForSection(section,adults,activityCount);
    mergeActivityMaps(map,exerciseEquipmentMap(juniorEx,juniorActive,section,activity,participants,activityCount),'sum');
    mergeActivityMaps(map,exerciseEquipmentMap(adultEx,adultActive,section,activity,participants,activityCount),'sum');
  }else{
    mergeActivityMaps(map,exerciseEquipmentMap(juniorEx,activeCount,section,activity,participants,activityCount),'max');
  }
  return map;
}
function sectionDeclaredEquipment(section){
  const template=section.sectionPurpose==='Finisher'?finisherTemplateById(section.finisherTemplateId):null;
  return [...new Set([...(section.equipment||[]),...(template?.equipment||[])])];
}
function sectionEquipmentRequirements(rawSection,participants){
  const section=normalizeSection(structuredClone(rawSection));
  const activities=section.finisherMode==='song'?[]:(section.exercises||[]);
  const result=new Map();
  const stationMode=normalizeText(section.taskStructure)==='stationer'||normalizeText(section.organization).includes('rotation');
  const activityCount=Math.max(1,activities.length);
  const mergeMode=stationMode?'sum':'max';

  activities.forEach(activity=>{
    const active=stationMode
      ?Math.ceil(participants/sectionStationCount(section,activityCount))
      :activeCountForSection(section,participants,activityCount);
    mergeActivityMaps(result,activityEquipmentMap(activity,section,participants,activityCount,active),mergeMode);
  });

  const declared=sectionDeclaredEquipment(section);
  const active=activeCountForSection(section,participants,Math.max(1,activities.length));
  declared.forEach(name=>{
    if(!name||name==='Kropsvægt')return;
    if(isFacilityEquipment(name)){
      addRequirement(result,name,1,'Adgang under træningen');
      return;
    }
    const quantity=name==='Kegler'
      ?coneRequirement(section,participants,Math.max(1,activities.length),null)
      :isSharedSetEquipment(name)
        ?1
        :active;
    addRequirement(result,name,quantity,stationMode?'Fordelt på stationer':'');
  });

  return result;
}
function workoutEquipmentRequirements(participants){
  const total=new Map();
  sections.forEach(section=>{
    const sectionMap=sectionEquipmentRequirements(section,participants);
    sectionMap.forEach(item=>addRequirement(total,item.name,item.quantity,item.detail,'max'));
  });
  return [...total.values()].sort((a,b)=>{
    const priority=['Kettlebell','Håndvægt','Måtte','Boks','Medicinbold','TRX','Sandsæk','Slæde','Romaskine','SkiErg','Elastik','Bænk','Kegler','Reb','Vægtskive','Væg'];
    return priority.indexOf(a.name)-priority.indexOf(b.name)||a.name.localeCompare(b.name,'da');
  });
}
function renderEquipmentSummary(participants){
  const list=byId('reviewEquipmentList');
  const note=byId('reviewEquipmentNote');
  if(!list||!note)return;
  const requirements=workoutEquipmentRequirements(participants);
  if(!requirements.length){
    list.innerHTML='<li><strong>Intet særligt udstyr</strong><span>Kropsvægt og almindelig træningsplads</span></li>';
  }else{
    list.innerHTML=requirements.map(item=>{
      const label=isFacilityEquipment(item.name)?`Adgang til ${EQUIPMENT_LABELS[item.name]?.[0]||item.name}`:equipmentDisplay(item.name,item.quantity);
      return `<li><strong>${esc(label)}</strong>${item.detail?`<span>${esc(item.detail)}</span>`:''}</li>`;
    }).join('');
  }
  note.textContent=`Beregnet til ${participants} deltagere ud fra det højeste samtidige behov. Udstyr kan genbruges mellem sektioner.`;
}
function equipmentSummaryPrintHtml(workout){
  const previousSections=sections;
  const previousConcept=plannerConcept;
  const previousFamily=$('#familyMode')?.checked;
  const previousAdults=$('#adultCount')?.value;
  try{
    sections=structuredClone(workout.sections||[]);
    plannerConcept=workout.trainingType||'junior';
    if($('#familyMode'))$('#familyMode').checked=!!workout.familyMode;
    if($('#adultCount'))$('#adultCount').value=workout.adultCount||0;
    const participants=Math.max(1,+workout.participants||1);
    const requirements=workoutEquipmentRequirements(participants);
    const items=requirements.length
      ?requirements.map(item=>`<li>${esc(isFacilityEquipment(item.name)?`Adgang til ${EQUIPMENT_LABELS[item.name]?.[0]||item.name}`:equipmentDisplay(item.name,item.quantity))}${item.detail?` <small>(${esc(item.detail)})</small>`:''}</li>`).join('')
      :'<li>Intet særligt udstyr – kun kropsvægt og træningsplads.</li>';
    return `<section class="print-equipment-summary"><h2>Du skal bruge</h2><ul>${items}</ul><p>Beregnet til ${participants} deltagere ud fra højeste samtidige behov.</p></section>`;
  }finally{
    sections=previousSections;
    plannerConcept=previousConcept;
    if($('#familyMode'))$('#familyMode').checked=!!previousFamily;
    if($('#adultCount'))$('#adultCount').value=previousAdults||0;
  }
}

function collect(){return{id:currentId||crypto.randomUUID(),trainingType:selectedTrainingType(),profileId:userProfile().id,theme:$('#plannerTheme')?.value||'',name:$('#workoutName').value,date:$('#workoutDate').value,participants:+$('#participantCount').value,familyMode:$('#familyMode').checked,adultCount:+($('#adultCount').value||0),savedAt:new Date().toISOString(),sections:structuredClone(sections),music:{spotify:$('#spotifyPlaylistUrl').value.trim(),tidal:$('#tidalPlaylistUrl').value.trim(),telmore:$('#telmorePlaylistUrl').value.trim()}}}
function saveCurrent(){
  const invalidFinisher=sections.find(s=>normalizeSection(s).sectionPurpose==='Finisher'&&finisherValidationMessage(s));
  if(invalidFinisher)return alert(finisherValidationMessage(invalidFinisher)+' Ret finisheren, før træningen gemmes.');
  const w=collect(),all=workouts().filter(x=>x.id!==w.id);all.unshift(w);saveWorkouts(all);currentId=w.id;renderSaved();alert('Træningen er gemt.')} 
function updateReview(){
  const participants=Math.max(1,+$('#participantCount')?.value||20);
  $('#reviewName').textContent=$('#workoutName').value;
  $('#reviewSections').textContent=sections.length;
  $('#reviewMinutes').textContent=sections.reduce((n,s)=>n+(+s.minutes||0),0);
  const reviewParticipants=byId('reviewParticipants');
  if(reviewParticipants&&document.activeElement!==reviewParticipants)reviewParticipants.value=participants;
  renderEquipmentSummary(participants);
}

function trainingTypeLabel(type){return ({junior:'FunkFit Junior',family:'Familietræning',adult:'Funktionel voksen',trx:'TRX',hiit:'HIIT',hyrox:'Hyrox'})[type]||'FunkFit-træning'}
function trainingTypeClass(type){return `saved-type-${String(type||'other').replace(/[^a-z0-9-]/gi,'')}`}
function renderSaved(){
  const all=workouts();
  $('#savedWorkouts').innerHTML=all.length?all.map(w=>`<article class="saved-card">
    <span class="saved-training-type ${trainingTypeClass(w.trainingType)}">${esc(trainingTypeLabel(w.trainingType))}</span>
    <h3>${esc(w.name)}</h3>
    <p class="meta">${w.date||'Ingen dato'} · ${w.sections.length} sektioner · ${w.sections.reduce((n,s)=>n+(+s.minutes||0),0)} min</p>
    <p class="saved-at">Senest gemt: ${w.savedAt?new Date(w.savedAt).toLocaleString('da-DK'):'Tidspunkt ikke registreret'}</p>
    <div class="saved-card-actions">
      <button data-edit="${w.id}">Åbn i Finpuds</button>
      <button class="secondary" data-play="${w.id}">Afspil</button>
      <button class="secondary" data-participant="${w.id}">Deltager-PDF</button>
      <button class="secondary" data-instructor="${w.id}">Instruktør-PDF</button>
      <button class="ghost" data-delete="${w.id}">Slet</button>
    </div>
  </article>`).join(''):'<div class="empty">Ingen gemte træninger endnu.</div>';
  $('#savedWorkouts').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editWorkout(all.find(x=>x.id===b.dataset.edit)));
  $('#savedWorkouts').querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>startPlayer(all.find(x=>x.id===b.dataset.play)));
  $('#savedWorkouts').querySelectorAll('[data-participant]').forEach(b=>b.onclick=()=>printWorkout(all.find(x=>x.id===b.dataset.participant),'participant'));
  $('#savedWorkouts').querySelectorAll('[data-instructor]').forEach(b=>b.onclick=()=>printWorkout(all.find(x=>x.id===b.dataset.instructor),'instructor'));
  $('#savedWorkouts').querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{saveWorkouts(all.filter(x=>x.id!==b.dataset.delete));renderSaved()});
}
function editWorkout(w){
  currentId=w.id;plannerConcept=w.trainingType|| (w.familyMode?'family':'junior');
  document.querySelectorAll('#conceptChoices .choice-card').forEach(x=>x.classList.toggle('selected',x.dataset.value===plannerConcept));
  $('#workoutName').value=w.name;$('#workoutDate').value=w.date;$('#participantCount').value=w.participants;$('#familyMode').checked=!!w.familyMode;$('#adultCount').value=w.adultCount||0;$('#adultCountLabel').classList.toggle('hidden',!w.familyMode);$('#spotifyPlaylistUrl').value=w.music?.spotify||'';$('#tidalPlaylistUrl').value=w.music?.tidal||'';$('#telmorePlaylistUrl').value=w.music?.telmore||'';sections=structuredClone(w.sections);normalizeSections();expandAllSections();renderFramework();renderExerciseSections();updateReview();setCreationMode('choice');showView('designView');showStep(2);
}

let clearedWorkoutSnapshot=null;
let clearUndoTimer=null;
let savedWorkoutsGuard=null;

function todayISO(){
  return new Date().toISOString().slice(0,10);
}
function draftSnapshot(){
  return {
    currentId,
    plannerConcept,
    plannerVenue,
    sections:structuredClone(sections),
    fields:{
      workoutName:$('#workoutName')?.value||'',
      workoutDate:$('#workoutDate')?.value||'',
      participantCount:$('#participantCount')?.value||'',
      familyMode:!!$('#familyMode')?.checked,
      adultCount:$('#adultCount')?.value||'',
      spotify:$('#spotifyPlaylistUrl')?.value||'',
      tidal:$('#tidalPlaylistUrl')?.value||'',
      telmore:$('#telmorePlaylistUrl')?.value||'',
      plannerTheme:$('#plannerTheme')?.value||'',
      plannerDuration:$('#plannerDuration')?.value||'60',
      plannerParticipants:$('#plannerParticipants')?.value||'20',
      plannerAdults:$('#plannerAdults')?.value||'10',
      importText:$('#importWorkoutText')?.value||''
    }
  };
}
function applyDraftSnapshot(snapshot){
  if(!snapshot)return;
  currentId=snapshot.currentId;
  plannerConcept=snapshot.plannerConcept||'junior';
  plannerVenue=snapshot.plannerVenue||'indoor';
  sections=structuredClone(snapshot.sections||[]).map(normalizeSection);
  const f=snapshot.fields||{};
  if($('#workoutName'))$('#workoutName').value=f.workoutName||'';
  if($('#workoutDate'))$('#workoutDate').value=f.workoutDate||todayISO();
  if($('#participantCount'))$('#participantCount').value=f.participantCount||20;
  if($('#familyMode'))$('#familyMode').checked=!!f.familyMode;
  if($('#adultCount'))$('#adultCount').value=f.adultCount||10;
  if($('#spotifyPlaylistUrl'))$('#spotifyPlaylistUrl').value=f.spotify||'';
  if($('#tidalPlaylistUrl'))$('#tidalPlaylistUrl').value=f.tidal||'';
  if($('#telmorePlaylistUrl'))$('#telmorePlaylistUrl').value=f.telmore||'';
  if($('#plannerTheme'))$('#plannerTheme').value=f.plannerTheme||'';
  if($('#plannerDuration'))$('#plannerDuration').value=f.plannerDuration||60;
  if($('#plannerParticipants'))$('#plannerParticipants').value=f.plannerParticipants||20;
  if($('#plannerAdults'))$('#plannerAdults').value=f.plannerAdults||10;
  if($('#importWorkoutText'))$('#importWorkoutText').value=f.importText||'';
  $('#adultCountLabel')?.classList.toggle('hidden',!f.familyMode);
  document.querySelectorAll('#conceptChoices .choice-card').forEach(x=>x.classList.toggle('selected',x.dataset.value===plannerConcept));
  document.querySelectorAll('#venueChoices .choice-card').forEach(x=>x.classList.toggle('selected',x.dataset.value===plannerVenue));
  enforceWorkoutStructure();
  renderFramework();renderExerciseSections();updateReview();
}
function resetDraft({withStructure=true}={}){
  currentId=null;
  plannerConcept='junior';
  plannerVenue='indoor';
  sections=withStructure
    ?[defaultSection('Ledopvarmning'),defaultSection('Opvarmning'),defaultSection('Finisher')]
    :[];

  if($('#workoutName'))$('#workoutName').value=withStructure?'Ny FunkFit Junior-træning':'Ny træning';
  if($('#workoutDate'))$('#workoutDate').value=todayISO();
  if($('#participantCount'))$('#participantCount').value=20;
  if($('#familyMode'))$('#familyMode').checked=false;
  if($('#adultCount'))$('#adultCount').value=10;
  if($('#adultCountLabel'))$('#adultCountLabel').classList.add('hidden');
  if($('#spotifyPlaylistUrl'))$('#spotifyPlaylistUrl').value='';
  if($('#tidalPlaylistUrl'))$('#tidalPlaylistUrl').value='';
  if($('#telmorePlaylistUrl'))$('#telmorePlaylistUrl').value='';
  if($('#plannerTheme'))$('#plannerTheme').value='';
  if($('#plannerDuration'))$('#plannerDuration').value=60;
  if($('#plannerParticipants'))$('#plannerParticipants').value=20;
  if($('#plannerAdults'))$('#plannerAdults').value=10;
  if($('#importWorkoutText'))$('#importWorkoutText').value='';
  if($('#plannerResult')){
    $('#plannerResult').classList.add('hidden');
    $('#plannerResult').innerHTML='';
  }
  document.querySelectorAll('#conceptChoices .choice-card').forEach(x=>x.classList.toggle('selected',x.dataset.value==='junior'));
  document.querySelectorAll('#venueChoices .choice-card').forEach(x=>x.classList.toggle('selected',x.dataset.value==='indoor'));
  syncManualChoiceButtons();
  enforceWorkoutStructure();
  renderFramework();renderExerciseSections();updateReview();
}
function clearCurrentWorkout(){
  const hasContent=sections.length||$('#workoutName')?.value||$('#spotifyPlaylistUrl')?.value||$('#tidalPlaylistUrl')?.value||$('#telmorePlaylistUrl')?.value;
  if(!hasContent)return alert('Træningen er allerede tom.');
  if(!confirm('Vil du rydde hele træningen? Handlingen fjerner alt indhold fra den aktuelle kladde.'))return;

  clearedWorkoutSnapshot=draftSnapshot();
  savedWorkoutsGuard=localStorage.getItem(WKEY);
  resetDraft({withStructure:false});

  // Ryd må kun påvirke den aktuelle kladde – aldrig Gemte træninger.
  if(localStorage.getItem(WKEY)!==savedWorkoutsGuard){
    if(savedWorkoutsGuard===null)localStorage.removeItem(WKEY);
    else localStorage.setItem(WKEY,savedWorkoutsGuard);
    renderSaved();
  }
  showStep(2);

  const bar=byId('clearUndoBar');
  const countdown=byId('clearUndoCountdown');
  let seconds=15;
  if(countdown)countdown.textContent=seconds;
  bar?.classList.remove('hidden');
  clearTimeout(clearUndoTimer);
  clearInterval(clearUndoInterval);
  clearUndoInterval=setInterval(()=>{
    seconds-=1;
    if(countdown)countdown.textContent=Math.max(0,seconds);
    if(seconds<=0)clearInterval(clearUndoInterval);
  },1000);
  clearUndoTimer=setTimeout(()=>{
    bar?.classList.add('hidden');
    clearedWorkoutSnapshot=null;
    savedWorkoutsGuard=null;
    clearInterval(clearUndoInterval);
  },15000);
}
function undoClearWorkout(){
  if(!clearedWorkoutSnapshot)return;
  applyDraftSnapshot(clearedWorkoutSnapshot);
  clearedWorkoutSnapshot=null;
  clearTimeout(clearUndoTimer);
  clearInterval(clearUndoInterval);
  savedWorkoutsGuard=null;
  byId('clearUndoBar')?.classList.add('hidden');
  showStep(2);
}

function newWorkout(){
  singleSectionTarget=null;
  clearedWorkoutSnapshot=null;
  clearTimeout(clearUndoTimer);
  clearInterval(clearUndoInterval);
  savedWorkoutsGuard=null;
  byId('clearUndoBar')?.classList.add('hidden');
  resetDraft({withStructure:true});
  setCreationMode('choice');
  showView('designView');
  showStep(1);
}

function printWorkout(w,mode){
  const map=new Map(exercises.map(x=>[x.id,x]));
  const line=(label,value)=>value?`<p><strong>${esc(label)}:</strong> ${esc(value)}</p>`:'';
  const participantActivity=(it,w)=>{
    if(it.kind==='run'){
      return `<article class="participant-exercise">
        <h3>🏃 ${esc(it.runType)}</h3>
        ${line('Opgave',`${it.value} ${it.unit} · ${it.intensity}`)}
        ${line('Rute',it.route)}
        ${line('Vigtigt',it.note)}
      </article>`;
    }
    const ex=map.get(it.exerciseId),adultEx=map.get(it.adultExerciseId||it.exerciseId);
    const prescription=[it.juniorReps||ex?.junior,it.juniorKg?`${it.juniorKg} kg`:null].filter(Boolean).join(' · ');
    return `<article class="participant-exercise">
      <h3>${esc(ex?.name||'Ukendt øvelse')}</h3>
      ${line('Sådan gør du',ex?.description||'Følg instruktørens anvisning.')}
      ${line('Din opgave',prescription)}
      ${line('Fokus',it.juniorNote)}
      ${line('Gør den lettere',ex?.easier)}
      ${line('Typiske fejl',ex?.mistakes)}
      ${w.familyMode&&adultEx?line('Voksenalternativ',`${adultEx.name}${it.adultReps?` · ${it.adultReps}`:''}${it.adultKg?` · ${it.adultKg} kg`:''}`):''}
    </article>`;
  };
  const instructorActivity=(it,w,currentPrintSection)=>{
    if(it.kind==='run'){
      return `<article class="print-activity">
        <h3>🏃 ${esc(it.runType)}</h3>
        ${line('Mængde',`${it.value} ${it.unit}`)}
        ${line('Intensitet',it.intensity)}
        ${line('Rute/opstilling',it.route)}
        ${line('Note',it.note)}
      </article>`;
    }
    const ex=map.get(it.exerciseId),aex=map.get(it.adultExerciseId||it.exerciseId);
    const metricDefinitions=visibleMetricDefinitions(it,ex,normalizeSection(structuredClone(currentPrintSection||{})),w.trainingType||'junior').fields;
    const metrics=metricDefinitions.filter(field=>field.value!==''&&field.value!=null).map(field=>`${field.label}: ${field.value}`).join(' · ');
    return `<article class="print-activity">
      <h3>${esc(ex?.name||'Ukendt')}</h3>
      ${line('Udførelse',ex?.description)}
      ${line('Junior',[
        it.juniorReps||ex?.junior,
        it.juniorKg?`${it.juniorKg} kg`:null,
        it.juniorNote
      ].filter(Boolean).join(' · '))}
      ${w.familyMode?line('Voksen',[
        aex?.name||ex?.name,
        it.adultReps||aex?.adult,
        it.adultKg?`${it.adultKg} kg`:null,
        it.adultNote
      ].filter(Boolean).join(' · ')):''}
      ${line('Træningsfelter',metrics)}
      ${line('Lettere',ex?.easier)}
      ${line('Sværere',ex?.harder)}
      ${line('Typiske fejl',ex?.mistakes)}
      ${line('Udstyr',(ex?.equipment||[]).join(' · '))}
    </article>`;
  };
  const sectionHtml=(raw,participant)=>{
    const s=normalizeSection(structuredClone(raw));
    if(s.type==='Finisher'){
      if(s.finisherMode==='song')return `<section class="${participant?'participant-section':'print-section'}">
        <h2><span>${esc(s.name)}</span><span>🎵 Sang · ${esc(String(s.songMinutes||s.minutes||4))} min</span></h2>
        <article class="${participant?'participant-exercise':'print-activity'}">
          <h3>${esc(s.songTitle||'Sang ikke valgt')}</h3>
          ${line('Kunstner',s.songArtist)}${line('Opgave',s.description)}${line('Regler',s.rules)}${s.songUrl?`<p><a href="${esc(s.songUrl)}">Åbn sanglink</a></p>`:''}
        </article>
      </section>`;
      return `<section class="${participant?'participant-section':'print-section'}">
        <h2><span>${esc(s.name)}</span><span>🏁 ${esc(sectionTimingText(s))}</span></h2>
        ${participant?'':`<div class="print-section-brief">${line('Format',s.format)}${line('Organisering',s.organization)}${line('Opgave',s.description)}${line('Regler',s.rules)}${line('Trænertips',s.coachTips)}</div>`}
        ${(s.exercises||[]).map(it=>participant?participantActivity(it,w):instructorActivity(it,w,s)).join('')||`<article class="${participant?'participant-exercise':'print-activity'}">${line('Opgave',s.description)}${line('Regler',s.rules)}</article>`}
      </section>`;
    }
    return `<section class="${participant?'participant-section':'print-section'}">
      <h2><span>${esc(s.name)}</span><span>${esc(sectionTimingText(s))}</span></h2>
      ${participant?'':`
        <div class="print-section-brief">
          ${line('Format',s.format)}
          ${line('Organisering',s.organization)}
          ${line('Styring',s.control)}
          ${line('Beskrivelse',s.description)}
          ${line('Regler',s.rules)}
          ${line('Trænertips',s.coachTips)}
        </div>`}
      ${(s.exercises||[]).map(it=>participant?participantActivity(it,w):instructorActivity(it,w,s)).join('')}
    </section>`;
  };

  const total=w.sections.reduce((sum,section)=>sum+(+section.minutes||0),0);
  const heading=`<header class="print-heading">
    <p class="eyebrow">${mode==='participant'?'DELTAGERPROGRAM':'INSTRUKTØRPROGRAM'}</p>
    <h1>${esc(w.name)}</h1>
    <p>${esc(w.date||'Ingen dato')} · ${total} min · ${w.participants||0} deltagere</p>
  </header>`;

  $('#printView').className=mode==='participant'?'print-view participant-print':'print-view instructor-print';
  const equipmentHtml=mode==='instructor'?equipmentSummaryPrintHtml(w):'';
  $('#printView').innerHTML=heading+equipmentHtml+w.sections.map(section=>sectionHtml(section,mode==='participant')).join('');
  window.print();
}
function startPlayer(w){
  const map=new Map(exercises.map(x=>[x.id,x]));
  playerItems=[];
  for(const raw of w.sections){
    const s=normalizeSection(raw);
    if(s.type==='Finisher'){
      if(s.finisherMode==='song'){
        playerItems.push({kind:'song',section:s.name,format:'Finisher · Sang',style:s.style,minutes:s.songMinutes||s.minutes,exercise:s.songTitle?`🎵 ${s.songTitle}`:'🎵 Vælg sang',junior:s.songArtist||s.description||'Sangbaseret finisher',juniorNote:s.rules||'',adultExercise:'',adult:'',adultNote:'',familyMode:false,timing:sectionTimingText(s)});
      }else if((s.exercises||[]).length){
        for(const it of s.exercises||[]){
          if(it.kind==='run')playerItems.push({kind:'run',section:s.name,format:`Finisher · ${s.format}`,style:s.style,minutes:s.minutes,exercise:`🏃 ${it.runType}`,junior:`${it.value} ${it.unit} · ${it.intensity}`,juniorNote:[s.description,it.route,it.note].filter(Boolean).join(' · '),adultExercise:'',adult:'',adultNote:'',familyMode:false,timing:sectionTimingText(s)});
          else{const ex=map.get(it.exerciseId),aex=map.get(it.adultExerciseId||it.exerciseId);playerItems.push({kind:'exercise',section:s.name,format:`Finisher · ${s.format}`,style:s.style,minutes:s.minutes,exercise:ex?.name||'Finisher-opgave',junior:it.juniorReps||ex?.junior||s.description,juniorNote:[s.rules,it.juniorNote].filter(Boolean).join(' · '),adultExercise:aex?.name||'',adult:it.adultReps||aex?.adult||'',adultNote:it.adultNote||'',familyMode:w.familyMode,timing:sectionTimingText(s)});}
        }
      }else playerItems.push({kind:'exercise',section:s.name,format:`Finisher · ${s.format}`,style:s.style,minutes:s.minutes,exercise:`🏁 ${s.name}`,junior:s.description,juniorNote:s.rules,adultExercise:'',adult:'',adultNote:'',familyMode:false,timing:sectionTimingText(s)});
      continue;
    }
    for(const it of s.exercises||[]){
      if(it.kind==='run'){
        playerItems.push({
          kind:'run',section:s.name,format:s.format,style:s.style,minutes:s.minutes,
          exercise:`🏃 ${it.runType}`,junior:`${it.value} ${it.unit} · ${it.intensity}`,
          juniorNote:[it.route,it.note].filter(Boolean).join(' · '),adultExercise:'',adult:'',adultNote:'',
          familyMode:false,timing:sectionTimingText(s)
        });
        continue;
      }
      const ex=map.get(it.exerciseId),aex=map.get(it.adultExerciseId||it.exerciseId);
      playerItems.push({
        kind:'exercise',section:s.name,format:s.format,style:s.style,minutes:s.minutes,
        exercise:ex?.name||'Ukendt',
        junior:[it.juniorReps,it.juniorKg?`${it.juniorKg} kg`:null].filter(Boolean).join(' · ')||ex?.junior||'-',
        juniorNote:it.juniorNote||'',adultExercise:aex?.name||ex?.name||'Ukendt',
        adult:[it.adultReps,it.adultKg?`${it.adultKg} kg`:null].filter(Boolean).join(' · ')||aex?.adult||'-',
        adultNote:it.adultNote||'',familyMode:w.familyMode,timing:sectionTimingText(s)
      });
    }
  }
  if(!playerItems.length)return alert('Træningen har ingen aktiviteter.');
  playerIndex=0;
  $('#spotifyPlaylistUrl').value=w.music?.spotify||'';
  $('#tidalPlaylistUrl').value=w.music?.tidal||'';
  $('#telmorePlaylistUrl').value=w.music?.telmore||'';
  $('#playerWorkoutName').textContent=w.name;renderPlayer();$('#workoutPlayer').showModal();
}
function renderPlayer(){
  const i=playerItems[playerIndex];
  $('#playerCounter').textContent=`${playerIndex+1} / ${playerItems.length}`;
  $('#playerProgressBar').style.width=`${((playerIndex+1)/playerItems.length)*100}%`;
  $('#playerSection').textContent=i.section;
  $('#playerFormat').textContent=`${i.format} · ${i.style}`;
  $('#playerTiming').textContent=i.timing||`${i.minutes} min`;
  $('#playerExercise').textContent=i.exercise;
  $('#playerJunior').textContent=i.junior;
  $('#playerJuniorNote').textContent=i.juniorNote;
  $('#playerAdultCard').classList.toggle('hidden',!i.familyMode);
  $('#playerAdult').textContent=i.adultExercise===i.exercise?i.adult:`${i.adultExercise}${i.adult?' · '+i.adult:''}`;
  $('#playerAdultNote').textContent=i.adultNote;
  $('#playerNextBtn').textContent=playerIndex===playerItems.length-1?'Afslut ✓':'Næste →';
}

function movePlayer(d){if(!$('#workoutPlayer').open)return;if(d>0&&playerIndex===playerItems.length-1){closePlayer();return}playerIndex=Math.max(0,Math.min(playerItems.length-1,playerIndex+d));renderPlayer()}
function closePlayer(){if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});if($('#workoutPlayer').open)$('#workoutPlayer').close()}
async function toggleFullscreen(){try{if(!document.fullscreenElement)await $('#workoutPlayer').requestFullscreen();else await document.exitFullscreen()}catch{}}
function openPlaylist(url,name){if(!url.trim())return alert(`Indsæt først et link til ${name}.`);window.open(url,'_blank','noopener')}

if('serviceWorker' in navigator)navigator.serviceWorker.register('./service-worker.js');
init().catch(e=>{console.error(e);alert('Appen kunne ikke starte. Genindlæs siden.')});
