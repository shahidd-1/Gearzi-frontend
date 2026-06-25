import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const storedToken = localStorage.getItem('gearzi_token');
    const storedUser = localStorage.getItem('gearzi_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      fetchCurrentUser(storedToken);
    }
  }, []);

  const fetchCurrentUser = async (currentToken) => {
    if (!currentToken) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem('gearzi_user', JSON.stringify(userData));
      } else {
        clearSession();
      }
    } catch (err) {
      console.error('Session validation failed:', err);
      clearSession();
    }
  };

  const clearSession = () => {
    localStorage.removeItem('gearzi_token');
    localStorage.removeItem('gearzi_user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const login = useCallback(async (identifier, password) => {
    if (!identifier || !password) throw new Error('Identifier and password are required');
    setIsLoading(true);
    setError(null);
    try {
      const payload = { password };
      if (identifier.includes('@')) {
        payload.email = identifier.trim();
      } else {
        const cleaned = identifier.replace(/[\s-]/g, '');
        payload.phone = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
      }
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');

      const userRes = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
          'Accept': 'application/json',
        }
      });
      if (!userRes.ok) throw new Error('Failed to fetch user profile');
      const userData = await userRes.json();

      localStorage.setItem('gearzi_token', data.access_token);
      localStorage.setItem('gearzi_user', JSON.stringify(userData));
      setToken(data.access_token);
      setUser(userData);

      return { ...data, user: userData };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (name, identifier, password) => {
    if (!name || !identifier || !password) throw new Error('Name, identifier, and password are required');
    setIsLoading(true);
    setError(null);
    try {
      const payload = { name: name.trim(), password };
      if (identifier.includes('@')) {
        payload.email = identifier.trim();
      } else {
        const cleaned = identifier.replace(/[\s-]/g, '');
        payload.phone = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
      }
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Signup failed');
      return await login(identifier, password);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const currentToken = localStorage.getItem('gearzi_token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
      ...(currentToken && { 'Authorization': `Bearer ${currentToken}` })
    };
    return fetch(url, { ...options, headers });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      error,
      isLoading,
      login,
      signup,
      logout,
      fetchWithAuth,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;