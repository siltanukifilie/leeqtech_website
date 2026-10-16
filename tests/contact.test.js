import test from 'node:test';
import assert from 'node:assert/strict';
import {validateEnquiry} from '../supabase/functions/contact/validate.js';
const valid={name:'Example Person',email:'example@example.com',company:'Example',service:'Consulting',message:'We would like to discuss a technology roadmap.',consent:true};
test('accepts and trims a valid enquiry without forwarding extra fields',()=>assert.deepEqual(validateEnquiry({...valid,name:' Example Person ',admin:true}),valid));
test('rejects consent omission, spam honeypot, invalid service and invalid email',()=>{for(const patch of [{consent:false},{website:'spam.example'},{service:'admin'},{email:'invalid'}])assert.equal(validateEnquiry({...valid,...patch}),null);});
test('rejects long messages and malformed input',()=>{for(const value of [null,[],{},'text',{...valid,message:'x'.repeat(4001)},{...valid,name:5},{...valid,message:'short'}])assert.equal(validateEnquiry(value),null);});
