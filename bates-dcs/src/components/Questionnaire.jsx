import { useState } from 'react';
import '../styles/Questionnaire.css';

const Questionnaire = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    interests: '',
    goals: ''
  });

  const faqs = [
    {
      question: "What services does Bates DCS offer?",
      answer: "We offer web development, mobile app development, and cloud solutions."
    },
    {
      question: "How can I join Bates DCS?",
      answer: "Fill out our quick questionnaire to help us understand your interests and goals."
    },
    {
      question: "What programming languages do you teach?",
      answer: "We cover JavaScript, Python, Java, and more modern web technologies."
    },
    {
      question: "Do I need prior experience to join?",
      answer: "No prior experience is required. We welcome students of all skill levels."
    },
    {
      question: "How long does the questionnaire take?",
      answer: "The questionnaire takes about 5 minutes to complete and helps us provide better recommendations."
    }
  ];

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
    // Here you would typically send the data to your backend
  };

  return (
    <div className="questionnaire-page">
      <section className="intro-section">
        <h1>Join Bates DCS</h1>
        <p className="intro-text">
          Take our quick 5-minute questionnaire to help us understand your interests and goals. 
          This informal assessment will help us provide better recommendations for your learning journey.
        </p>
      </section>

      <div className="content-wrapper">
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="questionnaire-section">
          <div className="phone-screen">
            <div className="phone-header">
              <div className="phone-notch"></div>
            </div>
            <div className="phone-content">
              <h3>Student Questionnaire</h3>
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
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="e.g., Web Development, Data Science"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Learning Goals</label>
                  <textarea
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
        </section>
      </div>
    </div>
  );
};

export default Questionnaire; 