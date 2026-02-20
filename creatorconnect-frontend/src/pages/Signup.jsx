import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { initiateSignup, verifySignupOtp } from '../services/api';
import styles from './Auth.module.css';

export default function Signup() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('VIEWER');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await initiateSignup(email);
            setSuccess('OTP sent! Check your email.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await verifySignupOtp({ email, otp, name, password, role });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.bg}>
                <div className={styles.blob1} />
                <div className={styles.blob2} />
            </div>
            <div className={`${styles.card} animate-in`}>
                <div className={styles.logo}>CC</div>
                <h1 className={styles.title}>{step === 1 ? 'Create account' : 'Verify & Setup'}</h1>
                <p className={styles.subtitle}>{step === 1 ? 'Join CreatorConnect' : `OTP sent to ${email}`}</p>

                <div className={styles.steps}>
                    <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>1</div>
                    <div className={styles.stepLine} />
                    <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>2</div>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className={styles.form}>
                        <div className={styles.field}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                        <button type="submit" className={styles.btn} disabled={loading}>
                            {loading ? <span className={styles.spinner} /> : 'Send OTP →'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className={styles.form}>
                        {success && <p className={styles.successMsg}>{success}</p>}
                        <div className={styles.field}>
                            <label>OTP Code</label>
                            <input
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                maxLength={6}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Role</label>
                            <select value={role} onChange={e => setRole(e.target.value)} className={styles.select}>
                                <option value="VIEWER">Viewer</option>
                                <option value="EDITOR">Editor</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                        <button type="submit" className={styles.btn} disabled={loading}>
                            {loading ? <span className={styles.spinner} /> : 'Create Account'}
                        </button>
                        <button type="button" className={styles.btnGhost} onClick={() => setStep(1)}>
                            ← Back
                        </button>
                    </form>
                )}
                <p className={styles.switch}>
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}