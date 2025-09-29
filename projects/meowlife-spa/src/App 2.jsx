import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Gallery from './pages/Gallery.jsx';
import BookVisit from './pages/BookVisit.jsx';
import FAQ from './pages/FAQ.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState('light');
  const [displayName, setDisplayName] = useState('Guest');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  function renderPage() {
    const sharedProps = { displayName };
    if (currentPage === 'home') return <Home {...sharedProps} />; //应该修改的 因为没有displayName属性了 QAQ
    if (currentPage === 'gallery') return <Gallery />;
    if (currentPage === 'book') return <BookVisit />;
    if (currentPage === 'faq') return <FAQ />;
    if (currentPage === 'settings') return (
      <Settings
        theme={theme}
        setTheme={setTheme}
        displayName={displayName}
        setDisplayName={setDisplayName}
      />
    );
  }

  return (
    <div>
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      <main id="main">{renderPage()}</main>
    </div>
  );
}
