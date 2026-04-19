import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const modules = [
    { path: '/hiragana', icon: 'あ', title: 'Hiragana', desc: '46 basic characters', color: '#6366f1' },
    { path: '/katakana', icon: 'ア', title: 'Katakana', desc: '46 basic characters', color: '#8b5cf6' },
    { path: '/kanji', icon: '漢', title: 'Kanji', desc: 'N5 to N1 levels', color: '#3b82f6' },
    { path: '/vocabulary', icon: '語', title: 'Vocabulary', desc: 'Words & phrases', color: '#10b981' },
    { path: '/grammar', icon: '文', title: 'Grammar', desc: 'Grammar patterns', color: '#f59e0b' },
    { path: '/practice', icon: '✏', title: 'Practice', desc: 'Auto-generated quizzes', color: '#ef4444' },
    { path: '/tests', icon: '📝', title: 'JLPT Tests', desc: 'Exam simulation', color: '#ec4899' },
];

const levels = [
    { level: 'N5', desc: 'Beginner', color: 'var(--n5)', kanji: '~100', vocab: '~800' },
    { level: 'N4', desc: 'Elementary', color: 'var(--n4)', kanji: '~300', vocab: '~1500' },
    { level: 'N3', desc: 'Intermediate', color: 'var(--n3)', kanji: '~650', vocab: '~3750' },
    { level: 'N2', desc: 'Upper-Intermediate', color: 'var(--n2)', kanji: '~1000', vocab: '~6000' },
    { level: 'N1', desc: 'Advanced', color: 'var(--n1)', kanji: '~2000', vocab: '~10000' },
];

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="home">
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-orb orb1" />
                    <div className="hero-orb orb2" />
                </div>
                <div className="hero-content">
                    <div className="hero-badge">🇯🇵 Japanese Learning Platform</div>
                    <h1 className="hero-title">
                        Master Japanese<br />
                        <span className="gradient-text">from N5 to N1</span>
                    </h1>
                    <p className="hero-desc">
                        Structured learning with hiragana, katakana, kanji, vocabulary, grammar,
                        dynamic practice quizzes, and real JLPT exam simulation.
                    </p>
                    <div className="hero-actions">
                        {user ? (
                            <Link to="/practice" className="btn btn-primary btn-lg">Start Practicing</Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                                <Link to="/hiragana" className="btn btn-secondary btn-lg">Explore Content</Link>
                            </>
                        )}
                    </div>
                    <div className="hero-stats">
                        <div className="stat"><span>46</span> Hiragana</div>
                        <div className="stat"><span>46</span> Katakana</div>
                        <div className="stat"><span>2000+</span> Kanji</div>
                        <div className="stat"><span>10000+</span> Vocabulary</div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="kana-grid">
                        {['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ'].map((c, i) => (
                            <div key={i} className="kana-bubble" style={{ animationDelay: `${i * 0.1}s` }}>{c}</div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modules */}
            <section className="section page-container">
                <h2 className="section-title">Learning Modules</h2>
                <div className="modules-grid">
                    {modules.map((m) => (
                        <Link key={m.path} to={m.path} className="module-card">
                            <div className="module-icon" style={{ background: `${m.color}20`, color: m.color }}>
                                <span className="japanese">{m.icon}</span>
                            </div>
                            <div className="module-info">
                                <div className="module-title">{m.title}</div>
                                <div className="module-desc">{m.desc}</div>
                            </div>
                            <div className="module-arrow">→</div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* JLPT Levels */}
            <section className="section page-container">
                <h2 className="section-title">JLPT Levels</h2>
                <div className="levels-grid">
                    {levels.map((l) => (
                        <div key={l.level} className="level-card">
                            <div className="level-tag" style={{ color: l.color, borderColor: l.color }}>{l.level}</div>
                            <div className="level-desc">{l.desc}</div>
                            <div className="level-stats">
                                <span>Kanji: {l.kanji}</span>
                                <span>Vocab: {l.vocab}</span>
                            </div>
                            <Link to={`/kanji?level=${l.level}`} className="level-link" style={{ color: l.color }}>
                                Study {l.level} →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="section page-container">
                <h2 className="section-title">Features</h2>
                <div className="grid-3">
                    {[
                        { icon: '🎯', title: 'Dynamic Quizzes', desc: 'Auto-generated practice from your learning data with smart wrong-answer selection.' },
                        { icon: '📋', title: 'JLPT Exam Simulation', desc: 'Timed tests with vocabulary, grammar, reading, and listening sections.' },
                        { icon: '🧠', title: 'Spaced Repetition', desc: 'SM-2 algorithm schedules reviews at optimal intervals for long-term retention.' },
                        { icon: '📊', title: 'Progress Tracking', desc: 'Dashboard with charts showing your learning history and weak areas.' },
                        { icon: '🔊', title: 'Audio Pronunciation', desc: 'Native Japanese text-to-speech for every character, word, and sentence.' },
                        { icon: '📱', title: 'Mobile Friendly', desc: 'Fully responsive design works on any device, anywhere.' },
                    ].map((f, i) => (
                        <div key={i} className="feature-card card">
                            <div className="feature-icon">{f.icon}</div>
                            <div className="feature-title">{f.title}</div>
                            <div className="feature-desc">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
