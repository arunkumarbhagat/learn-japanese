const mongoose = require('mongoose');

const kanjiSchema = new mongoose.Schema({
    character: { type: String, required: true, unique: true },
    onyomi: { type: mongoose.Schema.Types.Mixed },   // [{reading, romaji}] or string
    kunyomi: { type: mongoose.Schema.Types.Mixed },  // [{reading, romaji}] or string
    meanings: { type: mongoose.Schema.Types.Mixed }, // [String] or plain string
    strokeCount: { type: Number },
    level: { type: String, enum: ['N5', 'N4', 'N3', 'N2', 'N1'], required: true },
    examples: { type: mongoose.Schema.Types.Mixed }, // [{word,reading,meaning}] or string
    audioUrl: { type: String }
}, { strict: false });

module.exports = mongoose.model('Kanji', kanjiSchema);
