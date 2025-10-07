import React, { useState, useEffect } from 'react';
import socket from './socket';
import ChatBox from './ChatBox';

function Student() {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [removed, setRemoved] = useState(false);

  const join = () => {
    if (name.trim() === '') return;
    socket.emit('student-join', name);
    setJoined(true);
  };

  const submitAnswer = () => {
    socket.emit('submit-answer', answer || 'No Answer');
    setSubmitted(true);
    setTimeLeft(null);
  };

  useEffect(() => {
    if (!joined) return;

    socket.on('new-question', ({ question, timeLimit }) => {
      setQuestion(question);
      setAnswer('');
      setSubmitted(false);
      setTimeLeft(timeLimit);
    });

    socket.on('poll-results', (data) => setResults(data));

    socket.on('removed', () => {
      setRemoved(true);
      setJoined(false);
    });

    return () => {
      socket.off('new-question');
      socket.off('poll-results');
      socket.off('removed');
    };
  }, [joined]);

  useEffect(() => {
    if (timeLeft === null || submitted) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (timeLeft === 0) {
      submitAnswer();
    }
  }, [timeLeft, submitted]);

  if (removed) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>You have been removed from the poll.</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {!joined ? (
        <div>
          <h2 style={styles.heading}>Enter your name to join</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={styles.input}
          />
          <button onClick={join} style={styles.button}>Join</button>
        </div>
      ) : (
        <div>
          <h2 style={styles.heading}>Question: {question}</h2>

          {!submitted ? (
            <>
              {timeLeft !== null && (
                <p style={styles.timer}>Time left: {timeLeft} seconds</p>
              )}
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer"
                style={styles.input}
              />
              <button onClick={submitAnswer} style={styles.button}>Submit</button>
            </>
          ) : (
            <div>
              <h3 style={styles.subheading}>Results</h3>
              <ul style={styles.list}>
                {Object.entries(results).map(([id, ans]) => (
                  <li key={id} style={styles.listItem}>{ans}</li>
                ))}
              </ul>
            </div>
          )}
          <ChatBox name={name} role="student" />
        </div>
      )}
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
  timer: {
    fontSize: '16px',
    color: '#5767D0',
    marginBottom: '10px'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    marginBottom: '8px'
  }
};

export default Student;