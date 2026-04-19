const mongoose = require('mongoose');

const hiraganaSchema = new mongoose.Schema({
    character: { type: String, required: true, unique: true },
    romaji: { type: String, required: true },
    group: { type: String, required: true },
    strokeCount: { type: Number },
    exampleWord: { type: String },
    exampleRomaji: { type: String },   // NEW
    exampleMeaning: { type: String },
    audioUrl: { type: String }
}, { strict: false }); // strict:false allows any extra fields from MongoDB

module.exports = mongoose.model('Hiragana', hiraganaSchema);
