import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import './DashboardPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export default function DashboardPage() {
    const { user } = useAuth();
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/progress').then(r => { setProgress(r.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

    const learned = progress?.learnedItems || {};
    const totalLearned = Object.values(learned).reduce((a, b) => a + (b?.length || 0), 0);

    const quizHistory = progress?.quizHistory?.slice(-10) || [];
    const testHistory = progress?.testHistory?.slice(-5) || [];
    const weakAreas = progress?.weakAreas || [];
    const dueReviews = progress?.srsItems?.filter(s => new Date(s.nextReview) <= new Date()) || [];

    const lineData = {
        labels: quizHistory.map((_, i) => `Quiz ${i + 1}`),
        datasets: [{
            label: 'Score %',
            data: quizHistory.map(q => q.total ? Math.round((q.score / q.total) * 100) : 0),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.1)',
            tension: 0.4,
            fill: true,
        }]
    };

    const donutData = {
        labels: ['Hiragana', 'Katakana', 'Kanji', 'Vocabulary', 'Grammar'],
        datasets: [{
            data: [
                learned.hiragana?.length || 0,
                learned.katakana?.length || 0,
                learned.kanji?.length || 0,
                learned.vocabulary?.length || 0,
                learned.grammar?.length || 0,
            ],
            backgroundColor: ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
            borderWidth: 0,
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: '#2a2a4a' } },
            y: { ticks: { color: '#64748b' }, grid: { color: '#2a2a4a' }, min: 0, max: 100 }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome back, {user?.username} 👋</p>
            </div>

            {/* Stats row */}
            <div className="dash-stats">
                {[
                    { label: 'Items Learned', value: totalLearned, icon: '📚', color: 'var(--primary)' },
                    { label: 'Quizzes Taken', value: progress?.quizHistory?.length || 0, icon: '✏️', color: 'var(--success)' },
                    { label: 'Tests Taken', value: progress?.testHistory?.length || 0, icon: '📝', color: 'var(--n4)' },
                    { label: 'Due Reviews', value: dueReviews.length, icon: '🔁', color: 'var(--warning)' },
                    { label: 'Streak', value: `${progress?.streak || 0} days`, icon: '🔥', color: 'var(--danger)' },
                ].map((s, i) => (
                    <div key={i} className="dash-stat-card">
                        <div className="dash-stat-icon" style={{ color: s.color }}>{s.icon}</div>
                        <div className="dash-stat-val" style={{ color: s.color }}>{s.value}</div>
                        <div className="dash-stat-lbl">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="dash-grid">
                {/* Quiz performance chart */}
                <div className="dash-card">
                    <h3>Quiz Performance</h3>
                    {quizHistory.length > 0 ? (
                        <Line data={lineData} options={chartOptions} />
                    ) : (
                        <div className="empty-state" style={{ padding: '30px' }}>
                            <p>No quiz history yet. Start practicing!</p>
                        </div>
                    )}
                </div>

                {/* Learned items donut */}
                <div className="dash-card">
                    <h3>Learned Items</h3>
                    {totalLearned > 0 ? (
                        <div className="donut-wrapper">
                            <Doughnut data={donutData} options={{ responsive: true, plugins: { legend: { labels: { color: '#94a3b8' } } } }} />
                        </div>
                    ) : (
                        <div className="empty-state" style={{ padding: '30px' }}>
                            <p>Start learning to track progress!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Weak areas */}
            {weakAreas.length > 0 && (
                <div className="dash-section">
                    <h3>Weak Areas</h3>
                    <div className="weak-areas">
                        {weakAreas.map((area, i) => (
                            <div key={i} className="weak-tag">{area.replace('-', ' ')}</div>
                        ))}
                    </div>
                </div>
            )}

            {/* Test history */}
            {testHistory.length > 0 && (
                <div className="dash-section">
                    <h3>Recent Tests</h3>
                    <div className="test-history">
                        {testHistory.map((t, i) => (
                            <div key={i} className="test-history-item">
                                <span className={`level-badge level-${t.level}`}>{t.level}</span>
                                <span className="th-date">{new Date(t.date).toLocaleDateString()}</span>
                                <span className="th-score">{t.score}/{t.total}</span>
                                <div className="th-bar">
                                    <div className="th-fill" style={{ width: `${(t.score / t.total) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SRS due */}
            {dueReviews.length > 0 && (
                <div className="dash-section">
                    <h3>Due for Review ({dueReviews.length})</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        You have {dueReviews.length} items due for spaced repetition review.
                    </p>
                </div>
            )}
        </div>
    );
}
