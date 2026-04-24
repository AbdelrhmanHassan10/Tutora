import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const API_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                // Assuming successful login returns a token
                localStorage.setItem('auth_token', data.token);
                // Also setting global core logic standard
                localStorage.setItem('isLoggedIn', 'true');
                if (data.user) {
                    localStorage.setItem('userName', data.user.name || 'User');
                    localStorage.setItem('userAvatar', data.user.avatar || '/unnamed.png');
                }
                navigate('/exhibition-halls');
            } else {
                setError(data.message || 'Invalid email or password. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Connection error. Please try again later.');
        }
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', maxWidth: '1200px', background: 'var(--bg-secondary)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                {/* Left Column: Hero Image Panel */}
                <div className="hero-panel" style={{ backgroundImage: "url('/1212.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', minHeight: '600px' }}>
                    <div className="hero-overlay" style={{ background: 'linear-gradient(to right, rgba(18,18,18,0.3), rgba(18,18,18,0.9))', position: 'absolute', inset: 0 }}></div>
                    <div className="hero-content" style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%', color: 'white' }}>
                        <h3 className="hero-title" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '3rem', textShadow: '2px 2px 4px #000', marginBottom: '1rem' }}>Welcome back to eternity.</h3>
                        <p className="hero-subtitle" style={{ fontSize: '1.2rem', textShadow: '2px 2px 4px #000' }}>Your personal AI guide, <span style={{ color: '#ecb613', fontWeight: 'bold' }}>Tutora</span>, is waiting for you.</p>
                    </div>
                </div>

                {/* Right Column: Registration Form (Login adapted) */}
                <div className="form-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
                    <div className="form-container" style={{ width: '100%', maxWidth: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                            <img src="/logo.png" alt="Tutora Logo" style={{ width: '100px', height: 'auto', filter: 'drop-shadow(0 0 10px rgba(236,182,19,0.3))' }} />
                        </div>

                        <div className="form-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h1 className="form-title" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Log In</h1>
                        </div>

                        <form className="registration-form" onSubmit={handleLogin}>
                            <div className="field-group" style={{ marginBottom: '1.5rem' }}>
                                <p className="field-label" style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</p>
                                <div className="input-wrapper">
                                    <input 
                                        className="form-input" 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                        style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                    />
                                </div>
                            </div>

                            <div className="field-group" style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <p className="field-label" style={{ color: 'var(--text-secondary)', margin: 0 }}>Password</p>
                                    <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#ecb613', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot Password?</a>
                                </div>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <input 
                                        className="form-input" 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="Enter your password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                        style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                    />
                                    <div 
                                        className="icon-addon" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                    >
                                        <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {error && <div className="error-message" style={{ color: '#ff3b30', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

                            <button type="submit" className="submit-btn" style={{ width: '100%', padding: '1rem', background: '#ecb613', color: '#121212', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: '0.3s', marginTop: '1rem' }}>
                                Log In
                            </button>
                        </form>
                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <span style={{ color: '#aaa' }}>New to the museum?</span>
                            <Link to="/register" style={{ color: '#ecb613', fontWeight: 'bold', textDecoration: 'none', marginLeft: '0.5rem' }}>Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
