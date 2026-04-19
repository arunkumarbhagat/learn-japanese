const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hiragana', require('./routes/hiragana'));
app.use('/api/katakana', require('./routes/katakana'));
app.use('/api/kanji', require('./routes/kanji'));
app.use('/api/vocabulary', require('./routes/vocabulary'));
app.use('/api/grammar', require('./routes/grammar'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/progress', require('./routes/progress'));

app.get('/', (req, res) => res.json({ message: 'Japanese Learning API running' }));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected to Japanesedb');
        app.listen(process.env.PORT, () =>
            console.log(`Server running on port ${process.env.PORT}`)
        );
    })
    .catch((err) => console.error('MongoDB connection error:', err));
