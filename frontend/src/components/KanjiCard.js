import React, { useState } from 'react';
import './KanjiCard.css';

function toArray(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
        return [parsed];
    } catch {
        return String(val).split(',').map(s => s.trim()).filter(Boolean);
    }
}

// Returns [{reading, romaji}] normalized from any format
function normalizeReadings(val) {
    const arr = toArray(val);
    return arr.map(item => {
        if (typeof item === 'object' && item !== null) {
            return { reading: item.reading || '', romaji: item.romaji || '' };
        }
        return { reading: String(item), romaji: '' };
    });
}

function getMeanings(val) {
    const arr = toArray(val);
    return arr.slice(0, 3).map(item =>
        typeof item === 'object' ? (item.meaning || JSON.stringify(item)) : String(item)
    ).join(', ') || '—';
}

export default function KanjiCard({ kanji }) {
    const [expanded, setExpanded] = useState(false);

    const speak = (e) => {
        e.stopPropagation();
        if (kanji.audioUrl) { new Audio(kanji.audioUrl).play(); return; }
        if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(kanji.character);
            utter.lang = 'ja-JP';
            window.speechSynthesis.speak(utter);
        }
    };

    const onyomi = normalizeReadings(kanji.onyomi);
    const kunyomi = normalizeReadings(kanji.kunyomi);
    const examples = toArray(kanji.examples);

    return (
        <div className={`kanji-card ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
            <div className="kanji-header">
                <div className="kanji-char japanese">{kanji.character}</div>
                <div className="kanji-meta">
                    <span className={`level-badge level-${kanji.level}`}>{kanji.level}</span>
                    {kanji.strokeCount && <span className="kanji-strokes">{kanji.strokeCount} strokes</span>}
                </div>
                <button className="kanji-audio" onClick={speak}>🔊</button>
            </div>

            <div className="kanji-meanings">{getMeanings(kanji.meanings)}</div>

            <div className="kanji-readings">
                {onyomi.length > 0 && (
                    <div className="reading-row">
                        <span className="reading-label">On:</span>
                        <div className="reading-list">
                            {onyomi.map((o, i) => (
                                <span key={i} className="reading-item">
                                    <span className="japanese">{o.reading}</span>
                                    {o.romaji && <span className="reading-romaji">({o.romaji})</span>}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {kunyomi.length > 0 && (
                    <div className="reading-row">
                        <span className="reading-label">Kun:</span>
                        <div className="reading-list">
                            {kunyomi.map((k, i) => (
                                <span key={i} className="reading-item">
                                    <span className="japanese">{k.reading}</span>
                                    {k.romaji && <span className="reading-romaji">({k.romaji})</span>}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {expanded && examples.length > 0 && (
                <div className="kanji-examples">
                    <div className="examples-title">Examples</div>
                    {examples.map((ex, i) => {
                        if (typeof ex === 'object' && ex !== null) {
                            return (
                                <div key={i} className="example-item">
                                    <span className="japanese example-word">{ex.word}</span>
                                    {ex.reading && <span className="example-reading japanese">({ex.reading})</span>}
                                    {ex.meaning && <span className="example-meaning">— {ex.meaning}</span>}
                                </div>
                            );
                        }
                        return <div key={i} className="example-item"><span className="japanese">{String(ex)}</span></div>;
                    })}
                </div>
            )}

            <div className="kanji-expand-hint">{expanded ? '▲ Less' : '▼ More'}</div>
        </div>
    );
}
