import { useState } from 'react';

export default function AdminInventory({
  cards,
  onAddCard,
  onToggleActive,
  onDeleteCard,
  onUpdateCard,
}) {

  const [form, setForm] = useState({
    playerName: '',
    team: '',
    year: '',
    brand: '',
    parallel: '',
    price: '',
    stock: '',
    isLimited: false,
    printRun: '',
    serialNumber: '',
    isGraded: false,
    gradeCompany: '',
    grade: '',
    imageUrl: '',
  });
  const [formError, setFormError] = useState('');

  const [editCardId, setEditCardId] = useState(null);
  const [editForm, setEditForm] = useState({
    price: '',
    stock: '',
    imageUrl: '',
  });
  const [editError, setEditError] = useState('');

  function handleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleToggle(field) {
    setForm((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }

  function validateForm() {
    if (!form.playerName.trim() || !form.team.trim() || !form.brand.trim()) {
      return 'Player, team, and brand are required.';
    }
    if (!form.imageUrl.trim()) {
      return 'Image URL is required.';
    }
    const yearNum = Number(form.year);
    if (!Number.isInteger(yearNum) || yearNum < 1980 || yearNum > 2100) {
      return 'Year must be a number between 1980 and 2100.';
    }
    const priceNum = Number(form.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return 'Price must be a positive number.';
    }
    const stockNum = Number(form.stock);
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      return 'Stock must be a non-negative integer.';
    }
    if (form.isLimited) {
      const printRunNum = Number(form.printRun);
      if (!Number.isInteger(printRunNum) || printRunNum <= 0) {
        return 'Print run must be a positive integer for limited cards.';
      }
    }
    return '';
  }

  function handleSubmit(event) {
    event.preventDefault();
    const errorMessage = validateForm();
    if (errorMessage) {
      setFormError(errorMessage);
      return;
    }
    setFormError('');
    onAddCard(form);
  }

  function startEdit(card) {
    setEditCardId(card.id);
    setEditForm({
      price: String(card.price),
      stock: String(card.stock),
      imageUrl: card.imageUrl || '',
    });
    setEditError('');
  }

  function handleEditChange(field, value) {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validateEditForm() {
    const priceNum = Number(editForm.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return 'Price must be a positive number.';
    }
    const stockNum = Number(editForm.stock);
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      return 'Stock must be a non-negative integer.';
    }
    if (!editForm.imageUrl.trim()) {
      return 'Image URL is required.';
    }
    return '';
  }

  function handleEditSubmit(event) {
    event.preventDefault();
    if (!editCardId) {
      return;
    }
    const msg = validateEditForm();
    if (msg) {
      setEditError(msg);
      return;
    }
    setEditError('');

    const priceNum = Number(editForm.price);
    const stockNum = Number(editForm.stock);

    onUpdateCard(editCardId, {
      price: priceNum,
      stock: stockNum,
      imageUrl: editForm.imageUrl.trim(),
    });

    setEditCardId(null);
  }

  function cancelEdit() {
    setEditCardId(null);
    setEditError('');
  }

  return (
    <section className="admin-inventory">
      <h1>Inventory (Admin)</h1>

      <h2>Create New Card</h2>
      <form className="card-form" onSubmit={handleSubmit}>
        <div className="card-form-grid">
          <label className="form-field">
            <span>Player Name</span>
            <input
              type="text"
              value={form.playerName}
              onChange={(e) => handleChange('playerName', e.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Team</span>
            <input
              type="text"
              value={form.team}
              onChange={(e) => handleChange('team', e.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Year</span>
            <input
              type="number"
              value={form.year}
              onChange={(e) => handleChange('year', e.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Brand</span>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Parallel</span>
            <input
              type="text"
              value={form.parallel}
              onChange={(e) => handleChange('parallel', e.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Price</span>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Stock</span>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Image URL</span>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
            />
          </label>
        </div>
        <div className="card-form-row">
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={form.isLimited}
              onChange={() => handleToggle('isLimited')}
            />
            <span>Limited</span>
          </label>
          {form.isLimited && (
            <>
              <label className="form-field">
                <span>Print Run</span>
                <input
                  type="number"
                  value={form.printRun}
                  onChange={(e) => handleChange('printRun', e.target.value)}
                />
              </label>
              <label className="form-field">
                <span>Serial Number</span>
                <input
                  type="number"
                  value={form.serialNumber}
                  onChange={(e) =>
                    handleChange('serialNumber', e.target.value)
                  }
                />
              </label>
            </>
          )}
        </div>
        <div className="card-form-row">
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={form.isGraded}
              onChange={() => handleToggle('isGraded')}
            />
            <span>Graded</span>
          </label>
          {form.isGraded && (
            <>
              <label className="form-field">
                <span>Grade Company</span>
                <input
                  type="text"
                  value={form.gradeCompany}
                  onChange={(e) =>
                    handleChange('gradeCompany', e.target.value)
                  }
                />
              </label>
              <label className="form-field">
                <span>Grade</span>
                <input
                  type="text"
                  value={form.grade}
                  onChange={(e) => handleChange('grade', e.target.value)}
                />
              </label>
            </>
          )}
        </div>
        {formError && <div className="form-error">{formError}</div>}
        <button type="submit" className="primary-btn">
          Create Card
        </button>
      </form>

      <h2>Existing Cards</h2>
      <ul className="admin-card-list">
        {cards.map((card) => {
          const isEditing = editCardId === card.id;
          return (
            <li key={card.id} className="admin-card-row">
              <div className="admin-card-main">
                <span className="admin-card-id">#{card.id}</span>
                <span className="admin-card-text">
                  {card.playerName} · {card.team} · {card.year} · {card.brand} · $
                  {card.price.toFixed(2)} · stock: {card.stock}
                </span>
                {!card.isActive && (
                  <span className="admin-card-label">Inactive</span>
                )}
              </div>

              <div className="admin-card-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => onToggleActive(card.id, !card.isActive)}
                >
                  {card.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => startEdit(card)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => onDeleteCard(card.id)}
                >
                  Delete
                </button>
              </div>

              {isEditing && (
                <div className="admin-edit-inline">
                  <form className="card-edit-form" onSubmit={handleEditSubmit}>
                    <label className="form-field">
                      <span>Price</span>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) =>
                          handleEditChange('price', e.target.value)
                        }
                      />
                    </label>
                    <label className="form-field">
                      <span>Stock</span>
                      <input
                        type="number"
                        value={editForm.stock}
                        onChange={(e) =>
                          handleEditChange('stock', e.target.value)
                        }
                      />
                    </label>
                    <label className="form-field">
                      <span>Image URL</span>
                      <input
                        type="text"
                        value={editForm.imageUrl}
                        onChange={(e) =>
                          handleEditChange('imageUrl', e.target.value)
                        }
                      />
                    </label>

                    {editError && (
                      <div className="form-error">{editError}</div>
                    )}

                    <div className="edit-actions">
                      <button type="submit" className="primary-btn">
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </li>
          );
        })}
        {cards.length === 0 && <li>No cards yet</li>}
      </ul>
    </section>
  );
}