import '../styles/Minor.css';

const Minor = () => {
  return (
    <section className="minor-section">
      <div className="minor-content">
        <h1>Minor/GEC Requirements</h1>
        <div className="requirements-grid">
          <div className="requirement-card">
            <h2>Minor Requirements</h2>
            <ul>
              <li>Introduction to Computer Science</li>
              <li>Data Structures and Algorithms</li>
              <li>Two additional CS courses</li>
              <li>Minimum GPA of 2.0 in CS courses</li>
            </ul>
          </div>
          <div className="requirement-card">
            <h2>GEC Requirements</h2>
            <ul>
              <li>Mathematics (Calculus or Statistics)</li>
              <li>Natural Sciences</li>
              <li>Social Sciences</li>
              <li>Humanities</li>
              <li>Arts</li>
            </ul>
          </div>
          <div className="requirement-card">
            <h2>Additional Information</h2>
            <p>Students must complete all GEC requirements in addition to their major or minor requirements. Some courses may count towards both GEC and major/minor requirements.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Minor; 