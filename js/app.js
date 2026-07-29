
const $=s=>document.querySelector(s);
const FORMATS=['Fælles flow','Teknik','Stationstræning','Cirkeltræning','AMRAP','EMOM','E2MOM','For time','Chipper','Tabata','HIIT-intervaller','You go, I go','Makkertræning','Team workout','Stafet','Hyrox station'];
const STYLES=['Funktionel','CrossFit-inspireret','HIIT / Hyrox-inspireret','Teknik','Leg','Mobilitet','Kondition'];
const WKEY='funkfit-workouts-v050',CKEY='funkfit-custom-v050',FKEY='funkfit-favorites-v050',EKEY='funkfit-elements-v070';
let exercises=[],templates=[],sections=[],currentId=null,pickerSection=0,playerItems=[],playerIndex=0;
let plannerConcept='junior',plannerVenue='indoor';
const EQUIPMENT_PROFILES={
  indoor:['Kropsvægt','Måtte','Kettlebell','Håndvægt','Boks','Bænk','Medicinbold','Væg','Kegler','Sjippetov','Elastik','Romaskine'],
  trx:['TRX','Kropsvægt','Måtte','Elastik'],
  outdoor:['Kropsvægt','Kettlebell','Håndvægt','Kegler','Sjippetov','Sandsæk','Battle rope','Traktordæk','Slæde','Pull-up stativ','Løbebane','Bakke']
};
let plannerEquipment=new Set(EQUIPMENT_PROFILES.indoor);


const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch{return f}};
const saveWorkouts=x=>localStorage.setItem(WKEY,JSON.stringify(x));
const workouts=()=>read(WKEY,[]);
const customs=()=>read(CKEY,[]);
const favorites=()=>new Set(read(FKEY,[]));
const elementLibrary=()=>read(EKEY,[]);
const saveElementLibrary=x=>localStorage.setItem(EKEY,JSON.stringify(x));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

const collapsedSections=new Set();

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
  sections=structuredClone(templates[0].sections);
  populatePickerFilters();bind();renderFramework();renderExerciseSections();renderSaved();renderElementLibrary();updateReview();
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
  $('#workoutImageInput').onchange=handleWorkoutImage;
  $('#workoutTextFileInput').onchange=handleWorkoutTextFile;
  $('#analyzeImportBtn').onclick=analyzeImportedWorkout;
  $('#clearImportBtn').onclick=clearImportedWorkout;
  bindPlanner();
  $('#clearElementLibraryBtn').onclick=()=>{if(confirm('Ryd hele elementbiblioteket?')){saveElementLibrary([]);renderElementLibrary()}};


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
  $('#frameworkSections').innerHTML=sections.map((s,i)=>{
    const v=sectionVisual(s),collapsed=collapsedSections.has(i),count=(s.exercises||[]).length;
    const progress=Math.round(((i+1)/sections.length)*100);
    return `<article class="framework-card ${collapsed?'collapsed':''}" style="--section-color:${v.color}">
      <div class="section-card-header">
        <div class="section-title-group">
          <div class="section-icon">${v.icon}</div>
          <div class="section-title-text">
            <h3>${esc(s.name)}</h3>
            <small>Sektion ${i+1} af ${sections.length}</small>
            <div class="section-badges">
              <span class="section-stat">${s.minutes} min</span>
              <span class="section-stat">${count} øvelser</span>
              <span class="section-stat">${esc(s.format)}</span>
              <span class="section-stat">${s.work||0}/${s.rest||0}</span>
              <span class="section-stat">${s.rounds||1} runder</span>
            </div>
          </div>
        </div>
        <div class="section-card-actions">
          <button class="collapse-btn" data-collapse-framework="${i}">${collapsed?'Fold ud':'Fold sammen'}</button>
          <details class="section-card-menu">
            <summary>⋮</summary>
            <div class="section-menu-popover">
              <button data-move-up="${i}">↑ Flyt op</button>
              <button data-move-down="${i}">↓ Flyt ned</button>
              <button data-duplicate="${i}">⧉ Duplikér</button>
              <button data-del-sec="${i}">Slet sektion</button>
            </div>
          </details>
        </div>
      </div>
      <div class="section-progress"><span>${v.label}</span><div class="section-progress-bar"><span style="width:${progress}%"></span></div><span>${progress}%</span></div>
      <div class="framework-settings">
        <label>Navn<input data-sec-name="${i}" value="${esc(s.name)}"></label>
        <label>Minutter<input data-sec-min="${i}" type="number" min="0" value="${s.minutes}"></label>
        <label>Format<select data-sec-format="${i}">${FORMATS.map(x=>`<option ${x===s.format?'selected':''}>${x}</option>`).join('')}</select></label>
        <label>Træningsspor<select data-sec-style="${i}">${STYLES.map(x=>`<option ${x===s.style?'selected':''}>${x}</option>`).join('')}</select></label>
        <label>Arbejde (sek.)<input data-sec-work="${i}" type="number" value="${s.work||0}"></label>
        <label>Pause (sek.)<input data-sec-rest="${i}" type="number" value="${s.rest||0}"></label>
        <label>Runder<input data-sec-rounds="${i}" type="number" min="1" value="${s.rounds||1}"></label>
      </div>
    </article>`;
  }).join('');

  $('#frameworkSections').querySelectorAll('[data-collapse-framework]').forEach(b=>b.onclick=()=>toggleSectionCollapse(+b.dataset.collapseFramework));
  $('#frameworkSections').querySelectorAll('[data-move-up]').forEach(b=>b.onclick=()=>moveSection(+b.dataset.moveUp,+b.dataset.moveUp-1));
  $('#frameworkSections').querySelectorAll('[data-move-down]').forEach(b=>b.onclick=()=>moveSection(+b.dataset.moveDown,+b.dataset.moveDown+1));
  $('#frameworkSections').querySelectorAll('[data-duplicate]').forEach(b=>b.onclick=()=>duplicateSection(+b.dataset.duplicate));
  $('#frameworkSections').querySelectorAll('[data-sec-name]').forEach(e=>e.oninput=()=>{sections[+e.dataset.secName].name=e.value;renderExerciseSections();updateReview()});
  $('#frameworkSections').querySelectorAll('[data-sec-min]').forEach(e=>e.oninput=()=>{sections[+e.dataset.secMin].minutes=+e.value||0;renderExerciseSections();updateReview()});
  $('#frameworkSections').querySelectorAll('[data-sec-format]').forEach(e=>e.onchange=()=>{sections[+e.dataset.secFormat].format=e.value;renderFramework();renderExerciseSections()});
  $('#frameworkSections').querySelectorAll('[data-sec-style]').forEach(e=>e.onchange=()=>{sections[+e.dataset.secStyle].style=e.value;renderFramework();renderExerciseSections()});
  $('#frameworkSections').querySelectorAll('[data-sec-work]').forEach(e=>e.oninput=()=>{sections[+e.dataset.secWork].work=+e.value||0;renderExerciseSections()});
  $('#frameworkSections').querySelectorAll('[data-sec-rest]').forEach(e=>e.oninput=()=>{sections[+e.dataset.secRest].rest=+e.value||0;renderExerciseSections()});
  $('#frameworkSections').querySelectorAll('[data-sec-rounds]').forEach(e=>e.oninput=()=>{sections[+e.dataset.secRounds].rounds=+e.value||1;renderExerciseSections()});
  $('#frameworkSections').querySelectorAll('[data-sec-description]').forEach(e=>e.oninput=()=>sections[+e.dataset.secDescription].description=e.value);
  $('#frameworkSections').querySelectorAll('[data-sec-notes]').forEach(e=>e.oninput=()=>sections[+e.dataset.secNotes].coachNotes=e.value);
  $('#frameworkSections').querySelectorAll('[data-save-element]').forEach(b=>b.onclick=()=>saveSectionToLibrary(+b.dataset.saveElement));
  $('#frameworkSections').querySelectorAll('[data-regenerate-element]').forEach(b=>b.onclick=()=>regenerateElement(+b.dataset.regenerateElement));
  $('#frameworkSections').querySelectorAll('[data-del-sec]').forEach(b=>b.onclick=()=>{if(sections.length>1){sections.splice(+b.dataset.delSec,1);renderFramework();renderExerciseSections();updateReview()}});
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
            <div class="section-badges">
              <span class="section-stat">${s.minutes} min</span>
              <span class="section-stat">${count} øvelser</span>
              <span class="section-stat">${esc(s.format)}</span>
              <span class="section-stat">${s.work||0}/${s.rest||0}</span>
              <span class="section-stat">${s.rounds||1} runder</span>
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
      <div class="section-progress"><span>${v.label}</span><div class="section-progress-bar"><span style="width:${progress}%"></span></div><span>${progress}%</span></div>
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



function bindPlanner(){
  renderEquipmentChoices();
  document.querySelectorAll('#conceptChoices .choice-card').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#conceptChoices .choice-card').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');plannerConcept=b.dataset.value;
    const family=plannerConcept==='family';
    $('#plannerAdultsWrap').classList.toggle('hidden',!family);
    $('#familyMode').checked=family;
    $('#adultCountLabel').classList.toggle('hidden',!family);
    if(plannerConcept==='adult'||plannerConcept==='trx'||plannerConcept==='hyrox'||plannerConcept==='hiit'){$('#participantCount').value=$('#plannerParticipants').value;}
    $('#themePlannerBlock').classList.toggle('hidden',!(plannerConcept==='junior'||plannerConcept==='family'));
    if(plannerConcept==='trx'){plannerEquipment=new Set(EQUIPMENT_PROFILES.trx);renderEquipmentChoices();}
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
  $('#plannerTheme').onchange=()=>$('#customThemeWrap').classList.toggle('hidden',$('#plannerTheme').value!=='custom');
  $('#generateSmartWorkoutBtn').onclick=generateSmartWorkout;
}
function renderEquipmentChoices(){
  if(!$('#equipmentChoices'))return;
  const profile=plannerConcept==='trx'?EQUIPMENT_PROFILES.trx:EQUIPMENT_PROFILES[plannerVenue];
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
  if(plannerConcept==='hyrox'&&hay.includes('hyrox'))score+=8;
  if(plannerConcept==='hiit'&&hay.includes('hiit'))score+=8;
  if(plannerConcept==='adult'&&(ex.audience||[]).includes('Voksen'))score+=2;
  if(plannerVenue==='outdoor'&&(hay.includes('løb')||hay.includes('carry')||hay.includes('stafet')))score+=3;
  if(plannerVenue==='indoor'&&(ex.equipment||[]).some(x=>['Måtte','Boks','Bænk','Væg'].includes(x)))score+=2;
  if($('#useFavoritesFirst').checked&&favorites().has(ex.id))score+=10;
  return score+Math.random()*1.5;
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
  return {exerciseId:ex.id,juniorKg:'',juniorReps:prescriptionFor(ex,false),juniorNote:'',adultExerciseId:ex.id,adultKg:'',adultReps:prescriptionFor(ex,true),adultNote:''};
}
function formatPreset(kind,index=0){
  const pools={junior:['AMRAP','You go, I go','EMOM','Chipper','Stationstræning'],family:['You go, I go','Team workout','AMRAP','Stationstræning'],adult:['AMRAP','EMOM','Chipper','You go, I go','Stationstræning'],trx:['Stationstræning','EMOM','AMRAP','You go, I go'],hyrox:['Hyrox station','You go, I go','Chipper'],hiit:['HIIT-intervaller','Tabata','EMOM','AMRAP']};
  return (pools[kind]||pools.adult)[index%(pools[kind]||pools.adult).length];
}
function sectionFromAI({name,minutes,format,type,goals,used,count=4,description='',coachNotes='',optional=false}){
  const chosen=pickExercises(count,goals,type,used);chosen.forEach(x=>used.add(x.id));
  return {name,minutes,format,style:type==='play'?'Leg':plannerConcept==='hyrox'||plannerConcept==='hiit'?'HIIT / Hyrox-inspireret':plannerConcept==='trx'?'TRX':'Funktionel',work:format==='Tabata'?20:format.includes('HIIT')?40:45,rest:format==='Tabata'?10:format.includes('EMOM')?15:15,rounds:format==='Chipper'?1:Math.max(2,Math.round(minutes/5)),description,coachNotes,optional,exercises:chosen.map(makeItem)};
}
function currentTheme(){const v=$('#plannerTheme').value;return v==='custom'?$('#plannerCustomTheme').value.trim():v}
function generateSmartWorkout(){
  const duration=Math.max(20,+$('#plannerDuration').value||60),participants=Math.max(1,+$('#plannerParticipants').value||20),goals=goalValues(),used=new Set();
  const isYouth=plannerConcept==='junior'||plannerConcept==='family',theme=isYouth?currentTheme():'';
  const includePlay=isYouth&&$('#includePlay').checked&&(goals.includes('Sjov')||$('#plannerStructure').value==='play-two');
  const includeFinisher=$('#includeFinisher').checked;
  let warm=Math.max(7,Math.round(duration*.14)),play=includePlay?Math.max(7,Math.round(duration*.14)):0,finish=includeFinisher?Math.max(4,Math.round(duration*.09)):0;
  let remaining=duration-warm-play-finish;
  const structure=$('#plannerStructure').value;
  let mainCount=structure==='three'?3:2;if(structure==='stations')mainCount=1;if(remaining<24)mainCount=1;
  const mainTimes=Array(mainCount).fill(Math.floor(remaining/mainCount));mainTimes[mainTimes.length-1]+=remaining-mainTimes.reduce((a,b)=>a+b,0);
  sections=[];
  sections.push(sectionFromAI({name:'Opvarmning',minutes:warm,format:'Fælles flow',type:'warmup',goals:[...goals,'Koordination'],used,count:3,description:'Aktiv fælles opvarmning med gradvis stigende puls og bevægelighed.',coachNotes:'Hold instruktionerne korte. Alle skal være i gang samtidig.'}));
  if(includePlay){const playName=theme?`${theme}: Missionen begynder`:'Leg og samarbejde';sections.push(sectionFromAI({name:playName,minutes:play,format:'Stafet',type:'play',goals:[...goals,'Samarbejde'],used,count:2,description:theme?`En holdleg i temaet ${theme}. Del deltagerne i hold. De løser en mission med bevægelse, samarbejde og korte fysiske opgaver.`:'Del deltagerne i hold. Brug kegler som baser. Holdene løser bevægelsesopgaver og samler point uden lang ventetid.',coachNotes:'Forklar banen på højst 60 sekunder. Kør en kort prøverunde. Tilpas afstande, så alle lykkes.'}));}
  mainTimes.forEach((mins,i)=>{const format=structure==='stations'?'Stationstræning':formatPreset(plannerConcept,i);const count=format==='Stationstræning'?6:format==='EMOM'?4:format==='Chipper'?5:4;sections.push(sectionFromAI({name:`Hovedelement ${i+1} – ${format}`,minutes:mins,format,type:'main',goals,used,count,description:`${format} planlagt til ${participants} deltagere med fokus på ${goals.join(', ').toLowerCase()||'helkrop'}.`,coachNotes:format==='You go, I go'?'Arbejd i makkerpar. Den ene arbejder, mens den anden holder øje og gør klar til skift.':format==='Stationstræning'?'Fordel deltagerne jævnt. Start på forskellige stationer for at minimere kø.':'Gennemgå rækkefølge og standarder før start.'}));});
  if(includeFinisher)sections.push(sectionFromAI({name:'Finisher – bonus hvis tiden tillader det',minutes:finish,format:plannerConcept==='hiit'?'AMRAP':'Team workout',type:'finisher',goals:[...goals,'Kondition'],used,count:3,description:'Kort, energifyldt afslutning. Elementet kan springes over uden at ødelægge resten af træningen.',coachNotes:'Stop mens energien er høj. Prioritér god teknik frem for ekstra runder.',optional:true}));
  const conceptNames={junior:'FunkFit Junior',family:'Familietræning',adult:'Funktionel voksentræning',trx:'TRX-træning',hyrox:'Hyrox-træning',hiit:'HIIT-træning'};
  $('#workoutName').value=`${conceptNames[plannerConcept]}${theme?' – '+theme:''} – ${plannerVenue==='indoor'?'inde':'ude'}`;$('#workoutTheme').value=theme;$('#participantCount').value=participants;$('#familyMode').checked=plannerConcept==='family';$('#adultCountLabel').classList.toggle('hidden',plannerConcept!=='family');if(plannerConcept==='family')$('#adultCount').value=+$('#plannerAdults').value||10;
  renderFramework();renderExerciseSections();updateReview();
  const equipmentUsed=[...new Set(sections.flatMap(s=>(s.exercises||[]).flatMap(it=>exercises.find(x=>x.id===it.exerciseId)?.equipment||[])))];
  const total=sections.reduce((n,s)=>n+(+s.minutes||0),0),checks=[total===duration?'Tiden passer præcist.':'Tiden er justeret tæt på ønsket varighed.',sections.at(-1)?.optional?'Finisheren ligger sidst og er markeret som bonus.':'Ingen finisher valgt.',includePlay?'Sjov har udløst en konkret leg og samarbejde.':'Strukturen er lavet uden særskilt leg.'];
  $('#plannerResult').classList.remove('hidden');$('#plannerResult').innerHTML=`<h3>Komplet træning klar til gennemgang ✓</h3><p><strong>${esc(conceptNames[plannerConcept])}</strong> · ${total} min · ${participants} deltagere${theme?` · Tema: ${esc(theme)}`:''}</p><div class="ai-checks">${checks.map(x=>`<span>✓ ${esc(x)}</span>`).join('')}</div><p><strong>${sections.length} elementer</strong> · Udstyr: ${esc(equipmentUsed.join(', ')||'Kropsvægt')}</p><div class="actions"><button id="openGeneratedEditorBtn" type="button">Gennemgå elementerne →</button><button id="regenerateAllBtn" class="ghost" type="button">✨ Lav et nyt komplet forslag</button></div>`;
  $('#openGeneratedEditorBtn').onclick=()=>showStep(2);$('#regenerateAllBtn').onclick=generateSmartWorkout;$('#plannerResult').scrollIntoView({behavior:'smooth',block:'center'});
}
function saveSectionToLibrary(index){const item=structuredClone(sections[index]);item.libraryId=crypto.randomUUID();item.savedAt=new Date().toISOString();const all=elementLibrary();all.unshift(item);saveElementLibrary(all);renderElementLibrary();alert(`“${item.name}” er gemt i elementbiblioteket.`)}
function useLibraryElement(id){const item=elementLibrary().find(x=>x.libraryId===id);if(!item)return;const copy=structuredClone(item);delete copy.libraryId;delete copy.savedAt;const finisher=(copy.name||'').toLowerCase().includes('finisher')||copy.optional;if(finisher)sections.push(copy);else{const finisherIndex=sections.findIndex(s=>s.optional||(s.name||'').toLowerCase().includes('finisher'));finisherIndex<0?sections.push(copy):sections.splice(finisherIndex,0,copy)}renderFramework();renderExerciseSections();updateReview();showView('designView');showStep(2)}
function renderElementLibrary(){const el=$('#elementLibraryGrid');if(!el)return;const list=elementLibrary();el.innerHTML=list.length?list.map(x=>`<article class="saved-card"><p class="eyebrow">${esc(x.format||'ELEMENT')}</p><h3>${esc(x.name)}</h3><p class="meta">${x.minutes||0} min · ${(x.exercises||[]).length} øvelser</p><p>${esc(x.description||'Ingen beskrivelse endnu.')}</p><div class="saved-card-actions"><button data-use-element="${x.libraryId}">Brug i træning</button><button class="ghost" data-delete-element="${x.libraryId}">Slet</button></div></article>`).join(''):'<div class="empty">Biblioteket er tomt. Gem et element fra editoren.</div>';el.querySelectorAll('[data-use-element]').forEach(b=>b.onclick=()=>useLibraryElement(b.dataset.useElement));el.querySelectorAll('[data-delete-element]').forEach(b=>b.onclick=()=>{saveElementLibrary(elementLibrary().filter(x=>x.libraryId!==b.dataset.deleteElement));renderElementLibrary()})}
function regenerateElement(index){const old=sections[index],used=new Set(sections.flatMap((s,i)=>i===index?[]:(s.exercises||[]).map(x=>x.exerciseId))),goals=goalValues();const type=(old.name||'').toLowerCase().includes('opvarm')?'warmup':(old.name||'').toLowerCase().includes('leg')?'play':(old.name||'').toLowerCase().includes('finisher')?'finisher':'main';const count=Math.max(2,(old.exercises||[]).length||4);const fresh=pickExercises(count,goals,type,used);old.exercises=fresh.map(makeItem);old.coachNotes=(old.coachNotes||'')+' Nyt øvelsesvalg genereret.';renderFramework();renderExerciseSections();updateReview()}

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
    const result=await Tesseract.recognize(file,'eng',{
      logger:m=>{
        if(m.status==='recognizing text'){
          $('#ocrStatus').textContent=`Aflæser tekst… ${Math.round((m.progress||0)*100)} %`;
        }
      }
    });
    $('#importWorkoutText').value=result.data.text.trim();
    $('#ocrStatus').textContent='Teksten er aflæst. Ret den eventuelt, før du laver forslaget.';
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
  let best=null,bestScore=0;
  for(const ex of exercises){
    const names=[ex.name,ex.category,...(ex.bodyAreas||[])].map(normalizeText);
    for(const name of names){
      if(!name)continue;
      let score=0;
      if(normalized.includes(name))score=name.length+20;
      else if(name.includes(normalized)&&normalized.length>3)score=normalized.length+10;
      if(score>bestScore){bestScore=score;best=ex}
    }
  }
  return bestScore>=14?best:null;
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

function collect(){return{id:currentId||crypto.randomUUID(),name:$('#workoutName').value,date:$('#workoutDate').value,participants:+$('#participantCount').value,familyMode:$('#familyMode').checked,theme:$('#workoutTheme').value.trim(),adultCount:+($('#adultCount').value||0),sections:structuredClone(sections),music:{spotify:$('#spotifyPlaylistUrl').value.trim(),tidal:$('#tidalPlaylistUrl').value.trim(),telmore:$('#telmorePlaylistUrl').value.trim()}}}
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
