import { Link, useSearchParams } from 'react-router';
import { Layout } from '../components/Layout';
import Form, { adoptionFields } from '../components/Form';
import { useApi } from '../api';
import AsyncState from '../components/AsyncState';

export default function Adopt() {
  const [search] = useSearchParams();
  const id = search.get('dogId');
  const legacyName = search.get('dog');
  const result = useApi(id ? `/dogs/${encodeURIComponent(id)}` : legacyName ? `/dogs?q=${encodeURIComponent(legacyName)}` : null);
  const dog = result.data?.dog || result.data?.dogs?.find(d=>d.name.toLowerCase()===legacyName?.toLowerCase());
  const selected = Boolean(id||legacyName);
  const missing = selected&&!result.loading&&!result.error&&!dog;
  return <Layout namespace="adopt" title="Adopt"><main className="adopt-main"><section className="adopt-section"><div className="adopt-container">
    <div className="adopt-section__head"><h1 className="adopt-section__title">Adopt {dog?.name}</h1><p className="adopt-section__subtitle">Please fill out the form below to start the adoption process.</p></div>
    {selected&&<AsyncState {...result}/>}
    {(missing||result.error)&&<p role="alert">The selected dog could not be loaded. <Link to="/dogs">Choose a dog from the listings.</Link></p>}
    <div className="adopt-form-container"><Form key={id||legacyName||'general'} kind="adoption" namespace="adopt" endpoint="/applications" fields={adoptionFields} extra={{dogId:dog?.id||null}} disabled={selected&&(!dog||result.loading||!!result.error)} submitLabel="Apply for Adoption"/></div>
  </div></section></main></Layout>;
}
