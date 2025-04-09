import { useState } from 'react';
import '../styles/About.css';

const About = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    interests: '',
    goals: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section className="about-section">
      <div className="about-content">
        <h1>Digital & Computational Studies at Bates</h1>
        <p>
          Digital & Computational Studies at Bates encompasses computer science, critical studies, data science, and digital humanities. Our program requires students to engage in understanding the most fundamental aspects of computer science, data science, critical digital studies, and human-centered design.
        </p>
        <p>
          Our focus is on transferable knowledge and skills rather than on specific languages or technologies, while requiring students to interrogate the assumptions of the digital world, encouraging the use of computing for social good.
        </p>
      </div>

      <div className="program-overview">
        <h2>Program Overview</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <h3>Interdisciplinary Approach</h3>
            <p>Combine computer science with critical studies, data science, and digital humanities for a comprehensive education.</p>
          </div>
          <div className="overview-card">
            <h3>Fundamental Knowledge</h3>
            <p>Develop deep understanding of core concepts in computer science, data science, and digital studies.</p>
          </div>
          <div className="overview-card">
            <h3>Social Impact</h3>
            <p>Learn to use computing for social good while critically examining the digital world's assumptions.</p>
          </div>
        </div>
      </div>

      <div className="interactive-section">
        <div className="faqs-container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3>What is DCS?</h3>
            <p>DCS stands for Digital and Computational Studies. It's an interdisciplinary field that focuses on the use of digital tools, computational thinking, and data analysis to solve problems across various disciplines.</p>
          </div>
          <div className="faq-item">
            <h3>How does DCS differ from a CS major?</h3>
            <p>While CS focuses on technical depth—algorithms, data structures, and software engineering—DCS blends computational thinking with humanities, social sciences, and data analysis. DCS is ideal for students who want to use computation to solve problems in diverse fields, whereas CS is more specialized in software development and computer systems.</p>
          </div>
          <div className="faq-item">
            <h3>What are some pathways you can explore in Bates DCS department?</h3>
            <p>Students can explore various pathways including:</p>
            <ul>
              <li>Data Science & Analysis</li>
              <li>Critical Digital Studies</li>
              <li>Human-Centered Design</li>
              <li>Community Engaged Learning</li>
              <li>Create your own path!</li>
            </ul>
          </div>
          <div className="faq-item">
            <h3>What is Data Science & Analysis?</h3>
            <p>Data Science & Analysis in DCS focuses on using computational methods to extract insights from data, applying statistical and analytical techniques to solve real-world problems across various disciplines. This pathway combines technical skills with domain-specific knowledge to make data-driven decisions.</p>
          </div>
          <div className="faq-item">
            <h3>What is Critical Digital Studies?</h3>
            <p>Critical Digital Studies examines the social, cultural, and political implications of digital technologies. This pathway explores how digital tools shape our understanding of society, culture, and human interaction, while critically analyzing issues like digital privacy, algorithmic bias, and the impact of technology on social justice.</p>
          </div>
          <div className="faq-item">
            <h3>What is Human-Centered Design?</h3>
            <p>Human-Centered Design focuses on creating digital solutions that prioritize user needs and experiences. This pathway combines principles of design thinking, user research, and iterative development to create technologies that are accessible, inclusive, and meaningful to diverse user groups.</p>
          </div>
          <div className="faq-item">
            <h3>What is Community Engaged Learning?</h3>
            <p>Community Engaged Learning in DCS connects academic study with real-world community needs. Students work with local organizations and communities to develop digital solutions that address specific challenges, applying their technical skills while learning about community needs and social impact.</p>
          </div>
        </div>

        <div className="phone-screen">
          <div className="screen-content">
            <h2>Quick Assessment</h2>
            <form onSubmit={handleSubmit} className="questionnaire-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  required
                />
              </div>
              <div className="form-group">
                <label>Programming Experience</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label>Areas of Interest</label>
                <select
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your interests</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="critical-studies">Critical Studies</option>
                  <option value="data-science">Data Science</option>
                  <option value="digital-humanities">Digital Humanities</option>
                  <option value="human-centered-design">Human-Centered Design</option>
                </select>
              </div>
              <div className="form-group">
                <label>Learning Goals</label>
                <input
                  type="text"
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  placeholder="What do you hope to achieve?"
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 