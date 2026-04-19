import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './TestExamPage.css';

const SECTIONS = ['vocabulary', 'grammar', 'reading', 'listening'];
const SECTION_ICONS = { vocabulary: '📖', grammar: '✏️', reading: '📄', listening: '🎧' };

function useTimer(initialSeconds, onExpire) {
    const [seconds, setSeconds] = useState(initialSeconds);
    useEffect(() => {
        if (seconds <= 0) { onExpire(); return; }
        const t = setTimeout(() => setSeconds(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [seconds, onExpire]);
    return seconds;
}

export default function TestExamPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [phase, setPhase] = useState('intro'); // intro | exam | result
    const [activeSection, setActiveSection] = useState('vocabulary');
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get(`/tests/${id}`).then(r => { setTest(r.data); setLoading(false); });
    }, [id]);

    const handleExpire = useCallback(() => {
        toast('Time is up! Submitting...', { icon: '⏱' });
        submitTest();
    }, []); // eslint-disable-line

    const seconds = useTimer(
        phase === 'exam' && test ? test.timeLimit * 60 : 999999,
        handleExpire
    );

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const allQuestions = test ? SECTIONS.flatMap(s => (test.sections[s] || []).map(q => ({ ...q, section: s }))) : [];
    const totalQ = allQuestions.length;
    const answered = Object.keys(answers).length;

    const submitTest = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const { data } = await api.post(`/tests/${id}/submit`, { answers });
            setResult(data);
            setPhase('result');
        } catch (err) {
            if (!user) {
                toast.error('Login to save results');
                // Still show local result
                const localScore = allQuestions.filter(q => answers[q._id] === q.correctAnswer).length;
                setResult({ totalScore: localScore, totalQuestions: totalQ, sectionScores: {}, results: [] });
                setPhase('result');
            } else {
                toast.error('Failed to submit');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
    if (!test) return <div className="page-container"><p>Test not found.</p></div>;

    if (phase === 'intro') return (
        <div className="page-container">
            <div className="exam-intro">
                <div className={`level-badge level-${test.level}`} style={{ fontSize: '1rem', padding: '6px 20px', marginBottom: '16px' }}>{test.level}</div>
                <h1>{test.title}</h1>
                <div className="intro-stats">
                    <div className="intro-stat"><div className="stat-val">⏱ {test.timeLimit}</div><div className="stat-lbl">Minutes</div></div>
                    <div className="intro-stat"><div className="stat-val">📝 {totalQ}</div><div className="stat-lbl">Questions</div></div>
                    <div className="intro-stat"><div className="stat-val">📚 4</div><div className="stat-lbl">Sections</div></div>
                </div>
                <div className="intro-sections">
                    {SECTIONS.map(s => {
                        const qs = test.sections[s] || [];
                        return qs.length > 0 ? (
                            <div key={s} className="intro-section">
                                <span>{SECTION_ICONS[s]}</span>
                                <span style={{ textTransform: 'capitalize' }}>{s}</span>
                                <span className="section-count">{qs.length} questions</span>
                            </div>
                        ) : null;
                    })}
                </div>
                <div className="intro-note">⚠️ Once started, the timer cannot be paused.</div>
                <button className="btn btn-primary btn-lg" onClick={() => setPhase('exam')}>Start Exam</button>
            </div>
        </div>
    );

    if (phase === 'result') return (
        <div className="page-container">
            <div className="exam-result">
                <h2>Exam Complete</h2>
                <div className="result-score-big">
                    <span className="score-num">{result?.totalScore}</span>
                    <span className="score-sep">/</span>
                    <span className="score-total">{result?.totalQuestions}</span>
                </div>
                <div className="score-pct">{result ? Math.round((result.totalScore / result.totalQuestions) * 100) : 0}%</div>

                {result?.sectionScores && Object.keys(result.sectionScores).length > 0 && (
                    <div className="section-scores">
                        {SECTIONS.map(s => result.sectionScores[s] !== undefined ? (
                            <div key={s} className="section-score-item">
                                <span>{SECTION_ICONS[s]} {s}</span>
                                <span>{result.sectionScores[s]} / {result.sectionTotals?.[s] || '?'}</span>
                            </div>
                        ) : null)}
                    </div>
                )}

                <div className="result-actions">
                    <button className="btn btn-secondary" onClick={() => navigate('/tests')}>← Back to Tests</button>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>Retake</button>
                </div>
            </div>
        </div>
    );

    const sectionQuestions = test.sections[activeSection] || [];

    return (
        <div className="exam-layout">
            {/* Timer bar */}
            <div className="exam-topbar">
                <div className="exam-title">{test.title}</div>
                <div className={`exam-timer ${seconds < 300 ? 'urgent' : ''}`}>⏱ {formatTime(seconds)}</div>
                <div className="exam-progress">{answered}/{totalQ} answered</div>
            </div>

            <div className="exam-body">
                {/* Section tabs */}
                <div className="section-tabs">
                    {SECTIONS.map(s => {
                        const qs = test.sections[s] || [];
                        if (!qs.length) return null;
                        const sAnswered = qs.filter(q => answers[q._id]).length;
                        return (
                            <button
                                key={s}
                                className={`section-tab ${activeSection === s ? 'active' : ''}`}
                                onClick={() => setActiveSection(s)}
                            >
                                {SECTION_ICONS[s]} <span style={{ textTransform: 'capitalize' }}>{s}</span>
                                <span className="tab-count">{sAnswered}/{qs.length}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Questions */}
                <div className="exam-questions">
                    {sectionQuestions.map((q, i) => (
                        <div key={q._id} className="exam-question">
                            {q.passage && <div className="reading-passage japanese">{q.passage}</div>}
                            <div className="exam-q-text">
                                <span className="q-num">{i + 1}.</span>
                                <span>{q.question}</span>
                            </div>
                            <div className="exam-options">
                                {q.options?.map((opt, j) => (
                                    <button
                                        key={j}
                                        className={`exam-option ${answers[q._id] === opt ? 'selected' : ''}`}
                                        onClick={() => setAnswers(prev => ({ ...prev, [q._id]: opt }))}
                                    >
                                        <span className="opt-letter">{String.fromCharCode(65 + j)}</span>
                                        <span className="japanese">{opt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="exam-footer">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={submitTest}
                    disabled={submitting}
                >
                    {submitting ? 'Submitting...' : `Submit Exam (${answered}/${totalQ})`}
                </button>
            </div>
        </div>
    );
}
