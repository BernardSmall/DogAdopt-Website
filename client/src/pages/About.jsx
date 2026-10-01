import { Link } from 'react-router';
import { Layout } from '../components/Layout';
const staff = [
  ['Ava Thompson','Director • Behavior & Training'],
  ['Luis Ortega','Shelter Partnerships'],
  ['Maya Chen','Volunteer Programs'],
  ['Sam Patel','Community Outreach'],
];
function Team(){return <div className="about-team">{staff.map(([name,title])=><article key={name} className="about-card about-person"><div className="about-person__media"><img src={`/Photos/${name}.png`} alt={name} width="1024" height="1536" loading="lazy"/></div><div className="about-person__body"><h3 className="about-person__name">{name}</h3><p className="about-muted">{title}</p></div></article>)}</div>;}
export default function About(){return <Layout namespace="about" title="About Us">
  <main className="about-main">
    
    <section className="about-hero">
      <div className="about-container about-hero__inner">
        <div className="about-hero__text">
          <h1 className="about-hero__title">About Us</h1>
          <p className="about-hero__subtitle">
            We’re a community of volunteers and adopters helping dogs find loving forever homes.
          </p>
          <div className="about-hero__badges">
            <span className="about-paw about-paw--orange"><i className="fa fa-paw"></i></span>
            <span className="about-paw about-paw--orange2"><i className="fa fa-paw"></i></span>
            <span className="about-paw about-paw--green"><i className="fa fa-paw"></i></span>
          </div>
        </div>

        <div className="about-hero__panel">
          <div className="about-hero__stat">
            <strong>2.4k+</strong>
            <span>Adoptions</span>
          </div>
          <div className="about-hero__stat">
            <strong>120</strong>
            <span>Active volunteers</span>
          </div>
          <div className="about-hero__stat">
            <strong>85%</strong>
            <span>First-month matches</span>
          </div>
        </div>
      </div>
    </section>

    
    <section className="about-section">
      <div className="about-container about-grid about-story">
        <div className="about-card about-story__card">
          <h2 className="about-h2">Our Mission</h2>
          <p className="about-muted">
            To connect dogs with caring adopters through a simple, transparent process and lifelong support.
          </p>
        </div>

        <div className="about-card about-story__card">
          <h2 className="about-h2">Our Story</h2>
          <p className="about-muted">
            Started by a small foster group, DogAdopt grew into a platform that helps shelters reach more families,
            reduce stays, and improve matches using personality profiles and post-adoption guidance.
          </p>
        </div>

        <div className="about-card about-story__card">
          <h2 className="about-h2">What We Do</h2>
          <ul className="about-list">
            <li>Partner with shelters & rescues</li>
            <li>Offer training & care resources</li>
            <li>Support fosters and volunteers</li>
            <li>Host adoption events</li>
          </ul>
        </div>
      </div>
    </section>

    
    <section className="about-section about-section--alt">
      <div className="about-container">
        <div className="about-section__head">
          <h2 className="about-h2">Meet the Team</h2>
        </div>

        <Team />
      </div>
    </section>

    
    <section className="about-section">
      <div className="about-container about-values">
        <div className="about-card about-values__card">
          <h2 className="about-h2">Our Values</h2>
          <ul className="about-list">
            <li>Compassion & respect</li>
            <li>Transparency & trust</li>
            <li>Education & support</li>
            <li>Community & inclusivity</li>
          </ul>
        </div>

        <div className="about-card about-values__cta">
          <h2 className="about-h2">Join our mission</h2>
          <p className="about-muted">Become a foster, volunteer, or adopter today.</p>
          <div className="about-actions">
            <Link className="about-btn about-btn--lg" to="/adopt">Adopt now</Link>
            <Link className="about-btn about-btn--ghost about-btn--lg" to="/contact">Become a volunteer</Link>
          </div>
        </div>
      </div>
    </section>
  </main>
</Layout>;}
