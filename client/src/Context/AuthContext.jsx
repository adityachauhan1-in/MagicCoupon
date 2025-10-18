import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

const AuthContext = createContext(); // creation of context ....

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
                const stored = localStorage.getItem('user');
                if (stored) {
                  setUser(JSON.parse(stored));
        }
        if (token) {
          const me = await getMe();
                 if (me?.success && me?.data) {
                   setUser(me.data);
                   localStorage.setItem('user', JSON.stringify(me.data));
          }
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } 
      // console.log("Auth init done:", { token: localStorage.getItem("token"), user });

        setLoading(false);
      
    };
    init();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
             localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return <div className="text-center text-3xl font-bold text-gray-600">Loading...</div>; 
  }

  return (
    <AuthContext.Provider value={{ user, login, logout , loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
