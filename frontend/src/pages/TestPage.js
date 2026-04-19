import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './TestPage.css';

const LEVELS = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];

export default function TestPage() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [level, setLevel] = useState('All');

    useEffect(() => {
        setLoading(true);
        const params = level !== 'All' ? { level } : {};
        api.get('/tests', { params }).then(r => { setTests(r.data); setLoading(false); });
    }, [level]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>JLPT Test Mode <span style={{ color: 'var(--n1)' }}>📝</span></h1>
                <p>Structured JLPT-style exams with vocabulary, grammar, reading, and listening sections</p>
            </div>

            <div className="test-info-banner">
                <div className="info-item"><span>⏱</span> Timed exam (105 min)</div>
                <div className="info-item"><span>📚</span> 4 sections</div>
                <div className="info-item"><span>📊</span> Score breakdown</div>
                <div className="info-item"><span>🎯</span> JLPT format</div>
            </div>

            <div className="filter-bar">
                {LEVELS.map(l => (
                    <button key={l} className={`filter-btn ${level === l ? 'active' : ''}`} onClick={() => setLevel(l)}>{l}</button>
                ))}
            </div>

            {loading ? (
                <div className="loading-spinner"><div className="spinner" /></div>
            ) : tests.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">📝</div>
                    <p>No tests found. Please seed the database.</p>
                </div>
            ) : (
                <div className="tests-grid">
                    {tests.map(test => (
                        <div key={test._id} className="test-card">
                            <div className="test-card-header">
                                <span className={`level-badge level-${test.level}`}>{test.level}</span>
                                <span className="test-time">⏱ {test.timeLimit} min</span>
                            </div>
                            <h3 className="test-title">{test.title}</h3>
                            <div className="test-sections">
                                <span>📖 Vocabulary</span>
                                <span>✏️ Grammar</span>
                                <span>📄 Reading</span>
                                <span>🎧 Listening</span>
                            </div>
                            <Link to={`/tests/${test._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                Start Test
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
