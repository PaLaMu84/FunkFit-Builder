
const FORMATS=['Fælles flow','Teknik','Stationstræning','Cirkeltræning','AMRAP','EMOM','E2MOM','For time','Chipper','Tabata','HIIT-intervaller','You go, I go','Makkertræning','Team workout','Stafet','Hyrox station'];
const STYLES=['Funktionel','CrossFit-inspireret','HIIT / Hyrox-inspireret','Teknik','Leg','Mobilitet','Kondition'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const pair=s=>s.split('-').map(Number);

export class WorkoutBuilder{
  constructor({container,totalEl,getExercises,getFamilyMode,onCreateExercise}){
    Object.assign(this,{container,totalEl,getExercises,getFamilyMode,onCreateExercise});
    this.sections=[];
    this.openPickerIndex=null;
    this.pickerSearch='';
    this.pickerStyle='';
  }
  loadTemplate(t){this.sections=structuredClone(t.sections);this.openPickerIndex=null;this.render()}
  loadData(x){this.sections=structuredClone(x);this.openPickerIndex=null;this.render()}
  getData(){return structuredClone(this.sections)}
  addSection(){this.sections.push({name:'Ny sektion',minutes:10,format:'Stationstræning',style:'Funktionel',work:40,rest:20,rounds:3,exercises:[]});this.render()}
  addExercise(si,id){
    this.sections[si].exercises.push({exerciseId:id,juniorKg:'',juniorReps:'',juniorNote:'',adultExerciseId:id,adultKg:'',adultReps:'',adultNote:''});
    this.openPickerIndex=null;
    this.render();
  }
  clear(){this.sections.forEach(s=>s.exercises=[]);this.render()}
  togglePicker(si){
    this.openPickerIndex=this.openPickerIndex===si?null:si;
    this.pickerSearch='';
    this.pickerStyle=this.sections[si]?.style||'';
    this.render();
  }
  filteredExercises(){
    const q=this.pickerSearch.toLowerCase().trim();
    const style=this.pickerStyle;
    return this.getExercises().filter(x=>{
      const hay=[x.name,x.category,x.description,...(x.bodyAreas||[]),...(x.styles||[]),...(x.equipment||[])].join(' ').toLowerCase();
      const styleMatch=!style || style==='Funktionel'
        ? (!style || (x.styles||[]).includes('Funktionel') || (x.styles||[]).includes('CrossFit-inspireret'))
        : style==='HIIT / Hyrox-inspireret'
          ? (x.styles||[]).some(s=>s==='HIIT'||s==='Hyrox-inspireret')
          : (x.styles||[]).includes(style);
      return (!q||hay.includes(q)) && styleMatch;
    });
  }
  pickerHtml(si){
    if(this.openPickerIndex!==si) return '';
    const list=this.filteredExercises();
    return `<div class="inline-picker">
      <div class="inline-picker-head">
        <input id="sectionPickerSearch" type="search" placeholder="Søg efter øvelse" value="${esc(this.pickerSearch)}">
        <select id="sectionPickerStyle">
          <option value="">Alle spor</option>
          <option ${this.pickerStyle==='Funktionel'?'selected':''}>Funktionel</option>
          <option ${this.pickerStyle==='CrossFit-inspireret'?'selected':''}>CrossFit-inspireret</option>
          <option ${this.pickerStyle==='HIIT / Hyrox-inspireret'?'selected':''}>HIIT / Hyrox-inspireret</option>
        </select>
        <button class="secondary" data-create-exercise="${si}">+ Opret øvelse</button>
      </div>
      <div class="inline-picker-list">
        ${list.length?list.map(x=>`<button class="picker-choice" data-pick-inline="${si}|${x.id}">
          <span><strong>${esc(x.name)}</strong><small>${esc((x.bodyAreas||[]).join(' · '))}</small></span><b>+</b>
        </button>`).join(''):'<div class="empty">Ingen øvelser matcher søgningen.</div>'}
      </div>
    </div>`;
  }
  render(){
    const fam=this.getFamilyMode(),xs=this.getExercises();
    this.container.innerHTML=this.sections.map((s,si)=>`
      <section class="workout-section">
        <div class="section-header">
          <div class="section-top">
            <input data-name="${si}" value="${esc(s.name)}">
            <input data-min="${si}" type="number" min="0" value="${s.minutes}">
            <div class="section-actions">
              <button data-toggle-picker="${si}">${this.openPickerIndex===si?'Luk øvelser':'﻿+ Tilføj øvelse'}</button>
              <button class="ghost" data-del-sec="${si}">Slet sektion</button>
            </div>
          </div>
          <div class="section-settings">
            <label>Format<select data-format="${si}">${FORMATS.map(x=>`<option ${x===s.format?'selected':''}>${x}</option>`).join('')}</select></label>
            <label>Træningsspor<select data-style="${si}">${STYLES.map(x=>`<option ${x===s.style?'selected':''}>${x}</option>`).join('')}</select></label>
            <label>Arbejde (sek.)<input data-work="${si}" type="number" min="0" value="${s.work||0}"></label>
            <label>Pause (sek.)<input data-rest="${si}" type="number" min="0" value="${s.rest||0}"></label>
            <label>Runder<input data-rounds="${si}" type="number" min="1" value="${s.rounds||1}"></label>
          </div>
          ${this.pickerHtml(si)}
        </div>
        <div class="section-body">
          ${s.exercises.length?s.exercises.map((it,ei)=>{
            const ex=xs.find(x=>x.id===it.exerciseId);
            return `<article class="exercise-row">
              <div class="exercise-main">
                <div class="exercise-name"><strong>${esc(ex?.name||'Ukendt')}</strong><small>${esc((ex?.bodyAreas||[]).join(' · '))}</small></div>
                <label>Junior kg<input data-jkg="${si}-${ei}" value="${esc(it.juniorKg)}"></label>
                <label>Junior reps/tid<input data-jreps="${si}-${ei}" value="${esc(it.juniorReps)}"></label>
                <label>Junior note<input data-jnote="${si}-${ei}" value="${esc(it.juniorNote)}"></label>
                <button class="ghost" data-del-ex="${si}-${ei}">Fjern</button>
              </div>
              ${fam?`<div class="adult-settings"><span class="family-chip">VOKSEN</span><div class="adult-grid">
                <label>Voksenøvelse<select data-aex="${si}-${ei}">${xs.map(x=>`<option value="${x.id}" ${(it.adultExerciseId||it.exerciseId)===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label>
                <label>Voksen kg<input data-akg="${si}-${ei}" value="${esc(it.adultKg)}"></label>
                <label>Voksen reps/tid<input data-areps="${si}-${ei}" value="${esc(it.adultReps)}"></label>
                <label>Voksen note<input data-anote="${si}-${ei}" value="${esc(it.adultNote)}"></label>
              </div></div>`:''}
            </article>`}).join(''):'<div class="empty">Ingen øvelser endnu. Tryk “+ Tilføj øvelse” ovenfor.</div>'}
        </div>
      </section>`).join('');
    this.bind();
    this.totalEl.textContent=this.sections.reduce((n,s)=>n+(+s.minutes||0),0);
  }
  bind(){
    this.container.querySelectorAll('[data-toggle-picker]').forEach(b=>b.onclick=()=>this.togglePicker(+b.dataset.togglePicker));
    this.container.querySelectorAll('[data-create-exercise]').forEach(b=>b.onclick=()=>this.onCreateExercise(+b.dataset.createExercise));
    this.container.querySelectorAll('[data-pick-inline]').forEach(b=>b.onclick=()=>{
      const [si,id]=b.dataset.pickInline.split('|');this.addExercise(+si,id);
    });
    const search=this.container.querySelector('#sectionPickerSearch');
    if(search) search.oninput=()=>{this.pickerSearch=search.value;this.render()};
    const style=this.container.querySelector('#sectionPickerStyle');
    if(style) style.onchange=()=>{this.pickerStyle=style.value;this.render()};

    this.container.querySelectorAll('[data-del-sec]').forEach(b=>b.onclick=()=>{if(this.sections.length>1){this.sections.splice(+b.dataset.delSec,1);this.render()}});
    for(const [sel,key,prop,ev] of [
      ['[data-name]','name','name','input'],['[data-min]','min','minutes','input'],
      ['[data-format]','format','format','change'],['[data-style]','style','style','change'],
      ['[data-work]','work','work','input'],['[data-rest]','rest','rest','input'],['[data-rounds]','rounds','rounds','input']
    ]) this.container.querySelectorAll(sel).forEach(e=>e['on'+ev]=()=>{
      this.sections[+e.dataset[key]][prop]=['minutes','work','rest','rounds'].includes(prop)?(+e.value||0):e.value;
      if(prop==='minutes') this.totalEl.textContent=this.sections.reduce((n,s)=>n+(+s.minutes||0),0);
    });
    this.container.querySelectorAll('[data-del-ex]').forEach(b=>b.onclick=()=>{const[a,c]=pair(b.dataset.delEx);this.sections[a].exercises.splice(c,1);this.render()});
    for(const [sel,key,prop,ev] of [
      ['[data-jkg]','jkg','juniorKg','input'],['[data-jreps]','jreps','juniorReps','input'],['[data-jnote]','jnote','juniorNote','input'],
      ['[data-aex]','aex','adultExerciseId','change'],['[data-akg]','akg','adultKg','input'],['[data-areps]','areps','adultReps','input'],['[data-anote]','anote','adultNote','input']
    ]) this.container.querySelectorAll(sel).forEach(e=>e['on'+ev]=()=>{const[a,b]=pair(e.dataset[key]);this.sections[a].exercises[b][prop]=e.value});
  }
}
