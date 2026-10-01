import { Layout } from '../components/Layout';
import Form, { contactFields } from '../components/Form';
export default function Contact(){return <Layout namespace="contact" title="Contact"><main className="contact-main"><section className="contact-section"><div className="contact-container">
  <div className="contact-section__head"><h1 className="contact-section__title">Get in Touch</h1><p className="contact-section__subtitle">We'd love to hear from you. Please fill out the form below.</p></div>
  <div className="contact-form-container"><Form kind="contact" namespace="contact" endpoint="/contact" fields={contactFields} submitLabel="Send Message"/></div>
</div></section></main></Layout>;}
