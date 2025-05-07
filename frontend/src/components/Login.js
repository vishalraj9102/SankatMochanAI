import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      setErrorMessage('Both fields are required');
      return;
    }

    // Add your login logic here (e.g., send the email/password to the backend)
    console.log("Logging in with", email, password);

    // Reset form fields after successful login (optional)
    setEmail('');
    setPassword('');
    setErrorMessage(''); // Clear error message if login is successful
  };

  const styles = {
    loginContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'rgba(4, 12, 40, 0.9)', // dark blue transparent background
      backdropFilter: 'blur(3px)',
    },
    formBox: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)', // transparent form box
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '40px',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
    },
    heading: {
      marginBottom: '20px',
      fontSize: '28px',
      color: '#fff',
      textAlign: 'center',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    input: {
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: '#fff',
      fontSize: '16px',
      outline: 'none',
    },
    button: {
      padding: '12px',
      backgroundColor: '#1e88e5',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#1565c0',
    },
    paragraph: {
      marginTop: '20px',
      fontSize: '14px',
      textAlign: 'center',
      color: '#ccc',
    },
    link: {
      color: '#90caf9',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    linkHover: {
      textDecoration: 'none',
    },
    error: {
      color: '#ff6b6b',
      textAlign: 'center',
      marginBottom: '15px',
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Login to SankatMochan.ai</h2>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            aria-label="Email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            aria-label="Password"
          />
          <button 
            type="submit" 
            style={styles.button} 
            onMouseOver={(e) => e.target.style.backgroundColor = '#1565c0'} 
            onMouseOut={(e) => e.target.style.backgroundColor = '#1e88e5'}>
            Login
          </button>
        </form>
        <p style={styles.paragraph}>
          Don't have an account? <a href="/signup" style={styles.link}>Signup here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
