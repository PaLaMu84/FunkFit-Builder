
export class WorkoutBuilder{
  constructor({exercises,container,totalEl,warningEl,onChange=()=>{}}){Object.assign(this,{exercises,container,totalEl,warningEl,onChange});this.sections=[]}
  setExercises(x){this.exercises=x}
  loadTemplate(t){this.sections=t.sections.map(s=>({...s,musicNote:'',exercises:[]}));this.render()}
  loadData(x){this.sections=structuredClone(x);this.render()}
  getData(){return structuredClone(this.sections)}
  addSection(){this.sections.push({name:'Ny sektion',minutes:10,musicNote:'',exercises:[]});this.render()}
  removeSection(i){if(this.sections.length>1){this.sections.splice(i,1);this.render()}}
  addExercise(id,section=null,reps=''){const i=section??Math.min(2,this.sections.length-1);this.sections[i].exercises.push({exerciseId:id,reps,note:''});this.render()}
  clearExercises(){this.sections.forEach(s=>s.exercises=[]);this.render()}
  move(si,ei,to){if(si==to)return;this.sections[to].exercises.push(this.sections[si].exercises.splice(ei,1)[0]);this.render()}
  render(){
    this.container.innerHTML=this.sections.map((s,si)=>`
      <section class="workout-section">
        <div class="workout-section-header">
          <input data-name="${si}" value="${esc(s.name)}">
          <input data-min="${si}" type="number" min="0" value="${s.minutes}">
          <div class="section-tools"><strong>min</strong><button class="ghost" data-del-sec="${si}">Slet sektion</button></div>
        </div>
        <div class="section-dropzone">
          ${s.exercises.length?s.exercises.map((it,ei)=>{const ex=this.exercises.find(x=>x.id===it.exerciseId);return `<div class="workout-exercise">
              <div><strong>${esc(ex?.name||'Ukendt')}</strong><small>${esc(ex?.category||'')}</small></div>
              <input data-reps="${si}-${ei}" placeholder="Reps/tid" value="${esc(it.reps||'')}">
              <input data-note="${si}-${ei}" placeholder="Instruktørnote" value="${esc(it.note||'')}">
              <div><select data-move="${si}-${ei}">${this.sections.map((x,j)=>`<option value="${j}" ${j===si?'selected':''}>${esc(x.name)}</option>`).join('')}</select>
              <button class="remove-btn" data-del="${si}-${ei}">Fjern</button></div>
            </div>`}).join(''):'<div class="empty-section">Tilføj øvelser fra biblioteket.</div>'}
        </div>
        <label class="section-music-note">Musiknote<input data-music="${si}" value="${esc(s.musicNote||'')}" placeholder="Fx høj energi / start ved track 4"></label>
      </section>`).join('');
    this.bind();this.update()
  }
  bind(){
    this.container.querySelectorAll('[data-name]').forEach(e=>e.oninput=()=>{this.sections[+e.dataset.name].name=e.value;this.onChange(this.sections)});
    this.container.querySelectorAll('[data-min]').forEach(e=>e.oninput=()=>{this.sections[+e.dataset.min].minutes=+e.value||0;this.update()});
    this.container.querySelectorAll('[data-reps]').forEach(e=>e.oninput=()=>{let[a,b]=e.dataset.reps.split('-').map(Number);this.sections[a].exercises[b].reps=e.value});
    this.container.querySelectorAll('[data-note]').forEach(e=>e.oninput=()=>{let[a,b]=e.dataset.note.split('-').map(Number);this.sections[a].exercises[b].note=e.value});
    this.container.querySelectorAll('[data-music]').forEach(e=>e.oninput=()=>{this.sections[+e.dataset.music].musicNote=e.value;this.onChange(this.sections)});
    this.container.querySelectorAll('[data-move]').forEach(e=>e.onchange=()=>{let[a,b]=e.dataset.move.split('-').map(Number);this.move(a,b,+e.value)});
    this.container.querySelectorAll('[data-del]').forEach(e=>e.onclick=()=>{let[a,b]=e.dataset.del.split('-').map(Number);this.sections[a].exercises.splice(b,1);this.render()});
    this.container.querySelectorAll('[data-del-sec]').forEach(e=>e.onclick=()=>this.removeSection(+e.dataset.delSec))
  }
  update(){this.totalEl.textContent=this.sections.reduce((n,s)=>n+(+s.minutes||0),0);this.onChange(this.sections)}
}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
