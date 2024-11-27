import React, { useState, useEffect } from 'react';
import { fetchQuestions } from '../services/api';

function Quiz({ user }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await fetchQuestions(user.level);
      setQuestions(data);
    };
    fetchData();
  }, [user.level]);

  useEffect(() => {
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    if (timer === 0) nextQuestion();
    return () => clearInterval(interval);
  }, [timer]);

  const nextQuestion = () => {
    setTimer(30);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      alert(`Quiz complete! Your score: ${score}`);
    }
  };

  const handleAnswer = (index) => {
    if (index === questions[currentQuestionIndex].correctAnswer) setScore((prev) => prev + 1);
    nextQuestion();
  };

  return (
    <div>
      {questions.length > 0 && (
        <div>
          <h3>Level {user.level}</h3>
          <p>Time left: {timer}s</p>
          <p>{questions[currentQuestionIndex].question}</p>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <button key={index} onClick={() => handleAnswer(index)}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Quiz;
