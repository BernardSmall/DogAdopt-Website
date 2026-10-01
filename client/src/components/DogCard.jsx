import { Link } from 'react-router';
export default function DogCard({dog,featured=false}) {
  return <article className="home-card home-dog">
    <div className="home-dog__media"><img src={dog.image} alt={dog.name} loading="lazy"/></div>
    <div className="home-dog__body">
      <h3 className="home-dog__name">{dog.name}</h3>
      <p className="home-text--muted">{dog.breed} • {dog.age}</p>
      <Link className="home-btn home-btn--sm" to={`/adopt?dogId=${encodeURIComponent(dog.id)}`}>{featured?'Adopt me':`Adopt ${dog.name}`}</Link>
    </div>
  </article>;
}
