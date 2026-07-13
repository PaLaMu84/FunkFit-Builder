
import { loadExercises, renderExerciseCards, setupFilters } from './exercises.js';
import { WorkoutBuilder } from './workoutBuilder.js';
import { loadSavedWorkouts, saveWorkout, deleteWorkout } from './storage.js';

const state = {
  exercises: [],
  templates: [],
  builder: null,
  installPrompt: null
};

async function init(){
  state.exercises = await loadExercises();
  state.templates = await fetch('data/workoutTemplates.json').then(r => r.json());

  state.builder = new WorkoutBuilder({
    exercises: state.exercises,
    container: document.querySelector('#workoutSections'),
    totalEl: document.querySelector('#totalMinutes'),
    warningEl: document.querySelector('#warningBox')
  });

  setupFilters(state.exercises, (filtered) => {
    renderExerciseCards(filtered, addExercise, showExerciseDetails);
    document.querySelector('#exerciseCount').textContent = `${filtered.length} øvelser`;
  });

  populateTemplates();
  state.builder.loadTemplate(state.templates[0]);
  setToday();
  renderSaved();
  setupEvents();
  registerPWA();
}

function addExercise(id){
  state.builder.addExercise(id);
  document.querySelector('#builder').scrollIntoView({behavior:'smooth'});
}

function showExerciseDetails(exercise){
  const dialog = document.querySelector('#exerciseDialog');
  document.querySelector('#dialogContent').innerHTML = `
    <p class="eyebrow">${exercise.category}</p>
    <h2>${exercise.name}</h2>
    <p>${exercise.description}</p>
    <div class="badges">${exercise.equipment.map(x=>`<span class="badge">${x}</span>`).join('')}</div>
    <div class="dialog-grid">
      <div class="dialog-card"><strong>Junior</strong><p>${exercise.junior}</p></div>
      <div class="dialog-card"><strong>Voksen</strong><p>${exercise.adult}</p></div>
      <div class="dialog-card"><strong>Lettere</strong><p>${exercise.easier}</p></div>
      <div class="dialog-card"><strong>Sværere</strong><p>${exercise.harder}</p></div>
    </div>
    <h3>Typiske fejl</h3>
    <p>${exercise.mistakes}</p>
    <button id="dialogAddBtn">Tilføj til træning</button>
  `;
  document.querySelector('#dialogAddBtn').onclick = () => {
    addExercise(exercise.id);
    dialog.close();
  };
  dialog.showModal();
}

function populateTemplates(){
  const select = document.querySelector('#templateSelect');
  select.innerHTML = state.templates.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

function setToday(){
  document.querySelector('#workoutDate').value = new Date().toISOString().slice(0,10);
}

function setupEvents(){
  document.querySelectorAll('[data-scroll]').forEach(btn=>{
    btn.addEventListener('click',()=>document.querySelector(`#${btn.dataset.scroll}`).scrollIntoView({behavior:'smooth'}));
  });

  document.querySelector('#loadTemplateBtn').addEventListener('click',()=>{
    const id = document.querySelector('#templateSelect').value;
    const template = state.templates.find(t=>t.id===id);
    state.builder.loadTemplate(template);
  });

  document.querySelector('#saveWorkoutBtn').addEventListener('click',()=>{
    const workout = collectWorkout();
    saveWorkout(workout);
    renderSaved();
    alert('Træningen er gemt på denne enhed.');
  });

  document.querySelector('#printWorkoutBtn').addEventListener('click',()=>window.print());
  document.querySelector('#clearWorkoutBtn').addEventListener('click',()=>state.builder.clearExercises());
  document.querySelector('#closeDialog').addEventListener('click',()=>document.querySelector('#exerciseDialog').close());
}

function collectWorkout(){
  return {
    id: crypto.randomUUID(),
    name: document.querySelector('#workoutName').value.trim() || 'Unavngivet træning',
    date: document.querySelector('#workoutDate').value,
    participants: Number(document.querySelector('#participantCount').value || 0),
    sections: state.builder.getData(),
    savedAt: new Date().toISOString()
  };
}

function renderSaved(){
  const el = document.querySelector('#savedWorkouts');
  const items = loadSavedWorkouts();
  if(!items.length){
    el.innerHTML = '<div class="empty-state">Ingen gemte træninger endnu.</div>';
    return;
  }
  el.innerHTML = items.map(item=>`
    <div class="saved-item">
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.date || 'Ingen dato'} · ${item.sections.reduce((s,x)=>s+Number(x.minutes||0),0)} min</small>
      </div>
      <div>
        <button class="secondary" data-load="${item.id}">Åbn</button>
        <button class="ghost" data-delete="${item.id}">Slet</button>
      </div>
    </div>
  `).join('');

  el.querySelectorAll('[data-load]').forEach(btn=>btn.onclick=()=>{
    const item=items.find(x=>x.id===btn.dataset.load);
    document.querySelector('#workoutName').value=item.name;
    document.querySelector('#workoutDate').value=item.date;
    document.querySelector('#participantCount').value=item.participants;
    state.builder.loadData(item.sections);
    document.querySelector('#builder').scrollIntoView({behavior:'smooth'});
  });
  el.querySelectorAll('[data-delete]').forEach(btn=>btn.onclick=()=>{
    deleteWorkout(btn.dataset.delete);
    renderSaved();
  });
}

function registerPWA(){
  if('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js');
  window.addEventListener('beforeinstallprompt',(e)=>{
    e.preventDefault();
    state.installPrompt=e;
    document.querySelector('#installBtn').classList.remove('hidden');
  });
  document.querySelector('#installBtn').addEventListener('click',async()=>{
    if(!state.installPrompt) return;
    state.installPrompt.prompt();
    await state.installPrompt.userChoice;
    state.installPrompt=null;
    document.querySelector('#installBtn').classList.add('hidden');
  });
}

init().catch(err=>{
  console.error(err);
  document.body.innerHTML='<p style="padding:2rem">Appen kunne ikke indlæses. Start den via en lokal webserver i stedet for direkte som fil.</p>';
});
