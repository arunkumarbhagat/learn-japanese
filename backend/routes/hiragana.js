const express = require('express');
const router = express.Router();
const Hiragana = require('../models/Hiragana');

router.get('/', async (req, res) => {
    try {
        const { group } = req.query;
        const filter = group ? { group } : {};
        const data = await Hiragana.find(filter).sort({ group: 1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/groups', async (req, res) => {
    try {
        const groups = await Hiragana.distinct('group');
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
