import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './GrammarPage.css';

const LEVELS = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];

function GrammarCard({ grammar }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="grammar-card">
            <div className="grammar-header" onClick={() => setOpen(!open)}>
                <div className="grammar-left">
                    <span className="grammar-point japanese">{grammar.point}</span>
                    {grammar.romaji && <span className="grammar-romaji">{grammar.romaji}</span>}
                    <span className={`level-badge level-${grammar.level}`}>{grammar.level}</span>
                </div>
                <div className="grammar-toggle">{open ? <FiChevronUp /> : <FiChevronDown />}</div>
            </div>

            {open && (
                <div className="grammar-body">
                    <p className="grammar-explanation">{grammar.explanation}</p>
                    {grammar.structure && (
                        <div className="grammar-structure">
                            <span className="structure-label">Structure:</span>
                            <code className="japanese">{grammar.structure}</code>
                        </div>
                    )}
                    {grammar.examples?.length > 0 && (
                        <div className="grammar-examples">
                            <div className="examples-label">Examples</div>
                            {grammar.examples.map((ex, i) => (
                                <div key={i} className="grammar-example">
                                    <div className="japanese example-jp">{ex.japanese}</div>
                                    <div className="example-en">{ex.english}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function GrammarPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [level, setLevel] = useState('All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (level !== 'All') params.level = level;
        if (search) params.search = search;
        api.get('/grammar', { params }).then(r => { setData(r.data); setLoading(false); });
    }, [level, search]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Grammar <span className="japanese" style={{ color: 'var(--warning)' }}>文法</span></h1>
                <p>{data.length} grammar patterns across N5–N1 levels</p>
            </div>

            <div className="filter-bar">
                {LEVELS.map(l => (
                    <button key={l} className={`filter-btn ${level === l ? 'active' : ''}`} onClick={() => setLevel(l)}>{l}</button>
                ))}
            </div>

            <div className="search-bar">
                <FiSearch className="search-icon" />
                <input
                    placeholder="Search grammar pattern..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="loading-spinner"><div className="spinner" /></div>
            ) : data.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">文</div>
                    <p>No grammar found. Try seeding the database first.</p>
                </div>
            ) : (
                <div className="grammar-list">
                    {data.map(g => <GrammarCard key={g._id} grammar={g} />)}
                </div>
            )}
        </div>
    );
}
