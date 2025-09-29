import React, { useEffect, useRef, useState } from 'react';
import '../styles/settings.css';

export default function Settings({ theme, setTheme, displayName, setDisplayName }) {
  useEffect(() => {
    document.title = 'MeowLife - Settings';
  }, []);

  const dialogRef = useRef(null);
  const [newName, setNewName] = useState(displayName);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim().length >= 1) {
      setDisplayName(newName);
      closeModal();
    }
  };

  return (
    <section className="page settings-page">
      <h2>Settings</h2>

      <div className="setting-block">
        <p>Current Theme: <strong>{theme}</strong></p>
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
      </div>

      <div className="setting-block">
        <p>Current Display Name: <strong>{displayName}</strong></p>
        <button onClick={openModal}>Edit Name</button>
      </div>

      <dialog ref={dialogRef}>
        <form onSubmit={handleSubmit} className="modal-form">
          <label htmlFor="new-name">New Display Name:</label>
          <input
            type="text"
            id="new-name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <div className="modal-buttons">
            <button type="button" onClick={closeModal}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
