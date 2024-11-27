import React, { useState, useEffect } from "react";
import axios from "axios";
import './styles.css';

const App = () => {
  const [teamId, setTeamId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [level, setLevel] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0); // Overall score across all levels
  const [levelScore, setLevelScore] = useState(0); // Score for the current level
  const [timer, setTimer] = useState(30);

  const toggleRegister = () => setIsRegistering(!isRegistering);

  const register = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/register", { team_id: teamId, password });
      alert(res.data.message);
      setIsRegistering(false);
    } catch (error) {
      alert(error.response.data.message || "Error during registration");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", { team_id: teamId, password });
      alert(res.data.message);
      setIsLoggedIn(true);
      fetchQuestions(level);
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  const fetchQuestions = async (level) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/questions/${level}`);
      setQuestions(res.data);
      setCurrentQuestion(0);
      setTimer(30);
      setLevelScore(0); // Reset level score at the start of each level
    } catch (error) {
      alert("Error fetching questions");
    }
  };

  const handleAnswer = async (answer) => {
    // If the answer is correct, increment the level score
    if (questions[currentQuestion].correctAnswer === answer) {
      setLevelScore((prevLevelScore) => prevLevelScore + 1);
    }

    // Check if this is the last question of the current level
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1); // Move to the next question
      setTimer(30); // Reset the timer for the next question
    } else {
      // End of questions for this level
      // Add the level score to the total score
      setScore((prevScore) => prevScore + levelScore);

      // If the player answered enough questions correctly, progress to the next level
      if (levelScore >= 3) {
        setLevel((prevLevel) => prevLevel + 1); // Move to the next level
        fetchQuestions(level + 1); // Fetch new questions for the next level
        setLevelScore(0); // Reset level score for the new level
      } else {
        // If score is not sufficient, trigger "Game Over" and reset level to 1
        alert("Game Over");
        setLevel(1); // Reset level to 1
        setScore(0); // Reset the total score
        setIsLoggedIn(false); // Log the player out
      }
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      handleAnswer(null); // Skip question on timer end
    }
  }, [timer]);

  return (
    <div>
      {!isLoggedIn ? (
        <div>
          <h1>{isRegistering ? "Team Registration" : "Team Login"}</h1>
          <input
            type="text"
            placeholder="Team ID"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isRegistering ? (
            <button onClick={register}>Register</button>
          ) : (
            <button onClick={login}>Login</button>
          )}
          <button onClick={toggleRegister}>
            {isRegistering ? "Back to Login" : "Register a Team"}
          </button>
        </div>
      ) : (
        <div className="quiz-container">
          <h1>Level {level}</h1>
          <h2>Overall Score: {score}</h2> {/* Show overall score */}
          <h2>Level Score: {levelScore}</h2> {/* Show score for the current level */}
          <h2>Time: {timer}s</h2>
          {questions.length > 0 && (
            <div>
              <h3 className="question">{questions[currentQuestion].question}</h3>
              <ul className="options">
                {questions[currentQuestion].options.map((option, index) => (
                  <li key={index} onClick={() => handleAnswer(option)}>
                    {option}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleAnswer(null)}>Skip Question</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
