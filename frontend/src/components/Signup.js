import React, { useState } from 'react';

function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isSignUp, setIsSignUp] = useState(true); // This state will toggle between signup and login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isSignUp ? 'Signup Data:' : 'Login Data:', formData);
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp); // Toggle between signup and login
  };

  const styles = {
    homeContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(4, 12, 40, 0.9)', // dark blue
      backdropFilter: 'blur(2px)',
    },
    formBox: {
      background: 'rgba(240, 248, 255, 0.1)', // light bluish glass
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '50px',
      maxWidth: '480px',
      width: '90%',
      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
    },
    heading: {
      fontSize: '28px',
      marginBottom: '25px',
      color: '#ffffff',
      textAlign: 'center',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
    },
    input: {
      padding: '14px',
      borderRadius: '8px',
      border: 'none',
      outline: 'none',
      fontSize: '17px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: '#fff',
    },
    button: {
      padding: '14px',
      backgroundColor: '#2196f3',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '17px',
    },
    signinText: {
      marginTop: '18px',
      textAlign: 'center',
      color: '#ccc',
      fontSize: '15px',
    },
    signinLink: {
      color: '#90caf9',
      textDecoration: 'underline',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.homeContainer}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>{isSignUp ? 'Signup to SankatMochan.ai' : 'Login to SankatMochan.ai'}</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit">{isSignUp ? 'Signup' : 'Login'}</button>
        </form>
        <p style={styles.signinText}>
          {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'} 
          <span style={styles.signinLink} onClick={toggleForm}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Home;
