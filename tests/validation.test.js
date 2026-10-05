import test from 'node:test';
import assert from 'node:assert/strict';
import { validateForm } from '../shared/validation.js';

test('demo application requires only a name and email',()=>{
 assert.deepEqual(validateForm('adoption',{name:"Zoë O'Neill",email:'zoe+adopt@example.co.za'}),{});
});
test('blank names and invalid emails produce field errors',()=>{
 const errors=validateForm('adoption',{name:'   ',email:{},phone:'555abc12345',address:'a'});
 assert.equal(Object.keys(errors).length,2);
});
test('signup requires eight characters, login accepts existing nonempty passwords',()=>{
 assert.ok(validateForm('signup',{email:'a@example.com',password:'1234567'}).password);
 assert.deepEqual(validateForm('login',{email:'a@example.com',password:'1234567'}),{});
});
test('contact messages enforce minimum and maximum length',()=>{
 assert.ok(validateForm('contact',{name:'User',email:'user@example.com',message:'x'.repeat(4001)}).message);
 assert.deepEqual(validateForm('contact',{name:'User',email:'user@example.com',message:'Please contact me.'}),{});
});
