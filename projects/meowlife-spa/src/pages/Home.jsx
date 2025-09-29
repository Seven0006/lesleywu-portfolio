import React, { useEffect } from 'react';
import '../styles/home.css';

export default function Home({ displayName }) {
  useEffect(() => {
    document.title = 'MeowLife - Home';
  }, []);

  return (
    <section className="page home-page">
      <h2>Welcome to MeowLife 🐾</h2>
      <p className="greeting">Hi, I'm <strong>Lesley</strong>! 🐱's human.</p>
      <p>This is a cozy corner of the web where I share the adorable lives of my three cats.</p>

      <h3>Meet the Cats</h3>
      <ul className="cat-list">
        <li>
          <strong>Seven:</strong> Calm, curious, and always watching.
        </li>
        <li>
          <strong>Six:</strong> Energetic and loves chasing toys!
        </li>
        <li>
          <strong>Five:</strong> Shy but sweet, loves napping in boxes.
        </li>
      </ul>

      <p>Use the menu above to explore their gallery, book a visit, or read FAQs!</p>
    </section>
  );
}
