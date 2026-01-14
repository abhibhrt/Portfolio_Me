'use client';

import { useEffect, useState } from 'react';
import Login from './auth/page';
import Dashboard from './dashboard/page';

const LoginPage: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = (): void => {
      if (typeof window === 'undefined') return;

      const admin = window.localStorage.getItem('admin');
      setLoggedIn(Boolean(admin));
      setIsChecking(false);
    };

    checkAuth();

    const handleAdminLogin = (): void => {
      checkAuth();
    };

    const handleAdminLogout = (): void => {
      checkAuth();
    };

    const handleStorageChange = (event: StorageEvent): void => {
      if (event.key === 'admin') {
        checkAuth();
      }
    };

    window.addEventListener('admin-login', handleAdminLogin as EventListener);
    window.addEventListener('admin-logout', handleAdminLogout as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('admin-login', handleAdminLogin as EventListener);
      window.removeEventListener('admin-logout', handleAdminLogout as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return loggedIn ? <Dashboard /> : <Login />;
};

export default LoginPage;