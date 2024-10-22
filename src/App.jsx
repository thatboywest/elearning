import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Courses from './components/Courses';

import ChaptersPage from './components/Chapterspage';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';


const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/signup" element={<SignupForm/>} />
      <Route path="/login" element={<LoginForm/>} />
      <Route path="/Admin" element={<Dashboard/>} />
      <Route path="/courses/:courseId" element={<ChaptersPage />} /> 
    </Routes>
  
  </Router>
);

export default App;
