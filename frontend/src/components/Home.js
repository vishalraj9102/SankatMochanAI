import React from 'react';

function Home() {
  const styles = {
    homeContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f4f4f9',
      textAlign: 'center',
      padding: '20px',
    },
    heading: {
      marginBottom: '20px',
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#333',
    },
    paragraph: {
      fontSize: '18px',
      color: '#555',
      marginBottom: '30px',
    },
    aiToolSection: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '40px',
    },
    aiToolButton: {
      padding: '12px 20px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    aiToolButtonHover: {
      backgroundColor: '#0056b3',
    }
  };

  return (
    <div style={styles.homeContainer}>
      <h2 style={styles.heading}>Welcome to SankatMochan.ai</h2>
      <p style={styles.paragraph}>Discover the best AI tools based on your needs and prompts.</p>
      
      {/* AI Tool Finder UI Section */}
      <div style={styles.aiToolSection}>
        <button style={styles.aiToolButton}>
          Find AI Tool
        </button>
        {/* You can add more interactive elements or a form here for tool discovery */}
      </div>
    </div>
  );
}

export default Home;
