export function addGroupTenAnimalDetails(T,{root,head,legs,wings,spec,coat,sphere,rod}){
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.95}),cream=mat(0xe8dfc6),dark=mat(0x3d454a),gold=mat(0xd0b978);
 const v=spec.variant;
 if(v==='polynesian-triller'){sphere(root,0,.4,.28,.16,.17,.09,cream);for(const side of [-1,1])sphere(head,side*.1,.07,.06,.02,.025,.12,cream);}
 if(v==='buff-banded-rail'){sphere(head,0,0,.035,.12,.16,.18,coat);for(let j=0;j<7;j++)sphere(root,0,.28+j*.05,.31,.16,.012,.035,cream);sphere(root,0,.49,.34,.17,.04,.035,gold);root.userData.bandedRail=true;}
 if(v==='bridled-tern'){sphere(root,0,.39,.28,.17,.18,.08,cream);for(const side of [-1,1])sphere(head,side*.1,.07,.08,.018,.02,.12,cream);}
 if(v==='long-tailed-cuckoo'){for(let j=0;j<5;j++){const feather=sphere(root,(j-2)*.025,.43,-1,.03,.035,.7,coat);feather.name='Cuckoo long tail feather';}for(let j=0;j<6;j++)sphere(root,0,.35+j*.045,.3,.14,.01,.035,cream);}
 if(v==='snake-eyed-skink'||v==='dark-sided-skink')for(const side of [-1,1])sphere(root,side*.14,.15,-.02,.025,.06,.31,v==='dark-sided-skink'?dark:cream);
 if(v==='wattled-honeyeater')for(const side of [-1,1])sphere(head,side*.12,-.03,.07,.045,.075,.035,gold);
 if(v==='futuna-shrikebill')sphere(head,0,-.035,.28,.06,.085,.15,dark).name='Shrikebill deep bill cue';
 if(v==='spotless-crake')legs.forEach(l=>l.children.forEach(o=>o.material=mat(0xb27566)));
 if(v==='wandering-tattler'||v==='tuamotu-sandpiper'){rod(head,new T.Vector3(0,-.02,.14),new T.Vector3(0,-.04,.38),.022,dark).name='Shorebird probing bill';for(const l of legs){l.position.y+=.13;l.children.forEach(o=>{o.scale.y*=1.5;o.position.y*=1.5;});}sphere(root,0,.4,.28,.16,.16,.08,cream);}
 if(v==='blue-lorikeet-polynesia'){sphere(head,0,-.07,.13,.12,.085,.1,cream);sphere(root,0,.42,.3,.16,.12,.07,cream);sphere(head,0,-.035,.23,.05,.06,.07,mat(0xc89b71));}
 if(v==='tahiti-petrel'){sphere(root,0,.35,.25,.17,.16,.15,cream);for(const w of wings)w.scale.x=1.4;}
 if(v==='tahiti-reed-warbler'){sphere(head,0,.075,.015,.125,.12,.16,gold);for(const side of [-1,1])sphere(head,side*.1,.06,.08,.02,.025,.12,dark);}
}
