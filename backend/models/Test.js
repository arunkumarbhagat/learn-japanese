const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    type: { type: String, enum: ['vocabulary', 'grammar', 'reading', 'listening'] },
    question: String,
    options: [String],
    correctAnswer: String,
    passage: String,       // for reading questions
    audioUrl: String,      // for listening questions
    explanation: String
});

const testSchema = new mongoose.Schema({
    title: { type: String, required: true },
    level: { type: String, enum: ['N5', 'N4', 'N3', 'N2', 'N1'], required: true },
    sections: {
        vocabulary: [questionSchema],
        grammar: [questionSchema],
        reading: [questionSchema],
        listening: [questionSchema]
    },
    timeLimit: { type: Number, default: 105 }, // minutes
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);
