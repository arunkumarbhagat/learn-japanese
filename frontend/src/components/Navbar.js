import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import './Navbar.css';

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/hiragana', label: 'Hiragana' },
    { path: '/katakana', label: 'Katakana' },
    { path: '/kanji', label: 'Kanji' },
    { path: '/vocabulary', label: 'Vocabulary' },
    { path: '/grammar', label: 'Grammar' },
    { path: '/practice', label: 'Practice' },
    { path: '/tests', label: 'Tests' },
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-logo">
                    <span className="logo-jp">日</span>
                    <span className="logo-text">JapanLearn</span>
                </Link>

                <button className="navbar-toggle" onClick={() => setOpen(!open)}>
                    {open ? <FiX size={22} /> : <FiMenu size={22} />}
                </button>

                <div className={`navbar-links ${open ? 'open' : ''}`}>
                    {navLinks.map((l) => (
                        <Link
                            key={l.path}
                            to={l.path}
                            className={`nav-link ${location.pathname === l.path ? 'active' : ''}`}
                            onClick={() => setOpen(false)}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>

                <div className="navbar-actions">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="btn btn-secondary btn-sm">
                                <FiUser size={14} /> {user.username}
                            </Link>
                            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                                <FiLogOut size={14} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
