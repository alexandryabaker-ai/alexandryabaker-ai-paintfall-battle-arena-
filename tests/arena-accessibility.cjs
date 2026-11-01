const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../public/paintfall-arena-accessibility.js'),'utf8').replace('export function','function');
function harness(){
 const listeners=new Map(),storage=new Map();
 class Element{
  constructor(){this.children=[];this.attrs={};this.listeners=new Map();this.hidden=false;this.style={};this.textContent='';}
  append(...xs){this.children.push(...xs);}
  setAttribute(k,v){this.attrs[k]=v;}
  addEventListener(k,f){this.listeners.set(k,f);}
  remove(){this.removed=true;}
  click(){this.listeners.get('click')?.();}
 }
 const host=new Element();
 const window={addEventListener(k,f){listeners.set(k,f);},removeEventListener(k){listeners.delete(k);}};
 const context={document:{createElement:()=>new Element(),addEventListener(){},removeEventListener(){}},window,localStorage:{getItem:k=>storage.has(k)?storage.get(k):null,setItem:(k,v)=>storage.set(k,v)},performance:{now:()=>1000},setTimeout:()=>42,clearTimeout(){},globalThis:{},AudioContext:null};
 const {createArenaAccessibility}=vm.runInNewContext(src+';({createArenaAccessibility})',context);
 return {host,listeners,storage,createArenaAccessibility};
}
test('captions are off initially and render at bottom only when opted in',()=>{
 const h=harness(),ui=h.createArenaAccessibility({host:h.host});
 const [controls,caption]=h.host.children;
 assert.equal(caption.hidden,true);
 assert.ok(caption.style.cssText.includes('bottom:12px'));
 h.listeners.get('paintfall-arena-dialogue')({detail:{speaker:'Bull',text:'Hello'}});
 assert.equal(caption.hidden,true);
 controls.children[0].click();
 h.listeners.get('paintfall-arena-dialogue')({detail:{speaker:'Bull',text:'Hello'}});
 assert.equal(caption.hidden,false);
 assert.equal(caption.textContent,'Bull: Hello');
 controls.children[0].click();
 assert.equal(caption.hidden,true);
 ui.dispose();
});
test('sound and caption toggles are independent and persist',()=>{
 const h=harness();h.createArenaAccessibility({host:h.host});
 const controls=h.host.children[0];
 controls.children[1].click();
 assert.equal(h.storage.get('paintfall-arena-sound'),'false');
 assert.equal(h.storage.get('paintfall-arena-captions'),undefined);
 controls.children[0].click();
 assert.equal(h.storage.get('paintfall-arena-captions'),'true');
});
