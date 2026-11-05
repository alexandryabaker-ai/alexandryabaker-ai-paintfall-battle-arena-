export function addGroupNineAnimalDetails(T,{root,head,spec,coat,sphere,rod}){
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.95}),cream=mat(0xe8dfc6),dark=mat(0x3f454a),yellow=mat(0xd3ba78);
 if(spec.variant==='micronesian-myzomela'){sphere(head,0,-.04,.27,.035,.035,.13,dark);sphere(root,0,.37,.27,.16,.13,.09,cream);}
 if(spec.variant==='rimatara-lorikeet'){sphere(head,0,.11,.02,.12,.08,.13,dark);sphere(root,0,.43,.29,.17,.2,.09,mat(0xc36b5e));sphere(head,0,-.025,.23,.06,.075,.07,mat(0xc2996d));}
 if(spec.variant==='golden-white-eye')for(const side of [-1,1]){const ring=new T.Mesh(new T.TorusGeometry(.037,.009,6,12),cream);ring.position.set(side*.09,.04,.15);ring.name='Golden white-eye eye ring';head.add(ring);}
 if(spec.variant==='tinian-monarch')sphere(root,0,.4,.29,.16,.16,.08,cream);
 if(spec.variant==='mariana-fruit-dove'){sphere(head,0,.1,.02,.12,.08,.13,mat(0xb97f93));sphere(root,0,.37,.28,.16,.14,.1,yellow);}
 if(spec.variant==='samoan-starling')for(const side of [-1,1]){sphere(head,side*.09,.04,.15,.032,.035,.025,yellow);sphere(head,side*.09,.04,.173,.018,.025,.012,dark);}
 if(spec.variant==='black-naped-tern')sphere(head,0,.035,-.07,.115,.04,.12,dark);
 if(spec.variant==='white-tailed-tropicbird'){for(const side of [-1,1]){rod(root,new T.Vector3(side*.025,.44,-.4),new T.Vector3(side*.08,.38,-1.55),.012,cream).name='White tropicbird tail streamer';sphere(head,side*.11,.04,.04,.018,.022,.1,dark);}}
 if(spec.variant==='chattering-kingfisher'){sphere(head,0,.075,.02,.125,.12,.16,mat(0x718d9f));sphere(root,0,.4,.29,.16,.18,.08,cream);rod(head,new T.Vector3(0,-.02,.17),new T.Vector3(0,-.04,.42),.035,dark);}
 if(spec.variant==='cook-reed-warbler')sphere(root,0,.4,.29,.16,.16,.08,cream);
 if(spec.variant==='rarotonga-starling')for(let j=0;j<7;j++)sphere(root,(j%3-1)*.08,.65,-.25+j*.07,.02,.012,.04,cream);
 if(spec.variant==='kakerori'){sphere(head,0,.075,.01,.125,.12,.15,mat(0xc2c1b7));sphere(root,0,.4,.28,.15,.16,.08,cream);}
 if(spec.variant==='slevin-skink'){sphere(root,0,.07,.05,.145,.04,.29,yellow);for(let j=0;j<8;j++)sphere(root,(j%2?1:-1)*.07,.25,-.25+j*.07,.025,.015,.035,dark);}
 if(spec.variant==='moth-skink'){const diamond=new T.Mesh(new T.OctahedronGeometry(.065,0),yellow);diamond.position.set(0,.255,.2);diamond.scale.set(.65,.15,1);diamond.name='Moth skink neck diamond';root.add(diamond);sphere(root,0,.26,-.04,.018,.012,.23,yellow).name='Moth skink dorsal stripe';}
}
