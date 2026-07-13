
export async function loadExercises(){
  return fetch('data/exercises.json').then(r=>r.json());
}
export function setupFilters(exercises,onChange){
  const category=document.querySelector('#categoryFilter');
  const equipment=document.querySelector('#equipmentFilter');
  const body=document.querySelector('#bodyAreaFilter');
  [...new Set(exercises.map(x=>x.category))].sort().forEach(x=>category.add(new Option(x,x)));
  [...new Set(exercises.flatMap(x=>x.equipment||[]))].sort().forEach(x=>equipment.add(new Option(x,x)));
  [...new Set(exercises.flatMap(x=>x.bodyAreas||x.focus||[]))].sort().forEach(x=>body.add(new Option(x,x)));
  ['searchInput','categoryFilter','equipmentFilter','bodyAreaFilter','audienceFilter','difficultyFilter']
    .forEach(id=>document.querySelector('#'+id).addEventListener('input',apply));
  function apply(){
    const q=document.querySelector('#searchInput').value.toLowerCase().trim();
    const c=category.value,e=equipment.value,b=body.value;
    const a=document.querySelector('#audienceFilter').value,d=document.querySelector('#difficultyFilter').value;
    onChange(exercises.filter(x=>{
      const hay=[x.name,x.category,...(x.equipment||[]),...(x.focus||[]),...(x.bodyAreas||[]),x.description].join(' ').toLowerCase();
      return (!q||hay.includes(q))&&(!c||x.category===c)&&(!e||(x.equipment||[]).includes(e))&&
             (!b||(x.bodyAreas||x.focus||[]).includes(b))&&(!a||(x.audience||[]).includes(a))&&(!d||x.difficulty===d);
    }));
  }
  apply();
}
export function renderExerciseCards(exercises,onAdd,onDetails){
  const grid=document.querySelector('#exerciseGrid');
  if(!exercises.length){grid.innerHTML='<div class="empty-state">Ingen øvelser matcher filtrene.</div>';return;}
  grid.innerHTML=exercises.map(x=>`
    <article class="exercise-card">
      <div class="badges"><span class="badge">${x.category}</span><span class="badge">${x.difficulty}</span></div>
      <h3>${x.name}</h3><p>${x.description}</p>
      <div class="badges">${(x.bodyAreas||x.focus||[]).map(i=>`<span class="badge">${i}</span>`).join('')}</div>
      <div class="badges">${(x.equipment||[]).map(i=>`<span class="badge">${i}</span>`).join('')}</div>
      <div class="exercise-actions"><button data-add="${x.id}">Tilføj</button><button class="details" data-details="${x.id}">Detaljer</button></div>
    </article>`).join('');
  grid.querySelectorAll('[data-add]').forEach(btn=>btn.onclick=()=>onAdd(btn.dataset.add));
  grid.querySelectorAll('[data-details]').forEach(btn=>btn.onclick=()=>onDetails(exercises.find(x=>x.id===btn.dataset.details)));
}
