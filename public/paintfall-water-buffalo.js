// Shared domestic swamp-water-buffalo silhouette for regional previews.
export function addWaterBuffaloFeatures(T,{root,head,coat,cream,dark,y}){
 const ball=(g,name,p,s,m)=>{const o=new T.Mesh(new T.SphereGeometry(1,14,10),m);o.name=name;o.position.set(...p);o.scale.set(...s);g.add(o);};
 for(const side of [-1,1]){
  const points=[[side*.22,.25,-.08],[side*.5,.32,-.14],[side*.85,.36,-.25],[side*1.02,.55,-.32]].map(p=>new T.Vector3(...p));
  const horn=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),20,.055,8,false),cream);horn.name='Water buffalo swept horn';head.add(horn);
  ball(head,'Broad buffalo ear',[side*.36,.1,-.08],[.22,.075,.12],coat);
 }
 ball(head,'Buffalo muzzle',[0,-.13,.26],[.26,.14,.22],coat);
 for(const side of [-1,1])ball(head,'Buffalo nostril',[side*.1,-.08,.46],[.04,.025,.018],dark);
 const tail=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([[0,y,-.8],[.06,y-.35,-1],[.15,.25,-1.08]].map(p=>new T.Vector3(...p))),16,.035,7,false),coat);tail.name='Buffalo tail';root.add(tail);
 ball(root,'Buffalo tail tuft',[.15,.25,-1.08],[.07,.12,.06],dark);
}
