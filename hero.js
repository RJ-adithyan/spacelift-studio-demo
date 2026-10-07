(() => {
'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const save=()=>Boolean(navigator.connection?.saveData);
const staticMode=()=>reduced.matches||save();
const root=document.documentElement;
const controllers=[];
let stopped=false;
function syncMode(){root.classList.toggle('static-experience',staticMode());
 if(staticMode()){
  document.querySelectorAll('.reel-slide').forEach(e=>{e.removeAttribute('inert');e.style.removeProperty('--grow');});
  document.querySelectorAll('.composition-collage img,.about-tiles img,.approach-panels').forEach(e=>e.style.removeProperty('transform'));
  document.querySelectorAll('.about-tiles img').forEach(e=>e.style.opacity='1');
 }else updateScroll();
}
reduced.addEventListener('change',syncMode);navigator.connection?.addEventListener?.('change',syncMode);
const hero=document.querySelector('.s-hero');
if(hero){
 const light=hero.querySelector('.light-study');
 const photo=hero.querySelector('.hero-photo'),copy=hero.querySelector('.hero-copy'),entry=document.querySelector('.entry-loader');
 const limit=(v)=>Math.max(0,Math.min(1,v));
 function finishEntrance(){root.classList.remove('entering');photo.style.cssText='';copy.style.opacity='1';}
 const control=DemoKitMotion.mount(hero,{durationMs:24000,draw(t,info){
  light.style.setProperty('--light',(Math.sin(t/24000*Math.PI*2)*55).toFixed(2)+'px');light.style.opacity=(.08+Math.sin(t/24000*Math.PI*2)*.03).toFixed(3);
  if(info.elapsed<4000&&!staticMode()){
   root.classList.add('entering');
   const framed=limit((info.elapsed-1900)/800),full=limit((info.elapsed-2700)/1300);
   const width=4+framed*38+full*58,height=6+framed*38+full*56;
   photo.style.cssText='inset:auto;left:50%;top:50%;transform:translate(-50%,-50%);width:'+width+'vw;height:'+height+'vh;';
   copy.style.opacity=String(limit((info.elapsed-3100)/900));
   if(entry){entry.style.background=info.elapsed<1900?'repeating-linear-gradient(90deg,#f4f1e9 0,#f4f1e9 60px,#eeebe3 60px,#eeebe3 100px)':'transparent';
    entry.querySelectorAll('p,small,.entry-brand,.entry-strip').forEach(e=>e.style.opacity=String(1-limit((info.elapsed-1400)/600)));
    entry.querySelectorAll('.entry-strip img').forEach((e,i)=>e.style.transform='translateY('+((i%2?20:-20)*limit(info.elapsed/1000))+'px) translateX('+((7-i)*limit((info.elapsed-1000)/800)*25)+'px)');
   }
  }else finishEntrance();
 },staticFrame(){light.style.setProperty('--light','0px');light.style.opacity='.08';finishEntrance();}});
 controllers.push(control);
}
const approach=document.querySelector('.approach-intro[data-dk-motion]');
if(approach){const wire=approach.querySelector('.wire-room');controllers.push(DemoKitMotion.mount(approach,{durationMs:22000,draw(t){const wave=Math.sin(t/22000*Math.PI*2);wire.style.transform='rotateY('+(wave*8).toFixed(3)+'deg)';wire.style.opacity=(.4+wave*.1).toFixed(3);},staticFrame(){wire.style.transform='none';wire.style.opacity='.4';}}));}
document.querySelectorAll('[data-dk-motion-toggle]').forEach(button=>button.addEventListener('click',()=>{stopped=button.getAttribute('aria-pressed')==='true';controllers.forEach(c=>stopped?c.pause():c.play());}));
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const progress=e=>clamp(-e.getBoundingClientRect().top/(e.offsetHeight-innerHeight));
let manualProject=null;
function selectProject(index){document.querySelectorAll('.reel-slide').forEach((e,i)=>{e.classList.toggle('active',i===index);if(i!==index)e.setAttribute('inert','');else e.removeAttribute('inert');});}
document.querySelector('[data-reel-prev]')?.addEventListener('click',()=>{const i=[...document.querySelectorAll('.reel-slide')].findIndex(e=>e.classList.contains('active'));manualProject=(i+1)%2;selectProject(manualProject);});
document.querySelector('[data-reel-next]')?.addEventListener('click',()=>{const i=[...document.querySelectorAll('.reel-slide')].findIndex(e=>e.classList.contains('active'));manualProject=(i+1)%2;selectProject(manualProject);});
function updateScroll(){
 if(staticMode()||stopped)return;
 const composition=document.querySelector('.composition');if(composition){const p=progress(composition);composition.querySelectorAll('.composition-collage img').forEach((e,i)=>e.style.transform='translateY('+(-p*(180+i*55)).toFixed(1)+'px)');}
 const reel=document.querySelector('.project-reel');if(reel){const p=progress(reel),i=Math.min(1,Math.floor(p*2));selectProject(manualProject??i);const grow=clamp(((p*2)%1-.1)/.35);reel.querySelectorAll('.reel-slide').forEach(e=>e.style.setProperty('--grow',String(manualProject===null?grow:0)));}
 const run=document.querySelector('.approach-run');if(run){const p=progress(run);const x=65-clamp(p/.95)* (innerWidth<768?245:115);run.querySelector('.approach-panels').style.transform='translateX('+x+'vw)';}
 const about=document.querySelector('.about-run');if(about){const p=progress(about),index=Math.min(3,Math.floor(p*4));about.querySelectorAll('.about-tiles a').forEach((e,i)=>{e.classList.toggle('is-active',i===index);e.querySelector('img').style.opacity=i===index?'1':'0';});}
}
let queued=false;addEventListener('scroll',()=>{manualProject=null;if(!queued){queued=true;requestAnimationFrame(()=>{updateScroll();queued=false;});}},{passive:true});addEventListener('resize',updateScroll);
syncMode();
})();
