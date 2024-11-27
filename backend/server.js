require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27018/quiz-app";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Team Schema
const teamSchema = new mongoose.Schema({
  team_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  score: { type: Number, default: 0 },
});

const Team = mongoose.model("Team", teamSchema);

// Question Schema
const questionSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
});

const Question = mongoose.model("Question", questionSchema);

// Team Registration
app.post("/api/register", async (req, res) => {
  const { team_id, password } = req.body;

  try {
    const existingTeam = await Team.findOne({ team_id });
    if (existingTeam) {
      return res.status(400).json({ message: "Team ID already exists" });
    }

    const newTeam = new Team({ team_id, password });
    await newTeam.save();
    res.status(201).json({ message: "Team registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Team login
app.post("/api/login", async (req, res) => {
  const { team_id, password } = req.body;

  try {
    const team = await Team.findOne({ team_id, password });
    if (!team) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json({ message: "Login successful", team_id: team.team_id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch questions based on level
app.get("/api/questions/:level", async (req, res) => {
  const { level } = req.params;

  try {
    const questions = await Question.find({ level: parseInt(level) });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update score
app.post("/api/score", async (req, res) => {
  const { team_id, score } = req.body;

  try {
    const team = await Team.findOneAndUpdate({ team_id }, { $inc: { score } }, { new: true });
    if (!team) {
      return res.status(400).json({ message: "Team not found" });
    }
    res.json({ message: "Score updated", totalScore: team.score });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const updateScoreInDB = async (newScore) => {
  try {
    const res = await axios.post("http://localhost:5000/api/update-score", {
      team_id: teamId,
      score: newScore,
    });
    alert("Score updated in the database");
  } catch (error) {
    console.error("Error updating score in the database:", error);
    alert("Failed to update score in the database");
  }
};

const handleAnswer = async (answer) => {
  if (questions[currentQuestion].correctAnswer === answer) {
    setLevelScore((prevLevelScore) => prevLevelScore + 1);
  }

  if (currentQuestion + 1 < questions.length) {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    setTimer(30);
  } else {
    setScore((prevScore) => prevScore + levelScore);
    updateScoreInDB(score + levelScore); // Send the score to the backend
    if (levelScore >= 3) {
      setLevel((prevLevel) => prevLevel + 1);
      fetchQuestions(level + 1);
    } else {
      alert("Game Over");
      setIsLoggedIn(false);
    }
  }
};
