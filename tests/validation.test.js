import test from 'node:test';
import assert from 'node:assert/strict';
import { validateForm } from '../shared/validation.js';

test('shared frontend/backend validation accepts real-world names and phone formatting',()=>{
 assert.deepEqual(validateForm('adoption',{name:"Zoë O'Neill",email:'zoe+adopt@example.co.za',phone:'+27 (82) 123-4567',address:'12 Main Street'}),{});
});
test('blank strings, objects, invalid email and short addresses produce field errors',()=>{
 const errors=validateForm('adoption',{name:'   ',email:{},phone:'555abc12345',address:'a'});
 assert.equal(Object.keys(errors).length,4);
});
test('signup requires eight characters, login accepts existing nonempty passwords',()=>{
 assert.ok(validateForm('signup',{email:'a@example.com',password:'1234567'}).password);
 assert.deepEqual(validateForm('login',{email:'a@example.com',password:'1234567'}),{});
});
test('contact messages enforce minimum and maximum length',()=>{
 assert.ok(validateForm('contact',{name:'User',email:'user@example.com',message:'x'.repeat(4001)}).message);
 assert.deepEqual(validateForm('contact',{name:'User',email:'user@example.com',message:'Please contact me.'}),{});
});
