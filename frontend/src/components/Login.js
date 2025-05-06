import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here (e.g., send to backend API)
    console.log("Logging in with", email, password);
  };

  const styles = {
    loginContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f4f4f9',
      padding: '20px',
    },
    heading: {
      marginBottom: '20px',
      fontSize: '24px',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '400px',
    },
    input: {
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '16px',
    },
    button: {
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    paragraph: {
      marginTop: '15px',
      fontSize: '14px',
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
    },
    linkHover: {
      textDecoration: 'underline',
    },
  };

  return (
    <div style={styles.loginContainer}>
      <h2 style={styles.heading}>Login to SankatMochan.ai</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p style={styles.paragraph}>
        Don't have an account? <a href="/signup" style={styles.link}>Signup here</a>
      </p>
    </div>
  );
}

export default Login;
