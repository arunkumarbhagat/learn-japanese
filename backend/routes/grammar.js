const express = require('express');
const router = express.Router();
const Grammar = require('../models/Grammar');

router.get('/', async (req, res) => {
    try {
        const { level, search } = req.query;
        const filter = {};
        if (level) filter.level = level;
        if (search) {
            filter.$or = [
                { point: { $regex: search, $options: 'i' } },
                { explanation: { $regex: search, $options: 'i' } }
            ];
        }
        const data = await Grammar.find(filter);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
