import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>Welcome to Bates DCS</h1>
        <p>Your trusted partner in digital solutions</p>
        <Link to="/contact" className="cta-button">Get Started</Link>
      </div>
    </section>
  );
};

export default Home; 