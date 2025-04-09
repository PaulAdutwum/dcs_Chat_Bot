import '../styles/Major.css';

const Major = () => {
  return (
    <section className="major-section">
      <div className="major-content">
        <h1>Major Requirements</h1>
        <div className="requirements-grid">
          <div className="requirement-card">
            <h2>Core Courses</h2>
            <ul>
              <li>Introduction to Computer Science</li>
              <li>Data Structures and Algorithms</li>
              <li>Computer Organization</li>
              <li>Software Engineering</li>
              <li>Operating Systems</li>
            </ul>
          </div>
          <div className="requirement-card">
            <h2>Electives</h2>
            <ul>
              <li>Artificial Intelligence</li>
              <li>Database Systems</li>
              <li>Web Development</li>
              <li>Mobile App Development</li>
              <li>Computer Networks</li>
            </ul>
          </div>
          <div className="requirement-card">
            <h2>Capstone Project</h2>
            <p>Complete a significant software development project under faculty supervision.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Major; 