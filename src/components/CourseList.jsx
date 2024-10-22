import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newChapter, setNewChapter] = useState({ title: '', description: '', videoFile: null, resourceFile: null });
  const [selectedChapter, setSelectedChapter] = useState(null); // Selected chapter
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // What we're deleting (course or chapter)

  // Fetch the courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  // Handle form input changes for the new chapter
  const handleChapterChange = (field, value) => {
    setNewChapter({ ...newChapter, [field]: value });
  };

  // Handle file input changes for the new chapter
  const handleFileChange = (field, file) => {
    setNewChapter({ ...newChapter, [field]: file });
  };

  // Handle selecting a course to view details and add chapters
  const selectCourse = (course) => {
    setSelectedCourse(course);
    setSelectedChapter(null); // Reset chapter selection
  };

  // Submit new chapter to the selected course
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', newChapter.title);
    formData.append('description', newChapter.description);
    formData.append('video', newChapter.videoFile);
    formData.append('resource', newChapter.resourceFile);
    formData.append('courseId', selectedCourse._id);

    try {
      const response = await axios.post('http://localhost:3000/api/chapters', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Chapter added successfully!');
      setSelectedCourse({ ...selectedCourse, chapters: [...selectedCourse.chapters, response.data] });
      setNewChapter({ title: '', description: '', videoFile: null, resourceFile: null });
    } catch (error) {
      console.error('Error adding chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for deleting a course or chapter
  const handleDeleteClick = (target, type) => {
    setDeleteTarget({ target, type });
    setShowDeleteModal(true);
  };

  // Confirm delete (course or chapter)
  const handleConfirmDelete = async () => {
    const { target, type } = deleteTarget;
    setLoading(true);

    try {
      if (type === 'course') {
        await axios.delete(`http://localhost:3000/api/courses/${target._id}`);
        setCourses(courses.filter((course) => course._id !== target._id));
        setSelectedCourse(null);
      } else if (type === 'chapter') {
        await axios.delete(`http://localhost:3000/api/chapters/${target._id}`);
        setSelectedCourse({
          ...selectedCourse,
          chapters: selectedCourse.chapters.filter((chapter) => chapter._id !== target._id)
        });
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Courses</h2>

      {selectedCourse ? (
        <div>
          <h3 className="subtitle">{selectedCourse.title}</h3>
          <p>Number of Chapters: {selectedCourse.chapters.length}</p>

          {/* Chapters list comes first */}
          <h4 className="subtitle">Chapters</h4>
          <div className="columns is-multiline">
            {selectedCourse.chapters.map((chapter) => (
              <div className="column is-one-third" key={chapter._id}>
                <div className="card">
                  <header className="card-header">
                    <p className="card-header-title">{chapter.title}</p>
                    <button
                      className="button is-danger is-small"
                      onClick={() => handleDeleteClick(chapter, 'chapter')}
                      disabled={loading}
                    >
                      <FaTrash />
                    </button>
                  </header>
                </div>
              </div>
            ))}
          </div>

          {/* Select chapter dropdown */}
          <div className="field">
            <label className="label">Select a Chapter</label>
            <div className="control">
              <div className="select">
                <select value={selectedChapter?._id || ''} onChange={(e) => setSelectedChapter(e.target.value)}>
                  <option value="" disabled>
                    Select a Chapter
                  </option>
                  {selectedCourse.chapters.map((chapter) => (
                    <option key={chapter._id} value={chapter._id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Add Chapter Form */}
          <form onSubmit={handleSubmit}>
            <h4>Add a New Chapter</h4>

            <div className="field">
              <label className="label">Chapter Title</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={newChapter.title}
                  onChange={(e) => handleChapterChange('title', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={newChapter.description}
                  onChange={(e) => handleChapterChange('description', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Video File</label>
              <div className="control">
                <input
                  type="file"
                  onChange={(e) => handleFileChange('videoFile', e.target.files[0])}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Resource File</label>
              <div className="control">
                <input
                  type="file"
                  onChange={(e) => handleFileChange('resourceFile', e.target.files[0])}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="field">
              <button type="submit" className={`button is-primary ${loading ? 'is-loading' : ''}`} disabled={loading}>
                {loading ? 'Adding Chapter...' : 'Add Chapter'}
              </button>
            </div>
          </form>

          <button className="button is-link" onClick={() => setSelectedCourse(null)} disabled={loading}>
            Back to Courses
          </button>

          {showDeleteModal && (
            <div className="modal is-active">
              <div className="modal-background"></div>
              <div className="modal-content">
                <div className="box">
                  <h4 className="subtitle">Are you sure you want to delete this {deleteTarget.type}?</h4>
                  <div className="buttons">
                    <button className="button is-danger" onClick={handleConfirmDelete} disabled={loading}>
                      Delete
                    </button>
                    <button className="button" onClick={() => setShowDeleteModal(false)} disabled={loading}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="columns is-multiline">
          {courses.map((course) => (
            <div className="column is-one-third" key={course._id}>
              <div className="card" onClick={() => selectCourse(course)}>
                <header className="card-header">
                  <p className="card-header-title">{course.title}</p>
                  <button
                    className="button is-danger is-small"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleDeleteClick(course, 'course');
                    }}
                    disabled={loading}
                  >
                    <FaTrash />
                  </button>
                </header>
                <div className="card-content">
                  <div className="content">
                    <p>{course.description}</p>
                    <p>Number of Chapters: {course.chapters.length}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesList;
