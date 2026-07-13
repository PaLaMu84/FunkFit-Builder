
import {WorkoutBuilder} from './workoutBuilder.js';
import {loadWorkouts,saveWorkout,deleteWorkout,loadCustomExercises,saveCustomExercise} from './storage.js';

const $=s=>document.querySelector(s);
let base=[],exercises=[],templates=[],builder,currentId=null;
let bodyColors={},favorites=new Set(),playerItems=[],playerIndex=0;

async function init(){
  base=await fetch('data/exercises.json').then(r=>r.json());
  bodyColors=await fetch('data/bodyColors.json').then(r=>r.json());
  templates=await fetch('data/workoutTemplates.json').then(r=>r.json());
  favorites=new Set(JSON.parse(localStorage.getItem('funkfit-favorites-v043')||'[]'));
  exercises=[...loadCustomExercises(),...base];

  builder=new WorkoutBuilder({
    container:$('#workoutSections'),
    totalEl:$('#totalMinutes'),
    getExercises:()=>exercises,
    getFamilyMode:()=>$('#familyMode').checked,
    onCreateExercise:openCreateExercise
  });

  $('#templateSelect').innerHTML=templates.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  builder.loadTemplate(templates[0]);
  $('#workoutDate').value=new Date().toISOString().slice(0,10);
  populateFilters();
  bind();
  renderLibrary();
  renderSaved();
}

function bind(){
  document.querySelectorAll('[data-scroll]').forEach(b=>b.onclick=()=>$('#'+b.dataset.scroll).scrollIntoView({behavior:'smooth'}));
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).close());

  $('#loadTemplateBtn').onclick=()=>builder.loadTemplate(templates.find(t=>t.id===$('#templateSelect').value));
  $('#addSectionBtn').onclick=()=>builder.addSection();
  $('#familyMode').onchange=()=>{$('#adultCountLabel').classList.toggle('hidden',!$('#familyMode').checked);builder.render()};
  $('#saveWorkoutBtn').onclick=saveCurrent;
  $('#clearWorkoutBtn').onclick=()=>builder.clear();
  $('#participantPdfBtn').onclick=()=>printWorkout('participant');
  $('#instructorPdfBtn').onclick=()=>printWorkout('instructor');
  $('#newExerciseBtn').onclick=()=>$('#newExerciseDialog').showModal();
  $('#newExerciseForm').onsubmit=createExercise;

  ['librarySearch','libraryBody','libraryStyle','libraryEquipment','favoritesOnly'].forEach(id=>$('#'+id).oninput=renderLibrary);

  $('#openSpotifyBtn').onclick=()=>openPlaylist($('#spotifyPlaylistUrl').value,'Spotify');
  $('#openTelmoreBtn').onclick=()=>openPlaylist($('#telmorePlaylistUrl').value,'Telmore Musik');
  $('#playWorkoutBtn').onclick=startWorkoutPlayer;
  $('#playerCloseBtn').onclick=closeWorkoutPlayer;
  $('#playerFullscreenBtn').onclick=togglePlayerFullscreen;
  $('#playerMusicBtn').onclick=openPreferredMusic;
  $('#playerPrevBtn').onclick=()=>movePlayer(-1);
  $('#playerNextBtn').onclick=()=>movePlayer(1);
  $('#playerTapArea').onclick=e=>{if(!e.target.closest('button,input,select,a'))movePlayer(1)};
  document.addEventListener('keydown',handlePlayerKeyboard);
}

function populateFilters(){
  const bodies=[...new Set(exercises.flatMap(x=>x.bodyAreas||[]))].sort();
  const styles=[...new Set(exercises.flatMap(x=>x.styles||[]))].sort();
  const equipment=[...new Set(exercises.flatMap(x=>x.equipment||[]))].sort();
  bodies.forEach(x=>$('#libraryBody').add(new Option(x,x)));
  styles.forEach(x=>$('#libraryStyle').add(new Option(x,x)));
  equipment.forEach(x=>$('#libraryEquipment').add(new Option(x,x)));
}

function filterExercises(q,b,s,e=''){
  q=q.toLowerCase().trim();
  return exercises.filter(x=>{
    const h=[x.name,x.category,x.description,...(x.bodyAreas||[]),...(x.styles||[]),...(x.equipment||[])].join(' ').toLowerCase();
    return(!q||h.includes(q))&&(!b||(x.bodyAreas||[]).includes(b))&&(!s||(x.styles||[]).includes(s))&&(!e||(x.equipment||[]).includes(e));
  });
}

function renderLibrary(){
  const onlyFav=$('#favoritesOnly').checked;
  const list=filterExercises($('#librarySearch').value,$('#libraryBody').value,$('#libraryStyle').value,$('#libraryEquipment').value)
    .filter(x=>!onlyFav||favorites.has(x.id));
  $('#libraryGrid').innerHTML=list.map(x=>`<article class="exercise-card">
    <div class="exercise-card-top">
      <div class="badges">${(x.styles||[]).slice(0,2).map(y=>`<span class="badge">${y}</span>`).join('')}</div>
      <button class="favorite-btn ${favorites.has(x.id)?'active':''}" data-favorite="${x.id}">${favorites.has(x.id)?'★':'☆'}</button>
    </div>
    <h3>${x.name}</h3><p>${x.description}</p>
    <div class="badges">${(x.bodyAreas||[]).map(y=>`<span class="badge body-badge" style="background:${bodyColors[y]||'#64748b'}">${y}</span>`).join('')}</div>
    <div class="exercise-card-actions"><button class="secondary" data-details="${x.id}">Detaljer</button></div>
  </article>`).join('');
  $('#libraryGrid').querySelectorAll('[data-favorite]').forEach(b=>b.onclick=()=>toggleFavorite(b.dataset.favorite));
  $('#libraryGrid').querySelectorAll('[data-details]').forEach(b=>b.onclick=()=>showExerciseDetails(b.dataset.details));
}

function toggleFavorite(id){
  favorites.has(id)?favorites.delete(id):favorites.add(id);
  localStorage.setItem('funkfit-favorites-v043',JSON.stringify([...favorites]));
  renderLibrary();
}

function showExerciseDetails(id){
  const x=exercises.find(e=>e.id===id); if(!x)return;
  $('#exerciseDetailContent').innerHTML=`<div class="exercise-card-top">
    <div><p class="eyebrow">${x.category}</p><h2>${x.name}</h2></div>
    <button class="favorite-btn ${favorites.has(x.id)?'active':''}" id="detailFavoriteBtn">${favorites.has(x.id)?'★ Favorit':'☆ Favorit'}</button>
  </div>
  <p>${x.description}</p>
  <div class="badges">${(x.bodyAreas||[]).map(y=>`<span class="badge body-badge" style="background:${bodyColors[y]||'#64748b'}">${y}</span>`).join('')}</div>
  ${x.instructionVideo?`<video class="detail-video" controls playsinline preload="metadata"><source src="${x.instructionVideo}" type="video/mp4"></video>`:'<div class="empty">Instruktionsfilm kommer senere.</div>'}
  <div class="detail-grid"><div class="detail-box"><strong>Junior</strong><p>${x.junior||'-'}</p></div><div class="detail-box"><strong>Voksen</strong><p>${x.adult||'-'}</p></div></div>`;
  $('#detailFavoriteBtn').onclick=()=>{toggleFavorite(x.id);showExerciseDetails(x.id)};
  $('#exerciseDetailDialog').showModal();
}

function openCreateExercise(sectionIndex){window.__createSectionIndex=sectionIndex;$('#newExerciseDialog').showModal()}

function createExercise(e){
  e.preventDefault();
  const d=Object.fromEntries(new FormData(e.target)),split=s=>s.split(',').map(x=>x.trim()).filter(Boolean);
  const created={id:'custom-'+crypto.randomUUID(),name:d.name,category:d.category,bodyAreas:split(d.bodyAreas),equipment:split(d.equipment),styles:split(d.styles),audience:['Junior','Voksen'],difficulty:d.difficulty,description:d.description,junior:d.junior,adult:d.adult};
  saveCustomExercise(created);exercises=[...loadCustomExercises(),...base];
  $('#newExerciseDialog').close();
  if(Number.isInteger(window.__createSectionIndex)){builder.addExercise(window.__createSectionIndex,created.id);window.__createSectionIndex=null}
  e.target.reset();renderLibrary();
}

function collect(){return{id:currentId||crypto.randomUUID(),name:$('#workoutName').value,date:$('#workoutDate').value,participants:+$('#participantCount').value,familyMode:$('#familyMode').checked,adultCount:+($('#adultCount').value||0),sections:builder.getData(),music:{spotify:$('#spotifyPlaylistUrl').value.trim(),telmore:$('#telmorePlaylistUrl').value.trim()},updatedAt:new Date().toISOString()}}

function saveCurrent(){const w=collect();currentId=w.id;saveWorkout(w);renderSaved();alert('Træningen er gemt.')}

function renderSaved(){
  const all=loadWorkouts();
  $('#savedWorkouts').innerHTML=all.length?all.map(w=>`<div class="saved-item"><div><strong>${w.name}</strong><br><small>${w.date||''} · ${w.sections.reduce((n,s)=>n+(+s.minutes||0),0)} min</small></div><div><button class="secondary" data-open="${w.id}">Åbn</button><button class="ghost" data-delete="${w.id}">Slet</button></div></div>`).join(''):'<div class="empty">Ingen gemte træninger endnu.</div>';
  $('#savedWorkouts').querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const w=all.find(x=>x.id===b.dataset.open);currentId=w.id;$('#workoutName').value=w.name;$('#workoutDate').value=w.date;$('#participantCount').value=w.participants;$('#familyMode').checked=!!w.familyMode;$('#adultCount').value=w.adultCount||0;$('#adultCountLabel').classList.toggle('hidden',!w.familyMode);$('#spotifyPlaylistUrl').value=w.music?.spotify||'';$('#telmorePlaylistUrl').value=w.music?.telmore||'';builder.loadData(w.sections);$('#builder').scrollIntoView({behavior:'smooth'})});
  $('#savedWorkouts').querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{deleteWorkout(b.dataset.delete);renderSaved()});
}

function printWorkout(){window.print()}

function openPlaylist(url,name){const value=(url||'').trim();if(!value)return alert(`Indsæt først et link til ${name}.`);window.open(value,'_blank','noopener')}
function buildPlayerItems(){const w=collect(),map=new Map(exercises.map(x=>[x.id,x])),items=[];for(const s of w.sections)for(const it of s.exercises){const ex=map.get(it.exerciseId),aex=map.get(it.adultExerciseId||it.exerciseId);items.push({section:s.name,format:s.format,style:s.style,minutes:s.minutes,work:s.work,rest:s.rest,rounds:s.rounds,exercise:ex?.name||'Ukendt øvelse',junior:[it.juniorReps,it.juniorKg?`${it.juniorKg} kg`:null].filter(Boolean).join(' · ')||ex?.junior||'Efter instruktørens anvisning',juniorNote:it.juniorNote||'',adultExercise:aex?.name||ex?.name||'Ukendt øvelse',adult:[it.adultReps,it.adultKg?`${it.adultKg} kg`:null].filter(Boolean).join(' · ')||aex?.adult||'Efter instruktørens anvisning',adultNote:it.adultNote||'',familyMode:w.familyMode})}return items}
function startWorkoutPlayer(){playerItems=buildPlayerItems();if(!playerItems.length)return alert('Tilføj mindst én øvelse, før træningen afspilles.');playerIndex=0;$('#playerWorkoutName').textContent=$('#workoutName').value||'FunkFit-træning';renderPlayer();$('#workoutPlayer').showModal();setTimeout(()=>$('#playerTapArea').focus(),50)}
function renderPlayer(){const i=playerItems[playerIndex];if(!i)return;$('#playerCounter').textContent=`${playerIndex+1} / ${playerItems.length}`;$('#playerProgressBar').style.width=`${((playerIndex+1)/playerItems.length)*100}%`;$('#playerSection').textContent=i.section;$('#playerFormat').textContent=`${i.format} · ${i.style}`;const t=[];if(i.work)t.push(`${i.work}/${i.rest||0} sek.`);if(i.rounds)t.push(`${i.rounds} runder`);if(i.minutes)t.push(`${i.minutes} min sektion`);$('#playerTiming').textContent=t.join(' · ')||'Fri træning';$('#playerExercise').textContent=i.exercise;$('#playerJunior').textContent=i.junior;$('#playerJuniorNote').textContent=i.juniorNote;$('#playerAdultCard').classList.toggle('hidden',!i.familyMode);$('#playerAdult').textContent=i.adultExercise===i.exercise?i.adult:`${i.adultExercise} · ${i.adult}`;$('#playerAdultNote').textContent=i.adultNote;$('#playerPrevBtn').disabled=playerIndex===0;$('#playerNextBtn').textContent=playerIndex===playerItems.length-1?'Afslut ✓':'Næste →'}
function movePlayer(d){if(!$('#workoutPlayer').open)return;if(d>0&&playerIndex===playerItems.length-1){closeWorkoutPlayer();return}playerIndex=Math.max(0,Math.min(playerItems.length-1,playerIndex+d));renderPlayer()}
function handlePlayerKeyboard(e){if(!$('#workoutPlayer').open)return;if(e.code==='Space'||e.code==='ArrowRight'){e.preventDefault();movePlayer(1)}else if(e.code==='ArrowLeft'){e.preventDefault();movePlayer(-1)}}
async function togglePlayerFullscreen(){try{if(!document.fullscreenElement)await $('#workoutPlayer').requestFullscreen();else await document.exitFullscreen()}catch{}}
function closeWorkoutPlayer(){if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});if($('#workoutPlayer').open)$('#workoutPlayer').close()}
function openPreferredMusic(){const s=$('#spotifyPlaylistUrl').value.trim(),t=$('#telmorePlaylistUrl').value.trim();if(s)return openPlaylist(s,'Spotify');if(t)return openPlaylist(t,'Telmore Musik');alert('Tilføj først et Spotify- eller Telmore Musik-link.')}

if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js');
init().catch(err=>{console.error(err);alert('Appen kunne ikke starte. Genindlæs siden.')});
