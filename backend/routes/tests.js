const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

// GET /api/tests?level=N5
router.get('/', async (req, res) => {
    try {
        const { level } = req.query;
        const filter = level ? { level } : {};
        const tests = await Test.find(filter).select('title level timeLimit createdAt');
        res.json(tests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/tests/:id
router.get('/:id', async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) return res.status(404).json({ message: 'Test not found' });
        // Strip correct answers before sending
        const sanitized = JSON.parse(JSON.stringify(test));
        ['vocabulary', 'grammar', 'reading', 'listening'].forEach((section) => {
            if (sanitized.sections[section]) {
                sanitized.sections[section] = sanitized.sections[section].map((q) => {
                    const { correctAnswer, ...rest } = q;
                    return rest;
                });
            }
        });
        res.json(sanitized);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/tests/:id/submit
router.post('/:id/submit', protect, async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        const { answers } = req.body; // { questionId: selectedAnswer }
        const sectionScores = { vocabulary: 0, grammar: 0, reading: 0, listening: 0 };
        const sectionTotals = { vocabulary: 0, grammar: 0, reading: 0, listening: 0 };
        const results = [];

        ['vocabulary', 'grammar', 'reading', 'listening'].forEach((section) => {
            test.sections[section]?.forEach((q) => {
                sectionTotals[section]++;
                const userAnswer = answers[q._id.toString()];
                const correct = userAnswer === q.correctAnswer;
                if (correct) sectionScores[section]++;
                results.push({ questionId: q._id, correct, correctAnswer: q.correctAnswer, userAnswer });
            });
        });

        const totalScore = Object.values(sectionScores).reduce((a, b) => a + b, 0);
        const totalQuestions = Object.values(sectionTotals).reduce((a, b) => a + b, 0);

        // Save to progress
        const progress = await Progress.findOne({ user: req.user._id });
        if (progress) {
            progress.testHistory.push({
                testId: test._id,
                level: test.level,
                score: totalScore,
                total: totalQuestions,
                sectionScores
            });
            await progress.save();
        }

        res.json({ totalScore, totalQuestions, sectionScores, sectionTotals, results });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
