import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('lastzone_token'));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate existing session on mount
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('lastzone_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setToken(storedToken);
        } else {
          // Token expired or invalid
          localStorage.removeItem('lastzone_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('Network error checking auth session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = useCallback(async (usernameOrEmail, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password })
    });

    if (!res.ok) {
      let errMsg = 'Login failed';
      try {
        const errorData = await res.json();
        errMsg = errorData.message || errorData.error || errMsg;
      } catch {}
      throw new Error(errMsg);
    }

    const data = await res.json();
    localStorage.setItem('lastzone_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (username, email, password, displayName) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, displayName })
    });

    if (!res.ok) {
      let errMsg = 'Registration failed';
      try {
        const errorData = await res.json();
        errMsg = errorData.message || errorData.error || errMsg;
      } catch {}
      throw new Error(errMsg);
    }

    const data = await res.json();
    localStorage.setItem('lastzone_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('lastzone_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
