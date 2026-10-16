export const services = ['Consulting','Training','AI technology','Data engineering','IT solutions','Automation','Not sure yet'];
export function validateEnquiry(body) {
 if(!body || typeof body !== 'object' || Array.isArray(body)) return null;
 const text=(key,max,min=0)=>typeof body[key]==='string' && body[key].trim().length>=min && body[key].trim().length<=max ? body[key].trim() : null;
 const name=text('name',120,2),email=text('email',254,3),company=body.company===undefined?'':text('company',160),message=text('message',4000,20);
 if(!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || company===null || !message || !services.includes(body.service) || body.consent!==true || body.website) return null;
 return {name,email,company,service:body.service,message,consent:true};
}
