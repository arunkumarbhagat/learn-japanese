const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

// GET /api/progress
router.get('/', protect, async (req, res) => {
    try {
        const progress = await Progress.findOne({ user: req.user._id });
        if (!progress) return res.status(404).json({ message: 'Progress not found' });
        res.json(progress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/progress/mark-learned
router.post('/mark-learned', protect, async (req, res) => {
    try {
        const { itemId, itemType } = req.body;
        const progress = await Progress.findOne({ user: req.user._id });
        if (!progress) return res.status(404).json({ message: 'Progress not found' });

        if (!progress.learnedItems[itemType].includes(itemId)) {
            progress.learnedItems[itemType].push(itemId);
        }
        progress.lastActive = new Date();
        await progress.save();
        res.json({ message: 'Marked as learned' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/progress/quiz-result
router.post('/quiz-result', protect, async (req, res) => {
    try {
        const { type, level, score, total } = req.body;
        const progress = await Progress.findOne({ user: req.user._id });
        if (!progress) return res.status(404).json({ message: 'Progress not found' });

        progress.quizHistory.push({ type, level, score, total });
        progress.lastActive = new Date();

        // Update weak areas
        if (score / total < 0.6) {
            const area = `${type}-${level}`;
            if (!progress.weakAreas.includes(area)) progress.weakAreas.push(area);
        }

        await progress.save();
        res.json({ message: 'Quiz result saved' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/progress/srs-review
router.post('/srs-review', protect, async (req, res) => {
    try {
        const { itemId, itemType, quality } = req.body; // quality: 0-5
        const progress = await Progress.findOne({ user: req.user._id });
        if (!progress) return res.status(404).json({ message: 'Progress not found' });

        let srsItem = progress.srsItems.find(
            (s) => s.itemId.toString() === itemId && s.itemType === itemType
        );

        if (!srsItem) {
            progress.srsItems.push({ itemId, itemType });
            srsItem = progress.srsItems[progress.srsItems.length - 1];
        }

        // SM-2 algorithm
        if (quality >= 3) {
            if (srsItem.repetitions === 0) srsItem.interval = 1;
            else if (srsItem.repetitions === 1) srsItem.interval = 6;
            else srsItem.interval = Math.round(srsItem.interval * srsItem.easeFactor);
            srsItem.repetitions++;
        } else {
            srsItem.repetitions = 0;
            srsItem.interval = 1;
        }

        srsItem.easeFactor = Math.max(
            1.3,
            srsItem.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
        );
        srsItem.lastReview = new Date();
        srsItem.nextReview = new Date(Date.now() + srsItem.interval * 86400000);
        if (quality >= 3) srsItem.correct++;
        else srsItem.incorrect++;

        await progress.save();
        res.json({ nextReview: srsItem.nextReview, interval: srsItem.interval });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/progress/due-reviews
router.get('/due-reviews', protect, async (req, res) => {
    try {
        const progress = await Progress.findOne({ user: req.user._id });
        if (!progress) return res.status(404).json({ message: 'Progress not found' });
        const due = progress.srsItems.filter((s) => new Date(s.nextReview) <= new Date());
        res.json(due);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
