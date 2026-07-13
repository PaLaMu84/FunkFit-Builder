
import {loadExercises,renderExerciseCards,setupFilters} from './exercises.js';
import {WorkoutBuilder} from './workoutBuilder.js';
import {loadSavedWorkouts,saveWorkout,deleteWorkout,loadCustomExercises,saveCustomExercise,loadMusicPlan,saveMusicPlan} from './storage.js';
let exercises=[],templates=[],builder,currentId=null;const $=s=>document.querySelector(s);
async function init(){
  exercises=[...loadCustomExercises(),...await loadExercises()];
  templates=await fetch('data/workoutTemplates.json').then(r=>r.json());
  builder=new WorkoutBuilder({exercises,container:$('#workoutSections'),totalEl:$('#totalMinutes'),warningEl:$('#warningBox'),onChange:renderMusic});
  setupFilters(exercises,f=>{renderExerciseCards(f,id=>{builder.addExercise(id);$('#builder').scrollIntoView({behavior:'smooth'})},showDetails);$('#exerciseCount').textContent=`${f.length} øvelser`});
  $('#templateSelect').innerHTML=templates.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  builder.loadTemplate(templates[0]);$('#workoutDate').value=new Date().toISOString().slice(0,10);bind();loadMusic();renderSaved()
}
function bind(){
  document.querySelectorAll('[data-scroll]').forEach(b=>b.onclick=()=>$('#'+b.dataset.scroll).scrollIntoView({behavior:'smooth'}));
  $('#loadTemplateBtn').onclick=()=>builder.loadTemplate(templates.find(t=>t.id===$('#templateSelect').value));
  $('#addSectionBtn').onclick=()=>builder.addSection();$('#saveWorkoutBtn').onclick=save;$('#printWorkoutBtn').onclick=()=>print();$('#clearWorkoutBtn').onclick=()=>builder.clearExercises();$('#closeDialog').onclick=()=>$('#exerciseDialog').close();
  $('#newExerciseBtn').onclick=()=>$('#newExerciseDialog').showModal();$('#closeNewExerciseDialog').onclick=()=>$('#newExerciseDialog').close();
  $('#newExerciseForm').onsubmit=e=>{e.preventDefault();let d=Object.fromEntries(new FormData(e.target));saveCustomExercise({id:'custom-'+crypto.randomUUID(),name:d.name,category:d.category,equipment:d.equipment?d.equipment.split(',').map(x=>x.trim()):['Kropsvægt'],audience:['Junior','Voksen'],difficulty:d.difficulty,intensity:'Middel',format:['Station'],description:d.description,focus:[d.category],junior:d.junior,adult:d.adult,easier:'',harder:'',mistakes:''});location.reload()};
  $('#saveMusicBtn').onclick=()=>{saveMusicPlan({name:$('#playlistName').value,url:$('#playlistUrl').value});alert('Musikplan gemt.')};
  $('#openPlaylistBtn').onclick=()=>$('#playlistUrl').value?open($('#playlistUrl').value,'_blank'):alert('Indsæt et TIDAL-link.');
  $('#workoutImageInput').onchange=e=>{let f=e.target.files[0];if(f){$('#imagePreview').src=URL.createObjectURL(f);$('#imagePreview').classList.remove('hidden')}};
  $('#parseWorkoutTextBtn').onclick=parseText
}
function showDetails(x){$('#dialogContent').innerHTML=`<p class="eyebrow">${x.category}</p><h2>${x.name}</h2><p>${x.description}</p><h3>Junior</h3><p>${x.junior||'-'}</p><h3>Voksen</h3><p>${x.adult||'-'}</p><button id="dialogAddBtn">Tilføj</button>`;$('#dialogAddBtn').onclick=()=>{builder.addExercise(x.id);$('#exerciseDialog').close()};$('#exerciseDialog').showModal()}
function save(){let w={id:currentId||crypto.randomUUID(),name:$('#workoutName').value,date:$('#workoutDate').value,participants:+$('#participantCount').value,sections:builder.getData(),music:{name:$('#playlistName').value,url:$('#playlistUrl').value}};currentId=w.id;saveWorkout(w);renderSaved();alert('Træningen er gemt.')}
function renderSaved(){let a=loadSavedWorkouts(),el=$('#savedWorkouts');el.innerHTML=a.length?a.map(w=>`<div class="saved-item"><div><strong>${w.name}</strong><br><small>${w.date||''}</small></div><div><button data-open="${w.id}" class="secondary">Åbn</button><button data-delete="${w.id}" class="ghost">Slet</button></div></div>`).join(''):'<div class="empty-state">Ingen gemte træninger endnu.</div>';el.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{let w=a.find(x=>x.id===b.dataset.open);currentId=w.id;$('#workoutName').value=w.name;$('#workoutDate').value=w.date;$('#participantCount').value=w.participants;builder.loadData(w.sections);$('#playlistName').value=w.music?.name||'';$('#playlistUrl').value=w.music?.url||''});el.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{deleteWorkout(b.dataset.delete);renderSaved()})}
function renderMusic(sections=[]){let t=0;$('#musicTimeline').innerHTML=sections.map(s=>{let a=t,b=t+(+s.minutes||0);t=b;return `<div class="music-row"><strong>${s.name}</strong><span>${a}:00–${b}:00</span><span>${s.musicNote||'Ingen musiknote'}</span></div>`}).join('')}
function loadMusic(){let m=loadMusicPlan();$('#playlistName').value=m.name||'';$('#playlistUrl').value=m.url||''}
function parseText(){let lines=$('#imageWorkoutText').value.split(/\n+/).map(x=>x.trim()).filter(Boolean);if(!lines.length)return alert('Indsæt teksten fra billedet.');let found=lines.map(line=>{let ex=exercises.find(x=>line.toLowerCase().includes(x.name.toLowerCase()));return {line,ex}});$('#importResult').classList.remove('hidden');$('#importResult').innerHTML=`<h3>Importforslag</h3><ul>${found.map(x=>`<li>${x.line} ${x.ex?'✓':'⚠'}</li>`).join('')}</ul><button id="useImport">Tilføj matchede øvelser</button>`;$('#useImport').onclick=()=>{found.filter(x=>x.ex).forEach(x=>builder.addExercise(x.ex.id));$('#builder').scrollIntoView({behavior:'smooth'})}}
if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js');init();
