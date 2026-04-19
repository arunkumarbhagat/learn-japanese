const mongoose = require('mongoose');

const katakanaSchema = new mongoose.Schema({
    character: { type: String, required: true, unique: true },
    romaji: { type: String, required: true },
    group: { type: String, required: true },
    strokeCount: { type: Number },
    exampleWord: { type: String },
    exampleRomaji: { type: String },   // NEW
    exampleMeaning: { type: String },
    audioUrl: { type: String }
}, { strict: false });

module.exports = mongoose.model('Katakana', katakanaSchema);
