(()=>{
const T={
 Maya:{walk:'confident-strut',peak:'fierce-strut',tell:'confidence'},
 Zara:{walk:'curious-tactical',peak:'secret-agent',tell:'curiosity'},
 Nova:{walk:'skip-gallop',peak:'energized-run',tell:'optimism'},
 Skye:{walk:'dance-walk',peak:'street-dance',tell:'calm-observer'},
 Jax:{walk:'leader-bounce',peak:'commanding-bounce',tell:'presence'},
 Rico:{walk:'slow-tactical',peak:'coordination-focus',tell:'overthinking'},
 Kai:{walk:'normal',peak:'chaos-flourish',tell:'creativity'},
 Dante:{walk:'stealth-walk',peak:'surface-grip-counter',tell:'patience'}
};
function apply(character,brain){
 if(!character)return;
 const d=T[character.name]||T.Maya;
 character.userData=character.userData||{};
 character.userData.heroTell=d.tell;
 character.userData.visibleWalk=brain?.overdrive?d.peak:d.walk;
 character.userData.tellIntensity=Math.max(0,Math.min(1,Number(brain?.intensity)||0));
}
window.PAINTFALL_HERO_VISIBLE_TELLS={profiles:T,apply};
window.addEventListener('paintfall-character-selected',e=>{window.PAINTFALL_ACTIVE_HERO=e.detail;apply(e.detail,window.PAINTFALL_HERO_BRAIN?.[e.detail.name]);});
})();