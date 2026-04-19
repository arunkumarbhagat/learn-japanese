import React from 'react';
import './KanaCard.css';

export default function KanaCard({ character, romaji, exampleWord, exampleRomaji, exampleMeaning, strokeCount, audioUrl }) {
    const speak = (e) => {
        e.stopPropagation();
        if (audioUrl) {
            new Audio(audioUrl).play();
            return;
        }
        if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(character);
            utter.lang = 'ja-JP';
            window.speechSynthesis.speak(utter);
        }
    };

    return (
        <div className="kana-card">
            <div className="kana-char japanese">{character}</div>
            <div className="kana-romaji">{romaji}</div>
            {strokeCount && <div className="kana-strokes">{strokeCount} strokes</div>}

            {exampleWord && (
                <div className="kana-example">
                    <span className="japanese kana-ex-word">{exampleWord}</span>
                    {exampleRomaji && <span className="kana-ex-romaji">{exampleRomaji}</span>}
                    {exampleMeaning && <span className="kana-meaning">{exampleMeaning}</span>}
                </div>
            )}

            <button className="kana-audio-btn" onClick={speak} title="Play pronunciation">🔊</button>
        </div>
    );
}
