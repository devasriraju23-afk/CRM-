import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_USERS } from '../services/mockData.js';

const AuthContext = createContext(null);

const DEMO_PASSWORD = 'Password@123';

// Generate a fake JWT-like token string
const fakeToken = (user) =>
  btoa(JSON.stringify({ userId: user.id, role: user.role, exp: Date.now() + 7 * 86400000 }));

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [token,   setToken]   = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = useCallback(async ({ email, password }) => {
    const found = MOCK_USERS[email.toLowerCase()];
    if (!found || password !== DEMO_PASSWORD) {
      throw new Error('Invalid email or password.');
    }
    const newToken = fakeToken(found);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user',  JSON.stringify(found));
    setToken(newToken);
    setUser(found);
    return found;
  }, []);

  const register = useCallback(async (data) => {
    // In mock mode just pretend registration succeeded
    return { success: true, message: 'Registration successful. Please login with a demo account.' };
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin   = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated,
      isAdmin, isFaculty, isStudent,
      login, register, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
