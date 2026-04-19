import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import KanjiCard from '../components/KanjiCard';
import { FiSearch } from 'react-icons/fi';
import './KanjiPage.css';

const LEVELS = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];

export default function KanjiPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [level, setLevel] = useState(searchParams.get('level') || 'All');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const fetchKanji = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 24 };
            if (level !== 'All') params.level = level;
            if (search) params.search = search;
            const { data: res } = await api.get('/kanji', { params });
            setData(res.data);
            setTotal(res.total);
            setPages(res.pages);
        } finally {
            setLoading(false);
        }
    }, [level, search, page]);

    useEffect(() => { fetchKanji(); }, [fetchKanji]);

    const handleLevel = (l) => {
        setLevel(l);
        setPage(1);
        if (l !== 'All') setSearchParams({ level: l });
        else setSearchParams({});
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Kanji <span className="japanese" style={{ color: 'var(--n4)' }}>漢字</span></h1>
                <p>{total} kanji across N5–N1 levels</p>
            </div>

            <div className="filter-bar">
                {LEVELS.map(l => (
                    <button key={l} className={`filter-btn ${level === l ? 'active' : ''}`} onClick={() => handleLevel(l)}>{l}</button>
                ))}
            </div>

            <div className="search-bar">
                <FiSearch className="search-icon" />
                <input
                    placeholder="Search kanji or meaning..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
            </div>

            {loading ? (
                <div className="loading-spinner"><div className="spinner" /></div>
            ) : data.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">漢</div>
                    <p>No kanji found. Try seeding the database first.</p>
                </div>
            ) : (
                <>
                    <div className="grid-4">
                        {data.map(k => <KanjiCard key={k._id} kanji={k} />)}
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
