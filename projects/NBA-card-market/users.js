const users = {
  dog: {
    username: 'dog',
    role: 'banned',
  },
};

function isValidUsername(username) {
  if (!username) {
    return false;
  }
  const trimmed = username.trim();
  if (!trimmed) {
    return false;
  }
  if (trimmed.length > 20) {
    return false;
  }

  return /^[A-Za-z0-9_]+$/.test(trimmed);
}

function registerUser(username, password) {
  const trimmed = (username || '').trim();

  if (!isValidUsername(trimmed)) {
    return { error: 'required-username' };
  }

  if (!password || !password.trim()) {
    return { error: 'required-password' };
  }

  if (trimmed === 'dog') {
    return { error: 'user-exists' };
  }

  if (users[trimmed]) {
    return { error: 'user-exists' };
  }

  const role = trimmed === 'nba_admin' ? 'admin' : 'user';

  users[trimmed] = {
    username: trimmed,
    role,
  };

  return { user: users[trimmed] };
}

function loginUser(username, password) {
  const trimmed = (username || '').trim();

  if (!isValidUsername(trimmed)) {
    return { error: 'required-username' };
  }

  if (!password || !password.trim()) {
    return { error: 'required-password' };
  }

  const user = users[trimmed];
  if (!user) {
    return { error: 'user-missing' };
  }

  return { user };
}

function getUser(username) {
  if (!username) {
    return null;
  }
  return users[username] || null;
}

export default {
  registerUser,
  loginUser,
  getUser,
};