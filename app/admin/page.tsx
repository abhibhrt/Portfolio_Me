'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './auth/page';
import Dashboard from './dashboard/page';

const LoginPage: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async (): Promise<void> => {
      try {
        const response = await axios.get('/api/dashboard/my-profile');
        
        if (response.data?.success) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        setLoggedIn(false);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-600 border-t-slate-200 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm tracking-wide">Verifying session...</span>
        </div>
      </div>
    );
  }

  return loggedIn ? <Dashboard /> : <Login />;
};

export default LoginPage;