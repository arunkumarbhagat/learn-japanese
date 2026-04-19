import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HiraganaPage from './pages/HiraganaPage';
import KatakanaPage from './pages/KatakanaPage';
import KanjiPage from './pages/KanjiPage';
import VocabularyPage from './pages/VocabularyPage';
import GrammarPage from './pages/GrammarPage';
import PracticePage from './pages/PracticePage';
import TestPage from './pages/TestPage';
import TestExamPage from './pages/TestExamPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hiragana" element={<HiraganaPage />} />
        <Route path="/katakana" element={<KatakanaPage />} />
        <Route path="/kanji" element={<KanjiPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/grammar" element={<GrammarPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/tests" element={<TestPage />} />
        <Route path="/tests/:id" element={<TestExamPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1a2e', color: '#e2e8f0', border: '1px solid #2a2a4a' }
        }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
