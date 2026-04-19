import React, { useEffect, useState } from 'react';
import api from '../services/api';
import KanaCard from '../components/KanaCard';
import FlashCard from '../components/FlashCard';
import './KanaPage.css';

const GROUP_ORDER = ['vowels', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'special'];
const GROUP_LABELS = { vowels: 'Vowels (ア行)', k: 'K-row (カ行)', s: 'S-row (サ行)', t: 'T-row (タ行)', n: 'N-row (ナ行)', h: 'H-row (ハ行)', m: 'M-row (マ行)', y: 'Y-row (ヤ行)', r: 'R-row (ラ行)', w: 'W-row (ワ行)', special: 'Special (ン)' };

export default function KatakanaPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('chart');
    const [flashIndex, setFlashIndex] = useState(0);

    useEffect(() => {
        api.get('/katakana').then(r => { setData(r.data); setLoading(false); });
    }, []);

    const grouped = GROUP_ORDER.reduce((acc, g) => {
        const items = data.filter(d => d.group === g);
        if (items.length) acc[g] = items;
        return acc;
    }, {});

    if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Katakana <span className="japanese" style={{ color: '#8b5cf6' }}>カタカナ</span></h1>
                <p>Used for foreign words, loanwords, and emphasis — 46 basic characters</p>
            </div>

            <div className="mode-toggle">
                <button className={`btn ${mode === 'chart' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('chart')}>📊 Chart View</button>
                <button className={`btn ${mode === 'flashcard' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('flashcard')}>🃏 Flashcards</button>
            </div>

            {mode === 'chart' ? (
                <div className="kana-groups">
                    {Object.entries(grouped).map(([group, items]) => (
                        <div key={group} className="kana-group">
                            <h3 className="group-title">{GROUP_LABELS[group] || group}</h3>
                            <div className="grid-5">
                                {items.map(item => <KanaCard key={item._id} {...item} />)}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flashcard-mode">
                    <div className="flashcard-nav">
                        <button className="btn btn-secondary" onClick={() => setFlashIndex(i => Math.max(0, i - 1))} disabled={flashIndex === 0}>← Prev</button>
                        <span className="flash-counter">{flashIndex + 1} / {data.length}</span>
                        <button className="btn btn-secondary" onClick={() => setFlashIndex(i => Math.min(data.length - 1, i + 1))} disabled={flashIndex === data.length - 1}>Next →</button>
                    </div>
                    {data[flashIndex] && (
                        <div className="flashcard-wrapper">
                            <FlashCard
                                front={data[flashIndex].character}
                                back={data[flashIndex].romaji}
                                frontSub={`Group: ${data[flashIndex].group}`}
                                backSub={data[flashIndex].exampleWord ? `${data[flashIndex].exampleWord} — ${data[flashIndex].exampleMeaning}` : ''}
                            />
                        </div>
                    )}
                    <div className="flashcard-progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${((flashIndex + 1) / data.length) * 100}%` }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
