
const $=s=>document.querySelector(s);
const byId=id=>document.getElementById(id);
const on=(id,event,handler)=>{
  const el=byId(id);
  if(!el){console.warn(`Mangler element #${id}`);return false}
  el.addEventListener(event,handler);
  return true;
};
const ELEMENT_TYPES=['Ledopvarmning','Opvarmning','Leg','AMRAP','EMOM','YGIG','Chipper','Stationer','Teknik','Styrke','Finisher'];
const FORMATS=['Fælles flow','Teknik','Stationstræning','Cirkeltræning','AMRAP','EMOM','E2MOM','For time','Chipper','Tabata','HIIT-intervaller','You go, I go','Makkertræning','Team workout','Stafet','Hyrox station'];
const STYLES=['Funktionel','CrossFit-inspireret','HIIT / Hyrox-inspireret','Teknik','Leg','Mobilitet','Kondition'];
const WKEY='funkfit-workouts-v072',CKEY='funkfit-custom-v072',FKEY='funkfit-favorites-v072',EKEY='funkfit-library-v072',HKEY='funkfit-ai-history-v072',PKEY='funkfit-profile-v072';
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
let creationMode='manual',structureChoice='auto';



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
  if(text.includes('finisher')||text.includes('teamchallenge'))return 'Finisher';
  if(text.includes('leg')||text.includes('stafet'))return 'Leg';
  if(text.includes('amrap'))return 'AMRAP';
  if(text.includes('emom'))return 'EMOM';
  if(text.includes('you go')||text.includes('ygig')||text.includes('makker'))return 'YGIG';
  if(text.includes('chipper'))return 'Chipper';
  if(text.includes('station'))return 'Stationer';
  if(text.includes('teknik'))return 'Teknik';
  return 'Styrke';
}
function normalizeSection(s){
  s.type=s.type||inferElementType(s);
  s.description=s.description||'';s.rules=s.rules||'';s.coachTips=s.coachTips||'';s.songTitle=s.songTitle||'';s.songArtist=s.songArtist||'';s.songUrl=s.songUrl||'';s.songMinutes=Number(s.songMinutes||s.minutes||4);
  s.exercises=s.exercises||[];return s;
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
    'Ledopvarmning':{name:'Ledopvarmning',minutes:5,format:'Fælles flow',style:'Mobilitet',work:0,rest:0,rounds:1,description:'Kort fælles mobilisering af de store led før pulsopvarmningen.',rules:'Arbejd roligt fra ankler og knæ til hofter, ryg, skuldre og håndled.',coachTips:'Ca. 5 minutter. Ingen høj puls endnu.'},
    'Opvarmning':{name:'Opvarmning',minutes:8,format:'Fælles flow',style:'Funktionel',work:35,rest:15,rounds:2},
    'Leg':{name:'Ny leg',minutes:8,format:'Stafet',style:'Leg',work:0,rest:0,rounds:1,description:'Beskriv legens idé og formål.',rules:'Skriv de vigtigste regler.',coachTips:'Skriv opstilling, variationer og sikkerhed.'},
    'AMRAP':{name:'AMRAP',minutes:12,format:'AMRAP',style:'Funktionel',work:0,rest:0,rounds:1},
    'EMOM':{name:'EMOM',minutes:12,format:'EMOM',style:'Funktionel',work:45,rest:15,rounds:3},
    'YGIG':{name:'YGIG',minutes:12,format:'You go, I go',style:'Funktionel',work:0,rest:0,rounds:3},
    'Chipper':{name:'Chipper',minutes:15,format:'Chipper',style:'Funktionel',work:0,rest:0,rounds:1},
    'Stationer':{name:'Stationstræning',minutes:18,format:'Stationstræning',style:'Funktionel',work:40,rest:20,rounds:3},
    'Teknik':{name:'Teknik',minutes:10,format:'Teknik',style:'Teknik',work:0,rest:0,rounds:1},
    'Styrke':{name:'Styrkeblok',minutes:15,format:'Fælles flow',style:'Funktionel',work:0,rest:0,rounds:3},
    'Finisher':{name:'Finisher – én sang',minutes:4,songMinutes:4,songTitle:'',songArtist:'',songUrl:'',format:'Team workout',style:'Kondition',work:40,rest:20,rounds:1}
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
  host.innerHTML=all.length?all.map(x=>`<article class="saved-card"><p class="eyebrow">${esc(x.type||inferElementType(x))}</p><h3>${esc(x.name)}</h3><p>${x.minutes||0} min · ${(x.exercises||[]).length} øvelser</p><p>${esc(x.description||'Ingen beskrivelse')}</p><div class="actions"><button data-use-element="${x.libraryId}">Brug i træning</button><button class="ghost" data-delete-element="${x.libraryId}">Slet</button></div></article>`).join(''):'<div class="empty">Mit bibliotek er tomt. Gem et element fra editoren.</div>';
  host.querySelectorAll('[data-use-element]').forEach(b=>b.onclick=()=>useLibraryElement(b.dataset.useElement));
  host.querySelectorAll('[data-delete-element]').forEach(b=>b.onclick=()=>deleteLibraryElement(b.dataset.deleteElement));
}
function regenerateSection(index){
  const old=normalizeSection(sections[index]), used=new Set(sections.flatMap((s,i)=>i===index?[]:(s.exercises||[]).map(x=>x.exerciseId)));
  const goals=goalValues();let count=Math.max(3,(old.exercises||[]).length||4);
  let type=old.type;
  const picked=pickExercises(count,goals,type==='Leg'?'team':type==='Opvarmning'?'warmup':'main',used);
  old.exercises=picked.map(makeItem);
  if(type==='Leg'){
    const names=picked.slice(0,2).map(x=>x.name).join(' og ');
    old.description=`En aktiv holdleg med ${names||'bevægelse og samarbejde'}. Alle skal være i gang mest muligt.`;
    old.rules='Del deltagerne i hold. Én opgave ad gangen. Holdet scorer et point ved korrekt gennemført runde. Justér banen, så der ikke opstår kø.';
    old.coachTips='Vis banen kort, lav en prøverunde og stop mens energien stadig er høj. Hav en lettere variant klar.';
  } else {
    old.description=`Nyt AI-forslag til ${old.type.toLowerCase()} med fokus på ${goals.join(', ')||'helkrop'}.`;
    old.coachTips='Tjek belastning og skaler gentagelser efter niveau. Hold instruktionen kort.';
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


async function init(){
  const base=await fetch('data/exercises.json').then(r=>r.json());
  templates=await fetch('data/workoutTemplates.json').then(r=>r.json());
  exercises=[...customs(),...base];
  $('#templateSelect').innerHTML=templates.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  $('#workoutDate').value=new Date().toISOString().slice(0,10);
  sections=[defaultSection('Ledopvarmning'),...structuredClone(templates[0].sections)];
  populatePickerFilters();bind();setCreationMode(userProfile().preferredMode||'manual');verifyInteractiveControls();normalizeSections();enforceWorkoutStructure();renderFramework();renderExerciseSections();renderSaved();renderElementLibrary();updateReview();
}

function bind(){
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>showView(b.dataset.view));
  document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>showStep(+b.dataset.step));
  document.querySelectorAll('[data-next-step]').forEach(b=>b.onclick=()=>showStep(+b.dataset.nextStep));
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).close());

  $('#familyMode').onchange=()=>{$('#adultCountLabel').classList.toggle('hidden',!$('#familyMode').checked);renderExerciseSections()};
  $('#loadTemplateBtn').onclick=()=>{sections=structuredClone(templates.find(t=>t.id===$('#templateSelect').value).sections);renderFramework();renderExerciseSections();updateReview()};
  $('#addSectionBtn').onclick=()=>{const type=prompt('Vælg elementtype: '+ELEMENT_TYPES.join(', '),'Stationer');const chosen=ELEMENT_TYPES.find(x=>x.toLowerCase()===String(type||'').toLowerCase())||'Stationer';const item=defaultSection(chosen);if(chosen==='Ledopvarmning')sections.unshift(item);else if(chosen==='Finisher')sections.push(item);else{const fi=sections.findIndex(s=>normalizeSection(s).type==='Finisher');fi<0?sections.push(item):sections.splice(fi,0,item)}enforceWorkoutStructure();renderFramework();renderExerciseSections();updateReview()};
  $('#saveWorkoutBtn').onclick=saveCurrent;
  $('#playCurrentBtn').onclick=()=>startPlayer(collect());
  $('#newWorkoutBtn').onclick=newWorkout;
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
  $('#workoutCameraInput').onchange=handleWorkoutImage;
  document.querySelectorAll('#structureChoices .structure-chip').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#structureChoices .structure-chip').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');structureChoice=b.dataset.value;
  });

  $('#workoutTextFileInput').onchange=handleWorkoutTextFile;
  $('#analyzeImportBtn').onclick=analyzeImportedWorkout;
  $('#clearImportBtn').onclick=clearImportedWorkout;
  bindPlanner();


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
  creationMode=mode==='ai'?'ai':'manual';
  const manualBtn=byId('manualModeBtn');
  const aiBtn=byId('aiModeBtn');
  const aiTrack=byId('aiPlannerTrack');
  const manualTrack=byId('manualBuilderTrack');
  const hint=byId('creationModeHint');

  manualBtn?.classList.toggle('selected',creationMode==='manual');
  aiBtn?.classList.toggle('selected',creationMode==='ai');

  if(aiTrack){
    aiTrack.classList.toggle('hidden',creationMode!=='ai');
    aiTrack.setAttribute('aria-hidden',String(creationMode!=='ai'));
  }
  if(manualTrack){
    manualTrack.open=creationMode==='manual';
    manualTrack.classList.toggle('hidden',creationMode!=='manual');
  }
  if(hint){
    hint.textContent=creationMode==='manual'
      ?'Builder er standard. Du bestemmer selv strukturen og kan bruge skabeloner eller import.'
      :'AI laver et komplet forslag, som bagefter åbnes i den almindelige Builder.';
  }
  const profile=userProfile();
  profile.preferredMode=creationMode;
  saveUserProfile(profile);
  setTimeout(()=>{(creationMode==='ai'?aiTrack:manualTrack)?.scrollIntoView({behavior:'smooth',block:'start'})},50);
}
function selectedTrainingType(){return plannerConcept||'junior'}

function verifyInteractiveControls(){
  const required=['manualModeBtn','aiModeBtn','manualBuilderTrack','aiPlannerTrack','saveWorkoutBtn','playCurrentBtn','newWorkoutBtn','workoutImageInput','workoutCameraInput','workoutTextFileInput','generateSmartWorkoutBtn'];
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

function renderFramework(){
  normalizeSections();enforceWorkoutStructure();
  $('#frameworkSections').innerHTML=sections.map((s,i)=>{
    const v=sectionVisual(s),collapsed=collapsedSections.has(i),count=(s.exercises||[]).length;
    return `<article class="framework-card ${collapsed?'collapsed':''}" style="--section-color:${v.color}">
      <div class="section-card-header"><div class="section-title-group"><div class="section-icon">${v.icon}</div><div class="section-title-text"><h3>${esc(s.name)}</h3><small>${esc(s.type)} · element ${i+1} af ${sections.length}</small><div class="section-badges"><span class="section-stat">${s.minutes} min</span><span class="section-stat">${count} øvelser</span><span class="section-stat">${esc(s.format)}</span></div></div></div>
      <div class="section-card-actions"><button class="collapse-btn" data-collapse-framework="${i}">${collapsed?'Fold ud':'Fold sammen'}</button><details class="section-card-menu"><summary>⋮</summary><div class="section-menu-popover"><button data-regenerate="${i}">✨ Regenerér element</button><button data-save-element="${i}">Gem i Mit bibliotek</button><button data-move-up="${i}">↑ Flyt op</button><button data-move-down="${i}">↓ Flyt ned</button><button data-duplicate="${i}">⧉ Duplikér</button><button data-del-sec="${i}">Slet element</button></div></details></div></div>
      <div class="framework-settings">
        <label>Elementtype<select data-sec-type="${i}">${ELEMENT_TYPES.map(x=>`<option ${x===s.type?'selected':''}>${x}</option>`).join('')}</select></label>
        <label>Navn<input data-sec-name="${i}" value="${esc(s.name)}"></label>
        <label>Minutter<input data-sec-min="${i}" type="number" min="0" value="${s.minutes}"></label>
        <label>Format<select data-sec-format="${i}">${FORMATS.map(x=>`<option ${x===s.format?'selected':''}>${x}</option>`).join('')}</select></label>
        <label>Træningsspor<select data-sec-style="${i}">${STYLES.map(x=>`<option ${x===s.style?'selected':''}>${x}</option>`).join('')}</select></label>
        <label>Arbejde (sek.)<input data-sec-work="${i}" type="number" value="${s.work||0}"></label><label>Pause (sek.)<input data-sec-rest="${i}" type="number" value="${s.rest||0}"></label><label>Runder<input data-sec-rounds="${i}" type="number" min="1" value="${s.rounds||1}"></label>
        <label class="span-2">Beskrivelse<textarea data-sec-description="${i}" rows="3" placeholder="Hvad går elementet eller legen ud på?">${esc(s.description)}</textarea></label>
        <label class="span-2">Regler<textarea data-sec-rules="${i}" rows="3" placeholder="Regler, point, skift og sådan afsluttes elementet">${esc(s.rules)}</textarea></label>
        <label class="span-2">Trænertips<textarea data-sec-tips="${i}" rows="3" placeholder="Opstilling, variationer, skalering og sikkerhed">${esc(s.coachTips)}</textarea></label>
        ${s.type==='Finisher'?`<div class="finisher-song-card"><h4>🎵 Finisher = én sang</h4>
          <label>Sangtitel *<input data-sec-song-title="${i}" value="${esc(s.songTitle)}" placeholder="Fx One More Time" required></label>
          <label>Kunstner<input data-sec-song-artist="${i}" value="${esc(s.songArtist)}" placeholder="Fx Daft Punk"></label>
          <label>Længde (min)<input data-sec-song-minutes="${i}" type="number" min="1" max="12" step=".1" value="${s.songMinutes||4}"></label>
          <label class="span-2">Link til sang<input data-sec-song-url="${i}" type="url" value="${esc(s.songUrl)}" placeholder="TIDAL, Spotify eller Telmore-link"></label>
        </div>`:''}
      </div>
      <div class="element-actions"><button data-regenerate="${i}">✨ Regenerér dette element</button><button class="secondary" data-save-element="${i}">Gem i Mit bibliotek</button></div>
    </article>`;
  }).join('');
  const host=$('#frameworkSections');
  host.querySelectorAll('[data-collapse-framework]').forEach(b=>b.onclick=()=>toggleSectionCollapse(+b.dataset.collapseFramework));
  host.querySelectorAll('[data-move-up]').forEach(b=>b.onclick=()=>moveSection(+b.dataset.moveUp,+b.dataset.moveUp-1));
  host.querySelectorAll('[data-move-down]').forEach(b=>b.onclick=()=>moveSection(+b.dataset.moveDown,+b.dataset.moveDown+1));
  host.querySelectorAll('[data-duplicate]').forEach(b=>b.onclick=()=>duplicateSection(+b.dataset.duplicate));
  host.querySelectorAll('[data-regenerate]').forEach(b=>b.onclick=()=>regenerateSection(+b.dataset.regenerate));
  host.querySelectorAll('[data-save-element]').forEach(b=>b.onclick=()=>saveSectionToLibrary(+b.dataset.saveElement));
  host.querySelectorAll('[data-sec-type]').forEach(e=>e.onchange=()=>{const i=+e.dataset.secType;sections[i].type=e.value;if(e.value==='Leg'){sections[i].style='Leg';sections[i].format='Stafet'}if(e.value==='Finisher')enforceWorkoutStructure();renderFramework();renderExerciseSections();updateReview()});
  const bindings=[['[data-sec-name]','secName','name','input'],['[data-sec-min]','secMin','minutes','input'],['[data-sec-format]','secFormat','format','change'],['[data-sec-style]','secStyle','style','change'],['[data-sec-work]','secWork','work','input'],['[data-sec-rest]','secRest','rest','input'],['[data-sec-rounds]','secRounds','rounds','input'],['[data-sec-description]','secDescription','description','input'],['[data-sec-rules]','secRules','rules','input'],['[data-sec-tips]','secTips','coachTips','input'],['[data-sec-song-title]','secSongTitle','songTitle','input'],['[data-sec-song-artist]','secSongArtist','songArtist','input'],['[data-sec-song-url]','secSongUrl','songUrl','input'],['[data-sec-song-minutes]','secSongMinutes','songMinutes','input']];
  bindings.forEach(([sel,key,prop,ev])=>host.querySelectorAll(sel).forEach(e=>e['on'+ev]=()=>{const i=+e.dataset[key];sections[i][prop]=['minutes','work','rest','rounds','songMinutes'].includes(prop)?(+e.value||0):e.value;if(prop==='songMinutes'){sections[i].minutes=+e.value||4;}if(prop==='name'||prop==='minutes')renderExerciseSections();updateReview()}));
  host.querySelectorAll('[data-del-sec]').forEach(b=>b.onclick=()=>{if(sections.length>1){sections.splice(+b.dataset.delSec,1);renderFramework();renderExerciseSections();updateReview()}});
}

function renderExerciseSections(){
  const fam=$('#familyMode').checked;
  $('#totalMinutes').textContent=sections.reduce((n,s)=>n+(+s.minutes||0),0);
  $('#exerciseSections').innerHTML=sections.map((s,si)=>{
    const v=sectionVisual(s),collapsed=collapsedSections.has(si),count=(s.exercises||[]).length;
    const progress=Math.round(((si+1)/sections.length)*100);
    return `<article class="exercise-section ${collapsed?'collapsed':''}" style="--section-color:${v.color}">
      <div class="section-card-header">
        <div class="section-title-group">
          <div class="section-icon">${v.icon}</div>
          <div class="section-title-text">
            <h3>${esc(s.name)}</h3>
            <small>Sektion ${si+1} af ${sections.length}</small>
            <div class="inline-section-controls">
              <label>Tid <input data-inline-min="${si}" type="number" min="0" value="${s.minutes}"> min</label>
              <label>Format <select data-inline-format="${si}">${FORMATS.map(x=>`<option ${x===s.format?'selected':''}>${x}</option>`).join('')}</select></label>
              <label>Arbejde <input data-inline-work="${si}" type="number" min="0" value="${s.work||0}"></label>
              <label>Pause <input data-inline-rest="${si}" type="number" min="0" value="${s.rest||0}"></label>
              <label>Runder <input data-inline-rounds="${si}" type="number" min="1" value="${s.rounds||1}"></label>
              <button class="ghost" data-open-exercises="${si}">${count} øvelser</button>
            </div>
          </div>
        </div>
        <div class="section-card-actions">
          <button class="collapse-btn" data-collapse-exercise="${si}">${collapsed?'Fold ud':'Fold sammen'}</button>
          <details class="section-card-menu">
            <summary>⋮</summary>
            <div class="section-menu-popover">
              <button data-move-up="${si}">↑ Flyt op</button>
              <button data-move-down="${si}">↓ Flyt ned</button>
              <button data-duplicate="${si}">⧉ Duplikér</button>
              <button data-del-section="${si}">Slet sektion</button>
            </div>
          </details>
        </div>
      </div>
      <div class="section-progress"><span>${esc(s.type||v.label)}</span><div class="section-progress-bar"><span style="width:${progress}%"></span></div><span>${progress}%</span></div>
      ${s.type==='Finisher'?`<div class="finisher-song-summary"><strong>🎵 ${esc(s.songTitle||'Vælg sang')}</strong>${s.songArtist?` · ${esc(s.songArtist)}`:''} · én sang</div>`:''}${(s.description||s.rules||s.coachTips)?`<div class="element-summary">${s.description?`<p><strong>Beskrivelse:</strong> ${esc(s.description)}</p>`:''}${s.rules?`<p><strong>Regler:</strong> ${esc(s.rules)}</p>`:''}${s.coachTips?`<p><strong>Trænertips:</strong> ${esc(s.coachTips)}</p>`:''}</div>`:''}
      <div class="element-actions"><button data-edit-element="${si}">Redigér beskrivelse og regler</button><button data-regenerate-exercise="${si}">✨ Regenerér element</button><button class="secondary" data-save-exercise-element="${si}">Gem i Mit bibliotek</button></div>
      <div class="exercise-list">${s.exercises?.length?s.exercises.map((it,ei)=>exerciseRow(it,si,ei,fam)).join(''):'<div class="empty">Ingen øvelser endnu.</div>'}</div>
      <div class="section-add-row"><button data-add-ex="${si}">+ Tilføj øvelse</button></div>
    </article>`;
  }).join('');

  $('#exerciseSections').querySelectorAll('[data-collapse-exercise]').forEach(b=>b.onclick=()=>toggleSectionCollapse(+b.dataset.collapseExercise));
  $('#exerciseSections').querySelectorAll('[data-move-up]').forEach(b=>b.onclick=()=>moveSection(+b.dataset.moveUp,+b.dataset.moveUp-1));
  $('#exerciseSections').querySelectorAll('[data-move-down]').forEach(b=>b.onclick=()=>moveSection(+b.dataset.moveDown,+b.dataset.moveDown+1));
  $('#exerciseSections').querySelectorAll('[data-duplicate]').forEach(b=>b.onclick=()=>duplicateSection(+b.dataset.duplicate));
  $('#exerciseSections').querySelectorAll('[data-del-section]').forEach(b=>b.onclick=()=>{if(sections.length>1){sections.splice(+b.dataset.delSection,1);renderFramework();renderExerciseSections();updateReview()}});
  $('#exerciseSections').querySelectorAll('[data-add-ex]').forEach(b=>b.onclick=()=>openPicker(+b.dataset.addEx));
  $('#exerciseSections').querySelectorAll('[data-del-ex]').forEach(b=>b.onclick=()=>{const[a,c]=b.dataset.delEx.split('-').map(Number);sections[a].exercises.splice(c,1);renderExerciseSections()});
  $('#exerciseSections').querySelectorAll('[data-edit-element]').forEach(b=>b.onclick=()=>{showStep(1);setTimeout(()=>document.querySelector(`[data-sec-description="${b.dataset.editElement}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),50)});
  $('#exerciseSections').querySelectorAll('[data-regenerate-exercise]').forEach(b=>b.onclick=()=>regenerateSection(+b.dataset.regenerateExercise));
  $('#exerciseSections').querySelectorAll('[data-save-exercise-element]').forEach(b=>b.onclick=()=>saveSectionToLibrary(+b.dataset.saveExerciseElement));

  $('#exerciseSections').querySelectorAll('[data-inline-min]').forEach(e=>e.onchange=()=>{const i=+e.dataset.inlineMin;sections[i].minutes=+e.value||0;renderFramework();renderExerciseSections();updateReview()});
  $('#exerciseSections').querySelectorAll('[data-inline-format]').forEach(e=>e.onchange=()=>{const i=+e.dataset.inlineFormat;sections[i].format=e.value;sections[i].type=inferElementType(sections[i]);renderFramework();renderExerciseSections();updateReview()});
  $('#exerciseSections').querySelectorAll('[data-inline-work]').forEach(e=>e.onchange=()=>{sections[+e.dataset.inlineWork].work=+e.value||0;updateReview()});
  $('#exerciseSections').querySelectorAll('[data-inline-rest]').forEach(e=>e.onchange=()=>{sections[+e.dataset.inlineRest].rest=+e.value||0;updateReview()});
  $('#exerciseSections').querySelectorAll('[data-inline-rounds]').forEach(e=>e.onchange=()=>{sections[+e.dataset.inlineRounds].rounds=+e.value||1;updateReview()});
  $('#exerciseSections').querySelectorAll('[data-open-exercises]').forEach(b=>b.onclick=()=>{const card=b.closest('.exercise-section');card?.classList.remove('collapsed');card?.querySelector('.exercise-list')?.scrollIntoView({behavior:'smooth',block:'center'})});
  updateTimeControl();
  bindExerciseInputs();
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
function exerciseRow(it,si,ei,fam){
  const ex=exercises.find(x=>x.id===it.exerciseId),type=selectedTrainingType();
  const juniorFields=['junior','family'].includes(type)?`<div class="exercise-main">
    <div><strong>${esc(ex?.name||'Ukendt')}</strong><small>${esc((ex?.bodyAreas||[]).join(' · '))}</small></div>
    <label>Junior kg<input data-jkg="${si}-${ei}" value="${esc(it.juniorKg||'')}"></label>
    <label>Junior reps/tid<input data-jreps="${si}-${ei}" value="${esc(it.juniorReps||'')}"></label>
    <label>Junior note<input data-jnote="${si}-${ei}" value="${esc(it.juniorNote||'')}"></label>
    <button class="ghost" data-del-ex="${si}-${ei}">Fjern</button>
  </div>`:`<div class="exercise-main compact-exercise"><div><strong>${esc(ex?.name||'Ukendt')}</strong><small>${esc((ex?.bodyAreas||[]).join(' · '))}</small></div><button class="ghost" data-del-ex="${si}-${ei}">Fjern</button></div>`;
  return `<div class="exercise-row">${juniorFields}${type==='family'?`<div class="adult-settings"><div class="adult-grid">
    <label>Voksenøvelse<select data-aex="${si}-${ei}">${exercises.map(x=>`<option value="${x.id}" ${(it.adultExerciseId||it.exerciseId)===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label>
    <label>Voksen kg<input data-akg="${si}-${ei}" value="${esc(it.adultKg||'')}"></label>
    <label>Voksen reps/tid<input data-areps="${si}-${ei}" value="${esc(it.adultReps||'')}"></label>
    <label>Voksen note<input data-anote="${si}-${ei}" value="${esc(it.adultNote||'')}"></label>
  </div></div>`:''}${trainingFields(it,si,ei)}</div>`;
}
function bindExerciseInputs(){
  const bind=(sel,key,prop,ev='input')=>$('#exerciseSections').querySelectorAll(sel).forEach(e=>e['on'+ev]=()=>{const[a,b]=(e.dataset[key]).split('-').map(Number);sections[a].exercises[b][prop]=e.value});
  $('#exerciseSections').querySelectorAll('[data-metric]').forEach(e=>e.onchange=()=>{const [a,b,key]=e.dataset.metric.split('-');sections[+a].exercises[+b].metrics=sections[+a].exercises[+b].metrics||{};sections[+a].exercises[+b].metrics[key]=e.value});
  bind('[data-jkg]','jkg','juniorKg');bind('[data-jreps]','jreps','juniorReps');bind('[data-jnote]','jnote','juniorNote');bind('[data-aex]','aex','adultExerciseId','change');bind('[data-akg]','akg','adultKg');bind('[data-areps]','areps','adultReps');bind('[data-anote]','anote','adultNote');
}

function populatePickerFilters(){
  [...new Set(exercises.flatMap(x=>x.bodyAreas||[]))].sort().forEach(x=>$('#pickerBody').add(new Option(x,x)));
  [...new Set(exercises.flatMap(x=>x.styles||[]))].sort().forEach(x=>$('#pickerStyle').add(new Option(x,x)));
}
function openPicker(si){pickerSection=si;$('#pickerSearch').value='';renderPicker();$('#exercisePickerDialog').showModal()}
function renderPicker(){
  const q=$('#pickerSearch').value.toLowerCase(),body=$('#pickerBody').value,style=$('#pickerStyle').value,favOnly=$('#pickerFavorites').checked,favs=favorites();
  const list=exercises.filter(x=>{const h=[x.name,x.category,x.description,...(x.bodyAreas||[]),...(x.styles||[])].join(' ').toLowerCase();return(!q||h.includes(q))&&(!body||(x.bodyAreas||[]).includes(body))&&(!style||(x.styles||[]).includes(style))&&(!favOnly||favs.has(x.id))});
  $('#pickerGrid').innerHTML=list.map(x=>`<div class="picker-item"><div><strong>${esc(x.name)}</strong><small>${esc((x.bodyAreas||[]).join(' · '))}</small></div><button data-pick="${x.id}">Tilføj</button></div>`).join('');
  $('#pickerGrid').querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{sections[pickerSection].exercises=sections[pickerSection].exercises||[];sections[pickerSection].exercises.push({exerciseId:b.dataset.pick,juniorKg:'',juniorReps:'',juniorNote:'',adultExerciseId:b.dataset.pick,adultKg:'',adultReps:'',adultNote:''});$('#exercisePickerDialog').close();renderExerciseSections()});
}
function createExercise(e){
  e.preventDefault();const d=Object.fromEntries(new FormData(e.target)),split=s=>s.split(',').map(x=>x.trim()).filter(Boolean);
  const x={id:'custom-'+crypto.randomUUID(),name:d.name,category:d.category,bodyAreas:split(d.bodyAreas),equipment:split(d.equipment),styles:split(d.styles),difficulty:d.difficulty,description:d.description,junior:d.junior,adult:d.adult};
  const all=customs();all.unshift(x);localStorage.setItem(CKEY,JSON.stringify(all));exercises=[x,...exercises];e.target.reset();$('#newExerciseDialog').close();renderPicker();
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
  $('#generateSmartWorkoutBtn').onclick=generateSmartWorkout;
  $('#plannerDuration').oninput=updateTimeControl;
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
function scoreExercise(ex,goals,sectionType){
  let score=0;
  const hay=[ex.name,ex.category,ex.intensity,...(ex.focus||[]),...(ex.bodyAreas||[]),...(ex.styles||[]),...(ex.format||[])].join(' ').toLowerCase();
  goals.forEach(g=>{if(hay.includes(g.toLowerCase()))score+=4});
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
  return exercises.filter(ex=>exerciseAvailable(ex)&&!used.has(ex.id))
    .map(ex=>({ex,score:scoreExercise(ex,goals,type)}))
    .sort((a,b)=>b.score-a.score).slice(0,count).map(x=>x.ex);
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
function generateSmartWorkout(){
  const duration=Math.max(20,+$('#plannerDuration').value||60);
  const participants=Math.max(1,+$('#plannerParticipants').value||20);
  const goals=goalValues();
  const includeFinisher=$('#includeTeamChallenge').checked;
  const includeJoint=$('#includeJointWarmup')?.checked!==false;
  const funSelected=goals.includes('Sjov');
  const includeGame=['junior','family'].includes(plannerConcept)&&($('#includeGame').checked||funSelected);
  const theme=['junior','family'].includes(plannerConcept)?$('#plannerTheme').value.trim():'';
  const used=new Set();

  const pick=(n,t,extra=[])=>{
    const chosen=pickExercises(n,[...goals,...extra],t,used);
    chosen.forEach(x=>used.add(x.id));
    return chosen;
  };
  const add=s=>sections.push(normalizeSection(s));
  const jointMinutes=includeJoint?5:0;
  const warmMinutes=Math.max(7,Math.round(duration*.13));
  const gameMinutes=includeGame?Math.max(7,Math.round(duration*.13)):0;
  const finisherMinutes=includeFinisher?4:0;
  const reserved=jointMinutes+warmMinutes+gameMinutes+finisherMinutes;
  const available=Math.max(12,duration-reserved);
  let mainCount=structureChoice==='one'?1:structureChoice==='two'?2:structureChoice==='three'?3:(available>=28?2:1);
  if(plannerConcept==='hiit'||plannerConcept==='hyrox'||plannerConcept==='trx')mainCount=Math.max(2,mainCount);
  const mainMinutes=Array.from({length:mainCount},(_,i)=>Math.floor(available/mainCount)+(i<available%mainCount?1:0));

  sections=[];
  if(includeJoint)add({
    type:'Ledopvarmning',name:'Ledopvarmning',minutes:5,format:'Fælles flow',style:'Mobilitet',
    work:0,rest:0,rounds:1,
    description:'Rolig mobilisering af ankler, knæ, hofter, ryg, skuldre og håndled.',
    rules:'Følg instruktøren i et roligt flow uden høj puls.',
    coachTips:'Hold den omkring fem minutter og tilpas bevægelserne til dagens træning.',
    exercises:[]
  });

  const warm=pick(3,'warmup',['Kondition']);
  add({
    type:'Opvarmning',name:'Pulsopvarmning',minutes:warmMinutes,format:'Fælles flow',style:'Funktionel',
    work:35,rest:15,rounds:2,
    description:'Dynamisk pulsopvarmning, der forbereder bevægelserne i hovedtræningen.',
    rules:'Arbejd samlet og skift på instruktørens signal.',
    coachTips:'Stig gradvist i tempo. Undgå kø og lange forklaringer.',
    exercises:warm.map(makeItem)
  });

  if(includeGame){
    const game=pick(3,'team',['Sjov','Samarbejde']);
    add({
      type:'Leg',name:theme?`${theme} – leg`:'Aktiv holdleg',minutes:gameMinutes,format:'Stafet',style:'Leg',
      work:0,rest:0,rounds:2,
      description:theme?`En fysisk mission i temaet “${theme}” med bevægelse, samarbejde og konkurrence.`:'En aktiv leg med samarbejde, reaktion og konkurrence.',
      rules:'Del deltagerne i hold. Alle skal have en aktiv rolle. Giv point for gennemførte opgaver og undgå eliminering.',
      coachTips:'Lav en prøverunde, justér straks hvis der opstår kø, og stop mens energien er høj.',
      exercises:game.map(makeItem)
    });
  }

  const profile=PROGRAMMING_PROFILES[plannerConcept]||PROGRAMMING_PROFILES.junior;
  const formatsByConcept={
    junior:['AMRAP','YGIG','Chipper'],
    family:['YGIG','Stationer','AMRAP'],
    adult:['Styrke','AMRAP','YGIG'],
    trx:['Stationer','YGIG','EMOM'],
    hyrox:['Stationer','YGIG','Chipper'],
    hiit:['EMOM','Stationer','AMRAP']
  };
  const options=formatsByConcept[plannerConcept]||formatsByConcept.junior;

  for(let i=0;i<mainCount;i++){
    let type=options[i%options.length];
    if(plannerConcept==='hiit'&&i===1)type='Stationer';
    if(plannerConcept==='hyrox')type=i%2===0?'Stationer':'YGIG';
    if(plannerConcept==='trx')type=i%2===0?'Stationer':'YGIG';

    const formatMap={YGIG:'You go, I go',Stationer:plannerConcept==='hyrox'?'Hyrox station':'Stationstræning',Styrke:'Fælles flow'};
    const format=formatMap[type]||type;
    const exCount=type==='Stationer'?6:type==='Chipper'?5:4;
    const extra=plannerConcept==='hiit'?['Kondition','HIIT']:plannerConcept==='hyrox'?['Hyrox','Kondition']:plannerConcept==='trx'?['TRX']:i===0?['Styrke']:['Samarbejde'];
    const chosen=pick(exCount,'main',extra);
    const highIntensity=plannerConcept==='hiit';
    add({
      type,
      name:plannerConcept==='hiit'?`HIIT-blok ${i+1}`:plannerConcept==='hyrox'?`Hyrox-blok ${i+1}`:plannerConcept==='trx'?`TRX-blok ${i+1}`:`Hovedelement ${i+1} – ${type}`,
      minutes:mainMinutes[i],
      format,
      style:plannerConcept==='hiit'?'HIIT / Hyrox-inspireret':plannerConcept==='hyrox'?'HIIT / Hyrox-inspireret':plannerConcept==='trx'?'Funktionel':'Funktionel',
      work:highIntensity?(i===0?40:45):40,
      rest:highIntensity?(i===0?20:15):20,
      rounds:Math.max(2,Math.round(mainMinutes[i]/5)),
      description:`${profile.label}-element programmeret som ${format}. Fokus: ${goals.join(', ')||'helkrop'}.`,
      rules:type==='YGIG'?'Makker A arbejder, mens makker B restituerer eller holder en enkel position. Byt efter den aftalte serie.':type==='Chipper'?'Gennemfør øvelserne i rækkefølge. Stop ved tidsgrænsen.':'Følg den aftalte arbejds-/pausestruktur og bevar teknisk kvalitet.',
      coachTips:plannerConcept==='hiit'?'Arbejdsperioderne skal være korte nok til reel høj intensitet. Skalér før start.':plannerConcept==='hyrox'?'Planlæg tydelige transitions og undgå kø ved udstyret.':'Giv skaleringer før start og hold skiftene korte.',
      exercises:chosen.map(makeItem)
    });
  }

  if(funSelected&&!['junior','family'].includes(plannerConcept)){
    const team=pick(3,'team',['Samarbejde']);
    add({
      type:'YGIG',name:'Sjov makkerudfordring',minutes:Math.min(8,Math.max(5,Math.round(duration*.1))),
      format:'You go, I go',style:'Funktionel',work:35,rest:20,rounds:2,
      description:'Et kort konkurrence- eller samarbejdselement, så “Sjov” får en konkret konsekvens.',
      rules:'Arbejd i par og saml point eller runder. Ingen deltagere elimineres.',
      coachTips:'Hold reglerne enkle og energien høj.',exercises:team.map(makeItem)
    });
  }

  if(includeFinisher){
    const fin=pick(3,'team',['Kondition']);
    add({
      type:'Finisher',name:'Finisher – én sang',minutes:4,songMinutes:4,songTitle:'One More Time',
      songArtist:'Daft Punk',songUrl:'',format:'Team workout',style:'Kondition',work:40,rest:20,rounds:1,
      description:'Hele finisheren varer én sang og kan springes over, hvis tiden er gået.',
      rules:'Arbejd fra sangen starter, til den slutter. Vælg et enkelt mønster, som alle forstår.',
      coachTips:'Start kun hvis der er tid. Skriv den ønskede sang og tilpas øvelserne til dens energi.',
      exercises:fin.map(makeItem)
    });
  }

  enforceWorkoutStructure();
  const conceptNames={junior:'FunkFit Junior',family:'Familietræning',adult:'Funktionel voksentræning',trx:'TRX-træning',hyrox:'Hyrox-træning',hiit:'HIIT-træning'};
  $('#workoutName').value=`${conceptNames[plannerConcept]}${theme?' – '+theme:''} – ${plannerVenue==='indoor'?'inde':'ude'}`;
  $('#participantCount').value=participants;
  $('#familyMode').checked=plannerConcept==='family';
  $('#adultCountLabel').classList.toggle('hidden',plannerConcept!=='family');
  if(plannerConcept==='family')$('#adultCount').value=+$('#plannerAdults').value||10;

  const history=aiHistory();
  history.push({date:new Date().toISOString(),concept:plannerConcept,exerciseIds:sections.flatMap(s=>(s.exercises||[]).map(x=>x.exerciseId))});
  saveAiHistory(history);

  renderFramework();renderExerciseSections();updateReview();
  $('#plannerResult').classList.remove('hidden');
  $('#plannerResult').innerHTML=`<h3>Komplet forslag klar ✓</h3>
    <p><strong>${esc(conceptNames[plannerConcept])}</strong> · ${duration} min · ${participants} deltagere${theme?` · tema: ${esc(theme)}`:''}</p>
    <div class="programming-note">Programmeringsmotoren har valgt struktur, formater og arbejdsparametre efter træningssporet – ikke kun tilfældige formatnavne.</div>
    <ul><li>${sections.length} elementer: ${sections.map(s=>esc(s.type)).join(' → ')}</li><li>Senest brugte øvelser nedprioriteres for at skabe intelligent variation.</li><li>Alle elementer kan redigeres i Builderen.</li></ul>
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
function newWorkout(){
  currentId=null;plannerConcept='junior';setCreationMode('manual');
  $('#workoutName').value='FunkFit Junior – dagens træning';
  sections=[defaultSection('Ledopvarmning'),...structuredClone(templates[0].sections).map(normalizeSection)];
  enforceWorkoutStructure();renderFramework();renderExerciseSections();showView('designView');showStep(1);
}

function printWorkout(w,mode){
  const map=new Map(exercises.map(x=>[x.id,x]));
  if(mode==='participant'){
    $('#printView').className='print-view participant-print';
    $('#printView').innerHTML=`<h1>${esc(w.name)}</h1>${w.sections.map(s=>`
      <section class="participant-section">
        <h2><span>${esc(s.name)}</span><span>${s.minutes} min</span></h2>
        ${(s.exercises||[]).map(it=>{
          const ex=map.get(it.exerciseId);
          const adultEx=map.get(it.adultExerciseId||it.exerciseId);
          const adultDiff=w.familyMode && adultEx && adultEx.id!==ex?.id;
          return `<article class="participant-exercise">
            <h3>${esc(ex?.name||'Ukendt øvelse')}${adultDiff?` <small>· Voksen: ${esc(adultEx.name)}</small>`:''}</h3>
            <p>${esc(ex?.description||'Følg instruktørens anvisning.')}</p>
          </article>`;
        }).join('')}
      </section>`).join('')}`;
  }else{
    $('#printView').className='print-view';
    $('#printView').innerHTML=`<h1>${esc(w.name)}</h1><p>${w.date||''} · ${w.sections.reduce((n,s)=>n+(+s.minutes||0),0)} min</p>${w.sections.map(s=>`<section class="print-section"><h2>${esc(s.name)} — ${s.minutes} min</h2><p>${esc(s.format)} · ${esc(s.style)}</p>${(s.exercises||[]).map(it=>{const ex=map.get(it.exerciseId),aex=map.get(it.adultExerciseId||it.exerciseId);return `<div><strong>${esc(ex?.name||'Ukendt')}</strong><p>Junior: ${esc(it.juniorReps||'-')} ${it.juniorKg?`· ${esc(it.juniorKg)} kg`:''}${it.juniorNote?` · ${esc(it.juniorNote)}`:''}</p>${w.familyMode?`<p>Voksen: ${esc(aex?.name||ex?.name||'Ukendt')} · ${esc(it.adultReps||'-')} ${it.adultKg?`· ${esc(it.adultKg)} kg`:''}${it.adultNote?` · ${esc(it.adultNote)}`:''}</p>`:''}</div>`}).join('')}</section>`).join('')}`;
  }
  window.print();
}

function startPlayer(w){
  const map=new Map(exercises.map(x=>[x.id,x]));playerItems=[];for(const s of w.sections)for(const it of s.exercises||[]){const ex=map.get(it.exerciseId),aex=map.get(it.adultExerciseId||it.exerciseId);playerItems.push({section:s.name,format:s.format,style:s.style,minutes:s.minutes,work:s.work,rest:s.rest,rounds:s.rounds,exercise:ex?.name||'Ukendt',junior:[it.juniorReps,it.juniorKg?`${it.juniorKg} kg`:null].filter(Boolean).join(' · ')||ex?.junior||'-',juniorNote:it.juniorNote||'',adultExercise:aex?.name||ex?.name||'Ukendt',adult:[it.adultReps,it.adultKg?`${it.adultKg} kg`:null].filter(Boolean).join(' · ')||aex?.adult||'-',adultNote:it.adultNote||'',familyMode:w.familyMode})}
  if(!playerItems.length)return alert('Træningen har ingen øvelser.');playerIndex=0;$('#spotifyPlaylistUrl').value=w.music?.spotify||'';$('#tidalPlaylistUrl').value=w.music?.tidal||'';$('#telmorePlaylistUrl').value=w.music?.telmore||'';$('#playerWorkoutName').textContent=w.name;renderPlayer();$('#workoutPlayer').showModal();
}
function renderPlayer(){const i=playerItems[playerIndex];$('#playerCounter').textContent=`${playerIndex+1} / ${playerItems.length}`;$('#playerProgressBar').style.width=`${((playerIndex+1)/playerItems.length)*100}%`;$('#playerSection').textContent=i.section;$('#playerFormat').textContent=`${i.format} · ${i.style}`;$('#playerTiming').textContent=`${i.work||0}/${i.rest||0} sek. · ${i.rounds||1} runder · ${i.minutes} min`;$('#playerExercise').textContent=i.exercise;$('#playerJunior').textContent=i.junior;$('#playerJuniorNote').textContent=i.juniorNote;$('#playerAdultCard').classList.toggle('hidden',!i.familyMode);$('#playerAdult').textContent=i.adultExercise===i.exercise?i.adult:`${i.adultExercise} · ${i.adult}`;$('#playerAdultNote').textContent=i.adultNote;$('#playerNextBtn').textContent=playerIndex===playerItems.length-1?'Afslut ✓':'Næste →'}
function movePlayer(d){if(!$('#workoutPlayer').open)return;if(d>0&&playerIndex===playerItems.length-1){closePlayer();return}playerIndex=Math.max(0,Math.min(playerItems.length-1,playerIndex+d));renderPlayer()}
function closePlayer(){if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});if($('#workoutPlayer').open)$('#workoutPlayer').close()}
async function toggleFullscreen(){try{if(!document.fullscreenElement)await $('#workoutPlayer').requestFullscreen();else await document.exitFullscreen()}catch{}}
function openPlaylist(url,name){if(!url.trim())return alert(`Indsæt først et link til ${name}.`);window.open(url,'_blank','noopener')}

if('serviceWorker' in navigator)navigator.serviceWorker.register('./service-worker.js');
init().catch(e=>{console.error(e);alert('Appen kunne ikke starte. Genindlæs siden.')});
