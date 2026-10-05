import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createStore } from '../server/store.js';
import { createApp } from '../server/app.js';

const valid = { name:'Jane Tester',email:'jane@example.com',phone:'+27 82 123 4567',address:'12 Example Road',dogId:'buddy' };

test('API contracts, validation, persistence and sessions', async t=>{
  const dir = mkdtempSync(join(tmpdir(),'dogadopt-test-'));
  const filename = join(dir,'store.sqlite');
  const db = createStore(filename);
  mkdirSync(join(dir,'dist'));
  writeFileSync(join(dir,'dist','index.html'),'<div id="root">React entry</div>');
  const server = createApp(db,{rateLimits:false,origins:['http://localhost:5173'],distDir:join(dir,'dist')}).listen(0,'127.0.0.1');
  await once(server,'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const send = (path,body,options={})=>fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',...options.headers},body:JSON.stringify(body)});
  let cookie;
  try {
    await t.test('original data, page groups, search and breed filter',async()=>{
      const all = await (await fetch(base+'/api/dogs')).json();
      assert.equal(all.dogs.length,30);
      const featured = await (await fetch(base+'/api/dogs?group=featured')).json();
      assert.deepEqual(featured.dogs.map(d=>d.name),['Penny',"bo'oh o' wah'ah",'Maximus','Inca']);
      const catalog = await (await fetch(base+'/api/dogs?group=catalog')).json();
      assert.deepEqual(catalog.dogs.map(d=>d.name),['Buddy','Luna','Max']);
      assert.equal((await (await fetch(base+'/api/dogs?group=catalog&q=luna&breed=Beagle')).json()).dogs[0].id,'luna');
      assert.deepEqual((await (await fetch(base+'/api/dogs?q=does-not-exist')).json()).dogs,[]);
      assert.equal((await (await fetch(base+'/api/dogs/buddy')).json()).dog.name,'Buddy');
      assert.equal((await fetch(base+'/api/dogs/missing')).status,404);
    });
    await t.test('application field errors reject malformed data without saving',async()=>{
      const response = await send('/api/applications',{name:' ',email:'bad',phone:'abc',address:'x'});
      assert.equal(response.status,400);
      assert.deepEqual(Object.keys((await response.json()).errors).sort(),['email','name']);
      for(const body of [null,[],{...valid,name:[]},{...valid,name:'x'.repeat(101)},{...valid,dogId:12}]) assert.equal((await send('/api/applications',body)).status,400);
      assert.equal(db.prepare('SELECT COUNT(*) AS n FROM applications').get().n,0);
    });
    await t.test('unknown dog is rejected instead of silently losing selection',async()=>{
      const response = await send('/api/applications',{...valid,dogId:'missing'});
      assert.equal(response.status,400);assert.ok((await response.json()).errors.dogId);
    });
    await t.test('applications persist with selected dog and optional general interest',async()=>{
      const response = await send('/api/applications',valid);
      assert.equal(response.status,201);
      const body = await response.json();assert.ok(body.id);assert.equal(body.email,undefined);
      const row = db.prepare('SELECT * FROM applications WHERE id = ?').get(body.id);
      assert.equal(row.dog_id,'buddy');assert.equal(row.address,'');assert.equal(row.phone,'');
      assert.match(body.message,/No shelter was contacted/);
      assert.equal((await send('/api/applications',{name:valid.name,email:valid.email,dogId:null})).status,201);
    });
    await t.test('concurrent writes remain distinct and private records are not public',async()=>{
      const responses = await Promise.all(Array.from({length:5},()=>send('/api/applications',valid)));
      assert.ok(responses.every(r=>r.status===201));
      assert.equal(db.prepare('SELECT COUNT(*) AS n FROM applications').get().n,7);
      assert.equal((await fetch(base+'/api/applications')).status,404);
    });
    await t.test('contact form validates and persists',async()=>{
      assert.equal((await send('/api/contact',{name:'J',email:'bad',message:''})).status,400);
      assert.equal((await send('/api/contact',{name:'Jane',email:'Jane@Example.com',message:'I would like to volunteer.'})).status,201);
      assert.equal(db.prepare('SELECT email FROM messages').get().email,'jane@example.com');
    });
    await t.test('signup hashes passwords and creates an HttpOnly session',async()=>{
      assert.equal((await send('/api/auth/signup',{email:'a@example.com',password:'short'})).status,400);
      const response = await send('/api/auth/signup',{email:'Jane@Example.com',password:'correct-horse-example'});
      assert.equal(response.status,201);
      const setCookie = response.headers.get('set-cookie');assert.match(setCookie,/HttpOnly/);assert.match(setCookie,/SameSite=Strict/);
      cookie = setCookie.split(';')[0];
      const payload = await response.json();assert.equal(payload.user.email,'jane@example.com');assert.equal(payload.user.password_hash,undefined);
      assert.notEqual(db.prepare('SELECT password_hash FROM users').get().password_hash,'correct-horse-example');
      assert.equal((await (await fetch(base+'/api/auth/me',{headers:{cookie}})).json()).user.email,'jane@example.com');
      assert.equal((await send('/api/auth/signup',{email:'jane@example.com',password:'another-password'})).status,409);
    });
    await t.test('login rejects incorrect credentials and logout revokes the session',async()=>{
      assert.equal((await send('/api/auth/login',{email:'jane@example.com',password:'wrong-password'})).status,401);
      const response = await send('/api/auth/login',{email:'jane@example.com',password:'correct-horse-example'},{headers:{cookie}});
      assert.equal(response.status,200);
      const previous = cookie;cookie=response.headers.get('set-cookie').split(';')[0];
      assert.equal((await (await fetch(base+'/api/auth/me',{headers:{cookie:previous}})).json()).user,null);
      assert.equal((await send('/api/auth/logout',{}, {headers:{cookie}})).status,200);
      assert.equal((await (await fetch(base+'/api/auth/me',{headers:{cookie}})).json()).user,null);
    });
    await t.test('cross-origin writes, invalid JSON and oversized bodies fail clearly',async()=>{
      assert.equal((await send('/api/applications',valid,{headers:{Origin:'https://unrelated.example'}})).status,403);
      assert.equal((await send('/api/applications',valid,{headers:{Origin:'http://localhost:5173'}})).status,201);
      assert.equal((await fetch(base+'/api/applications',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'})).status,400);
      assert.equal((await send('/api/applications',{...valid,address:'x'.repeat(20000)})).status,413);
    });
    await t.test('React routes refresh, original assets served, unknown API stays JSON',async()=>{
      for(const route of ['/about','/dogs','/adopt?dogId=buddy','/AboutUs.html']) assert.match(await (await fetch(base+route)).text(),/React entry/);
      assert.match((await fetch(base+'/Photos/BostonTerrier.png')).headers.get('content-type'),/image\/png/);
      const response=await fetch(base+'/api/missing');assert.equal(response.status,404);assert.match(response.headers.get('content-type'),/json/);
    });
  } finally {
    await new Promise(resolve=>server.close(resolve));
    db.close();
  }
  try {
    const reopened=createStore(filename);
    assert.equal(reopened.prepare('SELECT COUNT(*) AS n FROM dogs').get().n,30);
    assert.equal(reopened.prepare('SELECT COUNT(*) AS n FROM applications').get().n,8);
    assert.equal(reopened.prepare('SELECT COUNT(*) AS n FROM messages').get().n,1);
    assert.equal(reopened.prepare('SELECT COUNT(*) AS n FROM users').get().n,1);
    reopened.close();
  } finally {rmSync(dir,{recursive:true,force:true});}
});
