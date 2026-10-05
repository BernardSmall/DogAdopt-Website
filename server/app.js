import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { randomBytes, randomUUID, createHash, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateForm, cleanText } from '../shared/validation.js';

const deriveKey = promisify(scrypt);
const digest = token => createHash('sha256').update(token).digest('hex');
const projectRoot = resolve(import.meta.dirname, '..');
const cookieName = 'dogadopt_session';

export function createApp(db, { origins = [], secureCookie = false, sessionDays = 7, rateLimits = true, distDir = resolve(projectRoot, 'dist') } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Referrer-Policy', 'same-origin');
    next();
  });
  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.use('/api', (req, res, next) => {
    if (!['GET','HEAD','OPTIONS'].includes(req.method) && req.headers.origin && !origins.includes(req.headers.origin)) return res.status(403).json({ message: 'This site is not allowed to submit to this API.' });
    next();
  });
  app.use(express.json({ limit: '16kb' }));
  if (rateLimits) {
    app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'Too many account requests. Please try again in 15 minutes.' } }));
    const submissions = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'Too many submissions. Please try again in 15 minutes.' } });
    app.use(['/api/applications','/api/contact'], submissions);
  }
  const validate = kind => (req, res, next) => {
    const errors = validateForm(kind, req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Please correct the highlighted fields.', errors });
    next();
  };
  const safeDog = dog => ({ ...dog, featured: Boolean(dog.featured), catalog: Boolean(dog.catalog) });
  app.get('/api/health', (_req,res) => res.json({ status:'ok' }));
  app.get('/api/dogs', (req, res) => {
    const query = key => typeof req.query[key] === 'string' ? req.query[key].trim().toLowerCase() : '';
    const q = query('q'), breed = query('breed'), group = query('group');
    let dogs = db.prepare('SELECT * FROM dogs ORDER BY rowid').all();
    if (group === 'featured') dogs = dogs.filter(d=>d.featured);
    if (group === 'catalog') dogs = dogs.filter(d=>d.catalog);
    if (q) dogs = dogs.filter(d=>`${d.name} ${d.breed}`.toLowerCase().includes(q));
    if (breed) dogs = dogs.filter(d=>d.breed.toLowerCase() === breed);
    res.json({ dogs: dogs.map(safeDog) });
  });
  app.get('/api/dogs/:id', (req,res) => {
    const dog = db.prepare('SELECT * FROM dogs WHERE id = ?').get(req.params.id);
    if (!dog) return res.status(404).json({ message:'This dog could not be found.' });
    res.json({ dog: safeDog(dog) });
  });
  app.post('/api/applications', validate('adoption'), (req,res) => {
    const dogId = cleanText(req.body.dogId) || null;
    if (dogId && !db.prepare('SELECT id FROM dogs WHERE id = ?').get(dogId)) return res.status(400).json({ message:'The selected dog is no longer available. Please choose another dog.', errors:{ dogId:'Choose a dog from the listings.' } });
    const id = randomUUID();
    db.prepare('INSERT INTO applications VALUES (?, ?, ?, ?, ?, ?, ?)').run(id,dogId,cleanText(req.body.name),cleanText(req.body.email).toLowerCase(),'','',new Date().toISOString());
    res.status(201).json({ id, message:'Your demo enquiry has been saved. This is not an adoption commitment. No shelter was contacted and no email or follow-up will be sent.' });
  });
  app.post('/api/contact', validate('contact'), (req,res) => {
    const id = randomUUID();
    db.prepare('INSERT INTO messages VALUES (?, ?, ?, ?, ?)').run(id,cleanText(req.body.name),cleanText(req.body.email).toLowerCase(),cleanText(req.body.message),new Date().toISOString());
    res.status(201).json({ id, message:'Your message has been saved. Thank you for getting in touch!' });
  });
  const cookieOptions = { httpOnly:true, sameSite:'strict', secure:secureCookie, path:'/' };
  const readToken = req => (req.headers.cookie || '').split(';').map(c=>c.trim()).find(c=>c.startsWith(cookieName+'='))?.slice(cookieName.length+1) || '';
  const startSession = (req,res,user) => {
    const previous = readToken(req);
    if (previous) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(digest(previous));
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());
    const token = randomBytes(32).toString('hex');
    const maxAge = sessionDays * 24 * 60 * 60 * 1000;
    db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(digest(token),user.id,Date.now()+maxAge);
    res.cookie(cookieName,token,{...cookieOptions,maxAge});
  };
  app.post('/api/auth/signup', validate('signup'), async (req,res) => {
    const email = cleanText(req.body.email).toLowerCase();
    if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) return res.status(409).json({ message:'An account with that email already exists. Please log in.', errors:{email:'This email is already registered.'} });
    const salt = randomBytes(16).toString('hex');
    const key = await deriveKey(req.body.password,salt,64);
    const user = {id:randomUUID(),email};
    try { db.prepare('INSERT INTO users VALUES (?, ?, ?)').run(user.id,email,`${salt}:${key.toString('hex')}`); }
    catch (error) {
      if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) return res.status(409).json({message:'This email is already registered.',errors:{email:'Please log in instead.'}});
      throw error;
    }
    startSession(req,res,user);
    res.status(201).json({ user, message:'Your account has been created.' });
  });
  app.post('/api/auth/login', validate('login'), async (req,res) => {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanText(req.body.email).toLowerCase());
    const [salt, saved] = user ? user.password_hash.split(':') : ['invalid-account-salt','00'.repeat(64)];
    const key = await deriveKey(req.body.password,salt,64);
    if (!user || !timingSafeEqual(key,Buffer.from(saved,'hex'))) return res.status(401).json({ message:'The email or password is incorrect.' });
    startSession(req,res,user);
    res.json({ user:{id:user.id,email:user.email}, message:'You are now logged in.' });
  });
  app.get('/api/auth/me', (req,res) => {
    const token = readToken(req);
    const user = token ? db.prepare('SELECT users.id, users.email FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires_at > ?').get(digest(token),Date.now()) : null;
    res.json({ user:user || null });
  });
  app.post('/api/auth/logout', (req,res) => {
    const token = readToken(req);
    if(token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(digest(token));
    res.clearCookie(cookieName,cookieOptions).json({ message:'You have been logged out.' });
  });
  app.use('/api', (_req,res) => res.status(404).json({ message:'API endpoint not found.' }));
  app.use('/Photos', express.static(resolve(projectRoot,'Photos')));
  app.use('/Photos', (_req,res)=>res.sendStatus(404));
  if (existsSync(resolve(distDir,'index.html'))) {
    app.use(express.static(distDir));
    app.get('/{*path}', (req,res,next) => {
      if (req.path.startsWith('/assets/')) return next();
      res.sendFile(resolve(distDir,'index.html'));
    });
  }
  app.use((error,_req,res,_next) => {
    if (error.type === 'entity.parse.failed') return res.status(400).json({message:'Send a valid JSON request.'});
    if (error.type === 'entity.too.large') return res.status(413).json({message:'This submission is too large.'});
    console.error('Request failed:',error.code || error.name);
    res.status(500).json({message:'We could not save your request. Please try again.'});
  });
  return app;
}
