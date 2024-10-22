import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ChaptersPage = () => {
  const { courseId } = useParams(); 
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const token = localStorage.getItem('authToken'); 

        const response = await fetch(`http://localhost:3000/api/chapters?course=${courseId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
        if (response.status === 401) {
          setErrorMessage('You need to log in to view the chapters.');
          setLoading(false);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setChapters(data);
          setSelectedChapter(data[0]); // Set the first chapter as selected
        } else {
          setChapters([]); // Set chapters to empty if data is not an array
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setErrorMessage('An error occurred while fetching the chapters.');
        setLoading(false);
      }
    };

    fetchChapters();
  }, [courseId, navigate]);

  const handleNextChapter = () => {
    const currentIndex = chapters.findIndex(chapter => chapter._id === selectedChapter._id);
    const nextChapter = chapters[currentIndex + 1];

    if (nextChapter) {
      setSelectedChapter(nextChapter); // Set the next chapter as selected
    }
  };

  if (loading) {
    return <p>Loading chapters...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          {/* Sidebar: Chapter Titles */}
          <div className="column is-one-quarter">
            <aside className="menu">
              <p className="menu-label">Chapters</p>
              <ul className="menu-list">
                {chapters.length > 0 ? (
                  chapters.map((chapter) => (
                    <li key={chapter._id}>
                      <button
                        className={`button is-link is-light ${selectedChapter?._id === chapter._id ? 'is-active' : ''}`}
                        onClick={() => setSelectedChapter(chapter)}
                      >
                        {chapter.title}
                      </button>
                    </li>
                  ))
                ) : (
                  <li>No chapters available.</li>
                )}
              </ul>
            </aside>
          </div>

          {/* Main Content: Chapter Details */}
          <div className="column">
            {selectedChapter && (
              <div>
                <h2 className="title">{selectedChapter.title}</h2>
                <p>{selectedChapter.description}</p>
                <div className="content">
                  <h3>Video Lecture</h3>
                  <iframe
                    width="560"
                    height="315"
                    src={selectedChapter.videoUrl}
                    title={selectedChapter.title}
                    allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>

                  <h3>Additional Resources</h3>
                  <a 
                    href={selectedChapter.resourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="button is-link"
                    download 
                  >
                    Download Resources
                  </a>

                  {/* Next Chapter Button */}
                  <div className="field mt-5">
                    <button
                      className="button is-primary"
                      onClick={handleNextChapter}
                      disabled={chapters.findIndex(chapter => chapter._id === selectedChapter._id) === chapters.length - 1}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChaptersPage;
