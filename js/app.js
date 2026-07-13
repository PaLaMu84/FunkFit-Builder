
const $=s=>document.querySelector(s);
const FORMATS=['Fælles flow','Teknik','Stationstræning','Cirkeltræning','AMRAP','EMOM','E2MOM','For time','Chipper','Tabata','HIIT-intervaller','You go, I go','Makkertræning','Team workout','Stafet','Hyrox station'];
const STYLES=['Funktionel','CrossFit-inspireret','HIIT / Hyrox-inspireret','Teknik','Leg','Mobilitet','Kondition'];
const WKEY='funkfit-workouts-v050',CKEY='funkfit-custom-v050',FKEY='funkfit-favorites-v050';
let exercises=[],templates=[],sections=[],currentId=null,pickerSection=0,playerItems=[],playerIndex=0;

const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch{return f}};
const saveWorkouts=x=>localStorage.setItem(WKEY,JSON.stringify(x));
const workouts=()=>read(WKEY,[]);
const customs=()=>read(CKEY,[]);
const favorites=()=>new Set(read(FKEY,[]));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

async function init(){
  const base=await fetch('data/exercises.json').then(r=>r.json());
  templates=await fetch('data/workoutTemplates.json').then(r=>r.json());
  exercises=[...customs(),...base];
  $('#templateSelect').innerHTML=templates.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  $('#workoutDate').value=new Date().toISOString().slice(0,10);
  sections=structuredClone(templates[0].sections);
  populatePickerFilters();bind();renderFramework();renderExerciseSections();renderSaved();updateReview();
}

function bind(){
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>showView(b.dataset.view));
  document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>showStep(+b.dataset.step));
  document.querySelectorAll('[data-next-step]').forEach(b=>b.onclick=()=>showStep(+b.dataset.nextStep));
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).close());

  $('#familyMode').onchange=()=>{$('#adultCountLabel').classList.toggle('hidden',!$('#familyMode').checked);renderExerciseSections()};
  $('#loadTemplateBtn').onclick=()=>{sections=structuredClone(templates.find(t=>t.id===$('#templateSelect').value).sections);renderFramework();renderExerciseSections();updateReview()};
  $('#addSectionBtn').onclick=()=>{sections.push({name:'Ny sektion',minutes:10,format:'Stationstræning',style:'Funktionel',work:40,rest:20,rounds:3,exercises:[]});renderFramework();renderExerciseSections();updateReview()};
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
  $('#frameworkSections').innerHTML=sections.map((s,i)=>`<article class="framework-card">
    <div class="framework-head">
      <input data-sec-name="${i}" value="${esc(s.name)}">
      <input data-sec-min="${i}" type="number" min="0" value="${s.minutes}">
      <button class="ghost" data-del-sec="${i}">Slet</button>
    </div>
    <div class="framework-settings">
      <label>Format<select data-sec-format="${i}">${FORMATS.map(x=>`<option ${x===s.format?'selected':''}>${x}</option>`).join('')}</select></label>
      <label>Træningsspor<select data-sec-style="${i}">${STYLES.map(x=>`<option ${x===s.style?'selected':''}>${x}</option>`).join('')}</select></label>
      <label>Arbejde (sek.)<input data-sec-work="${i}" type="number" value="${s.work||0}"></label>
      <label>Pause (sek.)<input data-sec-rest="${i}" type="number" value="${s.rest||0}"></label>
      <label>Runder<input data-sec-rounds="${i}" type="number" min="1" value="${s.rounds||1}"></label>
    </div>
  </article>`).join('');
  $('#frameworkSections').querySelectorAll('[data-sec-name]').forEach(e=>e.oninput=()=>{sections[+e.dataset.secName].name=e.value;renderExerciseSections();updateReview()});
  $('#frameworkSections').querySelectorAll('[data-sec-min]').forEach(e=>e.oninput=()=>{sections[+e.dataset.secMin].minutes=+e.value||0;renderExerciseSections();updateReview()});
  $('#frameworkSections').querySelectorAll('[data-sec-format]').forEach(e=>e.onchange=()=>sections[+e.dataset.secFormat].format=e.value);
  $('#frameworkSections').querySelectorAll('[data-sec-style]').forEach(e=>e.onchange=()=>sections[+e.dataset.secStyle].style=e.value);
  $('#frameworkSections').querySelectorAll('[data-sec-work]').forEach(e=>e.oninput=()=>sections[+e.dataset.secWork].work=+e.value||0);
  $('#frameworkSections').querySelectorAll('[data-sec-rest]').forEach(e=>e.oninput=()=>sections[+e.dataset.secRest].rest=+e.value||0);
  $('#frameworkSections').querySelectorAll('[data-sec-rounds]').forEach(e=>e.oninput=()=>sections[+e.dataset.secRounds].rounds=+e.value||1);
  $('#frameworkSections').querySelectorAll('[data-del-sec]').forEach(b=>b.onclick=()=>{if(sections.length>1){sections.splice(+b.dataset.delSec,1);renderFramework();renderExerciseSections();updateReview()}});
}

function renderExerciseSections(){
  const fam=$('#familyMode').checked;
  $('#totalMinutes').textContent=sections.reduce((n,s)=>n+(+s.minutes||0),0);
  $('#exerciseSections').innerHTML=sections.map((s,si)=>`<article class="exercise-section">
    <header><div><strong>${esc(s.name)}</strong><small>${esc(s.format)} · ${esc(s.style)} · ${s.minutes} min</small></div><button data-add-ex="${si}">+ Tilføj øvelse</button></header>
    <div class="exercise-list">${s.exercises?.length?s.exercises.map((it,ei)=>exerciseRow(it,si,ei,fam)).join(''):'<div class="empty">Ingen øvelser endnu.</div>'}</div>
  </article>`).join('');
  $('#exerciseSections').querySelectorAll('[data-add-ex]').forEach(b=>b.onclick=()=>openPicker(+b.dataset.addEx));
  $('#exerciseSections').querySelectorAll('[data-del-ex]').forEach(b=>b.onclick=()=>{const[a,c]=b.dataset.delEx.split('-').map(Number);sections[a].exercises.splice(c,1);renderExerciseSections()});
  bindExerciseInputs();
}
function exerciseRow(it,si,ei,fam){
  const ex=exercises.find(x=>x.id===it.exerciseId);
  return `<div class="exercise-row"><div class="exercise-main">
    <div><strong>${esc(ex?.name||'Ukendt')}</strong><small>${esc((ex?.bodyAreas||[]).join(' · '))}</small></div>
    <label>Junior kg<input data-jkg="${si}-${ei}" value="${esc(it.juniorKg||'')}"></label>
    <label>Junior reps/tid<input data-jreps="${si}-${ei}" value="${esc(it.juniorReps||'')}"></label>
    <label>Junior note<input data-jnote="${si}-${ei}" value="${esc(it.juniorNote||'')}"></label>
    <button class="ghost" data-del-ex="${si}-${ei}">Fjern</button>
  </div>${fam?`<div class="adult-settings"><div class="adult-grid">
    <label>Voksenøvelse<select data-aex="${si}-${ei}">${exercises.map(x=>`<option value="${x.id}" ${(it.adultExerciseId||it.exerciseId)===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label>
    <label>Voksen kg<input data-akg="${si}-${ei}" value="${esc(it.adultKg||'')}"></label>
    <label>Voksen reps/tid<input data-areps="${si}-${ei}" value="${esc(it.adultReps||'')}"></label>
    <label>Voksen note<input data-anote="${si}-${ei}" value="${esc(it.adultNote||'')}"></label>
  </div></div>`:''}</div>`;
}
function bindExerciseInputs(){
  const bind=(sel,key,prop,ev='input')=>$('#exerciseSections').querySelectorAll(sel).forEach(e=>e['on'+ev]=()=>{const[a,b]=(e.dataset[key]).split('-').map(Number);sections[a].exercises[b][prop]=e.value});
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

function collect(){return{id:currentId||crypto.randomUUID(),name:$('#workoutName').value,date:$('#workoutDate').value,participants:+$('#participantCount').value,familyMode:$('#familyMode').checked,adultCount:+($('#adultCount').value||0),sections:structuredClone(sections),music:{spotify:$('#spotifyPlaylistUrl').value.trim(),tidal:$('#tidalPlaylistUrl').value.trim(),telmore:$('#telmorePlaylistUrl').value.trim()}}}
function saveCurrent(){const w=collect(),all=workouts().filter(x=>x.id!==w.id);all.unshift(w);saveWorkouts(all);currentId=w.id;renderSaved();alert('Træningen er gemt.')}
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
  currentId=w.id;$('#workoutName').value=w.name;$('#workoutDate').value=w.date;$('#participantCount').value=w.participants;$('#familyMode').checked=!!w.familyMode;$('#adultCount').value=w.adultCount||0;$('#adultCountLabel').classList.toggle('hidden',!w.familyMode);$('#spotifyPlaylistUrl').value=w.music?.spotify||'';$('#tidalPlaylistUrl').value=w.music?.tidal||'';$('#telmorePlaylistUrl').value=w.music?.telmore||'';sections=structuredClone(w.sections);renderFramework();renderExerciseSections();updateReview();showView('designView');showStep(1);
}
function newWorkout(){currentId=null;$('#workoutName').value='FunkFit Junior – dagens træning';sections=structuredClone(templates[0].sections);renderFramework();renderExerciseSections();showView('designView');showStep(1)}

function printWorkout(w,mode){
  const map=new Map(exercises.map(x=>[x.id,x]));
  $('#printView').innerHTML=`<h1>${esc(w.name)}</h1><p>${w.date||''} · ${w.sections.reduce((n,s)=>n+(+s.minutes||0),0)} min</p>${w.sections.map(s=>`<section class="print-section"><h2>${esc(s.name)} — ${s.minutes} min</h2><p>${esc(s.format)} · ${esc(s.style)}</p>${(s.exercises||[]).map(it=>{const ex=map.get(it.exerciseId),aex=map.get(it.adultExerciseId||it.exerciseId);return `<div><strong>${esc(ex?.name||'Ukendt')}</strong><p>Junior: ${esc(it.juniorReps||'-')} ${it.juniorKg?`· ${esc(it.juniorKg)} kg`:''}${mode==='instructor'&&it.juniorNote?` · ${esc(it.juniorNote)}`:''}</p>${w.familyMode?`<p>Voksen: ${esc(aex?.name||ex?.name||'Ukendt')} · ${esc(it.adultReps||'-')} ${it.adultKg?`· ${esc(it.adultKg)} kg`:''}${mode==='instructor'&&it.adultNote?` · ${esc(it.adultNote)}`:''}</p>`:''}</div>`}).join('')}</section>`).join('')}`;window.print();
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
