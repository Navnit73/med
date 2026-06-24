import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return false;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false; // Expired
    }
    return true;
  } catch (e) {
    return false; // Invalid token format
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('medexpert_token');
    return isTokenValid(storedToken) ? storedToken : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedToken = localStorage.getItem('medexpert_token');
    return isTokenValid(storedToken);
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('medexpert_role') || 'admin';
  });

  const [patientData, setPatientData] = useState(() => {
    const data = localStorage.getItem('medexpert_patient');
    return data ? JSON.parse(data) : null;
  });

  const login = (role = 'admin', accessToken = null) => {
    localStorage.setItem('medexpert_auth', 'true');
    localStorage.setItem('medexpert_role', role);
    if (accessToken) {
      localStorage.setItem('medexpert_token', accessToken);
      setToken(accessToken);
    }
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('medexpert_auth');
    localStorage.removeItem('medexpert_role');
    localStorage.removeItem('medexpert_token');
    localStorage.removeItem('medexpert_patient'); // Fix for incomplete logout
    
    setIsAuthenticated(false);
    setUserRole('admin');
    setToken(null);
    setPatientData(null);
  };

  const savePatientData = (data) => {
    localStorage.setItem('medexpert_patient', JSON.stringify(data));
    setPatientData(data);
  };

  // Listen for the custom 401 unauthorized event triggered by axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, patientData, token, login, logout, savePatientData }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
