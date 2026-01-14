import { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaExchangeAlt } from 'react-icons/fa';
import './Auth.css';

export default function Auth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [changeData, setChangeData] = useState({ oldPassword: '', newPassword: '' });
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeForm, setActiveForm] = useState('login');

    useEffect(() => {
        if (token) setIsLoggedIn(true);
    }, [token]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URI}/api/auth/signin`, loginData);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setMessage(res.data.message);
            setIsLoggedIn(true);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URI}/api/auth/change-password`,
                {
                    username: 'abhibhrt',
                    oldPassword: changeData.oldPassword,
                    newPassword: changeData.newPassword,
                    role: 'admin'
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message);
            setChangeData({ oldPassword: '', newPassword: '' });
        } catch (err) {
            setMessage(err.response?.data?.message || 'Password change failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoggedIn) {
        return <Dashboard token={token} />;
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Admin Portal</h1>
                    <p className="auth-subtitle">Secure Access Dashboard</p>
                </div>

                {message && (
                    <div className={`auth-message ${message.includes('failed') ? 'auth-message-error' : 'auth-message-success'}`}>
                        {message}
                    </div>
                )}

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${activeForm === 'login' ? 'auth-tab-active' : ''}`}
                        onClick={() => setActiveForm('login')}
                    >
                        <FaUser className="auth-tab-icon" />
                        Login
                    </button>
                    <button
                        className={`auth-tab ${activeForm === 'change' ? 'auth-tab-active' : ''}`}
                        onClick={() => setActiveForm('change')}
                    >
                        <FaExchangeAlt className="auth-tab-icon" />
                        Change Password
                    </button>
                </div>

                <div className="auth-forms">
                    {/* Login Form */}
                    <form
                        className={`auth-form ${activeForm === 'login' ? 'auth-form-active' : ''}`}
                        onSubmit={handleLogin}
                    >
                        <div className="auth-input-group">
                            <FaUser className="auth-input-icon" />
                            <input
                                type="text"
                                placeholder="Username"
                                className="auth-input"
                                value={loginData.username}
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                required
                            />
                        </div>

                        <div className="auth-input-group">
                            <FaLock className="auth-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className="auth-input"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="auth-spinner"></div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Change Password Form */}
                    <form
                        className={`auth-form ${activeForm === 'change' ? 'auth-form-active' : ''}`}
                        onSubmit={handleChangePassword}
                    >
                        <div className="auth-input-group">
                            <FaLock className="auth-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Old Password"
                                className="auth-input"
                                value={changeData.oldPassword}
                                onChange={(e) => setChangeData({ ...changeData, oldPassword: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <div className="auth-input-group">
                            <FaLock className="auth-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="New Password"
                                className="auth-input"
                                value={changeData.newPassword}
                                onChange={(e) => setChangeData({ ...changeData, newPassword: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="auth-spinner"></div>
                            ) : (
                                'Update Password'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}