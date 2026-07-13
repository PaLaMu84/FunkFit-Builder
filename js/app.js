'use strict';

const VERSION = '0.4.4';
const KEYS = {
  workouts: 'funkfit-workouts-v044',
  customExercises: 'funkfit-custom-exercises-v044',
  favorites: 'funkfit-favorites-v044'
};
const FORMATS = ['Fælles flow','Teknik','Stationstræning','Cirkeltræning','AMRAP','EMOM','E2MOM','For time','Chipper','Tabata','HIIT-intervaller','You go, I go','Makkertræning','Team workout','Stafet','Hyrox station'];
const STYLES = ['Funktionel','CrossFit-inspireret','HIIT / Hyrox-inspireret','Teknik','Leg','Mobilitet','Kondition'];
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const esc = (s='') => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const readLocal = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };

let baseExercises = [];
let exercises = [];
let templates = [];
let bodyColors = {};
let favorites = new Set();
let sections = [];
let currentWorkoutId = null;
let openPickerIndex = null;
let pickerSearch = '';
let pickerStyle = '';
let pickerFavoritesOnly = false;
let createTargetSection = null;
let playerItems = [];
let playerIndex = 0;

async function loadJson(url) {
  const response = await fetch(url, {cache:'no-store'});
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.json();
}

async function init() {
  [baseExercises, templates, bodyColors] = await Promise.all([
    loadJson('data/exercises.json'),
    loadJson('data/workoutTemplates.json'),
    loadJson('data/bodyColors.json')
  ]);
  exercises = [...readLocal(KEYS.customExercises, []), ...baseExercises];
  favorites = new Set(readLocal(KEYS.favorites, []));
  if (!templates.length) throw new Error('Ingen træningsskabeloner fundet');
  populateTemplateSelect();
  loadTemplate(templates[0]);
  $('#workoutDate').value = new Date().toISOString().slice(0,10);
  populateLibraryFilters();
  bindStaticEvents();
  renderLibrary();
  renderSaved();
}

function bindStaticEvents() {
  $$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
  $$('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close)?.close()));
  $('#loadTemplateBtn').addEventListener('click',()=>loadTemplate(templates.find(t=>t.id === $('#templateSelect').value) || templates[0]));
  $('#addSectionBtn').addEventListener('click',()=>{sections.push(newSection()); renderSections();});
  $('#familyMode').addEventListener('change',()=>{$('#adultCountLabel').classList.toggle('hidden',!$('#familyMode').checked);renderSections();});
  $('#saveWorkoutBtn').addEventListener('click',saveCurrentWorkout);
  $('#clearWorkoutBtn').addEventListener('click',()=>{sections.forEach(s=>s.exercises=[]);renderSections();});
  $('#participantPdfBtn').addEventListener('click',()=>printWorkout('participant'));
  $('#instructorPdfBtn').addEventListener('click',()=>printWorkout('instructor'));
  $('#newExerciseBtn').addEventListener('click',()=>openCreateExercise(null));
  $('#newExerciseForm').addEventListener('submit',createExercise);
  ['librarySearch','libraryBody','libraryStyle','libraryEquipment','favoritesOnly'].forEach(id=>document.getElementById(id).addEventListener('input',renderLibrary));
  $('#openSpotifyBtn').addEventListener('click',()=>openPlaylist($('#spotifyPlaylistUrl').value,'Spotify'));
  $('#openTelmoreBtn').addEventListener('click',()=>openPlaylist($('#telmorePlaylistUrl').value,'Telmore Musik'));
  $('#playWorkoutBtn').addEventListener('click',startPlayer);
  $('#playerCloseBtn').addEventListener('click',closePlayer);
  $('#playerFullscreenBtn').addEventListener('click',toggleFullscreen);
  $('#playerMusicBtn').addEventListener('click',openPreferredMusic);
  $('#playerPrevBtn').addEventListener('click',()=>movePlayer(-1));
  $('#playerNextBtn').addEventListener('click',()=>movePlayer(1));
  $('#playerTapArea').addEventListener('click',e=>{if(!e.target.closest('button,a,input,select')) movePlayer(1);});
  document.addEventListener('keydown',handlePlayerKey);
}

function populateTemplateSelect() {
  $('#templateSelect').innerHTML = templates.map(t=>`<option value="${esc(t.id)}">${esc(t.name)}</option>`).join('');
}

function normalizeSection(s={}) {
  return {
    name:s.name || 'Ny sektion', minutes:Number(s.minutes ?? 10), format:s.format || 'Stationstræning',
    style:s.style || 'Funktionel', work:Number(s.work ?? 40), rest:Number(s.rest ?? 20),
    rounds:Number(s.rounds ?? 3), exercises:Array.isArray(s.exercises) ? s.exercises : []
  };
}
function newSection(){ return normalizeSection({}); }
function loadTemplate(template) {
  sections = structuredClone(template.sections).map(normalizeSection);
  openPickerIndex = null;
  renderSections();
}

function totalMinutes(){ return sections.reduce((n,s)=>n+(Number(s.minutes)||0),0); }

function renderSections() {
  const family = $('#familyMode').checked;
  $('#workoutSections').innerHTML = sections.map((s,si)=>sectionHtml(s,si,family)).join('');
  $('#totalMinutes').textContent = totalMinutes();
  bindSectionEvents();
}

function sectionHtml(s,si,family) {
  return `<section class="workout-section">
    <div class="section-header">
      <div class="section-top">
        <input data-sec-name="${si}" value="${esc(s.name)}" aria-label="Sektionsnavn">
        <input data-sec-min="${si}" type="number" min="0" value="${s.minutes}" aria-label="Minutter">
        <div class="actions"><button data-toggle-picker="${si}">${openPickerIndex===si?'Luk øvelser':'+ Tilføj øvelse'}</button><button class="ghost" data-delete-section="${si}">Slet sektion</button></div>
      </div>
      <div class="section-settings">
        <label>Format<select data-sec-format="${si}">${FORMATS.map(x=>`<option ${x===s.format?'selected':''}>${esc(x)}</option>`).join('')}</select></label>
        <label>Træningsspor<select data-sec-style="${si}">${STYLES.map(x=>`<option ${x===s.style?'selected':''}>${esc(x)}</option>`).join('')}</select></label>
        <label>Arbejde (sek.)<input data-sec-work="${si}" type="number" min="0" value="${s.work}"></label>
        <label>Pause (sek.)<input data-sec-rest="${si}" type="number" min="0" value="${s.rest}"></label>
        <label>Runder<input data-sec-rounds="${si}" type="number" min="1" value="${s.rounds}"></label>
      </div>
      ${openPickerIndex===si ? pickerHtml(si) : ''}
    </div>
    <div class="section-body">${s.exercises.length ? s.exercises.map((it,ei)=>exerciseRowHtml(it,si,ei,family)).join('') : '<div class="empty">Ingen øvelser endnu. Tryk “+ Tilføj øvelse”.</div>'}</div>
  </section>`;
}

function pickerHtml(si) {
  const filtered = filterExercises(pickerSearch,'',pickerStyle,'').filter(x=>!pickerFavoritesOnly || favorites.has(x.id));
  return `<div class="inline-picker"><div class="picker-head">
    <input id="pickerSearch" type="search" placeholder="Søg efter øvelse" value="${esc(pickerSearch)}">
    <select id="pickerStyle"><option value="">Alle spor</option><option ${pickerStyle==='Funktionel'?'selected':''}>Funktionel</option><option ${pickerStyle==='CrossFit-inspireret'?'selected':''}>CrossFit-inspireret</option><option ${pickerStyle==='HIIT / Hyrox-inspireret'?'selected':''}>HIIT / Hyrox-inspireret</option></select>
    <label class="fav-filter"><input id="pickerFavoritesOnly" type="checkbox" ${pickerFavoritesOnly?'checked':''}> Favoritter</label>
    <button class="secondary" data-create-from-section="${si}">+ Opret øvelse</button></div>
    <div class="picker-list">${filtered.length ? filtered.map(x=>`<button class="picker-choice" data-pick="${si}|${esc(x.id)}"><span><strong>${esc(x.name)}</strong><small>${esc((x.bodyAreas||[]).join(' · '))}</small></span><b>+</b></button>`).join('') : '<div class="empty">Ingen øvelser matcher.</div>'}</div></div>`;
}

function exerciseRowHtml(it,si,ei,family) {
  const ex = exercises.find(x=>x.id===it.exerciseId);
  const adultId = it.adultExerciseId || it.exerciseId;
  return `<article class="exercise-row"><div class="exercise-main">
    <div class="exercise-name"><strong>${esc(ex?.name || 'Ukendt øvelse')}</strong><small>${esc((ex?.bodyAreas||[]).join(' · '))}</small></div>
    <label>Junior kg<input data-jkg="${si}-${ei}" value="${esc(it.juniorKg||'')}"></label>
    <label>Junior reps/tid<input data-jreps="${si}-${ei}" value="${esc(it.juniorReps||'')}"></label>
    <label>Junior note<input data-jnote="${si}-${ei}" value="${esc(it.juniorNote||'')}"></label>
    <button class="ghost" data-delete-exercise="${si}-${ei}">Fjern</button></div>
    ${family ? `<div class="adult-settings"><strong>VOKSEN</strong><div class="adult-grid">
      <label>Voksenøvelse<select data-aex="${si}-${ei}">${exercises.map(x=>`<option value="${esc(x.id)}" ${x.id===adultId?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label>
      <label>Voksen kg<input data-akg="${si}-${ei}" value="${esc(it.adultKg||'')}"></label>
      <label>Voksen reps/tid<input data-areps="${si}-${ei}" value="${esc(it.adultReps||'')}"></label>
      <label>Voksen note<input data-anote="${si}-${ei}" value="${esc(it.adultNote||'')}"></label>
    </div></div>` : ''}</article>`;
}

function bindSectionEvents() {
  $$('[data-toggle-picker]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.togglePicker);openPickerIndex=openPickerIndex===i?null:i;pickerSearch='';pickerStyle=sections[i].style;renderSections();}));
  $$('[data-create-from-section]').forEach(b=>b.addEventListener('click',()=>openCreateExercise(Number(b.dataset.createFromSection))));
  $$('[data-pick]').forEach(b=>b.addEventListener('click',()=>{const [si,id]=b.dataset.pick.split('|');sections[Number(si)].exercises.push(newExerciseItem(id));openPickerIndex=null;renderSections();}));
  $('#pickerSearch')?.addEventListener('input',e=>{pickerSearch=e.target.value;renderSections();setTimeout(()=>{const el=$('#pickerSearch');el?.focus();el?.setSelectionRange(el.value.length,el.value.length)},0);});
  $('#pickerStyle')?.addEventListener('change',e=>{pickerStyle=e.target.value;renderSections();});
  $('#pickerFavoritesOnly')?.addEventListener('change',e=>{pickerFavoritesOnly=e.target.checked;renderSections();});
  $$('[data-delete-section]').forEach(b=>b.addEventListener('click',()=>{if(sections.length>1){sections.splice(Number(b.dataset.deleteSection),1);openPickerIndex=null;renderSections();}}));
  bindSectionField('[data-sec-name]','secName','name',false);
  bindSectionField('[data-sec-min]','secMin','minutes',true);
  bindSectionField('[data-sec-format]','secFormat','format',false,'change');
  bindSectionField('[data-sec-style]','secStyle','style',false,'change');
  bindSectionField('[data-sec-work]','secWork','work',true);
  bindSectionField('[data-sec-rest]','secRest','rest',true);
  bindSectionField('[data-sec-rounds]','secRounds','rounds',true);
  $$('[data-delete-exercise]').forEach(b=>b.addEventListener('click',()=>{const [si,ei]=b.dataset.deleteExercise.split('-').map(Number);sections[si].exercises.splice(ei,1);renderSections();}));
  bindExerciseField('[data-jkg]','jkg','juniorKg'); bindExerciseField('[data-jreps]','jreps','juniorReps'); bindExerciseField('[data-jnote]','jnote','juniorNote');
  bindExerciseField('[data-aex]','aex','adultExerciseId','change'); bindExerciseField('[data-akg]','akg','adultKg'); bindExerciseField('[data-areps]','areps','adultReps'); bindExerciseField('[data-anote]','anote','adultNote');
}
function bindSectionField(selector,key,prop,numeric,event='input') { $$(selector).forEach(el=>el.addEventListener(event,()=>{sections[Number(el.dataset[key])][prop]=numeric?(Number(el.value)||0):el.value;if(prop==='minutes')$('#totalMinutes').textContent=totalMinutes();})); }
function bindExerciseField(selector,key,prop,event='input') { $$(selector).forEach(el=>el.addEventListener(event,()=>{const [si,ei]=el.dataset[key].split('-').map(Number);sections[si].exercises[ei][prop]=el.value;})); }
function newExerciseItem(id){ return {exerciseId:id,juniorKg:'',juniorReps:'',juniorNote:'',adultExerciseId:id,adultKg:'',adultReps:'',adultNote:''}; }

function populateLibraryFilters() {
  const unique = field => [...new Set(exercises.flatMap(x=>x[field]||[]))].sort((a,b)=>a.localeCompare(b,'da'));
  unique('bodyAreas').forEach(x=>$('#libraryBody').add(new Option(x,x)));
  unique('styles').forEach(x=>$('#libraryStyle').add(new Option(x,x)));
  unique('equipment').forEach(x=>$('#libraryEquipment').add(new Option(x,x)));
}
function filterExercises(q,body,style,equipment) {
  q=(q||'').toLowerCase().trim();
  return exercises.filter(x=>{const hay=[x.name,x.category,x.description,...(x.bodyAreas||[]),...(x.styles||[]),...(x.equipment||[])].join(' ').toLowerCase();const styleMatch=!style || (style==='HIIT / Hyrox-inspireret' ? (x.styles||[]).some(s=>s==='HIIT'||s==='Hyrox-inspireret'||s==='HIIT / Hyrox-inspireret') : (x.styles||[]).includes(style));return(!q||hay.includes(q))&&(!body||(x.bodyAreas||[]).includes(body))&&styleMatch&&(!equipment||(x.equipment||[]).includes(equipment));});
}
function renderLibrary() {
  const list=filterExercises($('#librarySearch').value,$('#libraryBody').value,$('#libraryStyle').value,$('#libraryEquipment').value).filter(x=>!$('#favoritesOnly').checked||favorites.has(x.id));
  $('#libraryGrid').innerHTML=list.map(x=>`<article class="exercise-card"><div class="card-top"><div class="badges">${(x.styles||[]).slice(0,2).map(y=>`<span class="badge">${esc(y)}</span>`).join('')}</div><button class="fav-btn ${favorites.has(x.id)?'active':''}" data-favorite="${esc(x.id)}">${favorites.has(x.id)?'★':'☆'}</button></div><h3>${esc(x.name)}</h3><p>${esc(x.description||'')}</p><div class="badges">${(x.bodyAreas||[]).map(y=>`<span class="badge body-badge" style="background:${esc(bodyColors[y]||'#64748b')}">${esc(y)}</span>`).join('')}</div><button class="secondary" data-details="${esc(x.id)}">Detaljer</button></article>`).join('');
  $$('[data-favorite]',$('#libraryGrid')).forEach(b=>b.addEventListener('click',()=>toggleFavorite(b.dataset.favorite)));
  $$('[data-details]',$('#libraryGrid')).forEach(b=>b.addEventListener('click',()=>showDetails(b.dataset.details)));
}
function toggleFavorite(id){favorites.has(id)?favorites.delete(id):favorites.add(id);localStorage.setItem(KEYS.favorites,JSON.stringify([...favorites]));renderLibrary();if(openPickerIndex!==null)renderSections();}
function showDetails(id){const x=exercises.find(e=>e.id===id);if(!x)return;$('#exerciseDetailContent').innerHTML=`<div class="card-top"><div><p class="eyebrow">${esc(x.category)}</p><h2>${esc(x.name)}</h2></div><button id="detailFav" class="fav-btn ${favorites.has(x.id)?'active':''}">${favorites.has(x.id)?'★ Favorit':'☆ Favorit'}</button></div><p>${esc(x.description||'')}</p><div class="badges">${(x.bodyAreas||[]).map(y=>`<span class="badge body-badge" style="background:${esc(bodyColors[y]||'#64748b')}">${esc(y)}</span>`).join('')}</div>${x.instructionVideo?`<video class="detail-video" controls playsinline preload="metadata"><source src="${esc(x.instructionVideo)}" type="video/mp4"></video>`:'<div class="empty">Instruktionsfilm kommer senere.</div>'}<p><strong>Junior:</strong> ${esc(x.junior||'-')}</p><p><strong>Voksen:</strong> ${esc(x.adult||'-')}</p>`;$('#detailFav').addEventListener('click',()=>{toggleFavorite(x.id);showDetails(x.id)});$('#exerciseDetailDialog').showModal();}

function openCreateExercise(sectionIndex){createTargetSection=sectionIndex;$('#newExerciseDialog').showModal();}
function createExercise(e){e.preventDefault();const d=Object.fromEntries(new FormData(e.target));const split=s=>String(s||'').split(',').map(x=>x.trim()).filter(Boolean);const x={id:'custom-'+crypto.randomUUID(),name:d.name,category:d.category,bodyAreas:split(d.bodyAreas),equipment:split(d.equipment),styles:split(d.styles),audience:['Junior','Voksen'],difficulty:d.difficulty,description:d.description,junior:d.junior,adult:d.adult};const custom=readLocal(KEYS.customExercises,[]);custom.unshift(x);localStorage.setItem(KEYS.customExercises,JSON.stringify(custom));exercises=[...custom,...baseExercises];if(Number.isInteger(createTargetSection))sections[createTargetSection].exercises.push(newExerciseItem(x.id));createTargetSection=null;e.target.reset();$('#newExerciseDialog').close();renderLibrary();renderSections();}

function collectWorkout(){return{id:currentWorkoutId||crypto.randomUUID(),name:$('#workoutName').value.trim()||'Unavngivet træning',date:$('#workoutDate').value,participants:Number($('#participantCount').value)||0,familyMode:$('#familyMode').checked,adultCount:Number($('#adultCount').value)||0,music:{spotify:$('#spotifyPlaylistUrl').value.trim(),telmore:$('#telmorePlaylistUrl').value.trim()},sections:structuredClone(sections),version:VERSION,updatedAt:new Date().toISOString()};}
function saveCurrentWorkout(){const w=collectWorkout();currentWorkoutId=w.id;const all=readLocal(KEYS.workouts,[]).filter(x=>x.id!==w.id);all.unshift(w);localStorage.setItem(KEYS.workouts,JSON.stringify(all.slice(0,100)));renderSaved();alert('Træningen er gemt.');}
function renderSaved(){const all=readLocal(KEYS.workouts,[]);$('#savedWorkouts').innerHTML=all.length?all.map(w=>`<div class="saved-item"><div><strong>${esc(w.name)}</strong><br><small>${esc(w.date||'')} · ${(w.sections||[]).reduce((n,s)=>n+(Number(s.minutes)||0),0)} min</small></div><div class="actions"><button class="secondary" data-open-saved="${esc(w.id)}">Åbn</button><button class="ghost" data-delete-saved="${esc(w.id)}">Slet</button></div></div>`).join(''):'<div class="empty">Ingen gemte træninger endnu.</div>';$$('[data-open-saved]').forEach(b=>b.addEventListener('click',()=>openSaved(b.dataset.openSaved)));$$('[data-delete-saved]').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem(KEYS.workouts,JSON.stringify(all.filter(x=>x.id!==b.dataset.deleteSaved)));renderSaved();}));}
function openSaved(id){const w=readLocal(KEYS.workouts,[]).find(x=>x.id===id);if(!w)return;currentWorkoutId=w.id;$('#workoutName').value=w.name;$('#workoutDate').value=w.date||'';$('#participantCount').value=w.participants||0;$('#familyMode').checked=!!w.familyMode;$('#adultCount').value=w.adultCount||0;$('#adultCountLabel').classList.toggle('hidden',!w.familyMode);$('#spotifyPlaylistUrl').value=w.music?.spotify||'';$('#telmorePlaylistUrl').value=w.music?.telmore||'';sections=structuredClone(w.sections||[]).map(normalizeSection);renderSections();$('#builder').scrollIntoView({behavior:'smooth'});}

function printWorkout(mode){const w=collectWorkout(),map=new Map(exercises.map(x=>[x.id,x]));$('#printView').innerHTML=`<h1>${esc(w.name)}</h1><p>${esc(w.date||'')} · ${w.participants} juniorer${w.familyMode?` · ${w.adultCount} voksne`:''}</p>${w.sections.map(s=>`<section class="workout-section"><h2>${esc(s.name)} — ${s.minutes} min</h2><p>${esc(s.format)} · ${esc(s.style)} · ${s.rounds} runder${s.work?` · ${s.work}/${s.rest} sek.`:''}</p>${s.exercises.map(it=>{const ex=map.get(it.exerciseId),a=map.get(it.adultExerciseId||it.exerciseId);return`<div class="exercise-row"><strong>${esc(ex?.name||'Ukendt')}</strong><p>Junior: ${esc(it.juniorReps||ex?.junior||'-')}${it.juniorKg?` · ${esc(it.juniorKg)} kg`:''}${mode==='instructor'&&it.juniorNote?` · ${esc(it.juniorNote)}`:''}</p>${w.familyMode?`<p>Voksen: ${esc(a?.name||ex?.name||'Ukendt')} · ${esc(it.adultReps||a?.adult||'-')}${it.adultKg?` · ${esc(it.adultKg)} kg`:''}${mode==='instructor'&&it.adultNote?` · ${esc(it.adultNote)}`:''}</p>`:''}</div>`}).join('')}</section>`).join('')}`;window.print();}

function openPlaylist(url,name){url=String(url||'').trim();if(!url)return alert(`Indsæt først et link til ${name}.`);window.open(url,'_blank','noopener');}
function buildPlayerItems(){const w=collectWorkout(),map=new Map(exercises.map(x=>[x.id,x])),items=[];for(const s of w.sections)for(const it of s.exercises){const ex=map.get(it.exerciseId),a=map.get(it.adultExerciseId||it.exerciseId);items.push({section:s.name,format:s.format,style:s.style,minutes:s.minutes,work:s.work,rest:s.rest,rounds:s.rounds,exercise:ex?.name||'Ukendt',junior:[it.juniorReps||ex?.junior,it.juniorKg?`${it.juniorKg} kg`:null].filter(Boolean).join(' · ')||'Efter instruktørens anvisning',juniorNote:it.juniorNote||'',adultExercise:a?.name||ex?.name||'Ukendt',adult:[it.adultReps||a?.adult,it.adultKg?`${it.adultKg} kg`:null].filter(Boolean).join(' · ')||'Efter instruktørens anvisning',adultNote:it.adultNote||'',family:w.familyMode});}return items;}
function startPlayer(){playerItems=buildPlayerItems();if(!playerItems.length)return alert('Tilføj mindst én øvelse først.');playerIndex=0;$('#playerWorkoutName').textContent=$('#workoutName').value||'Træning';renderPlayer();$('#workoutPlayer').showModal();setTimeout(()=>$('#playerTapArea').focus(),50);}
function renderPlayer(){const i=playerItems[playerIndex];$('#playerCounter').textContent=`${playerIndex+1} / ${playerItems.length}`;$('#playerProgressBar').style.width=`${100*(playerIndex+1)/playerItems.length}%`;$('#playerSection').textContent=i.section;$('#playerFormat').textContent=`${i.format} · ${i.style}`;$('#playerTiming').textContent=[i.work?`${i.work}/${i.rest} sek.`:'',i.rounds?`${i.rounds} runder`:'',i.minutes?`${i.minutes} min`: ''].filter(Boolean).join(' · ');$('#playerExercise').textContent=i.exercise;$('#playerJunior').textContent=i.junior;$('#playerJuniorNote').textContent=i.juniorNote;$('#playerAdultCard').classList.toggle('hidden',!i.family);$('#playerAdult').textContent=i.adultExercise===i.exercise?i.adult:`${i.adultExercise} · ${i.adult}`;$('#playerAdultNote').textContent=i.adultNote;$('#playerPrevBtn').disabled=playerIndex===0;$('#playerNextBtn').textContent=playerIndex===playerItems.length-1?'Afslut ✓':'Næste →';}
function movePlayer(d){if(!$('#workoutPlayer').open)return;if(d>0&&playerIndex===playerItems.length-1)return closePlayer();playerIndex=Math.max(0,Math.min(playerItems.length-1,playerIndex+d));renderPlayer();}
function handlePlayerKey(e){if(!$('#workoutPlayer').open)return;if(e.code==='Space'||e.code==='ArrowRight'){e.preventDefault();movePlayer(1)}else if(e.code==='ArrowLeft'){e.preventDefault();movePlayer(-1)}}
async function toggleFullscreen(){try{if(!document.fullscreenElement)await $('#workoutPlayer').requestFullscreen();else await document.exitFullscreen();}catch{}}
function closePlayer(){if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});if($('#workoutPlayer').open)$('#workoutPlayer').close();}
function openPreferredMusic(){const s=$('#spotifyPlaylistUrl').value.trim(),t=$('#telmorePlaylistUrl').value.trim();if(s)return openPlaylist(s,'Spotify');if(t)return openPlaylist(t,'Telmore Musik');alert('Tilføj først et musiklink.');}

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(console.error));}
init().catch(err=>{console.error(err);document.body.insertAdjacentHTML('afterbegin',`<div style="padding:1rem;background:#fee2e2;color:#991b1b;font-weight:700">FunkFit Builder kunne ikke starte: ${esc(err.message)}. Kontrollér at alle filer er uploadet.</div>`);});
