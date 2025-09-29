import React, { useEffect, useState } from 'react';
import '../styles/FAQ.css';

const faqData = [
  {
    question: 'Why does my cat run around like crazy at night?',
    answer: 'Cats are naturally nocturnal. They have bursts of energy called zoomies, often late at night.',
  },
  {
    question: 'Why is my cat always scratching the furniture?',
    answer: 'Scratching helps cats mark territory, stretch muscles, and sharpen claws. Try using a scratching post!',
  },
  {
    question: 'Why does my cat stare at nothing?',
    answer: 'Cats have great senses and might notice things we can’t—like tiny movements or sounds.',
  },
];

export default function FAQ() {
  useEffect(() => {
    document.title = 'MeowLife - FAQ';
  }, []);

  const [openIndex, setOpenIndex] = useState(null);

  function toggle(index) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="page faq-page">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
              onClick={() => toggle(index)}
            >
              {item.question}
            </button>
            {openIndex === index && (
              <div
                id={`faq-answer-${index}`}
                className="faq-answer"
              >
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
