import { Link } from 'react-router';
import { Layout, Icon } from '../components/Layout';
import DogCard from '../components/DogCard';
import AsyncState from '../components/AsyncState';
import { useApi } from '../api';
export default function Home() {
  const result = useApi('/dogs?group=featured');
  return <Layout title="Home"><main className="home-main">
    <section className="home-hero"><div className="home-container home-hero__inner">
      <div className="home-hero__text"><h1 className="home-hero__title">Find Your New Best Friend</h1><p className="home-hero__subtitle">Browse loving dogs waiting for a forever home. Simple process, friendly support.</p>
        <div className="home-hero__actions"><Link className="home-btn home-btn--lg" to="/adopt">Adopt now</Link><Link className="home-btn home-btn--ghost home-btn--lg" to="/dogs">See available dogs</Link></div>
      </div>
      <div className="home-hero__art" aria-hidden="true"><img src="/Photos/DogHouse2.png" alt="Dog House" className="home-hero__image"/></div>
    </div></section>
    <section className="home-section home-section--dogs"><div className="home-container">
      <div className="home-section__head"><h2 className="home-section__title">Featured Dogs</h2><Link className="home-link" to="/dogs">View all <Icon name="arrow-right"/></Link></div>
      <AsyncState {...result} empty={result.data?.dogs.length===0}/>
      <div className="home-dogs" id="dog-cards-container">{result.data?.dogs.map(dog=><DogCard key={dog.id} dog={dog} featured/>)}</div>
    </div></section>
  </main></Layout>;
}
