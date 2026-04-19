const mongoose = require('mongoose');

const reviewItemSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: ['kanji', 'vocabulary', 'grammar', 'hiragana', 'katakana'] },
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 1 },      // days
    repetitions: { type: Number, default: 0 },
    lastReview: { type: Date },
    nextReview: { type: Date, default: Date.now },
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 }
});

const progressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    learnedItems: {
        hiragana: [{ type: mongoose.Schema.Types.ObjectId }],
        katakana: [{ type: mongoose.Schema.Types.ObjectId }],
        kanji: [{ type: mongoose.Schema.Types.ObjectId }],
        vocabulary: [{ type: mongoose.Schema.Types.ObjectId }],
        grammar: [{ type: mongoose.Schema.Types.ObjectId }]
    },
    quizHistory: [{
        date: { type: Date, default: Date.now },
        type: String,
        level: String,
        score: Number,
        total: Number
    }],
    testHistory: [{
        testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        date: { type: Date, default: Date.now },
        level: String,
        score: Number,
        total: Number,
        sectionScores: {
            vocabulary: Number,
            grammar: Number,
            reading: Number,
            listening: Number
        }
    }],
    srsItems: [reviewItemSchema],
    weakAreas: [String],
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', progressSchema);
