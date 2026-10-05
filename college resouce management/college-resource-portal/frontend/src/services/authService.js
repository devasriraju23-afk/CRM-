// Auth service — mock mode (no backend required)
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const register = async (data) => {
  await delay();
  return { data: { success: true, message: 'Use a demo account to login.' } };
};

export const login = async ({ email, password }) => {
  await delay();
  return { data: { success: true } };
};

export const logout = async () => {
  await delay(100);
  return { data: { success: true } };
};

export const getMe = async () => {
  await delay();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return { data: { success: true, data: { user } } };
};

export const updateMe = async (data) => {
  await delay(400);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const updated = { ...user, first_name: data.firstName || user.first_name, last_name: data.lastName || user.last_name, phone: data.phone, bio: data.bio, semester: data.semester || user.semester };
  localStorage.setItem('user', JSON.stringify(updated));
  return { data: { success: true, data: { user: updated } } };
};

export const changePassword = async () => {
  await delay(400);
  return { data: { success: true, message: 'Password changed (mock).' } };
};
