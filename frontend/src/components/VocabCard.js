import React, { useState } from 'react';
import './VocabCard.css';

// reading can be a plain string or { kana: "...", romaji: "..." }
function parseReading(reading) {
    if (!reading) return { kana: '', romaji: '' };
    if (typeof reading === 'object') {
        return { kana: reading.kana || '', romaji: reading.romaji || '' };
    }
    return { kana: String(reading), romaji: '' };
}

export default function VocabCard({ vocab }) {
    const [showExample, setShowExample] = useState(false);
    const { kana, romaji } = parseReading(vocab.reading);

    const speak = (e) => {
        e.stopPropagation();
        if (vocab.audioUrl) { new Audio(vocab.audioUrl).play(); return; }
        if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(vocab.word);
            utter.lang = 'ja-JP';
            window.speechSynthesis.speak(utter);
        }
    };

    return (
        <div className="vocab-card">
            <div className="vocab-top">
                <div>
                    <div className="vocab-word japanese">{vocab.word}</div>
                    <div className="vocab-reading">
                        {kana && <span className="japanese">{kana}</span>}
                        {romaji && <span className="vocab-romaji">{romaji}</span>}
                    </div>
                </div>
                <div className="vocab-right">
                    <span className={`level-badge level-${vocab.level}`}>{vocab.level}</span>
                    <button className="vocab-audio" onClick={speak}>🔊</button>
                </div>
            </div>

            <div className="vocab-meaning">{vocab.meaning}</div>

            {vocab.partOfSpeech && (
                <div className="vocab-pos">{vocab.partOfSpeech}</div>
            )}

            {vocab.exampleSentence && (
                <button className="vocab-example-toggle" onClick={() => setShowExample(!showExample)}>
                    {showExample ? 'Hide example' : 'Show example'}
                </button>
            )}

            {showExample && vocab.exampleSentence && (
                <div className="vocab-example">
                    <div className="japanese">{vocab.exampleSentence}</div>
                    {vocab.exampleTranslation && (
                        <div className="vocab-translation">{vocab.exampleTranslation}</div>
                    )}
                </div>
            )}
        </div>
    );
}
