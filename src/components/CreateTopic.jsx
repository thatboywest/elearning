import React, { useState } from 'react';
import axios from 'axios';

const CreateTopic = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [chapters, setChapters] = useState([{ title: '', description: '', videoFile: null, resourceFile: null }]);
  const [loading, setLoading] = useState(false);

  const handleCourseTitleChange = (e) => {
    setCourseTitle(e.target.value);
  };

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[index][field] = value;
    setChapters(updatedChapters);
  };

  const handleFileChange = (index, field, file) => {
    const updatedChapters = [...chapters];
    updatedChapters[index][field] = file;
    setChapters(updatedChapters);
  };

  const addChapter = () => {
    setChapters([...chapters, { title: '', description: '', videoFile: null, resourceFile: null }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!courseTitle.trim()) {
      alert('Course title is required');
      setLoading(false);
      return;
    }

    // Validate chapters
    for (const chapter of chapters) {
      if (!chapter.title.trim() || !chapter.description.trim()) {
        alert('Each chapter must have a title and description');
        setLoading(false);
        return;
      }
    }

    try {
      // Step 1: Create the course first
      const courseResponse = await axios.post('http://localhost:3000/api/courses', { title: courseTitle.trim() });
      const courseId = courseResponse.data._id;

      // Step 2: Create chapters and link them to the created course
      const chapterPromises = chapters.map((chapter) => {
        const formData = new FormData();
        formData.append('title', chapter.title.trim());
        formData.append('description', chapter.description.trim());
        formData.append('courseId', courseId); // Link chapter to the course

        if (chapter.videoFile) {
          formData.append('video', chapter.videoFile);
        }
        if (chapter.resourceFile) {
          formData.append('resource', chapter.resourceFile);
        }

        return axios.post('http://localhost:3000/api/chapters', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      await Promise.all(chapterPromises);

      alert('Course and chapters created successfully!');

      // Reset form
      setCourseTitle('');
      setChapters([{ title: '', description: '', videoFile: null, resourceFile: null }]);
    } catch (error) {
      console.error('Error creating course and chapters:', error.response?.data || error.message);
      alert('Error creating course and chapters: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Create a New Course Topic</h2>
      <form onSubmit={handleSubmit}>
        {/* Course Title Input */}
        <div className="field">
          <label className="label">Course Title</label>
          <div className="control">
            <input
              type="text"
              className="input"
              value={courseTitle}
              onChange={handleCourseTitleChange}
              placeholder="Enter course title"
              required
            />
          </div>
        </div>

        {/* Chapters */}
        <h3>Chapters</h3>
        {chapters.map((chapter, index) => (
          <div key={index} className="box">
            <div className="field">
              <label className="label">Chapter Title</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={chapter.title}
                  onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                  placeholder="Enter chapter title"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={chapter.description}
                  onChange={(e) => handleChapterChange(index, 'description', e.target.value)}
                  placeholder="Enter chapter description"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Video File</label>
              <div className="control">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(index, 'videoFile', e.target.files[0])}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Resource File</label>
              <div className="control">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(index, 'resourceFile', e.target.files[0])}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="field">
          <button type="button" className="button is-link" onClick={addChapter}>
            Add Another Chapter
          </button>
        </div>

        <div className="field">
          <button type="submit" className="button is-primary" disabled={loading}>
            {loading ? 'Creating Course...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTopic;
