// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save token in localStorage and set user
  const login = (token, userData) => {
    localStorage.setItem('authToken', token);
    setUser(userData);  // This should contain user details, not just token
  };

  // Clear token and log out user
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);  // This will trigger a re-render
  };

  // Check if token exists in localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Fetch user data or decode token to get user details (if you have a function for it)
      setUser({ token });  // Consider replacing this with actual user data
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
