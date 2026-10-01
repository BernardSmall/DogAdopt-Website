import { useState } from 'react';
import { Layout, Icon } from '../components/Layout';
import Form from '../components/Form';
import { useAuth } from '../AuthContext';
export default function Account({signup=false}) {
  const {setUser} = useAuth();
  const [providerNotice,setProviderNotice] = useState('');
  const fields = [
    {name:'email',label:'Email',type:'email',placeholder:'Email',autoComplete:'email'},
    {name:'password',label:'Password',type:'password',placeholder:'Password',autoComplete:signup?'new-password':'current-password'},
  ];
  return <Layout title={signup?'Sign Up':'Log In'}><main className="page"><section className="card" aria-labelledby="card-title">
    <header className="card__head"><h1 id="card-title">{signup?'Welcome,':'Welcome back,'}</h1><p className="card__sub">{signup?'sign up to continue':'log in to continue'}</p></header>
    <Form kind={signup?'signup':'login'} endpoint={`/auth/${signup?'signup':'login'}`} fields={fields} submitLabel={<>Let’s go <span aria-hidden="true">→</span></>} onSuccess={data=>setUser(data.user)}>
      <div className="social-row" aria-label="Continue with">{['Apple','Google','Facebook'].map((provider,i)=><button key={provider} className={`social-btn social-btn--${['orange','orange2','green'][i]}`} type="button" aria-label={`Continue with ${provider}`} onClick={()=>setProviderNotice(`${provider} sign-in is not configured. Please use your email and password.`)}><Icon/></button>)}</div>
      {providerNotice&&<p className="form-status" role="status">{providerNotice}</p>}
    </Form>
  </section></main></Layout>;
}
