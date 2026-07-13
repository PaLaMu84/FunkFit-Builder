
export class WorkoutBuilder{
  constructor({exercises,container,totalEl,warningEl,onChange=()=>{},getFamilyMode=()=>false}){
    Object.assign(this,{exercises,container,totalEl,warningEl,onChange,getFamilyMode});this.sections=[];
  }
  setExercises(x){this.exercises=x}
  loadTemplate(t){this.sections=t.sections.map(s=>({...s,musicNote:'',exercises:[]}));this.render()}
  loadData(x){this.sections=structuredClone(x);this.render()}
  getData(){return structuredClone(this.sections)}
  addSection(){this.sections.push({name:'Ny sektion',minutes:10,musicNote:'',exercises:[]});this.render()}
  removeSection(i){if(this.sections.length>1){this.sections.splice(i,1);this.render()}}
  addExercise(id,section=null,reps=''){
    const i=section??Math.min(2,this.sections.length-1);
    this.sections[i].exercises.push({exerciseId:id,reps,note:'',juniorKg:'',adultExerciseId:id,adultReps:reps,adultKg:'',adultNote:''});
    this.render();
  }
  clearExercises(){this.sections.forEach(s=>s.exercises=[]);this.render()}
  move(si,ei,to){if(si==to)return;this.sections[to].exercises.push(this.sections[si].exercises.splice(ei,1)[0]);this.render()}
  rerender(){this.render()}
  render(){
    const family=this.getFamilyMode();
    this.container.innerHTML=this.sections.map((s,si)=>`
      <section class="workout-section">
        <div class="workout-section-header">
          <input data-name="${si}" value="${esc(s.name)}">
          <input data-min="${si}" type="number" min="0" value="${s.minutes}">
          <div class="section-tools"><strong>min</strong><button class="ghost" data-del-sec="${si}">Slet sektion</button></div>
        </div>
        <div class="section-dropzone">${s.exercises.length?s.exercises.map((it,ei)=>this.exerciseHtml(it,si,ei,family)).join(''):'<div class="empty-section">Tilføj øvelser fra biblioteket.</div>'}</div>
        <label class="section-music-note">Musiknote<input data-music="${si}" value="${esc(s.musicNote||'')}" placeholder="Fx høj energi / start ved track 4"></label>
      </section>`).join('');
    this.bind();this.update();
  }
  exerciseHtml(it,si,ei,family){
    const ex=this.exercises.find(x=>x.id===it.exerciseId);
    const adultEx=this.exercises.find(x=>x.id===(it.adultExerciseId||it.exerciseId));
    return `<div class="workout-exercise ${family?'family-active':''}">
      <div class="exercise-main-row">
        <div><strong>${esc(ex?.name||'Ukendt')}</strong><small>${esc(ex?.category||'')}</small></div>
        <input data-junior-reps="${si}-${ei}" placeholder="Junior reps/tid" value="${esc(it.reps||'')}">
        <input data-junior-note="${si}-${ei}" placeholder="Junior note" value="${esc(it.note||'')}">
        <div><select data-move="${si}-${ei}">${this.sections.map((x,j)=>`<option value="${j}" ${j===si?'selected':''}>${esc(x.name)}</option>`).join('')}</select><button class="remove-btn" data-del="${si}-${ei}">Fjern</button></div>
      </div>
      <div class="dual-grid">
        <label>Junior kg<input data-junior-kg="${si}-${ei}" value="${esc(it.juniorKg||'')}" placeholder="fx 6"></label>
        <label>Junior reps/tid<input data-junior-reps2="${si}-${ei}" value="${esc(it.reps||'')}" placeholder="fx 10"></label>
        <label>Junior note<input data-junior-note2="${si}-${ei}" value="${esc(it.note||'')}" placeholder="fx lav boks"></label><div></div>
      </div>
      ${family?`<div class="adult-panel"><h4><span class="family-badge">Voksen</span> ${esc(adultEx?.name||ex?.name||'Øvelse')}</h4>
        <div class="dual-grid">
          <label>Voksenøvelse<select data-adult-exercise="${si}-${ei}">${this.exercises.map(x=>`<option value="${x.id}" ${(it.adultExerciseId||it.exerciseId)===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label>
          <label>Voksen kg<input data-adult-kg="${si}-${ei}" value="${esc(it.adultKg||'')}" placeholder="fx 16"></label>
          <label>Voksen reps/tid<input data-adult-reps="${si}-${ei}" value="${esc(it.adultReps||it.reps||'')}" placeholder="fx 12"></label>
          <label>Voksen note<input data-adult-note="${si}-${ei}" value="${esc(it.adultNote||'')}" placeholder="fx tung variant"></label>
        </div></div>`:''}
    </div>`;
  }
  bind(){
    this.container.querySelectorAll('[data-name]').forEach(e=>e.oninput=()=>{this.sections[+e.dataset.name].name=e.value;this.onChange(this.sections)});
    this.container.querySelectorAll('[data-min]').forEach(e=>e.oninput=()=>{this.sections[+e.dataset.min].minutes=+e.value||0;this.update()});
    this.container.querySelectorAll('[data-junior-kg]').forEach(e=>e.oninput=()=>{let[a,b]=pair(e.dataset.juniorKg);this.sections[a].exercises[b].juniorKg=e.value});
    this.container.querySelectorAll('[data-junior-reps],[data-junior-reps2]').forEach(e=>e.oninput=()=>{let key=e.dataset.juniorReps||e.dataset.juniorReps2,[a,b]=pair(key);this.sections[a].exercises[b].reps=e.value});
    this.container.querySelectorAll('[data-junior-note],[data-junior-note2]').forEach(e=>e.oninput=()=>{let key=e.dataset.juniorNote||e.dataset.juniorNote2,[a,b]=pair(key);this.sections[a].exercises[b].note=e.value});
    this.container.querySelectorAll('[data-adult-exercise]').forEach(e=>e.onchange=()=>{let[a,b]=pair(e.dataset.adultExercise);this.sections[a].exercises[b].adultExerciseId=e.value;this.render()});
    this.container.querySelectorAll('[data-adult-kg]').forEach(e=>e.oninput=()=>{let[a,b]=pair(e.dataset.adultKg);this.sections[a].exercises[b].adultKg=e.value});
    this.container.querySelectorAll('[data-adult-reps]').forEach(e=>e.oninput=()=>{let[a,b]=pair(e.dataset.adultReps);this.sections[a].exercises[b].adultReps=e.value});
    this.container.querySelectorAll('[data-adult-note]').forEach(e=>e.oninput=()=>{let[a,b]=pair(e.dataset.adultNote);this.sections[a].exercises[b].adultNote=e.value});
    this.container.querySelectorAll('[data-music]').forEach(e=>e.oninput=()=>{this.sections[+e.dataset.music].musicNote=e.value;this.onChange(this.sections)});
    this.container.querySelectorAll('[data-move]').forEach(e=>e.onchange=()=>{let[a,b]=pair(e.dataset.move);this.move(a,b,+e.value)});
    this.container.querySelectorAll('[data-del]').forEach(e=>e.onclick=()=>{let[a,b]=pair(e.dataset.del);this.sections[a].exercises.splice(b,1);this.render()});
    this.container.querySelectorAll('[data-del-sec]').forEach(e=>e.onclick=()=>this.removeSection(+e.dataset.delSec));
  }
  update(){this.totalEl.textContent=this.sections.reduce((n,s)=>n+(+s.minutes||0),0);this.onChange(this.sections)}
}
const pair=s=>s.split('-').map(Number);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
