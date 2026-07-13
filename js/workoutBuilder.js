
export class WorkoutBuilder{
  constructor({exercises,container,totalEl,warningEl}){
    this.exercises=exercises;
    this.container=container;
    this.totalEl=totalEl;
    this.warningEl=warningEl;
    this.sections=[];
  }

  loadTemplate(template){
    this.sections=template.sections.map(s=>({...s, exercises:[]}));
    this.render();
  }

  loadData(sections){
    this.sections=structuredClone(sections);
    this.render();
  }

  addExercise(id){
    if(!this.sections.length) return;
    this.sections[this.sections.length>2?2:0].exercises.push({exerciseId:id,note:''});
    this.render();
  }

  removeExercise(sectionIndex,exerciseIndex){
    this.sections[sectionIndex].exercises.splice(exerciseIndex,1);
    this.render();
  }

  clearExercises(){
    this.sections.forEach(s=>s.exercises=[]);
    this.render();
  }

  getData(){
    return structuredClone(this.sections);
  }

  render(){
    this.container.innerHTML=this.sections.map((s,si)=>`
      <section class="workout-section">
        <div class="workout-section-header">
          <input data-section-name="${si}" value="${s.name}">
          <input data-section-minutes="${si}" type="number" min="0" value="${s.minutes}">
          <strong>minutter</strong>
        </div>
        <div class="section-dropzone">
          ${s.exercises.length ? s.exercises.map((item,ei)=>{
            const ex=this.exercises.find(x=>x.id===item.exerciseId);
            return `
              <div class="workout-exercise">
                <div><strong>${ex?.name || 'Ukendt øvelse'}</strong><small>${ex?.category || ''}</small></div>
                <input data-note="${si}-${ei}" placeholder="Fx 10 reps / 30 sek." value="${item.note||''}">
                <button class="remove-btn" data-remove="${si}-${ei}">Fjern</button>
              </div>`;
          }).join('') : '<div class="empty-section">Tilføj øvelser fra biblioteket.</div>'}
        </div>
      </section>
    `).join('');

    this.container.querySelectorAll('[data-section-name]').forEach(el=>el.oninput=()=>{
      this.sections[Number(el.dataset.sectionName)].name=el.value;
    });
    this.container.querySelectorAll('[data-section-minutes]').forEach(el=>el.oninput=()=>{
      this.sections[Number(el.dataset.sectionMinutes)].minutes=Number(el.value||0);
      this.updateSummary();
    });
    this.container.querySelectorAll('[data-note]').forEach(el=>el.oninput=()=>{
      const [si,ei]=el.dataset.note.split('-').map(Number);
      this.sections[si].exercises[ei].note=el.value;
    });
    this.container.querySelectorAll('[data-remove]').forEach(el=>el.onclick=()=>{
      const [si,ei]=el.dataset.remove.split('-').map(Number);
      this.removeExercise(si,ei);
    });
    this.updateSummary();
  }

  updateSummary(){
    const total=this.sections.reduce((sum,s)=>sum+Number(s.minutes||0),0);
    this.totalEl.textContent=total;

    const selected=this.sections.flatMap(s=>s.exercises).map(i=>this.exercises.find(x=>x.id===i.exerciseId)).filter(Boolean);
    const counts=selected.reduce((acc,x)=>(acc[x.category]=(acc[x.category]||0)+1,acc),{});
    const overused=Object.entries(counts).filter(([,n])=>n>=4).map(([k])=>k);

    if(overused.length){
      this.warningEl.textContent=`Pas på ensidig træning: mange øvelser i ${overused.join(', ')}.`;
      this.warningEl.classList.remove('hidden');
    }else{
      this.warningEl.classList.add('hidden');
    }
  }
}
