import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('medexpert_auth') === 'true';
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('medexpert_role') || 'admin';
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('medexpert_token') || null;
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
    setIsAuthenticated(false);
    setUserRole('admin');
    setToken(null);
  };

  const savePatientData = (data) => {
    localStorage.setItem('medexpert_patient', JSON.stringify(data));
    setPatientData(data);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, patientData, token, login, logout, savePatientData }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
