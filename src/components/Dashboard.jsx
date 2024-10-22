import React, { useState } from 'react';




import CreateTopic from './CreateTopic';
import CoursesList from './CourseList';

const Dashboard = () => {
  const [activeContent, setActiveContent] = useState('Welcome');

  const handleButtonClick = (content) => {
    setActiveContent(content);
  };

  const renderContent = () => {
    switch (activeContent) {
      case 'Add Course':
        return <CreateTopic />;
      case 'Courses':
        return <CoursesList/>;
      case 'Students':
        return <div className="content"><p>No Students</p></div>;
      default:
        return (
          <div className="content">
            <h2 className="title is-4">Welcome to the Dashboard</h2>
            <p>Select a section from the sidebar to view content.</p>
          </div>
        );
    }
  };

  return (
    <div className="columns is-gapless" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="column is-2 has-background-light p-4 is-link is-dark ">
        <div className="menu">
          <p className="menu-label">Dashboard</p>
          <ul className="menu-list">
            <li>
              <button
                className={`button is-link is-light is-fullwidth ${activeContent === 'Add Course' ? 'is-active' : ''}`}
                onClick={() => handleButtonClick('Add Course')}
              >
                Add Course
              </button>
            </li>
            <li>
              <button
                className={`button is-link is-light is-fullwidth ${activeContent === 'Courses' ? 'is-active' : ''}`}
                onClick={() => handleButtonClick('Courses')}
              >
                Courses
              </button>
            </li>
            <li>
              <button
                className={`button is-link is-dark is-fullwidth ${activeContent === 'Students' ? 'is-active' : ''}`}
                onClick={() => handleButtonClick('Students')}
              >
                Students
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <main className="column is-10">
        <section className="section">
          <div className="container">
            <div className="box">
              {renderContent()}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
