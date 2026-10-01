import { useSearchParams } from 'react-router';
import { Layout } from '../components/Layout';
import DogCard from '../components/DogCard';
import AsyncState from '../components/AsyncState';
import { useApi } from '../api';
export default function Dogs() {
  const [search] = useSearchParams();
  const params = new URLSearchParams();
  for(const key of ['q','breed']) if(search.get(key)) params.set(key,search.get(key));
  const result = useApi(`/dogs${params.size ? `?${params}` : ''}`);
  return <Layout title="Dogs"><main className="home-main"><section className="home-section"><div className="home-container">
    <div className="home-section__head"><h1 className="home-section__title">Meet Our Dogs</h1><p className="home-section__subtitle">Browse through our furry friends waiting for their forever homes.</p></div>
    <AsyncState {...result} empty={result.data?.dogs.length===0}/>
    <div className="home-dogs">{result.data?.dogs.map(dog=><DogCard key={dog.id} dog={dog}/>)}</div>
  </div></section></main></Layout>;
}
