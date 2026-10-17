const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open); });
navigation.addEventListener('click', e => { if(e.target.closest('a')) {menu.setAttribute('aria-expanded','false');navigation.classList.remove('open');} });
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');navigation.classList.remove('open');}});
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { document.querySelector('select[name="service"]').value = link.dataset.service; }));
const form = document.querySelector('#enquiry-form');
const status = document.querySelector('#form-status');
const config = window.LEEQ_CONFIG || {};
let widget;
if(config.contactEndpoint && config.turnstileSiteKey) {
 window.onTurnstileReady = () => {widget=window.turnstile.render('#captcha',{sitekey:config.turnstileSiteKey,theme:'dark'});};
 const script=document.createElement('script'); script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileReady&render=explicit'; script.async=true;script.onerror=()=>{status.textContent='Verification could not load. Please check your connection and reload.';};document.head.append(script);
} else {status.textContent='Enquiries will open soon.';}
form.addEventListener('submit',async e=>{
 e.preventDefault();
 if(!config.contactEndpoint || !config.turnstileSiteKey){status.textContent='Your enquiry has not been sent. The contact service is not connected yet.';return;}
 const data=Object.fromEntries(new FormData(form));
 const token=window.turnstile?.getResponse(widget);
 if(!token){status.textContent='Please complete the verification before sending.';return;}
 const button=form.querySelector('button[type="submit"]');button.disabled=true;status.textContent='Sending your enquiry…';
 try {
  const response=await fetch(config.contactEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,consent:data.consent==='on',token}),signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error('Unable to send');
  form.reset();status.textContent='Thank you. Your enquiry has been received by LeeqTech.';
 } catch {status.textContent='We could not confirm delivery. Please try again later. Your message is still here.';}
 finally{button.disabled=false;window.turnstile?.reset(widget);}
});

// Small, user-controlled visual demonstrations; no fabricated live metrics.
const pathways={
 automation:['A new request','Capture information once.','A smarter workflow','Route, organise and connect.','Your team, in sync','Less repetition. More focus.','From disconnected tasks to a connected way of working.'],
 data:['Your data sources','Bring scattered data together.','A dependable pipeline','Clean, transform and organise.','A clearer picture','Insights ready for decisions.','Turn separate sources into a useful, shared view.'],
 ai:['Your team’s knowledge','Start with trusted information.','An intelligent assistant','Find, summarise and explain.','Answers in context','Help people move forward.','Connect people to the knowledge they need, when they need it.']
};
const fields=['pipe-input','pipe-input-copy','pipe-engine','pipe-engine-copy','pipe-output','pipe-output-copy','demo-caption'];
document.querySelectorAll('[data-pathway]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-pathway]').forEach(b=>{const active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
 fields.forEach((id,i)=>document.getElementById(id).textContent=pathways[button.dataset.pathway][i]);
}));
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton=document.querySelector('.motion-toggle');
function setMotion(paused){document.body.classList.toggle('motion-paused',paused);motionButton.setAttribute('aria-pressed',String(paused));motionButton.setAttribute('aria-label',paused?'Resume animations':'Pause animations');motionButton.innerHTML=paused?'▶ <span>Resume motion</span>':'Ⅱ <span>Pause motion</span>';document.querySelectorAll('.scene-lines').forEach(svg=>paused?svg.pauseAnimations():svg.unpauseAnimations());}
motionButton.addEventListener('click',()=>setMotion(!document.body.classList.contains('motion-paused')));
setMotion(reducedMotion.matches);
reducedMotion.addEventListener('change',e=>setMotion(e.matches));
if(!reducedMotion.matches && 'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:0.08});
 document.querySelectorAll('.service,.demo-shell,.training,.about-grid').forEach(el=>{el.classList.add('reveal-ready');observer.observe(el);});
}

// Readers choose the photo story; there is no automatic carousel.
const stories={
 people:{image:'ethiopian-collaboration.png',alt:'AI-generated Ethiopian technology professionals collaborating on a laptop',kicker:'01 / CONNECT PEOPLE',title:'Great ideas start with people.'},
 build:{image:'ethiopian-engineers.png',alt:'AI-generated Ethiopian software engineers reviewing code together',kicker:'02 / BUILD WHAT MATTERS',title:'Turn possibility into progress.'},
 learn:{image:'ethiopian-workshop.png',alt:'AI-generated Ethiopian technology expert leading a practical workshop',kicker:'03 / GROW TOGETHER',title:'Skills for your next chapter.'}
};
document.querySelectorAll('[data-story]').forEach(button=>button.addEventListener('click',()=>{
 const story=stories[button.dataset.story];
 const photo=document.querySelector('#feature-photo');
 photo.src=`assets/photos/${story.image}`;photo.alt=story.alt;
 photo.style.objectPosition=button.dataset.story==='learn'?'center 35%':'center';
 document.querySelector('#photo-kicker').textContent=story.kicker;
 document.querySelector('#photo-title').textContent=story.title;
 document.querySelectorAll('[data-story]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));
