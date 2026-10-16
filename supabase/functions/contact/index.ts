import { validateEnquiry } from './validate.js';
// Public contact endpoint: only validated, CAPTCHA-verified enquiries can be inserted.
// Database credentials remain in the Edge Function environment.
Deno.serve(async (req: Request) => {
 const allowedOrigin=Deno.env.get('ALLOWED_ORIGIN');
 const origin=req.headers.get('origin');
 if(!allowedOrigin || origin!==allowedOrigin) return new Response('Forbidden',{status:403});
 const headers={'Access-Control-Allow-Origin':allowedOrigin,'Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin','Content-Type':'application/json'};
 const reply=(status:number,message:string)=>new Response(JSON.stringify({message}),{status,headers});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return reply(405,'Method not allowed');
 if(!req.headers.get('content-type')?.includes('application/json'))return reply(415,'JSON required');
 const secret=Deno.env.get('TURNSTILE_SECRET_KEY');
 const url=Deno.env.get('SUPABASE_URL');
 const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 if(!secret || !url || !key)return reply(503,'Contact service unavailable');
 try {
  // Bound streamed request bodies even if Content-Length is absent or dishonest.
  const reader=req.body?.getReader();
  if(!reader)return reply(400,'Request body required');
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>20000){await reader.cancel();return reply(413,'Request too large');}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  let body;try{body=JSON.parse(new TextDecoder().decode(bytes));}catch{return reply(400,'Invalid JSON');}
  const enquiry=validateEnquiry(body);
  if(!enquiry || typeof body.token!=='string' || body.token.length>2048)return reply(400,'Invalid enquiry');
  const verification=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret,response:body.token}),signal:AbortSignal.timeout(10000)});
  if(!verification.ok)return reply(503,'Verification unavailable');
  const verified=await verification.json();
  if(!verified.success || verified.hostname!==new URL(allowedOrigin).hostname)return reply(400,'Verification failed');
  const result=await fetch(`${url}/rest/v1/leeqtech_enquiries`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(enquiry),signal:AbortSignal.timeout(10000)});
  if(!result.ok)return reply(503,'Unable to store enquiry');
  return reply(201,'Received');
 }catch{return reply(503,'Unable to process enquiry');}
});
