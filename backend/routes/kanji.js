const express = require('express');
const router = express.Router();
const Kanji = require('../models/Kanji');

router.get('/', async (req, res) => {
    try {
        const { level, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (level) filter.level = level;
        if (search) {
            filter.$or = [
                { character: { $regex: search, $options: 'i' } },
                { meanings: { $elemMatch: { $regex: search, $options: 'i' } } }
            ];
        }
        const total = await Kanji.countDocuments(filter);
        const data = await Kanji.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json({ data, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const kanji = await Kanji.findById(req.params.id);
        if (!kanji) return res.status(404).json({ message: 'Not found' });
        res.json(kanji);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
