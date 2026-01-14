'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
} from 'react-icons/fa';
import { useAlert } from '@/app/hooks/useAlert';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface Credentials {
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showAlert } = useAlert();
  const router = useRouter();

  /* ----------------------------- Event Handlers ----------------------------- */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post<AuthResponse>('/api/auth', credentials);
      if (response.data?.success) {
        window.localStorage.setItem('admin', JSON.stringify(response.data));
        window.dispatchEvent(new Event('admin-login'));

        showAlert('Access granted. Redirecting...', 'success');
        router.push('/admin');
      } else {
        showAlert(
          response.data?.message ?? 'Invalid credentials',
          'error'
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;

      showAlert(
        axiosError.response?.data?.message ?? 'Connection failed',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;

    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white border border-slate-200 rounded-md shadow-sm p-6 md:p-10 w-full max-w-md">
        <div className="text-left mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Admin Login
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Please enter your details to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <FaUser className="text-slate-400 text-sm" />
              </div>
              <input
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <FaLock className="text-slate-400 text-sm" />
              </div>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-12 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <FaEyeSlash size={16} />
                ) : (
                  <FaEye size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-md font-medium text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <FaSignInAlt className="text-xs" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-[11px] uppercase tracking-widest font-medium">
            Secure Infrastructure Access
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;