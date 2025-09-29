import React, { useEffect, useState } from 'react';
import '../styles/form.css';

export default function BookVisit() {
  useEffect(() => {
    document.title = 'MeowLife - Book a Visit';
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cat: '',
    customCat: '',
    time: '',
  });

  const [errors, setErrors] = useState({});
  const [submittedName, setSubmittedName] = useState('');


  function handleChange(e) {
    const { name, value } = e.target;
  
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  function validate() {
    const newErrors = {};

    if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.cat) {
      newErrors.cat = 'Please select a cat.';
    }

    if (formData.cat === 'other' && formData.customCat.trim() === '') {
      newErrors.customCat = 'Please describe the type of cat you like.';
    }

    if (!formData.time) {
      newErrors.time = 'Please select a time.';
    }

    return newErrors;
  }


  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmittedName(formData.name);
    }
  }

  return (
    <section className="page book-visit-page">
      <h2>Book a Visit</h2>
      <form onSubmit={handleSubmit} noValidate>
        {}
        <div className="form-group">
        <label htmlFor="name">
        Your Name: <span className="required">(* required)</span>
        </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-msg">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Your Email: <span className="required">(* required)</span>
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-msg">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="cat">
            Which cat do you want to visit? <span className="required">(* required)</span>
          </label>
          <select
            id="cat"
            name="cat"
            value={formData.cat}
            onChange={handleChange}
          >
            <option value="">-- Select a cat --</option>
            <option value="Seven">Seven</option>
            <option value="Six">Six</option>
            <option value="Five">Five</option>
            <option value="All">All</option>
            <option value="other">Other</option>
          </select>
          {errors.cat && <p className="error-msg">{errors.cat}</p>}
        </div>

        {formData.cat === 'other' && (
          <div className="form-group">
            <label htmlFor="customCat">
                Tell us what kind of cat you like: <span className="required">(* required)</span>
            </label>
            <input
              type="text"
              id="customCat"
              name="customCat"
              value={formData.customCat}
              onChange={handleChange}
            />
            {errors.customCat && <p className="error-msg">{errors.customCat}</p>}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="time">
            Preferred Time: <span className="required">(* required)</span>
          </label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          >
            <option value="">-- Select a time --</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
          {errors.time && <p className="error-msg">{errors.time}</p>}
        </div>

        <button type="submit">Submit</button>
      </form>

      {submittedName && (
        <p className="confirmation-msg">
          ✅ Thank you, {submittedName}! Your visit has been requested.
        </p>
      )}
    </section>
  );
}
