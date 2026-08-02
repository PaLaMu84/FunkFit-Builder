
const $=s=>document.querySelector(s);
const byId=id=>document.getElementById(id);
const on=(id,event,handler)=>{
  const el=byId(id);
  if(!el){console.warn(`Mangler element #${id}`);return false}
  el.addEventListener(event,handler);
  return true;
};
const ELEMENT_TYPES=['Ledopvarmning','Opvarmning','Leg','AMRAP','EMOM','YGIG','Chipper','Stationer','Teknik','Styrke','Finisher'];
const FORMATS=['Fælles flow','Teknik','AMRAP','EMOM','E2MOM','For time','Chipper','Stationstræning','Cirkeltræning','Tabata','HIIT-intervaller','Team workout','Stafet','Hyrox station','Musik'];
const ORGANIZATIONS=['Individuelt','Samtidigt','You go, I go','Makker sammen','Hold','Stafet','Fast rotation','Fri rotation','Fælles'];
const CONTROL_TYPES=['Samlet tid','Intervaller','Runder','Reps','Distance','Til opgaven er løst','Sang'];
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

const WKEY='funkfit-workouts-v074a',CKEY='funkfit-custom-v074a',FKEY='funkfit-favorites-v074a',EKEY='funkfit-library-v074a',HKEY='funkfit-ai-history-v074a',PKEY='funkfit-profile-v074a';
let exercises=[],templates=[],sections=[],currentId=null,pickerSection=0,playerItems=[],playerIndex=0;
let plannerConcept='junior',plannerVenue='indoor';
const EQUIPMENT_PROFILES={
  indoor:['Kropsvægt','Måtte','Kettlebell','Håndvægt','Boks','Bænk','Medicinbold','Væg','Kegler','Sjippetov','Elastik','Romaskine'],
  trx:['Kropsvægt','TRX','Måtte'],
  outdoor:['Kropsvægt','Kettlebell','Håndvægt','Kegler','Sjippetov','Sandsæk','Battle rope','Traktordæk','Slæde','Pull-up stativ','Løbebane','Bakke']
};
let plannerEquipment=new Set(EQUIPMENT_PROFILES.indoor);

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
let creationMode='choice',structureChoice='auto',singleSectionTarget=null;



const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch{return f}};
const saveWorkouts=x=>localStorage.setItem(WKEY,JSON.stringify(x));
const workouts=()=>read(WKEY,[]);
const customs=()=>read(CKEY,[]);
const favorites=()=>new Set(read(FKEY,[]));
const elementLibrary=()=>read(EKEY,[]);
const saveElementLibrary=x=>localStorage.setItem(EKEY,JSON.stringify(x));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

const collapsedSections=new Set();



function inferElementType(s){
  const text=`${s?.name||''} ${s?.format||''} ${s?.style||''}`.toLowerCase();
  if(text.includes('ledopvarm')||text.includes('mobilitet led'))return 'Ledopvarmning';
  if(text.includes('opvarm'))return 'Opvarmning';
  if(text.includes('finisher')||text.includes('afslutningssang'))return 'Finisher';
  if(text.includes('leg')||text.includes('stafet'))return 'Leg';
  if(text.includes('amrap'))return 'AMRAP';
  if(text.includes('emom'))return 'EMOM';
  if(text.includes('you go')||text.includes('ygig'))return 'YGIG';
  if(text.includes('chipper'))return 'Chipper';
  if(text.includes('station'))return 'Stationer';
  if(text.includes('teknik'))return 'Teknik';
  return 'Styrke';
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
  if(s?.type==='Finisher')return 'Sang';
  if(s?.organization==='You go, I go'||s?.type==='YGIG')return 'Samlet tid';
  const format=String(s?.format||'').toLowerCase();
  if(format.includes('amrap')||format.includes('emom')||format.includes('e2mom'))return 'Samlet tid';
  if(format.includes('interval')||format.includes('tabata')||format.includes('station'))return 'Intervaller';
  if(format.includes('chipper')||format.includes('for time'))return 'Til opgaven er løst';
  return s?.minutes?'Samlet tid':'Runder';
}
function normalizeActivity(it){
  if(it?.kind==='run'){
    return {
      kind:'run',
      runType:it.runType||'Almindeligt løb',
      value:Number(it.value||200),
      unit:it.unit||'meter',
      intensity:it.intensity||'Moderat',
      route:it.route||'',
      note:it.note||''
    };
  }
  return {...it,kind:'exercise'};
}
function applySectionRules(s){
  s.type=s.type||inferElementType(s);
  s.organization=s.organization||inferOrganization(s);
  s.control=s.control||inferControl(s);

  if(s.type==='YGIG'||s.organization==='You go, I go'){
    s.type=s.type==='YGIG'?'YGIG':s.type;
    s.organization='You go, I go';
    if(['HIIT-intervaller','Tabata','Stationstræning','You go, I go'].includes(s.format))s.format='AMRAP';
    s.control='Samlet tid';
    s.work=0;s.rest=0;
    s.taskPerTurn=s.taskPerTurn||'Byt, når den aftalte opgave er løst';
  }
  if(s.format==='AMRAP'||s.format==='EMOM'||s.format==='E2MOM')s.control='Samlet tid';
  if(['HIIT-intervaller','Tabata','Stationstræning'].includes(s.format)&&s.organization!=='You go, I go')s.control='Intervaller';
  if(['Chipper','For time'].includes(s.format))s.control='Til opgaven er løst';
  if(s.type==='Leg'){
    s.style='Leg';
    if(s.organization==='Individuelt')s.organization='Hold';
    if(!s.control||s.control==='Intervaller')s.control='Samlet tid';
  }
  if(s.type==='Finisher'){
    s.format='Musik';s.organization='Fælles';s.control='Sang';
    s.work=0;s.rest=0;s.rounds=1;s.exercises=[];
  }
  return s;
}
function normalizeSection(s){
  s.type=s.type||inferElementType(s);
  s.description=s.description||'';
  s.rules=s.rules||'';
  s.coachTips=s.coachTips||'';
  s.songTitle=s.songTitle||'';
  s.songArtist=s.songArtist||'';
  s.songUrl=s.songUrl||'';
  s.songMinutes=Number(s.songMinutes||s.minutes||4);
  s.minutes=Number(s.minutes||0);
  s.rounds=Number(s.rounds||1);
  s.work=Number(s.work||0);
  s.rest=Number(s.rest||0);
  s.timeCap=Number(s.timeCap||s.minutes||0);
  s.fundamentalKey=FUNKFIT_FUNDAMENTALS[s.fundamentalKey]?s.fundamentalKey:'';
  s.exercises=(s.exercises||[]).map(normalizeActivity);
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
  const finishers=sections.filter(s=>normalizeSection(s).type==='Finisher');
  const others=sections.filter(s=>normalizeSection(s).type!=='Finisher');
  sections=[...others,...finishers];
}

function defaultSection(type='Stationer'){
  const map={
    'Ledopvarmning':{name:'Ledopvarmning',minutes:5,format:'Fælles flow',organization:'Fælles',control:'Samlet tid',style:'Mobilitet',work:0,rest:0,rounds:1,description:'Kort fælles mobilisering af de store led før pulsopvarmningen.',rules:'Arbejd roligt fra ankler og knæ til hofter, ryg, skuldre og håndled.',coachTips:'Ca. 5 minutter. Ingen høj puls endnu.'},
    'Opvarmning':{name:'Pulsopvarmning',minutes:8,format:'Fælles flow',organization:'Fælles',control:'Samlet tid',style:'Funktionel',work:0,rest:0,rounds:1},
    'Leg':{name:'Ny leg',minutes:8,format:'Stafet',organization:'Hold',control:'Samlet tid',style:'Leg',work:0,rest:0,rounds:1,description:'Beskriv legens idé og formål.',rules:'Skriv de vigtigste regler.',coachTips:'Skriv opstilling, variationer og sikkerhed.'},
    'AMRAP':{name:'AMRAP',minutes:12,format:'AMRAP',organization:'Individuelt',control:'Samlet tid',style:'Funktionel',work:0,rest:0,rounds:1},
    'EMOM':{name:'EMOM',minutes:12,format:'EMOM',organization:'Individuelt',control:'Samlet tid',style:'Funktionel',work:0,rest:0,rounds:1},
    'YGIG':{name:'You go, I go',minutes:12,format:'AMRAP',organization:'You go, I go',control:'Samlet tid',style:'Funktionel',work:0,rest:0,rounds:1,taskPerTurn:'Byt, når den aftalte opgave er løst',description:'Makker A arbejder, mens makker B restituerer eller hepper. Byt efter den aftalte opgave – ikke efter et 40/20-interval.'},
    'Chipper':{name:'Chipper',minutes:15,timeCap:15,format:'Chipper',organization:'Individuelt',control:'Til opgaven er løst',style:'Funktionel',work:0,rest:0,rounds:1},
    'Stationer':{name:'Stationstræning',minutes:18,format:'Stationstræning',organization:'Fast rotation',control:'Intervaller',style:'Funktionel',work:40,rest:20,rounds:3},
    'Teknik':{name:'Teknik',minutes:10,format:'Teknik',organization:'Fælles',control:'Samlet tid',style:'Teknik',work:0,rest:0,rounds:1},
    'Styrke':{name:'Styrkeblok',minutes:15,format:'Fælles flow',organization:'Individuelt',control:'Runder',style:'Funktionel',work:0,rest:0,rounds:3},
    'Finisher':{name:'Finisher – én sang',minutes:4,songMinutes:4,songTitle:'',songArtist:'',songUrl:'',format:'Musik',organization:'Fælles',control:'Sang',style:'Kondition',work:0,rest:0,rounds:1,description:'Afslut træningen med én valgfri sang.',rules:'Finisheren varer fra sangen starter, til den slutter.',coachTips:'Vælg sangen selv. “One More Time” er kun et eksempel i feltet.'}
  };
  return normalizeSection({...map[type],type,exercises:[]});
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
    const fi=sections.findIndex(s=>normalizeSection(s).type==='Finisher');
    fi<0?sections.push(copy):sections.splice(fi,0,copy);
  }
  enforceWorkoutStructure();renderFramework();renderExerciseSections();updateReview();showView('designView');showStep(2);
}
function deleteLibraryElement(id){saveElementLibrary(elementLibrary().filter(x=>x.libraryId!==id));renderElementLibrary()}
function renderElementLibrary(){
  const host=$('#elementLibrary');if(!host)return;const all=elementLibrary();
  host.innerHTML=all.length?all.map(x=>`<article class="saved-card"><p class="eyebrow">${esc(x.type||inferElementType(x))}</p><h3>${esc(x.name)}</h3><p>${x.type==='Finisher'?'Én sang':`${x.minutes||0} min · ${(x.exercises||[]).length} aktiviteter`}</p><p>${esc(x.description||'Ingen beskrivelse')}</p><div class="actions"><button data-use-element="${x.libraryId}">Brug i træning</button><button class="ghost" data-delete-element="${x.libraryId}">Slet</button></div></article>`).join(''):'<div class="empty">Mit bibliotek er tomt. Gem et element fra editoren.</div>';
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
function shouldSuggestRun(section,focus=''){
  const text=`${section?.type||''} ${section?.format||''} ${section?.style||''} ${focus}`.toLowerCase();
  const explicitRun=/\b(løb|løbe|løbetur|run|running|sprint|shuttle)\b/.test(text);
  if(plannerConcept==='hyrox'||explicitRun)return true;
  // Et stærkt specifikt ønske som “masser af mave” skal ikke udvandes
  // af automatisk løb, bare fordi træningen foregår udendørs.
  if(strongCoreRequest([focus]))return false;
  return plannerVenue==='outdoor'&&['AMRAP','Chipper'].includes(section?.format);
}
function suggestOneExercise(index){
  const s=normalizeSection(sections[index]);
  if(s.type==='Finisher')return alert('Finisheren indeholder kun én sang – ikke øvelser.');
  const used=new Set(sections.flatMap(x=>(x.exercises||[]).filter(a=>a.kind!=='run').map(a=>a.exerciseId)));
  const picked=pickExercises(1,goalValues(),s.type==='Leg'?'team':s.type==='Opvarmning'?'warmup':'main',used);
  if(!picked.length)return alert('Jeg kunne ikke finde en ny øvelse med det valgte udstyr.');
  s.exercises.push(makeItem(picked[0]));
  renderExerciseSections();renderFramework();updateReview();
}
function buildGameSuggestion(minutes=8,focus='',theme=''){
  const used=new Set(sections.flatMap(s=>(s.exercises||[]).filter(a=>a.kind!=='run').map(a=>a.exerciseId)));
  const picked=pickExercises(3,[...goalValues(),'Sjov','Samarbejde',focus],'team',used);
  const title=theme?`${theme} – missionen`:'Saml keglerne';
  return normalizeSection({
    type:'Leg',name:title,minutes,format:'Stafet',organization:'Hold',control:'Samlet tid',style:'Leg',
    description:theme
      ?`En aktiv holdleg i temaet “${theme}”, hvor deltagerne løser bevægelsesopgaver og samler point sammen.`
      :'En aktiv holdleg med korte bevægelsesopgaver, samarbejde og mulighed for at samle point.',
    rules:'Del deltagerne i 2-4 hold. Én deltager fra hvert hold løser en opgave og henter en kegle eller markør. Derefter sendes den næste afsted. Ingen elimineres. Flest markører ved tidens udløb vinder.',
    coachTips:'Vis én prøverunde. Hold banen kort, så alle ofte kommer i aktion. Flyt startlinjen eller ændr bevægelsen, hvis der opstår kø.',
    variations:'Gør lettere: kortere afstand og én enkel opgave. Gør sværere: to opgaver, makkertransport eller en kode, der skal huskes.',
    exercises:picked.map(makeItem)
  });
}
function buildSectionSuggestion(type='AMRAP',minutes=12,focus='',theme=''){
  if(type==='Leg')return buildGameSuggestion(minutes,focus,theme);
  if(type==='Teknik'&&isJuniorFamilyContext()){
    return buildFundamentalSection(fundamentalFromFocus(focus),minutes);
  }
  const s=defaultSection(type);
  s.minutes=minutes;
  if(type==='Chipper')s.timeCap=minutes;
  const used=new Set(sections.flatMap(x=>(x.exercises||[]).filter(a=>a.kind!=='run').map(a=>a.exerciseId)));
  const count=type==='Stationer'?6:type==='Chipper'?5:type==='Teknik'?3:4;
  const picked=pickExercises(count,[...goalValues(),focus],type==='Opvarmning'?'warmup':'main',used);
  s.exercises=picked.map(makeItem);
  if(shouldSuggestRun(s,focus)){
    const preset=plannerConcept==='hyrox'?'run-400':plannerVenue==='outdoor'?'run-200':'run-shuttle';
    s.exercises.splice(type==='Chipper'?0:Math.min(1,s.exercises.length),0,makeRunItem(preset));
  }
  if(type==='YGIG'){
    s.format='AMRAP';s.organization='You go, I go';s.control='Samlet tid';s.work=0;s.rest=0;
    s.description='Makkerne arbejder skiftevis i den samlede tid. Byt, når den aftalte mængde eller distance er gennemført.';
    s.rules='Makker A udfører den aftalte opgave. Makker B restituerer eller holder en enkel position. Byt efter opgaven – ikke efter et fast interval.';
  }else{
    s.description=`AI-forslag til ${type.toLowerCase()}${focus?` med fokus på ${focus}`:''}.`;
  }
  s.coachTips=s.coachTips||'Kontrollér belastning, plads og flow. Skalér før start og hold forklaringen kort.';
  return normalizeSection(s);
}
function regenerateSection(index){
  const old=normalizeSection(sections[index]);
  if(old.type==='Finisher'){
    old.songTitle='';old.songArtist='';old.songUrl='';old.exercises=[];
    old.description='Afslut træningen med én valgfri sang.';
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
  const copy=structuredClone(sections[index]);
  copy.name=`${copy.name} – kopi`;
  sections.splice(index+1,0,copy);
  renderFramework();renderExerciseSections();updateReview();
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
  const base=await fetch('data/exercises.json').then(r=>r.json());
  templates=await fetch('data/workoutTemplates.json').then(r=>r.json());
  exercises=[...customs(),...base];
  $('#templateSelect').innerHTML=templates.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  $('#workoutDate').value=new Date().toISOString().slice(0,10);
  sections=prepareTemplateSections(templates[0].sections);
  populatePickerFilters();bind();setCreationMode('choice');verifyInteractiveControls();normalizeSections();enforceWorkoutStructure();renderFramework();renderExerciseSections();renderSaved();renderElementLibrary();updateReview();
}

function bind(){
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>showView(b.dataset.view));
  document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>showStep(+b.dataset.step));
  document.querySelectorAll('[data-next-step]').forEach(b=>b.onclick=()=>showStep(+b.dataset.nextStep));
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).close());

  $('#familyMode').onchange=()=>{
    $('#adultCountLabel').classList.toggle('hidden',!$('#familyMode').checked);
    if($('#familyMode').checked)plannerConcept='family';
    else if(plannerConcept==='family')plannerConcept='junior';
    updateSingleFundamentalVisibility();
    renderFramework();renderExerciseSections();
  };
  $('#loadTemplateBtn').onclick=()=>{sections=prepareTemplateSections(templates.find(t=>t.id===$('#templateSelect').value).sections);enforceWorkoutStructure();renderFramework();renderExerciseSections();updateReview()};
  $('#addSectionBtn').onclick=()=>{const type=prompt('Vælg elementtype: '+ELEMENT_TYPES.join(', '),'Stationer');const chosen=ELEMENT_TYPES.find(x=>x.toLowerCase()===String(type||'').toLowerCase())||'Stationer';const item=defaultSection(chosen);if(chosen==='Ledopvarmning')sections.unshift(item);else if(chosen==='Finisher')sections.push(item);else{const fi=sections.findIndex(s=>normalizeSection(s).type==='Finisher');fi<0?sections.push(item):sections.splice(fi,0,item)}enforceWorkoutStructure();renderFramework();renderExerciseSections();updateReview()};
  $('#saveWorkoutBtn').onclick=saveCurrent;
  $('#playCurrentBtn').onclick=()=>startPlayer(collect());
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
  if($('#aiSectionType'))$('#aiSectionType').onchange=()=>$('#aiGameTheme').closest('label').classList.toggle('hidden',$('#aiSectionType').value!=='Leg');

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
  const required=['manualModeBtn','aiModeBtn','singleSectionModeBtn','manualBuilderTrack','aiPlannerTrack','saveWorkoutBtn','playCurrentBtn','newWorkoutBtn','workoutImageInput','workoutCameraInput','workoutTextFileInput','generateSmartWorkoutBtn','aiBuildSectionBtn','aiBuildGameBtn','clearWorkoutBtn','undoClearWorkoutBtn','runDialog','aiSectionDialog','exerciseInfoDialog'];
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
function fundamentalFromFocus(focus=''){
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
  return matchers.find(([,pattern])=>pattern.test(text))?.[0]||'squat';
}
function makeFundamentalActivity(exerciseId){
  const ex=exercises.find(x=>x.id===exerciseId);
  return normalizeActivity({
    kind:'exercise',
    exerciseId,
    juniorKg:'',
    juniorReps:ex?.junior||'5-8 rolige kvalitetsgentagelser',
    juniorNote:'Fokus på teknik – ikke tempo.',
    adultExerciseId:exerciseId,
    adultKg:'',
    adultReps:ex?.adult||'8-10 kontrollerede gentagelser',
    adultNote:'Skalér, så bevægelseskvaliteten bevares.'
  });
}
function buildFundamentalSection(key='squat',minutes=10){
  const f=FUNKFIT_FUNDAMENTALS[key]||FUNKFIT_FUNDAMENTALS.squat;
  const availableIds=f.exerciseIds.filter(id=>exercises.some(x=>x.id===id));
  const s=defaultSection('Teknik');
  s.fundamentalKey=key;
  s.name=`Teknik – ${f.label} (${f.english})`;
  s.minutes=Math.max(6,+minutes||10);
  s.description=f.description;
  s.rules=f.rules;
  s.coachTips=f.coachTips;
  s.exercises=availableIds.map(makeFundamentalActivity);
  return normalizeSection(s);
}
function applyFundamentalToSection(index,key){
  const current=normalizeSection(sections[index]);
  if(current.type!=='Teknik')return;
  if((current.exercises||[]).length){
    if(!confirm('Vil du erstatte de nuværende aktiviteter med de klassiske FunkFit Fundamentals-øvelser?'))return;
  }
  sections[index]=buildFundamentalSection(key,current.minutes||10);
  renderFramework();renderExerciseSections();updateReview();
}
function renderFundamentalsPicker(s,index,compact=false){
  if(s.type!=='Teknik'||!isJuniorFamilyContext())return '';
  const selected=s.fundamentalKey||'';
  return `<section class="fundamentals-card ${compact?'compact':''}">
    <div class="fundamentals-heading">
      <div>
        <p class="eyebrow">FUNKFIT FUNDAMENTALS</p>
        <h4>Vælg den grundbevægelse, der skal trænes</h4>
      </div>
      ${selected?`<span class="fundamental-selected">${esc(fundamentalTitle(selected))}</span>`:''}
    </div>
    <p class="field-help">Valget indsætter en fast progression med helt klassiske teknikøvelser. Eksisterende aktiviteter erstattes efter bekræftelse.</p>
    <div class="fundamentals-grid">
      ${Object.entries(FUNKFIT_FUNDAMENTALS).map(([key,f])=>`
        <button type="button" class="fundamental-btn ${selected===key?'selected':''}" data-fundamental-section="${index}" data-fundamental-key="${key}">
          <span>${f.icon}</span><strong>${esc(f.label)}</strong><small>${esc(f.english)}</small>
        </button>`).join('')}
    </div>
  </section>`;
}

function sectionActivityCount(s){return s.type==='Finisher'?0:(s.exercises||[]).length}
function sectionTimingText(s){
  s=normalizeSection(s);
  if(s.type==='Finisher')return `Én sang${s.songTitle?` · ${s.songTitle}`:''}`;
  if(s.organization==='You go, I go')return `${s.minutes} min · byt efter opgave`;
  if(s.control==='Intervaller')return `${s.work}/${s.rest} sek. · ${s.rounds} runder`;
  if(s.control==='Runder')return `${s.rounds} runder`;
  if(s.control==='Til opgaven er løst')return s.timeCap?`For time · cap ${s.timeCap} min`:'Til opgaven er løst';
  return `${s.minutes} min`;
}
function sectionSummaryText(s){
  const parts=[s.format,s.organization,sectionTimingText(s)].filter(Boolean);
  return parts.join(' · ');
}
function sectionDynamicFields(s,i){
  if(s.type==='Finisher'){
    return `<div class="finisher-song-card">
      <h4>🎵 Finisher = én sang</h4>
      <p class="field-help">Der tilføjes ingen øvelser til finisheren. “One More Time” er kun et eksempel.</p>
      <label>Sangtitel *<input data-section-index="${i}" data-section-field="songTitle" value="${esc(s.songTitle)}" placeholder="Fx One More Time" required></label>
      <label>Kunstner<input data-section-index="${i}" data-section-field="songArtist" value="${esc(s.songArtist)}" placeholder="Fx Daft Punk"></label>
      <label>Længde (min)<input data-section-index="${i}" data-section-field="songMinutes" type="number" min="1" max="12" step=".1" value="${s.songMinutes||4}"></label>
      <label class="span-2">Link til sang<input data-section-index="${i}" data-section-field="songUrl" type="url" value="${esc(s.songUrl)}" placeholder="TIDAL, Spotify eller YouTube"></label>
    </div>`;
  }
  const timing=s.control==='Intervaller'
    ?`<label>Arbejde (sek.)<input data-section-index="${i}" data-section-field="work" type="number" min="1" value="${s.work||40}"></label>
       <label>Pause (sek.)<input data-section-index="${i}" data-section-field="rest" type="number" min="0" value="${s.rest||20}"></label>
       <label>Runder<input data-section-index="${i}" data-section-field="rounds" type="number" min="1" value="${s.rounds||1}"></label>`
    :s.control==='Runder'
    ?`<label>Runder<input data-section-index="${i}" data-section-field="rounds" type="number" min="1" value="${s.rounds||1}"></label>`
    :s.control==='Til opgaven er løst'
    ?`<label>Time cap (min)<input data-section-index="${i}" data-section-field="timeCap" type="number" min="0" value="${s.timeCap||s.minutes||0}"></label>`
    :`<label>Samlet tid (min)<input data-section-index="${i}" data-section-field="minutes" type="number" min="1" value="${s.minutes||1}"></label>`;
  const ygig=s.organization==='You go, I go'
    ?`<label class="span-2">Opgave pr. tur<input data-section-index="${i}" data-section-field="taskPerTurn" value="${esc(s.taskPerTurn||'Byt, når opgaven er løst')}" placeholder="Fx 10 squats eller 200 m løb – derefter byt"></label>
      <p class="span-2 field-help">You go, I go styres her af samlet tid og opgaven pr. tur. Arbejde/pause-intervaller vises derfor ikke.</p>`
    :'';
  const fundamentals=s.type==='Teknik'?renderFundamentalsPicker(s,i):'';
  return fundamentals+timing+ygig;
}


function renderFramework(){
  normalizeSections();enforceWorkoutStructure();
  $('#frameworkSections').innerHTML=sections.map((s,i)=>{
    const v=sectionVisual(s),collapsed=collapsedSections.has(i),count=sectionActivityCount(s);
    return `<article class="framework-card ${collapsed?'collapsed':''}" style="--section-color:${v.color}">
      <div class="section-card-header">
        <div class="section-title-group">
          <div class="section-icon">${v.icon}</div>
          <div class="section-title-text">
            <h3>${esc(s.name)}</h3>
            <small>${esc(s.type)} · element ${i+1} af ${sections.length}</small>
            <div class="section-badges">
              <span class="section-stat">${esc(sectionTimingText(s))}</span>
              ${s.type!=='Finisher'?`<span class="section-stat">${count} aktiviteter</span>`:''}
              <span class="section-stat">${esc(s.format)}</span>
              <span class="section-stat">${esc(s.organization)}</span>
            </div>
          </div>
        </div>
        <div class="section-card-actions">
          <button class="collapse-btn" data-collapse-framework="${i}">${collapsed?'Fold ud':'Fold sammen'}</button>
          <details class="section-card-menu"><summary>⋮</summary><div class="section-menu-popover">
            ${s.type!=='Finisher'?`<button data-ai-section="${i}">✨ AI-forslag til sektionen</button><button data-regenerate="${i}">🔄 Regenerér sektionen</button><button data-suggest-one="${i}">+ Foreslå én øvelse</button>`:''}
            <button data-save-element="${i}">Gem i Mit bibliotek</button>
            <button data-move-up="${i}">↑ Flyt op</button>
            <button data-move-down="${i}">↓ Flyt ned</button>
            <button data-duplicate="${i}">⧉ Duplikér</button>
            <button data-del-sec="${i}">Slet element</button>
          </div></details>
        </div>
      </div>
      <div class="framework-settings">
        <label>Elementtype<select data-section-index="${i}" data-section-field="type">${ELEMENT_TYPES.map(x=>`<option ${x===s.type?'selected':''}>${x}</option>`).join('')}</select></label>
        <label>Navn<input data-section-index="${i}" data-section-field="name" value="${esc(s.name)}"></label>
        ${s.type!=='Finisher'?`
          <label>Format<select data-section-index="${i}" data-section-field="format">${FORMATS.filter(x=>x!=='Musik').map(x=>`<option ${x===s.format?'selected':''}>${x}</option>`).join('')}</select></label>
          <label>Organisering<select data-section-index="${i}" data-section-field="organization">${ORGANIZATIONS.filter(x=>x!=='Fælles'||['Ledopvarmning','Opvarmning','Teknik'].includes(s.type)).map(x=>`<option ${x===s.organization?'selected':''}>${x}</option>`).join('')}</select></label>
          <label>Styring<select data-section-index="${i}" data-section-field="control">${CONTROL_TYPES.filter(x=>x!=='Sang').map(x=>`<option ${x===s.control?'selected':''}>${x}</option>`).join('')}</select></label>
          <label>Træningsspor<select data-section-index="${i}" data-section-field="style">${STYLES.map(x=>`<option ${x===s.style?'selected':''}>${x}</option>`).join('')}</select></label>
        `:''}
        ${sectionDynamicFields(s,i)}
        <label class="span-2">Beskrivelse<textarea data-section-index="${i}" data-section-field="description" rows="3" placeholder="Hvad går elementet eller legen ud på?">${esc(s.description)}</textarea></label>
        ${s.type!=='Finisher'?`<label class="span-2">Regler<textarea data-section-index="${i}" data-section-field="rules" rows="3" placeholder="Regler, skift og sådan afsluttes elementet">${esc(s.rules)}</textarea></label>
        <label class="span-2">Trænertips<textarea data-section-index="${i}" data-section-field="coachTips" rows="3" placeholder="Opstilling, variationer, skalering og sikkerhed">${esc(s.coachTips)}</textarea></label>`:''}
      </div>
      <div class="element-actions">
        ${s.type!=='Finisher'?`<button data-ai-section="${i}">✨ AI-forslag til denne sektion</button><button class="secondary" data-regenerate="${i}">🔄 Regenerér</button>`:''}
        <button class="secondary" data-save-element="${i}">Gem i Mit bibliotek</button>
      </div>
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
  host.querySelectorAll('[data-ai-section]').forEach(b=>b.onclick=()=>startSingleSectionPlanner(+b.dataset.aiSection));
  host.querySelectorAll('[data-save-element]').forEach(b=>b.onclick=()=>saveSectionToLibrary(+b.dataset.saveElement));
  host.querySelectorAll('[data-del-sec]').forEach(b=>b.onclick=()=>{
    if(sections.length>1){sections.splice(+b.dataset.delSec,1);renderFramework();renderExerciseSections();updateReview()}
  });
  host.querySelectorAll('[data-section-field]').forEach(el=>{
    const structural=['type','format','organization','control'].includes(el.dataset.sectionField);
    const event=el.tagName==='TEXTAREA'||el.tagName==='INPUT'?'input':'change';
    el.addEventListener(event,()=>{
      const i=+el.dataset.sectionIndex,field=el.dataset.sectionField;
      const numeric=['minutes','work','rest','rounds','songMinutes','timeCap'].includes(field);
      sections[i][field]=numeric?(+el.value||0):el.value;
      if(field==='songMinutes'){sections[i].minutes=+el.value||4}
      applySectionRules(sections[i]);
      if(structural){
        renderFramework();renderExerciseSections();
      }else if(['name','minutes','songTitle','songArtist','songMinutes'].includes(field)){
        renderExerciseSections();
      }
      updateReview();
    });
  });
}


function inlineTimingControls(s,si){
  if(s.type==='Finisher')return `<span class="section-stat">Én sang</span>`;
  if(s.organization==='You go, I go'){
    return `<label>Samlet tid <input data-inline-field="minutes" data-inline-index="${si}" type="number" min="1" value="${s.minutes}"> min</label>
      <span class="ygig-note">Byt efter opgaven – ikke efter interval</span>`;
  }
  if(s.control==='Intervaller'){
    return `<label>Arbejde <input data-inline-field="work" data-inline-index="${si}" type="number" min="1" value="${s.work||40}"></label>
      <label>Pause <input data-inline-field="rest" data-inline-index="${si}" type="number" min="0" value="${s.rest||20}"></label>
      <label>Runder <input data-inline-field="rounds" data-inline-index="${si}" type="number" min="1" value="${s.rounds||1}"></label>`;
  }
  if(s.control==='Runder')return `<label>Runder <input data-inline-field="rounds" data-inline-index="${si}" type="number" min="1" value="${s.rounds||1}"></label>`;
  if(s.control==='Til opgaven er løst')return `<label>Time cap <input data-inline-field="timeCap" data-inline-index="${si}" type="number" min="0" value="${s.timeCap||s.minutes||0}"> min</label>`;
  return `<label>Tid <input data-inline-field="minutes" data-inline-index="${si}" type="number" min="1" value="${s.minutes}"> min</label>`;
}
function renderExerciseSections(){
  const fam=$('#familyMode').checked;
  $('#totalMinutes').textContent=sections.reduce((n,s)=>n+(+s.minutes||0),0);
  $('#exerciseSections').innerHTML=sections.map((s,si)=>{
    normalizeSection(s);
    const v=sectionVisual(s),collapsed=collapsedSections.has(si),count=sectionActivityCount(s);
    const progress=Math.round(((si+1)/sections.length)*100);
    const finisher=s.type==='Finisher';
    return `<article class="exercise-section ${collapsed?'collapsed':''}" style="--section-color:${v.color}">
      <div class="section-card-header">
        <div class="section-title-group">
          <div class="section-icon">${finisher?'🎵':v.icon}</div>
          <div class="section-title-text">
            <h3>${esc(s.name)}</h3>
            <small>Sektion ${si+1} af ${sections.length}</small>
            <div class="inline-section-controls">
              ${!finisher?`<label>Format <select data-inline-field="format" data-inline-index="${si}">${FORMATS.filter(x=>x!=='Musik').map(x=>`<option ${x===s.format?'selected':''}>${x}</option>`).join('')}</select></label>
                <label>Organisering <select data-inline-field="organization" data-inline-index="${si}">${ORGANIZATIONS.map(x=>`<option ${x===s.organization?'selected':''}>${x}</option>`).join('')}</select></label>`:''}
              ${inlineTimingControls(s,si)}
              ${!finisher?`<button class="ghost" data-open-activities="${si}">${count} aktiviteter</button>`:''}
            </div>
          </div>
        </div>
        <div class="section-card-actions">
          <button class="collapse-btn" data-collapse-exercise="${si}">${collapsed?'Fold ud':'Fold sammen'}</button>
          <details class="section-card-menu"><summary>⋮</summary><div class="section-menu-popover">
            ${!finisher?`<button data-ai-exercise-section="${si}">✨ AI-forslag til sektionen</button><button data-suggest-one="${si}">+ Foreslå én øvelse</button>`:''}
            <button data-move-up="${si}">↑ Flyt op</button>
            <button data-move-down="${si}">↓ Flyt ned</button>
            <button data-duplicate="${si}">⧉ Duplikér</button>
            <button data-del-section="${si}">Slet sektion</button>
          </div></details>
        </div>
      </div>
      <div class="section-progress"><span>${esc(s.type||v.label)}</span><div class="section-progress-bar"><span style="width:${progress}%"></span></div><span>${progress}%</span></div>
      ${finisher?`<div class="finisher-song-summary finisher-inline-editor">
          <h4>🎵 Finisher = én sang</h4>
          <p>Vælg sangen direkte her. “One More Time” og Daft Punk er kun eksempler.</p>
          <div class="finisher-inline-grid">
            <label>Sangtitel *
              <input data-finisher-field="songTitle" data-finisher-index="${si}" value="${esc(s.songTitle||'')}" placeholder="Fx One More Time">
            </label>
            <label>Kunstner
              <input data-finisher-field="songArtist" data-finisher-index="${si}" value="${esc(s.songArtist||'')}" placeholder="Fx Daft Punk">
            </label>
            <label>Længde (min)
              <input data-finisher-field="songMinutes" data-finisher-index="${si}" type="number" min="1" max="12" step=".1" value="${s.songMinutes||4}">
            </label>
            <label class="span-2">Link til sang
              <input data-finisher-field="songUrl" data-finisher-index="${si}" type="url" value="${esc(s.songUrl||'')}" placeholder="TIDAL, Spotify eller YouTube">
            </label>
            <label class="span-2">Beskrivelse
              <textarea data-finisher-field="description" data-finisher-index="${si}" rows="2" placeholder="Fx fælles afslutning, dans eller high fives">${esc(s.description||'')}</textarea>
            </label>
          </div>
        </div>`:
        `${(s.description||s.rules||s.coachTips)?`<div class="element-summary">${s.description?`<p><strong>Beskrivelse:</strong> ${esc(s.description)}</p>`:''}${s.rules?`<p><strong>Regler:</strong> ${esc(s.rules)}</p>`:''}${s.coachTips?`<p><strong>Trænertips:</strong> ${esc(s.coachTips)}</p>`:''}</div>`:''}
        <div class="element-actions">
          <button data-edit-element="${si}">Redigér beskrivelse og regler</button>
          <button data-ai-exercise-section="${si}">✨ AI-forslag til sektion</button>
          <button class="secondary" data-regenerate-exercise="${si}">🔄 Regenerér</button>
          <button class="secondary" data-save-exercise-element="${si}">Gem i Mit bibliotek</button>
        </div>
        ${s.type==='Teknik'?renderFundamentalsPicker(s,si,true):''}
        <div class="exercise-list">${s.exercises?.length?s.exercises.map((it,ai)=>activityRow(it,si,ai,fam)).join(''):'<div class="empty">Ingen aktiviteter endnu.</div>'}</div>
        <div class="section-add-row">
          <button data-add-ex="${si}">+ Tilføj øvelse</button>
          <button class="secondary" data-add-run="${si}">🏃 Tilføj løb</button>
          <button class="ghost" data-suggest-one="${si}">✨ Foreslå én øvelse</button>
        </div>`}
    </article>`;
  }).join('');

  const host=$('#exerciseSections');
  host.querySelectorAll('[data-fundamental-section]').forEach(b=>b.onclick=()=>applyFundamentalToSection(+b.dataset.fundamentalSection,b.dataset.fundamentalKey));
  host.querySelectorAll('[data-collapse-exercise]').forEach(b=>b.onclick=()=>toggleSectionCollapse(+b.dataset.collapseExercise));
  host.querySelectorAll('[data-move-up]').forEach(b=>b.onclick=()=>moveSection(+b.dataset.moveUp,+b.dataset.moveUp-1));
  host.querySelectorAll('[data-move-down]').forEach(b=>b.onclick=()=>moveSection(+b.dataset.moveDown,+b.dataset.moveDown+1));
  host.querySelectorAll('[data-duplicate]').forEach(b=>b.onclick=()=>duplicateSection(+b.dataset.duplicate));
  host.querySelectorAll('[data-del-section]').forEach(b=>b.onclick=()=>{
    if(sections.length>1){sections.splice(+b.dataset.delSection,1);renderFramework();renderExerciseSections();updateReview()}
  });
  host.querySelectorAll('[data-add-ex]').forEach(b=>b.onclick=()=>openPicker(+b.dataset.addEx));
  host.querySelectorAll('[data-add-run]').forEach(b=>b.onclick=()=>openRunDialog(+b.dataset.addRun));
  host.querySelectorAll('[data-del-activity]').forEach(b=>b.onclick=()=>{
    const[a,c]=b.dataset.delActivity.split('-').map(Number);
    sections[a].exercises.splice(c,1);renderExerciseSections();renderFramework();
  });
  host.querySelectorAll('[data-edit-element]').forEach(b=>b.onclick=()=>{
    const index=+b.dataset.editElement;
    if(sections[index]?.type==='Finisher'){
      document.querySelector(`[data-finisher-index="${index}"][data-finisher-field="songTitle"]`)?.focus();
      return;
    }
    showStep(1);
    setTimeout(()=>document.querySelector(`[data-section-index="${index}"][data-section-field="description"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),50);
  });
  host.querySelectorAll('[data-regenerate-exercise]').forEach(b=>b.onclick=()=>regenerateSection(+b.dataset.regenerateExercise));
  host.querySelectorAll('[data-save-exercise-element]').forEach(b=>b.onclick=()=>saveSectionToLibrary(+b.dataset.saveExerciseElement));
  host.querySelectorAll('[data-ai-exercise-section]').forEach(b=>b.onclick=()=>startSingleSectionPlanner(+b.dataset.aiExerciseSection));
  host.querySelectorAll('[data-suggest-one]').forEach(b=>b.onclick=()=>suggestOneExercise(+b.dataset.suggestOne));
  host.querySelectorAll('[data-finisher-field]').forEach(el=>{
    const event=el.tagName==='SELECT'?'change':'input';
    el.addEventListener(event,()=>{
      const i=+el.dataset.finisherIndex;
      const field=el.dataset.finisherField;
      const value=field==='songMinutes'?(+el.value||4):el.value;
      sections[i][field]=value;
      if(field==='songMinutes')sections[i].minutes=value;
      applySectionRules(sections[i]);
      updateTimeControl();
      updateReview();
    });
  });
  host.querySelectorAll('[data-inline-field]').forEach(el=>el.onchange=()=>{
    const i=+el.dataset.inlineIndex,field=el.dataset.inlineField;
    sections[i][field]=['minutes','work','rest','rounds','timeCap'].includes(field)?(+el.value||0):el.value;
    applySectionRules(sections[i]);
    renderFramework();renderExerciseSections();updateReview();
  });
  host.querySelectorAll('[data-open-activities]').forEach(b=>b.onclick=()=>{
    const card=b.closest('.exercise-section');card?.classList.remove('collapsed');
    card?.querySelector('.exercise-list')?.scrollIntoView({behavior:'smooth',block:'center'});
  });
  bindExerciseInfoButtons(host);
  updateTimeControl();
  bindActivityInputs();
}

function metricInput(label,key,value,si,ei,type='text',options=[]){
  if(options.length)return `<label>${label}<select data-metric="${si}-${ei}-${key}">${options.map(x=>`<option ${x===value?'selected':''}>${x}</option>`).join('')}</select></label>`;
  return `<label>${label}<input data-metric="${si}-${ei}-${key}" type="${type}" value="${esc(value||'')}"></label>`;
}
function trainingFields(it,si,ei){
  it.metrics=it.metrics||{};
  const m=it.metrics,type=selectedTrainingType();
  if(type==='hiit')return `<div class="type-fields"><h4>HIIT</h4>${metricInput('Arbejde (sek.)','work',m.work,si,ei,'number')}${metricInput('Pause (sek.)','rest',m.rest,si,ei,'number')}${metricInput('Runder','rounds',m.rounds,si,ei,'number')}${metricInput('Intensitet','intensity',m.intensity,si,ei,'text',['Moderat','Høj','Maksimal'])}</div>`;
  if(type==='hyrox')return `<div class="type-fields"><h4>Hyrox</h4>${metricInput('Distance','distance',m.distance,si,ei)}${metricInput('Erg-meter','ergMeters',m.ergMeters,si,ei,'number')}${metricInput('Vægt','weight',m.weight,si,ei)}${metricInput('Reps','reps',m.reps,si,ei)}${metricInput('Løbedistance','runDistance',m.runDistance,si,ei)}</div>`;
  if(type==='trx')return `<div class="type-fields"><h4>TRX</h4>${metricInput('Kropsvinkel','bodyAngle',m.bodyAngle,si,ei,'text',['Let','Mellem','Stejl'])}${metricInput('Reps/tid','repsOrTime',m.repsOrTime,si,ei)}${metricInput('Tempo','tempo',m.tempo,si,ei)}${metricInput('Udførelse','laterality',m.laterality,si,ei,'text',['Tosidig','Ensidig'])}</div>`;
  if(type==='adult')return `<div class="type-fields"><h4>Funktionel voksen</h4>${metricInput('Kg','weight',m.weight,si,ei)}${metricInput('Reps','reps',m.reps,si,ei)}${metricInput('Sæt','sets',m.sets,si,ei,'number')}${metricInput('Tempo','tempo',m.tempo,si,ei)}${metricInput('Pause','pause',m.pause,si,ei)}</div>`;
  return '';
}

function runActivityRow(it,si,ai){
  return `<div class="exercise-row run-activity">
    <div class="run-activity-head">
      <div class="run-icon">🏃</div>
      <div><strong>${esc(it.runType)}</strong><small>${esc(`${it.value} ${it.unit} · ${it.intensity}`)}</small></div>
      <button class="ghost" data-del-activity="${si}-${ai}">Fjern</button>
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
function exerciseInfoSection(title,text){
  if(!text||String(text).trim()==='')return '';
  return `<section class="exercise-info-section"><h3>${esc(title)}</h3><p>${esc(String(text))}</p></section>`;
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
    ${exerciseInfoSection('Sådan udføres øvelsen',ex.description||'Der er endnu ikke skrevet en beskrivelse til denne øvelse.')}
    ${exerciseInfoSection('Junior – forslag',ex.junior)}
    ${exerciseInfoSection('Voksen – forslag',ex.adult)}
    ${exerciseInfoSection('Gør den lettere',ex.easier)}
    ${exerciseInfoSection('Gør den sværere',ex.harder)}
    ${exerciseInfoSection('Typiske fejl',ex.mistakes)}
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

function exerciseActivityRow(it,si,ai,fam){
  const ex=exercises.find(x=>x.id===it.exerciseId),type=selectedTrainingType();
  const identity=`<div class="exercise-identity">
    <div><strong>${esc(ex?.name||'Ukendt')}</strong><small>${esc((ex?.bodyAreas||[]).join(' · '))}</small></div>
    ${exerciseInfoButton(ex?.id,`Vis beskrivelse af ${ex?.name||'øvelsen'}`)}
  </div>`;

  const juniorFields=['junior','family'].includes(type)?`<div class="exercise-main">
    ${identity}
    <label>Junior kg<input data-jkg="${si}-${ai}" value="${esc(it.juniorKg||'')}"></label>
    <label>Junior reps/tid<input data-jreps="${si}-${ai}" value="${esc(it.juniorReps||'')}"></label>
    <label>Junior note<input data-jnote="${si}-${ai}" value="${esc(it.juniorNote||'')}"></label>
    <button class="ghost" data-del-activity="${si}-${ai}">Fjern</button>
  </div>`:`<div class="exercise-main compact-exercise">${identity}<button class="ghost" data-del-activity="${si}-${ai}">Fjern</button></div>`;

  const adultExerciseId=it.adultExerciseId||it.exerciseId;
  return `<div class="exercise-row">${juniorFields}${type==='family'?`<div class="adult-settings"><div class="adult-grid">
    <label>Voksenøvelse
      <div class="adult-exercise-choice">
        <select data-aex="${si}-${ai}">${exercises.map(x=>`<option value="${x.id}" ${adultExerciseId===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select>
        <button type="button" class="exercise-info-btn" data-adult-exercise-info="${si}-${ai}" title="Vis beskrivelse af voksenøvelsen" aria-label="Vis beskrivelse af voksenøvelsen">?</button>
      </div>
    </label>
    <label>Voksen kg<input data-akg="${si}-${ai}" value="${esc(it.adultKg||'')}"></label>
    <label>Voksen reps/tid<input data-areps="${si}-${ai}" value="${esc(it.adultReps||'')}"></label>
    <label>Voksen note<input data-anote="${si}-${ai}" value="${esc(it.adultNote||'')}"></label>
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
  host.querySelectorAll('[data-metric]').forEach(e=>e.onchange=()=>{
    const [a,b,key]=e.dataset.metric.split('-');
    sections[+a].exercises[+b].metrics=sections[+a].exercises[+b].metrics||{};
    sections[+a].exercises[+b].metrics[key]=e.value;
  });
  host.querySelectorAll('[data-run-field]').forEach(e=>e.onchange=()=>{
    const [a,b]=e.dataset.runIndex.split('-').map(Number);
    const field=e.dataset.runField;
    sections[a].exercises[b][field]=field==='value'?(+e.value||1):e.value;
    renderFramework();
  });
  bind('[data-jkg]','jkg','juniorKg');
  bind('[data-jreps]','jreps','juniorReps');
  bind('[data-jnote]','jnote','juniorNote');
  bind('[data-aex]','aex','adultExerciseId','change');
  bind('[data-akg]','akg','adultKg');
  bind('[data-areps]','areps','adultReps');
  bind('[data-anote]','anote','adultNote');
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
  $('#pickerGrid').querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{sections[pickerSection].exercises=sections[pickerSection].exercises||[];sections[pickerSection].exercises.push({kind:'exercise',exerciseId:b.dataset.pick,juniorKg:'',juniorReps:'',juniorNote:'',adultExerciseId:b.dataset.pick,adultKg:'',adultReps:'',adultNote:''});$('#exercisePickerDialog').close();renderExerciseSections()});
}
function createExercise(e){
  e.preventDefault();const d=Object.fromEntries(new FormData(e.target)),split=s=>s.split(',').map(x=>x.trim()).filter(Boolean);
  const x={id:'custom-'+crypto.randomUUID(),name:d.name,category:d.category,bodyAreas:split(d.bodyAreas),equipment:split(d.equipment),styles:split(d.styles),difficulty:d.difficulty,description:d.description,junior:d.junior,adult:d.adult};
  const all=customs();all.unshift(x);localStorage.setItem(CKEY,JSON.stringify(all));exercises=[x,...exercises];e.target.reset();$('#newExerciseDialog').close();renderPicker();
}




let runTargetSection=0;
let aiTargetSection=null;
function openRunDialog(sectionIndex){
  if(sections[sectionIndex]?.type==='Finisher')return alert('Finisheren kan ikke indeholde løb eller øvelser.');
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
function openAISectionDialog(mode='section',target=null){
  aiTargetSection=Number.isInteger(target)?target:null;
  const isGame=mode==='game';
  const current=aiTargetSection!==null?normalizeSection(sections[aiTargetSection]):null;
  $('#aiSectionDialogTitle').textContent=isGame?'🎲 Byg en leg':aiTargetSection!==null?'AI-forslag til denne sektion':'Byg en sektion';
  $('#aiSectionType').value=isGame?'Leg':(current?.type==='Finisher'?'AMRAP':current?.type||'AMRAP');
  $('#aiSectionType').disabled=isGame;
  $('#aiSectionMinutes').value=current?.minutes|| (isGame?8:12);
  $('#aiSectionFocus').value='';
  $('#aiGameTheme').closest('label').classList.toggle('hidden',!isGame&&$('#aiSectionType').value!=='Leg');
  $('#aiSectionDialog').dataset.mode=isGame?'game':'section';
  $('#aiSectionDialog').showModal();
}
function submitAISection(e){
  e.preventDefault();
  const type=$('#aiSectionDialog').dataset.mode==='game'?'Leg':$('#aiSectionType').value;
  const section=buildSectionSuggestion(type,+$('#aiSectionMinutes').value||12,$('#aiSectionFocus').value.trim(),$('#aiGameTheme').value.trim());
  if(aiTargetSection!==null){
    sections[aiTargetSection]=section;
  }else{
    const fi=sections.findIndex(s=>normalizeSection(s).type==='Finisher');
    fi<0?sections.push(section):sections.splice(fi,0,section);
  }
  enforceWorkoutStructure();
  $('#aiSectionDialog').close();
  renderFramework();renderExerciseSections();updateReview();showStep(2);
}

function bindPlanner(){
  renderEquipmentChoices();
  document.querySelectorAll('#conceptChoices .choice-card').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#conceptChoices .choice-card').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');plannerConcept=b.dataset.value;
    if(plannerConcept==='trx'){plannerEquipment=new Set(EQUIPMENT_PROFILES.trx);renderEquipmentChoices()}
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
    plannerEquipment=new Set(EQUIPMENT_PROFILES[plannerVenue]);
    $('#venueHint').textContent=plannerVenue==='indoor'
      ?'Indendørs profil: gulv, vægge, bokse, måtter og salens udstyr.'
      :'Udendørs profil: containerudstyr, løbeområde, slæder, sandsække og større redskaber.';
    $('#equipmentProfileText').textContent=plannerVenue==='indoor'?'Standardprofil: Gymnastiksalen':'Standardprofil: Containeren';
    renderEquipmentChoices();
  });
  document.querySelectorAll('#goalChoices .goal-chip').forEach(b=>b.onclick=()=>b.classList.toggle('selected'));
  $('#selectAllEquipmentBtn').onclick=()=>{
    const all=[...new Set(exercises.flatMap(x=>x.equipment||[]).concat(EQUIPMENT_PROFILES.indoor,EQUIPMENT_PROFILES.outdoor))];
    plannerEquipment.size===all.length?plannerEquipment.clear():all.forEach(x=>plannerEquipment.add(x));
    renderEquipmentChoices();
  };
  $('#generateSmartWorkoutBtn').onclick=()=>creationMode==='section'?generateSingleSectionFromPlanner():generateSmartWorkout();
  $('#singleSectionType').onchange=updateSingleFundamentalVisibility;
  $('#plannerDuration').oninput=updateTimeControl;
  updateSingleFundamentalVisibility();
}
function renderEquipmentChoices(){
  if(!$('#equipmentChoices'))return;
  const profile=EQUIPMENT_PROFILES[plannerVenue];
  const fromExercises=[...new Set(exercises.flatMap(x=>x.equipment||[]))];
  const all=[...new Set([...profile,...fromExercises])].sort((a,b)=>{
    const ai=profile.includes(a)?0:1,bi=profile.includes(b)?0:1;
    return ai-bi||a.localeCompare(b,'da');
  });
  $('#equipmentChoices').innerHTML=all.map(eq=>`<label class="equipment-option ${plannerEquipment.has(eq)?'active':''}"><input type="checkbox" data-equipment="${esc(eq)}" ${plannerEquipment.has(eq)?'checked':''}>${esc(eq)}</label>`).join('');
  $('#equipmentChoices').querySelectorAll('[data-equipment]').forEach(c=>c.onchange=()=>{
    c.checked?plannerEquipment.add(c.dataset.equipment):plannerEquipment.delete(c.dataset.equipment);
    c.closest('.equipment-option').classList.toggle('active',c.checked);
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
    teknik:['teknik','teknisk']
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
  if(plannerConcept==='trx'&&(hay.includes('trx')||(ex.equipment||[]).includes('TRX')))score+=12;
  if(plannerConcept==='hyrox'&&hay.includes('hyrox'))score+=8;
  if(plannerConcept==='hiit'&&hay.includes('hiit'))score+=8;
  if(plannerConcept==='adult'&&(ex.audience||[]).includes('Voksen'))score+=2;
  if(plannerVenue==='outdoor'&&(hay.includes('løb')||hay.includes('carry')||hay.includes('stafet')))score+=3;
  if(plannerVenue==='indoor'&&(ex.equipment||[]).some(x=>['Måtte','Boks','Bænk','Væg'].includes(x)))score+=2;
  if($('#useFavoritesFirst').checked&&favorites().has(ex.id))score+=10;

  const recent=aiHistory().flatMap(x=>x.exerciseIds||[]);
  const uses=recent.filter(id=>id===ex.id).length;
  score-=uses*3.5;
  const jitter=(Math.sin((Date.now()/86400000)+(ex.id||'').length*17)+1)*0.9;
  return score+jitter;
}
function pickExercises(count,goals,type,used=new Set()){
  const ranked=exercises.filter(ex=>exerciseAvailable(ex)&&!used.has(ex.id))
    .map(ex=>({ex,score:scoreExercise(ex,goals,type)}))
    .sort((a,b)=>b.score-a.score);

  if(!strongCoreRequest(goals)){
    return ranked.slice(0,count).map(x=>x.ex);
  }

  // “Masser af mave” betyder, at hovedparten skal være direkte
  // mave/core-øvelser – ikke kun øvelser, hvor core hjælper lidt.
  const requiredCore=Math.min(count,Math.max(2,Math.ceil(count*.65)));
  const chosen=ranked.filter(x=>isPrimaryCoreExercise(x.ex)).slice(0,requiredCore);
  const chosenIds=new Set(chosen.map(x=>x.ex.id));
  ranked.filter(x=>!chosenIds.has(x.ex.id)).slice(0,count-chosen.length).forEach(x=>chosen.push(x));
  return chosen.slice(0,count).map(x=>x.ex);
}
function prescriptionFor(ex,adult=false){
  const text=adult?(ex.adult||'8-15 gentagelser'):(ex.junior||'8-12 gentagelser');
  return text.replace(/\.$/,'');
}
function makeItem(ex){
  return {
    exerciseId:ex.id,
    juniorKg:'',juniorReps:prescriptionFor(ex,false),juniorNote:'',
    adultExerciseId:ex.id,adultKg:'',adultReps:prescriptionFor(ex,true),adultNote:'',
    metrics:{
      weight:'',reps:'',sets:'3',tempo:'',pause:'',
      work:'40',rest:'20',rounds:'3',intensity:'Høj',
      distance:'',ergMeters:'',runDistance:'',
      bodyAngle:'Mellem',repsOrTime:prescriptionFor(ex,true),laterality:'Tosidig'
    }
  };
}



function updateSingleFundamentalVisibility(){
  const show=$('#singleSectionType')?.value==='Teknik'&&isJuniorFamilyContext();
  $('#singleFundamentalWrap')?.classList.toggle('hidden',!show);
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
    type=['Ledopvarmning','Finisher'].includes(current.type)?'AMRAP':current.type;
    $('#plannerDuration').value=Math.max(3,Math.min(45,current.minutes||12));
    if($('#plannerBrief')&&!$('#plannerBrief').value.trim()){
      $('#plannerBrief').value=current.description||'';
    }
  }
  if(!type)type='AMRAP';
  if($('#singleSectionType'))$('#singleSectionType').value=type;
  if(singleSectionTarget!==null&&sections[singleSectionTarget]?.fundamentalKey&&$('#singleFundamentalType')){
    $('#singleFundamentalType').value=sections[singleSectionTarget].fundamentalKey;
  }
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

  let section=type==='Leg'
    ?buildGameSuggestion(duration,focus,theme)
    :type==='Teknik'&&isJuniorFamilyContext()
    ?buildFundamentalSection($('#singleFundamentalType')?.value||fundamentalFromFocus(focus),duration)
    :buildSectionSuggestion(type,duration,focus,theme);

  section.minutes=duration;
  section.description=section.description||`AI-forslag til én ${type.toLowerCase()}-sektion.`;
  section.coachTips=[
    section.coachTips,
    `Planlagt til ${participants} deltagere ${plannerVenue==='indoor'?'indendørs':'udendørs'}.`,
    $('#avoidWaiting').checked?'Organisér sektionen, så ventetid og kø undgås.':''
  ].filter(Boolean).join(' ');

  // Section mode must never generate these whole-workout elements.
  if(['Ledopvarmning','Finisher'].includes(section.type)){
    section=buildSectionSuggestion('AMRAP',duration,focus,theme);
  }
  section.exercises=section.type==='Finisher'?[]:(section.exercises||[]);

  if(singleSectionTarget!==null&&sections[singleSectionTarget]){
    sections[singleSectionTarget]=normalizeSection(section);
  }else{
    const finisherIndex=sections.findIndex(s=>normalizeSection(s).type==='Finisher');
    if(finisherIndex<0)sections.push(normalizeSection(section));
    else sections.splice(finisherIndex,0,normalizeSection(section));
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
    <div class="programming-note">Kun denne sektion er bygget. Der er ikke tilføjet ledopvarmning, finisher eller en samlet træningsstruktur.</div>
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
  const includeFinisher=$('#includeTeamChallenge').checked;
  const includeJoint=$('#includeJointWarmup')?.checked!==false;
  const includeGame=['junior','family'].includes(plannerConcept)&&($('#includeGame').checked||goals.includes('Sjov'));
  const theme=['junior','family'].includes(plannerConcept)?$('#plannerTheme').value.trim():'';

  const jointMinutes=includeJoint?5:0;
  const warmMinutes=Math.max(7,Math.round(duration*.13));
  const gameMinutes=includeGame?Math.max(7,Math.round(duration*.13)):0;
  const finisherMinutes=includeFinisher?4:0;
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

  if(includeFinisher){
    sections.push(normalizeSection({
      type:'Finisher',name:'Finisher – én sang',minutes:4,songMinutes:4,
      songTitle:'',songArtist:'',songUrl:'',format:'Musik',organization:'Fælles',control:'Sang',style:'Kondition',
      description:'Vælg én sang som afslutning. “One More Time” er kun vist som eksempel i sangfeltet.',
      rules:'Finisheren varer fra sangen starter, til den slutter.',
      coachTips:'Ingen øvelser tilføjes automatisk til finisheren.',
      exercises:[]
    }));
  }

  enforceWorkoutStructure();
  const conceptNames={junior:'FunkFit Junior',family:'Familietræning',adult:'Funktionel voksentræning',trx:'TRX-træning',hyrox:'Hyrox-træning',hiit:'HIIT-træning'};
  $('#workoutName').value=`${conceptNames[plannerConcept]}${theme?' – '+theme:''} – ${plannerVenue==='indoor'?'inde':'ude'}`;
  $('#participantCount').value=participants;
  $('#familyMode').checked=plannerConcept==='family';
  $('#adultCountLabel').classList.toggle('hidden',plannerConcept!=='family');
  if(plannerConcept==='family')$('#adultCount').value=+$('#plannerAdults').value||10;

  const history=aiHistory();
  history.push({date:new Date().toISOString(),concept:plannerConcept,exerciseIds:sections.flatMap(s=>(s.exercises||[]).filter(a=>a.kind!=='run').map(x=>x.exerciseId))});
  saveAiHistory(history);

  renderFramework();renderExerciseSections();updateReview();
  $('#plannerResult').classList.remove('hidden');
  $('#plannerResult').innerHTML=`<h3>Komplet forslag klar ✓</h3>
    <p><strong>${esc(conceptNames[plannerConcept])}</strong> · ${duration} min · ${participants} deltagere${theme?` · tema: ${esc(theme)}`:''}</p>
    <div class="programming-note">Format, organisering og styring er nu adskilt. YGIG bruger samlet tid og skift efter opgaven – ikke 40/20.</div>
    <ul><li>${sections.length} sektioner: ${sections.map(s=>esc(s.type)).join(' → ')}</li><li>Løb kan optræde som en aktivitet inde i AMRAP, Chipper og Hyrox.</li><li>Finisheren er kun én sang og har ingen øvelser.</li></ul>
    <button id="openGeneratedEditorBtn" type="button">Gennemgå træningen →</button>`;
  $('#openGeneratedEditorBtn').onclick=()=>showStep(2);
  $('#plannerResult').scrollIntoView({behavior:'smooth',block:'center'});
}

function updateTimeControl(){
  const planned=Math.max(0,+$('#plannerDuration')?.value||0);
  const required=sections.filter(s=>normalizeSection(s).type!=='Finisher').reduce((n,s)=>n+(+s.minutes||0),0);
  const optional=sections.filter(s=>normalizeSection(s).type==='Finisher').reduce((n,s)=>n+(+(s.songMinutes||s.minutes)||0),0);
  const total=required+optional,diff=total-planned;
  if($('#plannedMinutes'))$('#plannedMinutes').textContent=planned;
  if($('#totalMinutes'))$('#totalMinutes').textContent=total;
  const el=$('#timeStatus');if(!el)return;
  el.className='time-status '+(required<=planned&&total>=planned-5?'ok':required>planned?'bad':'warn');
  el.textContent=optional
    ?`Fast program: ${required} min + finisher: 1 sang (${optional} min). ${diff>0?`${diff} min over inkl. finisher`:diff<0?`${Math.abs(diff)} min ledig inkl. finisher`:'Tiden passer inkl. finisher'}`
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


async function preprocessImage(file){
  const bitmap=await createImageBitmap(file);
  const maxWidth=1800,scale=Math.max(1,Math.min(3,maxWidth/bitmap.width));
  const canvas=document.createElement('canvas');
  canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
  const img=ctx.getImageData(0,0,canvas.width,canvas.height),d=img.data;
  for(let i=0;i<d.length;i+=4){
    const gray=.299*d[i]+.587*d[i+1]+.114*d[i+2];
    const contrast=Math.max(0,Math.min(255,(gray-128)*1.65+128));
    const value=contrast>185?255:contrast<70?0:contrast;
    d[i]=d[i+1]=d[i+2]=value;
  }
  ctx.putImageData(img,0,0);
  return new Promise(resolve=>canvas.toBlob(resolve,'image/png',1));
}
function levenshtein(a,b){
  a=normalizeText(a);b=normalizeText(b);
  const m=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
  for(let i=0;i<=a.length;i++)m[i][0]=i;for(let j=0;j<=b.length;j++)m[0][j]=j;
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return m[a.length][b.length];
}

async function handleWorkoutImage(e){
  const file=e.target.files?.[0];
  if(!file)return;
  const preview=$('#importImagePreview');
  preview.src=URL.createObjectURL(file);
  preview.classList.remove('hidden');
  $('#ocrStatus').textContent='Aflæser tekst fra billedet…';
  $('#ocrStatus').classList.remove('hidden');

  try{
    const Tesseract=await loadTesseract();
    const processed=await preprocessImage(file);
    const result=await Tesseract.recognize(processed||file,'dan+eng',{
      logger:m=>{
        if(m.status==='recognizing text'){
          $('#ocrStatus').textContent=`Aflæser tekst… ${Math.round((m.progress||0)*100)} %`;
        }
      }
    });
    $('#importWorkoutText').value=result.data.text.trim();
    $('#ocrStatus').textContent='Teksten er aflæst med dansk/engelsk OCR og billedforbedring. Gennemgå de markerede linjer før import.';
  }catch(err){
    console.error(err);
    $('#ocrStatus').textContent='Automatisk tekstaflæsning mislykkedes. Du kan stadig skrive eller indsætte teksten manuelt.';
  }
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

function parseImportedWorkoutText(text){
  const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const proposal=[];
  let current=null;

  const ensureSection=(name='Hovedtræning',minutes=10)=>{
    if(!current){
      current={name,minutes,format:'Stationstræning',style:'Funktionel',work:40,rest:20,rounds:1,exercises:[],unmatched:[]};
      proposal.push(current);
    }
    return current;
  };

  for(const line of lines){
    const sectionName=inferSectionName(line);
    const duration=parseDuration(line);

    if(sectionName){
      current={name:sectionName,minutes:duration||10,format:sectionName==='HIIT'?'HIIT-intervaller':sectionName==='Hyrox'?'Hyrox station':sectionName==='Teknik'?'Teknik':'Stationstræning',style:sectionName==='HIIT'||sectionName==='Hyrox'?'HIIT / Hyrox-inspireret':'Funktionel',work:40,rest:20,rounds:1,exercises:[],unmatched:[]};
      proposal.push(current);
      continue;
    }

    if(duration && line.split(/\s+/).length<=5){
      ensureSection().minutes=duration;
      continue;
    }

    const rounds=parseRounds(line);
    if(rounds){
      ensureSection().rounds=rounds;
      continue;
    }

    const prescription=parsePrescription(line);
    const match=matchExercise(prescription.text);
    const section=ensureSection();

    if(match){
      section.exercises.push({
        exerciseId:match.id,
        juniorKg:'',
        juniorReps:prescription.reps,
        juniorNote:'',
        adultExerciseId:match.id,
        adultKg:'',
        adultReps:prescription.reps,
        adultNote:''
      });
    }else{
      section.unmatched.push(line);
    }
  }

  return proposal.filter(s=>s.exercises.length||s.unmatched.length);
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
        ${s.unmatched.map(x=>`<li class="proposal-unmatched">⚠ Ikke matchet: ${esc(x)}</li>`).join('')}
      </ul>
    </div>`).join('')}
    <button id="useImportProposalBtn" type="button">Brug dette forslag</button>`;

  $('#useImportProposalBtn').onclick=()=>{
    sections=proposal.map(({unmatched,...s})=>s);
    renderFramework();
    renderExerciseSections();
    updateReview();
    $('#importProposal').innerHTML='<strong>Forslaget er indsat i træningen. Du kan nu redigere rammerne og øvelserne.</strong>';
    showStep(1);
  };
}

function clearImportedWorkout(){
  $('#workoutImageInput').value='';
  $('#workoutTextFileInput').value='';
  $('#importWorkoutText').value='';
  $('#importImagePreview').src='';
  $('#importImagePreview').classList.add('hidden');
  $('#ocrStatus').classList.add('hidden');
  $('#importProposal').classList.add('hidden');
  $('#importProposal').innerHTML='';
}

function collect(){return{id:currentId||crypto.randomUUID(),trainingType:selectedTrainingType(),profileId:userProfile().id,theme:$('#plannerTheme')?.value||'',name:$('#workoutName').value,date:$('#workoutDate').value,participants:+$('#participantCount').value,familyMode:$('#familyMode').checked,adultCount:+($('#adultCount').value||0),sections:structuredClone(sections),music:{spotify:$('#spotifyPlaylistUrl').value.trim(),tidal:$('#tidalPlaylistUrl').value.trim(),telmore:$('#telmorePlaylistUrl').value.trim()}}}
function saveCurrent(){
  const missingSong=sections.find(s=>normalizeSection(s).type==='Finisher'&&!s.songTitle.trim());
  if(missingSong)return alert('Vælg en sangtitel til finisheren, før træningen gemmes.');
  const w=collect(),all=workouts().filter(x=>x.id!==w.id);all.unshift(w);saveWorkouts(all);currentId=w.id;renderSaved();alert('Træningen er gemt.')} 
function updateReview(){$('#reviewName').textContent=$('#workoutName').value;$('#reviewSections').textContent=sections.length;$('#reviewMinutes').textContent=sections.reduce((n,s)=>n+(+s.minutes||0),0)}

function renderSaved(){
  const all=workouts();
  $('#savedWorkouts').innerHTML=all.length?all.map(w=>`<article class="saved-card">
    <h3>${esc(w.name)}</h3>
    <p class="meta">${w.date||'Ingen dato'} · ${w.sections.length} sektioner · ${w.sections.reduce((n,s)=>n+(+s.minutes||0),0)} min</p>
    <div class="saved-card-actions">
      <button data-edit="${w.id}">Redigér</button>
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
  $('#workoutName').value=w.name;$('#workoutDate').value=w.date;$('#participantCount').value=w.participants;$('#familyMode').checked=!!w.familyMode;$('#adultCount').value=w.adultCount||0;$('#adultCountLabel').classList.toggle('hidden',!w.familyMode);$('#spotifyPlaylistUrl').value=w.music?.spotify||'';$('#tidalPlaylistUrl').value=w.music?.tidal||'';$('#telmorePlaylistUrl').value=w.music?.telmore||'';sections=structuredClone(w.sections);normalizeSections();renderFramework();renderExerciseSections();updateReview();showView('designView');showStep(1);
}

let clearedWorkoutSnapshot=null;
let clearUndoTimer=null;

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
      importText:$('#importText')?.value||''
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
  if($('#importText'))$('#importText').value=f.importText||'';
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
  if($('#importText'))$('#importText').value='';
  if($('#plannerResult')){
    $('#plannerResult').classList.add('hidden');
    $('#plannerResult').innerHTML='';
  }
  document.querySelectorAll('#conceptChoices .choice-card').forEach(x=>x.classList.toggle('selected',x.dataset.value==='junior'));
  document.querySelectorAll('#venueChoices .choice-card').forEach(x=>x.classList.toggle('selected',x.dataset.value==='indoor'));
  enforceWorkoutStructure();
  renderFramework();renderExerciseSections();updateReview();
}
function clearCurrentWorkout(){
  const hasContent=sections.length||$('#workoutName')?.value||$('#spotifyPlaylistUrl')?.value||$('#tidalPlaylistUrl')?.value||$('#telmorePlaylistUrl')?.value;
  if(!hasContent)return alert('Træningen er allerede tom.');
  if(!confirm('Vil du rydde hele træningen? Handlingen fjerner alt indhold fra den aktuelle kladde.'))return;

  clearedWorkoutSnapshot=draftSnapshot();
  resetDraft({withStructure:false});
  showStep(2);

  const bar=byId('clearUndoBar');
  bar?.classList.remove('hidden');
  clearTimeout(clearUndoTimer);
  clearUndoTimer=setTimeout(()=>{
    bar?.classList.add('hidden');
    clearedWorkoutSnapshot=null;
  },15000);
}
function undoClearWorkout(){
  if(!clearedWorkoutSnapshot)return;
  applyDraftSnapshot(clearedWorkoutSnapshot);
  clearedWorkoutSnapshot=null;
  clearTimeout(clearUndoTimer);
  byId('clearUndoBar')?.classList.add('hidden');
  showStep(2);
}

function newWorkout(){
  singleSectionTarget=null;
  clearedWorkoutSnapshot=null;
  clearTimeout(clearUndoTimer);
  byId('clearUndoBar')?.classList.add('hidden');
  resetDraft({withStructure:true});
  setCreationMode('choice');
  showView('designView');
  showStep(1);
}

function printWorkout(w,mode){
  const map=new Map(exercises.map(x=>[x.id,x]));
  const activityHtml=(it,w)=>{
    if(it.kind==='run'){
      return `<article class="participant-exercise"><h3>🏃 ${esc(it.runType)}</h3><p>${esc(`${it.value} ${it.unit} · ${it.intensity}`)}${it.route?` · ${esc(it.route)}`:''}</p></article>`;
    }
    const ex=map.get(it.exerciseId),adultEx=map.get(it.adultExerciseId||it.exerciseId);
    const adultDiff=w.familyMode&&adultEx&&adultEx.id!==ex?.id;
    return `<article class="participant-exercise"><h3>${esc(ex?.name||'Ukendt øvelse')}${adultDiff?` <small>· Voksen: ${esc(adultEx.name)}</small>`:''}</h3><p>${esc(ex?.description||'Følg instruktørens anvisning.')}</p></article>`;
  };
  const sectionHtml=(raw,w,participant)=>{
    const s=normalizeSection(structuredClone(raw));
    if(s.type==='Finisher'){
      return `<section class="${participant?'participant-section':'print-section'}"><h2><span>${esc(s.name)}</span><span>Én sang</span></h2><article class="participant-exercise"><h3>🎵 ${esc(s.songTitle||'Vælg sang')}</h3><p>${esc(s.songArtist||'')}${s.description?` · ${esc(s.description)}`:''}</p></article></section>`;
    }
    if(participant){
      return `<section class="participant-section"><h2><span>${esc(s.name)}</span><span>${esc(sectionTimingText(s))}</span></h2>${(s.exercises||[]).map(it=>activityHtml(it,w)).join('')}</section>`;
    }
    return `<section class="print-section"><h2>${esc(s.name)} — ${esc(sectionTimingText(s))}</h2><p>${esc(s.format)} · ${esc(s.organization)} · ${esc(s.style)}</p>${(s.exercises||[]).map(it=>{
      if(it.kind==='run')return `<div><strong>🏃 ${esc(it.runType)}</strong><p>${esc(`${it.value} ${it.unit} · ${it.intensity}`)}${it.route?` · ${esc(it.route)}`:''}${it.note?` · ${esc(it.note)}`:''}</p></div>`;
      const ex=map.get(it.exerciseId),aex=map.get(it.adultExerciseId||it.exerciseId);
      return `<div><strong>${esc(ex?.name||'Ukendt')}</strong><p>Junior: ${esc(it.juniorReps||'-')} ${it.juniorKg?`· ${esc(it.juniorKg)} kg`:''}${it.juniorNote?` · ${esc(it.juniorNote)}`:''}</p>${w.familyMode?`<p>Voksen: ${esc(aex?.name||ex?.name||'Ukendt')} · ${esc(it.adultReps||'-')} ${it.adultKg?`· ${esc(it.adultKg)} kg`:''}${it.adultNote?` · ${esc(it.adultNote)}`:''}</p>`:''}</div>`;
    }).join('')}</section>`;
  };
  if(mode==='participant'){
    $('#printView').className='print-view participant-print';
    $('#printView').innerHTML=`<h1>${esc(w.name)}</h1>${w.sections.map(s=>sectionHtml(s,w,true)).join('')}`;
  }else{
    $('#printView').className='print-view';
    $('#printView').innerHTML=`<h1>${esc(w.name)}</h1><p>${w.date||''} · ${w.sections.reduce((n,s)=>n+(+s.minutes||0),0)} min</p>${w.sections.map(s=>sectionHtml(s,w,false)).join('')}`;
  }
  window.print();
}

function startPlayer(w){
  const map=new Map(exercises.map(x=>[x.id,x]));
  playerItems=[];
  for(const raw of w.sections){
    const s=normalizeSection(raw);
    if(s.type==='Finisher'){
      playerItems.push({
        kind:'song',section:s.name,format:'Finisher',style:s.style,minutes:s.songMinutes||s.minutes,
        exercise:s.songTitle?`🎵 ${s.songTitle}`:'🎵 Vælg sang',
        junior:s.songArtist||'Én sang',juniorNote:s.description||'',adultExercise:'',adult:'',adultNote:'',familyMode:false,
        timing:sectionTimingText(s)
      });
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
