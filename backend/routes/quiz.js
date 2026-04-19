const express = require('express');
const router = express.Router();
const Hiragana = require('../models/Hiragana');
const Katakana = require('../models/Katakana');
const Kanji = require('../models/Kanji');
const Vocabulary = require('../models/Vocabulary');
const Grammar = require('../models/Grammar');

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function pickWrong(pool, correct, field, count = 3) {
    const others = pool.filter((item) => {
        const val = typeof field === 'function' ? field(item) : item[field];
        return val !== correct;
    });
    return shuffle(others)
        .slice(0, count)
        .map((item) => (typeof field === 'function' ? field(item) : item[field]));
}

// Safely get first meaning — handles string[], JSON string, or plain "a, b, c"
function getFirstMeaning(val) {
    if (!val) return '';
    if (Array.isArray(val)) return String(val[0] || '').trim();
    try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return String(parsed[0] || '').trim();
    } catch { }
    return String(val).split(',')[0].trim();
}

// Safely get first reading — handles [{reading,romaji}], string[], or plain string
function getFirstReading(val) {
    if (!val) return '';
    if (Array.isArray(val)) {
        const first = val[0];
        if (!first) return '';
        if (typeof first === 'object') return first.reading || first.romaji || '';
        return String(first).trim();
    }
    try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
            const first = parsed[0];
            if (!first) return '';
            if (typeof first === 'object') return first.reading || first.romaji || '';
            return String(first).trim();
        }
    } catch { }
    return String(val).split(',')[0].trim();
}

// Safely get first example japanese sentence
function getFirstExample(val) {
    if (!val) return '';
    if (Array.isArray(val)) {
        const first = val[0];
        if (!first) return '';
        if (typeof first === 'object') return first.japanese || first.word || '';
        return String(first).trim();
    }
    try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
            const first = parsed[0];
            if (!first) return '';
            if (typeof first === 'object') return first.japanese || first.word || '';
            return String(first).trim();
        }
    } catch { }
    return String(val).split(',')[0].trim();
}

// GET /api/quiz/generate?type=kana-romaji|kanji-meaning|kanji-reading|vocab-meaning|grammar&level=N5&count=10
router.get('/generate', async (req, res) => {
    try {
        const { type = 'vocab-meaning', level = 'N5', count = 10 } = req.query;
        const questions = [];

        if (type === 'kana-romaji') {
            const pool = shuffle(await Hiragana.find());
            const sample = pool.slice(0, Number(count));
            for (const item of sample) {
                const wrong = pickWrong(pool, item.romaji, 'romaji');
                if (wrong.length < 3) continue;
                questions.push({
                    question: item.character,
                    questionType: 'kana-romaji',
                    correctAnswer: item.romaji,
                    options: shuffle([item.romaji, ...wrong]),
                    hint: `Group: ${item.group}`
                });
            }

        } else if (type === 'katakana-romaji') {
            const pool = shuffle(await Katakana.find());
            const sample = pool.slice(0, Number(count));
            for (const item of sample) {
                const wrong = pickWrong(pool, item.romaji, 'romaji');
                if (wrong.length < 3) continue;
                questions.push({
                    question: item.character,
                    questionType: 'katakana-romaji',
                    correctAnswer: item.romaji,
                    options: shuffle([item.romaji, ...wrong]),
                    hint: `Group: ${item.group}`
                });
            }

        } else if (type === 'kanji-meaning') {
            const pool = await Kanji.find({ level });
            if (pool.length < 4) return res.status(400).json({ message: 'Not enough kanji for this level' });
            const sample = shuffle([...pool]).slice(0, Number(count));
            for (const item of sample) {
                const correct = getFirstMeaning(item.meanings);
                if (!correct) continue;
                const wrong = pickWrong(pool, correct, (k) => getFirstMeaning(k.meanings));
                if (wrong.length < 3) continue;
                questions.push({
                    question: item.character,
                    questionType: 'kanji-meaning',
                    correctAnswer: correct,
                    options: shuffle([correct, ...wrong]),
                    hint: `Stroke count: ${item.strokeCount || '?'}`
                });
            }

        } else if (type === 'kanji-reading') {
            const pool = await Kanji.find({ level });
            if (pool.length < 4) return res.status(400).json({ message: 'Not enough kanji for this level' });
            const sample = shuffle([...pool]).slice(0, Number(count));
            for (const item of sample) {
                const correct = getFirstReading(item.kunyomi) || getFirstReading(item.onyomi);
                if (!correct) continue;
                const wrong = pickWrong(pool, correct, (k) => getFirstReading(k.kunyomi) || getFirstReading(k.onyomi));
                if (wrong.length < 3) continue;
                questions.push({
                    question: item.character,
                    questionType: 'kanji-reading',
                    correctAnswer: correct,
                    options: shuffle([correct, ...wrong]),
                    hint: `Meaning: ${getFirstMeaning(item.meanings)}`
                });
            }

        } else if (type === 'vocab-meaning') {
            const pool = await Vocabulary.find({ level });
            if (pool.length < 4) return res.status(400).json({ message: 'Not enough vocabulary for this level' });
            const sample = shuffle([...pool]).slice(0, Number(count));
            for (const item of sample) {
                if (!item.meaning) continue;
                const wrong = pickWrong(pool, item.meaning, 'meaning');
                if (wrong.length < 3) continue;
                // reading can be string or { kana, romaji }
                const readingDisplay = typeof item.reading === 'object'
                    ? (item.reading.kana || item.reading.romaji || '')
                    : (item.reading || '');
                questions.push({
                    question: `${item.word}${readingDisplay ? ` (${readingDisplay})` : ''}`,
                    questionType: 'vocab-meaning',
                    correctAnswer: item.meaning,
                    options: shuffle([item.meaning, ...wrong]),
                    hint: item.exampleSentence || ''
                });
            }

        } else if (type === 'grammar') {
            const pool = await Grammar.find({ level });
            if (pool.length < 4) return res.status(400).json({ message: 'Not enough grammar for this level' });
            const sample = shuffle([...pool]).slice(0, Number(count));
            for (const item of sample) {
                const correct = getFirstExample(item.examples);
                if (!correct) continue;
                const wrong = pickWrong(pool, correct, (g) => getFirstExample(g.examples));
                if (wrong.length < 3) continue;
                questions.push({
                    question: `Which sentence uses "${item.point}" correctly?`,
                    questionType: 'grammar',
                    correctAnswer: correct,
                    options: shuffle([correct, ...wrong]),
                    hint: item.explanation
                });
            }
        }

        if (!questions.length) {
            return res.status(400).json({ message: 'Not enough data to generate quiz. Please check your database.' });
        }

        res.json({ questions, type, level });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
