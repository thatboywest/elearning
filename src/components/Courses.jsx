import React from 'react';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate(); 

  
  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('https://elearningbackend-obpd.onrender.com/api/courses');
        const data = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = (courseId) => {
    navigate(`/courses/${courseId}`); 
  };

  if (loading) {
    return <p>Loading courses...</p>;
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Our Courses</h1>
        <div className="columns is-multiline">
          {courses.map((course) => (
            <div key={course._id} className="column is-one-third">
              <div className="card">
                <div className="card-content">
                  <p className="title is-4">{course.title}</p>
                  <p className="subtitle is-6">
                    Number of chapters: {course.chapters.length}
                  </p>
                  <button
                    className="button is-link is-light"
                    onClick={() => handleEnroll(course._id)}
                  >
                    Start learning
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
