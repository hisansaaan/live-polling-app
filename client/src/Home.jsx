import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Live Polling App</h1>
      <p style={styles.subtext}>Select your role to continue:</p>

      <div style={styles.buttonGroup}>
        <button onClick={() => navigate('/teacher')} style={styles.teacherButton}>
          I'm a Teacher
        </button>
        <button onClick={() => navigate('/student')} style={styles.studentButton}>
          I'm a Student
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#F2F2F2',
    padding: '40px'
  },
  heading: {
    fontSize: '36px',
    color: '#373737',
    marginBottom: '10px'
  },
  subtext: {
    fontSize: '18px',
    color: '#6E6E6E',
    marginBottom: '30px'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px'
  },
  teacherButton: {
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '8px',
    backgroundColor: '#5767D0',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  },
  studentButton: {
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '8px',
    backgroundColor: '#7765DA',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  }
};

export default Home;