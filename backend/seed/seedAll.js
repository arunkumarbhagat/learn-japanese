const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Test = require('../models/Test');
const testData = require('./testData');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Japanesedb');
        console.log('Connected to MongoDB');

        // Only seed tests — all other data is already in MongoDB
        await Test.deleteMany({});
        await Test.insertMany(testData);
        console.log(`✓ Seeded ${testData.length} tests`);

        console.log('\n✅ Tests seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
