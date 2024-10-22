// ViewContentModal.jsx
import React, { useEffect, useState } from 'react';

function ViewContentModal({ courseId, onClose }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`https://elearningbackend-obpd.onrender.com/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) return <div className="modal is-active"><div className="modal-background"></div><div className="modal-content"><p>Loading...</p></div></div>;
  if (error) return <div className="modal is-active"><div className="modal-background"></div><div className="modal-content"><p>Error: {error}</p><button className="button" onClick={onClose}>Close</button></div></div>;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title is-4">{course.title}</h2>
          <p>{course.description}</p>
          
          <h3 className="title is-5">Chapters</h3>
          {course.chapters.length === 0 ? (
            <p>No chapters available.</p>
          ) : (
            course.chapters.map((chapter, index) => (
              <div key={index} className="box">
                <h4 className="title is-6">{chapter.title}</h4>
                <p>{chapter.description}</p>
                {/* You can further display videos and resources here */}
              </div>
            ))
          )}
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
}

export default ViewContentModal;
