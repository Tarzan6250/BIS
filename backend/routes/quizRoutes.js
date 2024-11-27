const express = require('express');
const Question = require('../models/Question');
const router = express.Router();

router.get('/:level', async (req, res) => {
  const { level } = req.params;

  try {
    const questions = await Question.find({ level }).limit(5);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching questions.' });
  }
});

module.exports = router;
