import React, { useEffect, useState } from 'react';
import '../styles/gallery.css';

const catData = [
  {
    name: 'Seven',
    description: 'Seven is my first adopted cat, and she is very soft, cute, and has special characteristics.',
    image: '/images/seven.jpg',
    alt: 'This is a domestic shorthair cat with gray, cream, and orange fur. She is looking straight ahead while a spotted banana is held near her face.',
    tag: 'seven',
  },
  {
    name: 'Six',
    description: 'Six is my second adopted cat. He is super smart and knows how to shake hands.',
    image: '/images/six.jpg',
    alt: 'A black and white kitten is sleeping in his cozy cat bed with a blue towel nearby.',
    tag: 'six',
  },
  {
    name: 'Five',
    description: 'Five is my third adopted cat. He loves singing, watching birds, and following his brother, Six.',
    image: '/images/five.jpg',
    alt: 'A light orange tabby cat sitting upright on a gray carpet, with its ears perked up and a curious expression. The background shows an open door and part of a closet with neatly arranged items.',
    tag: 'five',
  },
];

export default function Gallery() {
  useEffect(() => {
    document.title = 'MeowLife - Gallery';
  }, []);

  const [filter, setFilter] = useState('all');

  const filteredCats = filter === 'all'
    ? catData
    : catData.filter(cat => cat.tag === filter);

  return (
    <section className="page gallery-page">
      <h2>Gallery</h2>

      <div className="filter-group">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('seven')} className={filter === 'seven' ? 'active' : ''}>Seven</button>
        <button onClick={() => setFilter('six')} className={filter === 'six' ? 'active' : ''}>Six</button>
        <button onClick={() => setFilter('five')} className={filter === 'five' ? 'active' : ''}>Five</button>
      </div>

      <div className="card-grid">
        {filteredCats.map((cat, index) => (
          <div className="cat-card" key={index}>
            <img src={cat.image} alt={`Photo of ${cat.name}`} />
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
