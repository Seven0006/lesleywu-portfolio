const cards = {};
let nextId = 1;

function initCard(card) {
  const id = card.id || nextId++;
  const base = {
    id,
    playerName: card.playerName,
    team: card.team,
    year: card.year,
    brand: card.brand,
    parallel: card.parallel || '',
    price: card.price,
    stock: card.stock,
    isLimited: !!card.isLimited,
    printRun: card.printRun || null,
    serialNumber: card.serialNumber || null,
    isGraded: !!card.isGraded,
    gradeCompany: card.gradeCompany || '',
    grade: card.grade || '',
    imageUrl: card.imageUrl,
    isActive: card.isActive !== false,
  };
  cards[id] = base;
  if (id >= nextId) {
    nextId = id + 1;
  }
}

initCard({
  id: 1,
  playerName: 'Hansen Yang',
  team: 'Trail Blazers',
  year: 2025,
  brand: 'Topps',
  parallel: 'Refractor',
  price: 12.5,
  stock: 8,
  isLimited: false,
  isGraded: true,
  gradeCompany: 'PSA',
  grade: '10',
  imageUrl: '/yang.jpg',
});

initCard({
  id: 2,
  playerName: 'Cooper Flagg',
  team: 'Mavericks',
  year: 2025,
  brand: 'Topps',
  parallel: 'Power Player',
  price: 50,
  stock: 1,
  isLimited: true,
  printRun: 50,
  serialNumber: 12,
  isGraded: true,
  gradeCompany: 'BGS',
  grade: '9.5',
  imageUrl: '/Flagg.jpg',
});

initCard({
  id: 3,
  playerName: 'Victor Wembanyama',
  team: 'San Antonio Spurs',
  year: 2024,
  brand: 'Topps Rookie',
  parallel: 'Costco Special',
  price: 9.5,
  stock: 15,
  isLimited: false,
  isGraded: false,
  gradeCompany: '',
  grade: '',
  imageUrl: '/Wembanyama.jpg',
});

initCard({
  id: 4,
  playerName: 'Ming Yao',
  team: 'Rockets',
  year: 2004,
  brand: 'NBA Hoops',
  parallel: 'Base',
  price: 7.5,
  stock: 10,
  isLimited: false,
  isGraded: false,
  gradeCompany: '',
  grade: '',
  imageUrl: '/Yao.jpg',
});

initCard({
  id: 5,
  playerName: 'Deni Avdija',
  team: 'Trail Blazers',
  year: 2021,
  brand: 'Select',
  parallel: 'Holo',
  price: 13.25,
  stock: 7,
  isLimited: false,
  isGraded: false,
  gradeCompany: '',
  grade: '',
  imageUrl: '/Deni.jpg',
});

initCard({
  id: 6,
  playerName: 'Donovan Clingan',
  team: 'Trail Blazers',
  year: 2023,
  brand: 'Donruss Optic',
  parallel: 'Holo',
  price: 10.0,
  stock: 6,
  isLimited: false,
  isGraded: true,
  gradeCompany: 'PSA',
  grade: '9',
  imageUrl: '/Clingan.jpg',
});


function toNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return null;
  }
  return num;
}

function sanitizeString(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.slice(0, maxLength);
}

function listCards(filters, options) {
  const includeInactive = options && options.includeInactive;
  let result = Object.values(cards);
  if (!includeInactive) {
    result = result.filter((card) => card.isActive);
  }
  const player = filters.player ? String(filters.player).toLowerCase() : '';
  const team = filters.team ? String(filters.team).toLowerCase() : '';
  const minPrice = filters.minPrice ? toNumber(filters.minPrice) : null;
  const maxPrice = filters.maxPrice ? toNumber(filters.maxPrice) : null;
  const year = filters.year ? Number.parseInt(filters.year, 10) : null;

  if (player) {
    result = result.filter((card) =>
      card.playerName.toLowerCase().includes(player),
    );
  }
  if (team) {
    result = result.filter((card) => card.team.toLowerCase().includes(team));
  }
  if (minPrice !== null) {
    result = result.filter((card) => card.price >= minPrice);
  }
  if (maxPrice !== null) {
    result = result.filter((card) => card.price <= maxPrice);
  }
  if (year !== null && Number.isInteger(year)) {
    result = result.filter((card) => card.year === year);
  }
  return result;
}

function buildCardFromPayload(body) {
  const playerName = sanitizeString(body.playerName, 80);
  const team = sanitizeString(body.team, 80);
  const brand = sanitizeString(body.brand, 80);
  const parallel = sanitizeString(body.parallel || '', 80);
  const imageUrl = sanitizeString(body.imageUrl || '', 300);
  const yearNum = toNumber(body.year);
  const priceNum = toNumber(body.price);
  const stockNum = toNumber(body.stock);
  const isLimited = !!body.isLimited;
  const isGraded = !!body.isGraded;
  const printRunNum = body.printRun ? toNumber(body.printRun) : null;
  const serialNum = body.serialNumber ? toNumber(body.serialNumber) : null;
  const gradeCompany = sanitizeString(body.gradeCompany || '', 40);
  const grade = sanitizeString(body.grade || '', 20);

  if (!playerName || !team || !brand || !imageUrl) {
    return { error: 'invalid-card' };
  }
  if (!Number.isInteger(yearNum) || yearNum < 1980 || yearNum > 2100) {
    return { error: 'invalid-card' };
  }
  if (!Number.isFinite(priceNum) || priceNum <= 0) {
    return { error: 'invalid-card' };
  }
  if (!Number.isInteger(stockNum) || stockNum < 0) {
    return { error: 'invalid-card' };
  }
  if (isLimited) {
    if (!Number.isInteger(printRunNum) || printRunNum <= 0) {
      return { error: 'invalid-card' };
    }
  }

  const card = {
    playerName,
    team,
    brand,
    parallel,
    imageUrl,
    year: yearNum,
    price: priceNum,
    stock: stockNum,
    isLimited,
    printRun: isLimited ? printRunNum : null,
    serialNumber:
      isLimited && Number.isInteger(serialNum) ? serialNum : null,
    isGraded,
    gradeCompany: isGraded ? gradeCompany : '',
    grade: isGraded ? grade : '',
    isActive: true,
  };
  return { card };
}

function buildUpdatesFromPayload(body) {
  const updates = {};
  if (Object.prototype.hasOwnProperty.call(body, 'isActive')) {
    updates.isActive = !!body.isActive;
  }
  if (Object.prototype.hasOwnProperty.call(body, 'price')) {
    const num = toNumber(body.price);
    if (!Number.isFinite(num) || num <= 0) {
      return { error: 'invalid-card' };
    }
    updates.price = num;
  }
  if (Object.prototype.hasOwnProperty.call(body, 'stock')) {
    const num = toNumber(body.stock);
    if (!Number.isInteger(num) || num < 0) {
      return { error: 'invalid-card' };
    }
    updates.stock = num;
  }
  if (Object.prototype.hasOwnProperty.call(body, 'imageUrl')) {
    const url = sanitizeString(body.imageUrl, 300);
    if (!url) {
      return { error: 'invalid-card' };
    }
    updates.imageUrl = url;
  }
  return { updates };
}

function addCard(cardData) {
  const id = nextId++;
  const card = Object.assign(
    {
      id,
      isActive: true,
      isLimited: false,
      isGraded: false,
      printRun: null,
      serialNumber: null,
      gradeCompany: '',
      grade: '',
    },
    cardData,
    { id },
  );
  cards[id] = card;
  return card;
}

function updateCard(id, updates) {
  const existing = cards[id];
  if (!existing) {
    return null;
  }
  const updated = Object.assign({}, existing, updates);
  cards[id] = updated;
  return updated;
}

function deleteCard(id) {
  const existing = cards[id];
  if (!existing) {
    return null;
  }
  delete cards[id];
  return existing;
}

function getCardById(id) {
  return cards[id];
}

function decreaseStock(id, quantity) {
  const card = cards[id];
  if (!card) {
    return false;
  }
  card.stock = Math.max(0, card.stock - quantity);
  return true;
}

export default {
  listCards,
  buildCardFromPayload,
  buildUpdatesFromPayload,
  addCard,
  updateCard,
  deleteCard,
  getCardById,
  decreaseStock,
};