
const KEY='funkfit-workouts-v1';

export function loadSavedWorkouts(){
  try{return JSON.parse(localStorage.getItem(KEY)||'[]');}
  catch{return [];}
}

export function saveWorkout(workout){
  const all=loadSavedWorkouts();
  all.unshift(workout);
  localStorage.setItem(KEY,JSON.stringify(all.slice(0,50)));
}

export function deleteWorkout(id){
  localStorage.setItem(KEY,JSON.stringify(loadSavedWorkouts().filter(x=>x.id!==id)));
}
