import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import VocabCard from '../components/VocabCard';
import { FiSearch } from 'react-icons/fi';

const LEVELS = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];

export default function VocabularyPage() {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [level, setLevel] = useState('All');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const fetchVocab = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 24 };
            if (level !== 'All') params.level = level;
            if (search) params.search = search;
            const { data: res } = await api.get('/vocabulary', { params });
            setData(res.data);
            setTotal(res.total);
            setPages(res.pages);
        } finally {
            setLoading(false);
        }
    }, [level, search, page]);

    useEffect(() => { fetchVocab(); }, [fetchVocab]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Vocabulary <span className="japanese" style={{ color: 'var(--n5)' }}>語彙</span></h1>
                <p>{total} words across N5–N1 levels</p>
            </div>

            <div className="filter-bar">
                {LEVELS.map(l => (
                    <button key={l} className={`filter-btn ${level === l ? 'active' : ''}`} onClick={() => { setLevel(l); setPage(1); }}>{l}</button>
                ))}
            </div>

            <div className="search-bar">
                <FiSearch className="search-icon" />
                <input
                    placeholder="Search word, reading, or meaning..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
            </div>

            {loading ? (
                <div className="loading-spinner"><div className="spinner" /></div>
            ) : data.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">語</div>
                    <p>No vocabulary found. Try seeding the database first.</p>
                </div>
            ) : (
                <>
                    <div className="grid-3">
                        {data.map(v => <VocabCard key={v._id} vocab={v} />)}
                    </div>
                    {pages > 1 && (
                        <div className="pagination">
                            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                                <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
