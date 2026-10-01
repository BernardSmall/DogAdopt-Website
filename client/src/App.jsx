import { Component } from 'react';
import { Navigate, Route, Routes, useLocation, Link } from 'react-router';
import Home from './pages/Home';
import About from './pages/About';
import Dogs from './pages/Dogs';
import Adopt from './pages/Adopt';
import Contact from './pages/Contact';
import Account from './pages/Account';
import Loading from './pages/Loading';
import { Layout } from './components/Layout';

function Legacy({to}){const {search,hash}=useLocation();return <Navigate replace to={`${to}${search}${hash}`}/>;}
class ErrorBoundary extends Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<main className="app-notice" role="alert"><h1>Something went wrong</h1><p>Please reload the page to try again.</p><button className="home-btn" onClick={()=>window.location.reload()}>Reload</button></main>:this.props.children;}
}
export default function App(){return <ErrorBoundary><Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/about" element={<About/>}/>
  <Route path="/dogs" element={<Dogs/>}/>
  <Route path="/adopt" element={<Adopt/>}/>
  <Route path="/contact" element={<Contact/>}/>
  <Route path="/login" element={<Account key="login"/>}/>
  <Route path="/signup" element={<Account key="signup" signup/>}/>
  <Route path="/loading" element={<Loading/>}/>
  {Object.entries({'HomePage.html':'/','AboutUs.html':'/about','dogs.html':'/dogs','adopt.html':'/adopt','Contact.html':'/contact','login.html':'/login','SignUp.html':'/signup','Loading.html':'/loading'}).map(([old,to])=><Route key={old} path={`/${old}`} element={<Legacy to={to}/>}/>)}
  <Route path="*" element={<Layout title="Page not found"><main className="home-container home-section"><h1>Page not found</h1><p>This page does not exist.</p><Link className="home-btn" to="/">Back to Home</Link></main></Layout>}/>
</Routes></ErrorBoundary>;}
