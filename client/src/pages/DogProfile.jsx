import { Link, useParams } from 'react-router';
import { Layout } from '../components/Layout';
import AsyncState from '../components/AsyncState';
import { useApi } from '../api';
import { sampleProfile } from '../data/sampleProfile';

export default function DogProfile() {
  const { id } = useParams();
  const result = useApi(`/dogs/${encodeURIComponent(id)}`);
  const dog = result.data?.dog;
  return <Layout title={dog ? dog.name : 'Dog profile'}>
    <main className="home-container home-section">
      <Link className="home-link" to="/dogs">Back to Dogs</Link>
      <AsyncState {...result}/>
      {dog && <article className="dog-profile">
        <div className="home-card dog-profile__photo"><img src={dog.image} alt={dog.name}/></div>
        <div>
          <h1 className="about-hero__title">{dog.name}</h1>
          <p className="home-section__subtitle">{dog.breed} • {dog.age}</p>
          <p><strong>Gender:</strong> Not provided. <strong>Adoption status:</strong> Demo listing, not a real adoption placement.</p>
          <section aria-labelledby="sample-profile-title">
            <h2 id="sample-profile-title" className="about-h2">Sample profile information</h2>
            <p>The details below are shared examples for this portfolio, not an assessment of {dog.name}. A real shelter would confirm each dog’s needs and suitability.</p>
            <dl className="dog-profile__facts">
              {sampleProfile.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </section>
          <Link className="home-btn" to={`/adopt?dogId=${encodeURIComponent(dog.id)}`}>Apply for {dog.name}</Link>
        </div>
      </article>}
    </main>
  </Layout>;
}
