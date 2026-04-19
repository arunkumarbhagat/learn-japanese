const mongoose = require('mongoose');

// reading can be a plain string OR { kana: "...", romaji: "..." }
const vocabularySchema = new mongoose.Schema({
    word: { type: String, required: true },
    reading: { type: mongoose.Schema.Types.Mixed }, // string or { kana, romaji }
    meaning: { type: String, required: true },
    level: { type: String, enum: ['N5', 'N4', 'N3', 'N2', 'N1'], required: true },
    exampleSentence: { type: String },
    exampleTranslation: { type: String },
    audioUrl: { type: String },
    partOfSpeech: { type: String }
}, { strict: false });

module.exports = mongoose.model('Vocabulary', vocabularySchema);
