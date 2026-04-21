import React, { useState, useEffect } from 'react';
import { LoginView } from './views/LoginView';
import { TeacherDashboard } from './views/TeacherDashboard';
import { PrincipalDashboard } from './views/PrincipalDashboard';
import { User, AuthState, UserRole } from './types';
import { initializeData } from './services/mockBackend';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    dashboardMode: 'teacher'
  });

  useEffect(() => {
    const syncData = async () => {
      // Initialize mock data (downloads the fresh csv)
      await initializeData();
      
      // Check for existing session
      const storedUserStr = localStorage.getItem('mi_nur_bilad_session');
      const storedMode = localStorage.getItem('mi_nur_bilad_mode') as UserRole || 'teacher';
      
      if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          
          // Memaksa update session lokal jika ada data fetch terbaru
          const allUsersStr = localStorage.getItem('mi_nur_bilad_users');
          if (allUsersStr) {
              const allUsers = JSON.parse(allUsersStr);
              const updatedUser = allUsers.find((u: User) => u.id === storedUser.id);
              if (updatedUser) {
                  localStorage.setItem('mi_nur_bilad_session', JSON.stringify(updatedUser)); // Tancapkan data baru dari GS
                  setAuth({
                      user: updatedUser,
                      isAuthenticated: true,
                      dashboardMode: storedMode
                  });
                  return;
              }
          }

          setAuth({
              user: storedUser,
              isAuthenticated: true,
              dashboardMode: storedMode
          });
      }
    };
    
    syncData();
  }, []);

  const handleLogin = (user: User, mode: UserRole) => {
    localStorage.setItem('mi_nur_bilad_session', JSON.stringify(user));
    localStorage.setItem('mi_nur_bilad_mode', mode);
    setAuth({
      user,
      isAuthenticated: true,
      dashboardMode: mode
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('mi_nur_bilad_session');
    localStorage.removeItem('mi_nur_bilad_mode');
    setAuth({
      user: null,
      isAuthenticated: false,
      dashboardMode: 'teacher'
    });
  };

  if (!auth.isAuthenticated || !auth.user) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Routing Logic:
  // If the stored dashboardMode is 'principal', show Principal Dashboard.
  // Otherwise show Teacher Dashboard.
  // This allows a Principal User to access Teacher Dashboard if they logged in via Teacher Tab.
  return auth.dashboardMode === 'principal' ? (
    <PrincipalDashboard user={auth.user} onLogout={handleLogout} />
  ) : (
    <TeacherDashboard user={auth.user} onLogout={handleLogout} />
  );
};

export default App;