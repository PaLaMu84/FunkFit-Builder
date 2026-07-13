
const KEY='funkfit-workouts-v2';
const CUSTOM='funkfit-custom-exercises-v1';
const MUSIC='funkfit-music-v1';
const read=(key,fallback=[])=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}};
export const loadSavedWorkouts=()=>read(KEY,[]);
export function saveWorkout(workout){const all=loadSavedWorkouts().filter(x=>x.id!==workout.id);all.unshift(workout);localStorage.setItem(KEY,JSON.stringify(all.slice(0,100)));}
export const deleteWorkout=id=>localStorage.setItem(KEY,JSON.stringify(loadSavedWorkouts().filter(x=>x.id!==id)));
export const loadCustomExercises=()=>read(CUSTOM,[]);
export function saveCustomExercise(ex){const all=loadCustomExercises();all.unshift(ex);localStorage.setItem(CUSTOM,JSON.stringify(all));}
export const loadMusicPlan=()=>read(MUSIC,{});
export const saveMusicPlan=plan=>localStorage.setItem(MUSIC,JSON.stringify(plan));
