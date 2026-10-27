import { Link } from 'react-router';
import { Layout } from '../components/Layout';
import IllustrationWithShadow from '../components/IllustrationWithShadow';
import './About.css';

const staff = [
  ['Ava Thompson', 'Director • Behavior & Training'],
  ['Luis Ortega', 'Shelter Partnerships'],
  ['Maya Chen', 'Volunteer Programs'],
  ['Sam Patel', 'Community Outreach'],
];
const values = [
  ['Compassion & respect', 'Treat every dog and adopter with care and respect.'],
  ['Transparency & trust', 'Keep the adoption process simple and transparent.'],
  ['Education & support', 'Offer training, care resources and lifelong support.'],
  ['Community & inclusivity', 'Bring shelters, fosters, volunteers and adopters together.'],
];

export default function About() {
  return <Layout namespace="about" title="About Us">
    <main className="about-foundation">
      <section className="about-foundation__section" aria-labelledby="about-title">
        <div className="about-container about-foundation__hero">
          <div>
            <h1 id="about-title" className="about-hero__title">About Us</h1>
            <p className="about-foundation__intro">We’re a community of volunteers and adopters helping dogs find loving forever homes.</p>
          </div>
          <img
            className="about-foundation__photo"
            src="/Photos/Cheerful White Shepherd Portrait.png"
            alt="A cheerful cartoon White Shepherd with upright ears and a brown collar"
            width={1448}
            height={1086}
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="about-foundation__section about-foundation__story" aria-labelledby="about-story-title">
        <div className="about-container about-foundation__story-layout">
          <IllustrationWithShadow
            className="about-foundation__illustration"
            src="/Photos/dog-house-transparent.png"
            alt="A cartoon dog sitting in front of a doghouse with a heart on its roof"
            imageWidth={1476}
            imageHeight={1065}
          />
          <div className="about-foundation__reading">
            <h2 id="about-story-title" className="about-h2">Our Story</h2>
            <p>Started by a small foster group, DogAdopt grew into a platform that helps shelters reach more families, reduce stays, and improve matches using personality profiles and post-adoption guidance.</p>
            <p>We partner with shelters and rescues, offer training and care resources, support fosters and volunteers, and host adoption events.</p>
          </div>
        </div>
      </section>

      <section className="about-foundation__section about-foundation__mission" aria-labelledby="about-mission-title">
        <div className="about-container">
          <div className="about-foundation__reading">
            <h2 id="about-mission-title" className="about-h2">Our Mission</h2>
            <p>To connect dogs with caring adopters through a simple, transparent process and lifelong support.</p>
          </div>
        </div>
      </section>

      <section className="about-foundation__section" aria-labelledby="about-team-title">
        <div className="about-container">
          <h2 id="about-team-title" className="about-h2">Meet the Team</h2>
          <div className="about-foundation__team">
            {staff.map(([name, role]) => <article className="about-card about-person" key={name}>
              <div className="about-person__media">
                <img src={`/Photos/${name}.png`} alt="" width="1024" height="1536" loading="lazy" />
              </div>
              <div className="about-person__body">
                <h3 className="about-person__name">{name}</h3>
                <p>{role}</p>
              </div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="about-foundation__section" aria-labelledby="about-values-title">
        <div className="about-container">
          <h2 id="about-values-title" className="about-h2">Our Values</h2>
          <div className="about-foundation__values">
            {values.map(([title, description]) => <div key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>)}
          </div>
        </div>
      </section>

      <section className="about-foundation__section about-foundation__join" aria-labelledby="about-join-title">
        <div className="about-container">
          <h2 id="about-join-title" className="about-h2">Join our mission</h2>
          <p>Become a foster, volunteer, or adopter today.</p>
          <div className="about-actions">
            <Link className="about-btn about-btn--lg" to="/adopt">Adopt now</Link>
            <Link className="about-btn about-btn--ghost about-btn--lg" to="/contact">Become a volunteer</Link>
          </div>
        </div>
      </section>
    </main>
  </Layout>;
}
