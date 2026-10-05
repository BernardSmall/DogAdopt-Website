import { Link } from 'react-router';
export default function SelectedDog({dog}) {
  return <div className="selected-dog">
    <img src={dog.image} alt={dog.name}/>
    <div><strong>Enquiry for {dog.name}</strong><p>{dog.breed} • {dog.age}</p>
      <Link className="home-link" to={`/dogs/${encodeURIComponent(dog.id)}`}>View profile</Link>
    </div>
  </div>;
}
