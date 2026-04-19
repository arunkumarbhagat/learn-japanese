const express = require('express');
const router = express.Router();
const Vocabulary = require('../models/Vocabulary');

router.get('/', async (req, res) => {
    try {
        const { level, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (level) filter.level = level;
        if (search) {
            filter.$or = [
                { word: { $regex: search, $options: 'i' } },
                { meaning: { $regex: search, $options: 'i' } },
                { reading: { $regex: search, $options: 'i' } }
            ];
        }
        const total = await Vocabulary.countDocuments(filter);
        const data = await Vocabulary.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json({ data, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
