import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './PracticePage.css';

const QUIZ_TYPES = [
    { value: 'kana-romaji', label: 'Hiragana → Romaji', icon: 'あ', level: false },
    { value: 'katakana-romaji', label: 'Katakana → Romaji', icon: 'ア', level: false },
    { value: 'kanji-meaning', label: 'Kanji → Meaning', icon: '漢', level: true },
    { value: 'kanji-reading', label: 'Kanji → Reading', icon: '読', level: true },
    { value: 'vocab-meaning', label: 'Vocabulary → Meaning', icon: '語', level: true },
    { value: 'grammar', label: 'Grammar Selection', icon: '文', level: true },
];

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

export default function PracticePage() {
    const { user } = useAuth();
    const [config, setConfig] = useState({ type: 'vocab-meaning', level: 'N5', count: 10 });
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [phase, setPhase] = useState('config'); // config | quiz | result
    const [loading, setLoading] = useState(false);

    const selectedType = QUIZ_TYPES.find(t => t.value === config.type);

    const startQuiz = async () => {
        setLoading(true);
        try {
            const params = { type: config.type, count: config.count };
            if (selectedType?.level) params.level = config.level;
            const { data } = await api.get('/quiz/generate', { params });
            if (!data.questions?.length) { toast.error('Not enough data. Please seed the database.'); return; }
            setQuestions(data.questions);
            setCurrent(0);
            setSelected(null);
            setAnswers([]);
            setPhase('quiz');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (option) => {
        if (selected !== null) return;
        setSelected(option);
        const correct = option === questions[current].correctAnswer;
        setAnswers(prev => [...prev, { question: questions[current], selected: option, correct }]);
    };

    const next = () => {
        if (current + 1 >= questions.length) {
            finishQuiz();
        } else {
            setCurrent(c => c + 1);
            setSelected(null);
        }
    };

    const finishQuiz = async () => {
        setPhase('result');
        const score = answers.filter(a => a.correct).length + (selected === questions[current]?.correctAnswer ? 1 : 0);
        if (user) {
            try {
                await api.post('/progress/quiz-result', {
                    type: config.type, level: config.level,
                    score, total: questions.length
                });
            } catch { }
        }
    };

    const score = answers.filter(a => a.correct).length;
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;

    if (phase === 'config') return (
        <div className="page-container">
            <div className="page-header">
                <h1>Practice Mode <span style={{ color: 'var(--danger)' }}>✏️</span></h1>
                <p>Auto-generated quizzes from the learning database</p>
            </div>

            <div className="practice-config">
                <div className="config-section">
                    <h3>Quiz Type</h3>
                    <div className="quiz-type-grid">
                        {QUIZ_TYPES.map(t => (
                            <button
                                key={t.value}
                                className={`quiz-type-btn ${config.type === t.value ? 'active' : ''}`}
                                onClick={() => setConfig(c => ({ ...c, type: t.value }))}
                            >
                                <span className="qt-icon japanese">{t.icon}</span>
                                <span className="qt-label">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {selectedType?.level && (
                    <div className="config-section">
                        <h3>JLPT Level</h3>
                        <div className="filter-bar">
                            {LEVELS.map(l => (
                                <button key={l} className={`filter-btn ${config.level === l ? 'active' : ''}`} onClick={() => setConfig(c => ({ ...c, level: l }))}>{l}</button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="config-section">
                    <h3>Number of Questions</h3>
                    <div className="count-options">
                        {[5, 10, 20, 30].map(n => (
                            <button key={n} className={`filter-btn ${config.count === n ? 'active' : ''}`} onClick={() => setConfig(c => ({ ...c, count: n }))}>{n}</button>
                        ))}
                    </div>
                </div>

                <button className="btn btn-primary btn-lg" onClick={startQuiz} disabled={loading}>
                    {loading ? 'Generating...' : '🚀 Start Quiz'}
                </button>
            </div>
        </div>
    );

    if (phase === 'result') return (
        <div className="page-container">
            <div className="result-screen">
                <div className="result-score-circle" style={{ '--pct': pct }}>
                    <div className="result-score-inner">
                        <div className="result-pct">{pct}%</div>
                        <div className="result-label">{score}/{questions.length}</div>
                    </div>
                </div>

                <h2 className="result-title">
                    {pct >= 80 ? '🎉 Excellent!' : pct >= 60 ? '👍 Good job!' : '📚 Keep practicing!'}
                </h2>

                <div className="result-breakdown">
                    {answers.map((a, i) => (
                        <div key={i} className={`result-item ${a.correct ? 'correct' : 'wrong'}`}>
                            <span className="result-q japanese">{a.question.question}</span>
                            <span className="result-ans">{a.correct ? '✓' : `✗ ${a.question.correctAnswer}`}</span>
                        </div>
                    ))}
                </div>

                <div className="result-actions">
                    <button className="btn btn-primary" onClick={() => { setPhase('config'); setQuestions([]); }}>Try Again</button>
                    <button className="btn btn-secondary" onClick={startQuiz}>Same Quiz</button>
                </div>
            </div>
        </div>
    );

    const q = questions[current];
    const progress = ((current) / questions.length) * 100;

    return (
        <div className="page-container">
            <div className="quiz-screen">
                <div className="quiz-progress-bar">
                    <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="quiz-meta">
                    <span>{current + 1} / {questions.length}</span>
                    <span className={`level-badge level-${config.level}`}>{config.level}</span>
                </div>

                <div className="quiz-question">
                    <div className="question-text japanese">{q.question}</div>
                    {q.hint && selected !== null && <div className="question-hint">💡 {q.hint}</div>}
                </div>

                <div className="quiz-options">
                    {q.options.map((opt, i) => {
                        let cls = 'quiz-option';
                        if (selected !== null) {
                            if (opt === q.correctAnswer) cls += ' correct';
                            else if (opt === selected) cls += ' wrong';
                        }
                        return (
                            <button key={i} className={cls} onClick={() => handleAnswer(opt)}>
                                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                                <span className="japanese">{opt}</span>
                            </button>
                        );
                    })}
                </div>

                {selected !== null && (
                    <button className="btn btn-primary btn-lg quiz-next" onClick={next}>
                        {current + 1 >= questions.length ? 'See Results' : 'Next →'}
                    </button>
                )}
            </div>
        </div>
    );
}
