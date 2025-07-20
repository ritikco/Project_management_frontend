import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContextType, User } from '../types';
const API_BASE_URL = "https://project-management-9oxy.onrender.com";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('Usertoken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // ✅ Real login using your backend
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/log_in`, {
        emailOrPhone : email,
        password,
      });

      const result = response.data?.result;
      if (result?.user?.token) {
        const userData = result.user;
        console.log("hyyyyy",userData);
        

        setToken(userData.token);
        setUser(userData);
        localStorage.setItem('Usertoken', userData.token);
        localStorage.setItem('authUser', JSON.stringify(userData));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Real register using your backend
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/user/register`, {
        name,
        email,
        password,
      });

      const result = response.data?.result;
      if (result?.user?.token) {
        const userData = result.user;

        setToken(userData.token);
        setUser(userData);
        localStorage.setItem('Usertoken', userData.token);
        localStorage.setItem('authUser', JSON.stringify(userData));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('Usertoken');
    localStorage.removeItem('authUser');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
