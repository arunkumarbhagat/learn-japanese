const mongoose = require('mongoose');

const grammarSchema = new mongoose.Schema({
    point: { type: String, required: true },
    romaji: { type: String },           // NEW — romaji of the grammar point
    level: { type: String, enum: ['N5', 'N4', 'N3', 'N2', 'N1'], required: true },
    explanation: { type: String, required: true },
    structure: { type: String },
    examples: [{ japanese: String, english: String }]
}, { strict: false });

module.exports = mongoose.model('Grammar', grammarSchema);
