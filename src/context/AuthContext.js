import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = (props) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
          // setVarWithExpiry('token', token, 3600000);
          localStorage.setItem('token', token);

        } else {
          localStorage.removeItem('token');
        }
      }, [token]);

    function setVarWithExpiry(key, value, expiresAt) {
      const tokenData = {
        value: value,
        expiresAt: expiresAt,
      };
      localStorage.setItem(key, JSON.stringify(tokenData));
    }

    function getVarWithExpiry(key) {
      const tokenData = localStorage.getItem(key);
    
      // If no token data exists, return null
      if (!tokenData) return null;
    
      const parsedTokenData = JSON.parse(tokenData);
    
      // Check if the token is expired
      if (Date.now() > parsedTokenData.expiresAt) {
        localStorage.removeItem(key); // Remove expired token
        return null;
      }
    
      // Return the token if it's not expired
      return parsedTokenData.value;
    }

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        // setVarWithExpiry('token', token, 3600000);
        // setVarWithExpiry('profile_pic', userData.profile_pic, 3600000);
        // setVarWithExpiry('permissions', JSON.stringify(userData.permissions), 3600000);
        localStorage.setItem('token', token);
        localStorage.setItem('profile_pic', userData.profile_pic);
        localStorage.setItem('permissions', JSON.stringify(userData.permissions));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('profile_pic');
        localStorage.removeItem('permissions');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, getVarWithExpiry }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
