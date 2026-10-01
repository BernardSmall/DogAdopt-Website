import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { useAuth } from '../AuthContext';
import { api } from '../api';

export function Icon({name='paw'}) { return <i className={`fa fa-${name}`} aria-hidden="true"/>; }
const links = [['/','Home'],['/about','About'],['/dogs','Dogs'],['/adopt','Adopt'],['/contact','Contact']];

export function Layout({namespace='home',title,children}) {
  const ns = namespace;
  const {pathname} = useLocation();
  const [open,setOpen] = useState(false);
  const toggle = useRef(null);
  const brand = useRef(null);
  const {user,setUser} = useAuth();
  const [notice,setNotice] = useState('');
  const [loggingOut,setLoggingOut] = useState(false);
  useLayoutEffect(()=> {
    document.body.className = `${ns} ${ns === 'about' ? 'about-menu-ready' : 'site-menu-ready'} ${open ? (ns === 'about' ? 'about-menu-open' : 'site-menu-open') : ''}`;
    return ()=>{document.body.className='';};
  },[ns,open]);
  useEffect(()=>{setOpen(false);setNotice('');window.scrollTo(0,0);document.title=`DogAdopt — ${title}`;},[pathname,title]);
  useEffect(()=> {
    const media = window.matchMedia('(min-width:60rem)');
    const reset = ()=> {
      const active = document.activeElement;
      const linkWillHide = !media.matches && active.matches('#site-navigation a, #site-account-links a, #site-account-links button');
      const toggleWillHide = media.matches && active === toggle.current;
      setOpen(false);
      if (linkWillHide) toggle.current?.focus();
      if (toggleWillHide) brand.current?.focus();
    };
    media.addEventListener('change',reset);
    return ()=>media.removeEventListener('change',reset);
  },[]);
  async function logout() {
    setLoggingOut(true);
    try {await api('/auth/logout',{method:'POST'});setUser(null);setNotice('You have been logged out.');}
    catch(error){setNotice(error.message);}
    finally{setLoggingOut(false);}
  }
  return <>
    <header className={`${ns}-header`} data-site-header onKeyDown={event=>{
      if(event.key==='Escape'&&open){setOpen(false);toggle.current?.focus();}
    }}>
      <div className={`${ns}-container ${ns}-header__inner`}>
        <Link ref={brand} className={`${ns}-brand`} to="/"><span className={`${ns}-brand__icon`}><Icon/></span><span className={`${ns}-brand__name`}>DogAdopt</span></Link>
        <nav className={`${ns}-nav`} id="site-navigation" aria-label="Primary">
          {links.map(([to,label])=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)} className={({isActive})=>`${ns}-nav__link${isActive?' is-active':''}`}>{label}</NavLink>)}
        </nav>
        <div className={`${ns}-header__cta`} id="site-account-links">
          {user ? <button className={`${ns}-btn ${ns}-btn--outline`} disabled={loggingOut} onClick={logout}>{loggingOut?'Logging out…':'Log out'}</button> : <>
            <NavLink className={`${ns}-btn ${ns}-btn--outline`} to="/login">{ns==='about'?'Sign in':'Log in'}</NavLink>
            <NavLink className={`${ns}-btn`} to="/signup">Sign up</NavLink>
          </>}
        </div>
        <button ref={toggle} className={`${ns}-nav__toggle`} type="button" data-menu-toggle aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="site-navigation site-account-links" onClick={()=>setOpen(!open)}><Icon name="bars"/><span>Menu</span></button>
      </div>
    </header>
    {notice&&<p className="app-notice" role="status">{notice}</p>}
    {children}
    <Footer namespace={ns}/>
  </>;
}

export function Footer({namespace:ns}) {
  const [notice,setNotice] = useState('');
  const pawClass = ns==='about'?'about-paw':`${ns}-paw-circle`;
  return <footer className={`${ns}-footer`}>
    <div className={`${ns}-container ${ns}-footer__inner`}>
      <p className={`${ns}-footer__copy`}>© {new Date().getFullYear()} DogAdopt</p>
      <nav className={`${ns}-footer__nav`} aria-label="Footer">
        {['Privacy','Terms'].map(label=><button className="footer-link" key={label} onClick={()=>setNotice(`${label} information is not available in this portfolio demo.`)}>{label}</button>)}
        <Link to="/contact">Contact</Link>
      </nav>
      <div className={`${ns}-footer__social`}>
        {['orange','orange2','green'].map((color,index)=><span key={color} className={`${pawClass} ${ns}-paw--${color}`} aria-label={['Instagram','Twitter/X','Facebook'][index]}><Icon/></span>)}
      </div>
    </div>
    {notice&&<p className={`${ns}-container`} role="status">{notice}</p>}
  </footer>;
}
