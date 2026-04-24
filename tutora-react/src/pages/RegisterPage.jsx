import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const API_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();
            if (res.ok) {
                // Assuming successful registration might return a token or requires login
                if (data.token) {
                    localStorage.setItem('auth_token', data.token);
                    localStorage.setItem('isLoggedIn', 'true');
                    navigate('/exhibition-halls');
                } else {
                    navigate('/login');
                }
            } else {
                setError(data.message || 'Registration failed. Please check your inputs.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Connection error. Please try again later.');
        }
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', maxWidth: '1200px', background: 'var(--bg-secondary)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                {/* Left Column: Register Form */}
                <div className="form-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
                    <div className="form-container" style={{ width: '100%', maxWidth: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                            <img src="/logo.png" alt="Tutora Logo" style={{ width: '100px', height: 'auto', filter: 'drop-shadow(0 0 10px rgba(40,198,208,0.3))' }} />
                        </div>

                        <div className="form-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h1 className="form-title" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Create Account</h1>
                        </div>

                        <form className="registration-form" onSubmit={handleRegister}>
                            <div className="field-group" style={{ marginBottom: '1.5rem' }}>
                                <p className="field-label" style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</p>
                                <div className="input-wrapper">
                                    <input 
                                        className="form-input" 
                                        type="text" 
                                        placeholder="Enter your name" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required 
                                        style={{ width: '100%', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                    />
                                </div>
                            </div>

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
                                <p className="field-label" style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</p>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <input 
                                        className="form-input" 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="Create a password" 
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

                            <button type="submit" className="submit-btn" style={{ width: '100%', padding: '1rem', background: '#28C6D0', color: '#121212', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: '0.3s', marginTop: '1rem' }}>
                                Sign Up
                            </button>
                        </form>
                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <span style={{ color: '#aaa' }}>Already have an account?</span>
                            <Link to="/login" style={{ color: '#28C6D0', fontWeight: 'bold', textDecoration: 'none', marginLeft: '0.5rem' }}>Log In</Link>
                        </div>
                    </div>
                </div>

                {/* Right Column: Hero Image Panel */}
                <div className="hero-panel" style={{ backgroundImage: "url('/3.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', minHeight: '600px' }}>
                    <div className="hero-overlay" style={{ background: 'linear-gradient(to right, rgba(18,18,18,0.3), rgba(18,18,18,0.9))', position: 'absolute', inset: 0 }}></div>
                    <div className="hero-content" style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%', color: 'white', textAlign: 'right' }}>
                        <h3 className="hero-title" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '3rem', textShadow: '2px 2px 4px #000', marginBottom: '1rem' }}>Your legacy begins here.</h3>
                        <p className="hero-subtitle" style={{ fontSize: '1.2rem', textShadow: '2px 2px 4px #000' }}>Join the museum community and start your journey.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
