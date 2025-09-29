import React, { useState } from 'react';
import '../styles/navigation.css';

export default function Header({ onNavigate, currentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNav(page) {
    onNavigate(page);
    setMenuOpen(false); 
  }

  return (
    <header className="site-header">
      <a href="#main" className="skip-link">Skip to main content</a>
      <div className="nav-container">
        <h1 className="site-logo">MeowLife 🐾</h1>

        {}
        <button
          className="hamburger-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          ☰
        </button>

        {}
        <nav
          className={`site-nav ${menuOpen ? 'open' : ''}`}
          aria-label="Main Navigation"
        >
          <button
            onClick={() => handleNav('home')}
            className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('gallery')}
            className={`nav-button ${currentPage === 'gallery' ? 'active' : ''}`}
          >
            Gallery
          </button>

          <button
            onClick={() => handleNav('book')}
            className={`nav-button ${currentPage === 'book' ? 'active' : ''}`}
          >
            Book a Visit
          </button>

          <button
            onClick={() => handleNav('faq')}
            className={`nav-button ${currentPage === 'faq' ? 'active' : ''}`}
          >
            FAQ
          </button>

          <button
            onClick={() => handleNav('settings')}
            className={`nav-button ${currentPage === 'settings' ? 'active' : ''}`}
          >
            Settings
          </button>
          
        </nav>
      </div>
    </header>
  );
}
