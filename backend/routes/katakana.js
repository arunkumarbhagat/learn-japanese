const express = require('express');
const router = express.Router();
const Katakana = require('../models/Katakana');

router.get('/', async (req, res) => {
    try {
        const { group } = req.query;
        const filter = group ? { group } : {};
        const data = await Katakana.find(filter).sort({ group: 1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/groups', async (req, res) => {
    try {
        const groups = await Katakana.distinct('group');
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
