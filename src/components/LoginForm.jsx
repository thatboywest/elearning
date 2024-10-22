import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext'; // Import NotificationContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext); // Get showNotification function
  const navigate = useNavigate(); // Use navigate for redirection

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://elearningbackend-obpd.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        login(data.token, data.user); // Save token and user data in context
        showNotification('Login successful!'); 
        // Show notification
        navigate('/');
        window.location.reload(); // Redirect to home page
      } else {
        showNotification(data.error); // Display error message as notification
      }
    } catch (error) {
      console.error('Login failed:', error);
      showNotification('An error occurred while trying to log in.');
    }
  };

  return (
    <div className="columns is-centered">
      <div className="column is-4">
        <div className="card">
          <div className="card-content">
            <h1 className="title has-text-centered">Login</h1>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <button className="button is-link is-light is-fullwidth" type="submit">
                    Login
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
