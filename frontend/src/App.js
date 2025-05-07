import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define routes for login and signup */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* Add a route for the home page or fallback route */}
        <Route path="/" element={<Login />} /> {/* You can replace Home with your home component */}
      </Routes>
    </Router>
  );
}

export default App;
