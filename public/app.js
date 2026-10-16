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
} else {status.textContent='Enquiries are not available yet. The contact service is being connected.';}
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
