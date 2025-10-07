import React, { useState, useEffect } from 'react';
import socket from './socket';
import ChatBox from './ChatBox';

function Teacher() {
  const [question, setQuestion] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);
  const [results, setResults] = useState({});
  const [students, setStudents] = useState({});

  useEffect(() => {
    socket.on('poll-results', (data) => setResults(data));
    socket.on('student-list', (list) => setStudents(list));

    return () => {
      socket.off('poll-results');
      socket.off('student-list');
    };
  }, []);

  const askQuestion = () => {
    if (question.trim() === '') return;
    socket.emit('ask-question', { question, timeLimit });
    setQuestion('');
  };

  const removeStudent = (id) => {
    socket.emit('remove-student', id);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Teacher Panel</h2>

      <input
        type="text"
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Time limit (seconds)"
        value={timeLimit}
        onChange={(e) => setTimeLimit(Number(e.target.value))}
        style={styles.input}
      />
      <button onClick={askQuestion} style={styles.button}>Ask Question</button>

      <h3 style={styles.subheading}>Students</h3>
      <ul style={styles.list}>
        {Object.entries(students).map(([id, name]) => (
          <li key={id} style={styles.listItem}>
            {name}
            <button onClick={() => removeStudent(id)} style={styles.kickButton}>Kick</button>
          </li>
        ))}
      </ul>

      <h3 style={styles.subheading}>Results</h3>
      <ul style={styles.list}>
        {Object.entries(results).map(([id, answer]) => (
          <li key={id} style={styles.listItem}>{answer}</li>
        ))}
      </ul>

      <ChatBox name="Teacher" role="teacher" />
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#F2F2F2'
  },
  heading: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#373737'
  },
  subheading: {
    fontSize: '20px',
    marginTop: '30px',
    marginBottom: '10px',
    color: '#6E6E6E'
  },
  input: {
    display: 'block',
    marginBottom: '10px',
    padding: '10px',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4F0DCE',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  kickButton: {
    backgroundColor: '#5767D0',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Teacher;