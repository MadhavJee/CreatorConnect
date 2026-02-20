import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import styles from './Chat.module.css';

export default function Chat() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, from: 'system', text: `Welcome, ${user?.name || 'Creator'}! 👋` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), from: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Uncomment when chat API is ready:
            // const res = await API.post('/chats/send', { message: input });
            // setMessages(prev => [...prev, { id: Date.now()+1, from: 'bot', text: res.data.reply }]);

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    from: 'bot',
                    text: 'Chat API not connected yet!'
                }]);
                setLoading(false);
            }, 800);
        } catch {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>CC</div>
                    <span className={styles.appName}>CreatorConnect</span>
                </div>
                <div className={styles.navItem}>💬 Chat</div>
                <div className={styles.sidebarBottom}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
                        <div>
                            <p className={styles.userName}>{user?.name}</p>
                            <p className={styles.userRole}>{user?.role}</p>
                        </div>
                    </div>
                    <button className={styles.logoutBtn} onClick={handleLogout}>Sign out</button>
                </div>
            </div>

            <div className={styles.chatArea}>
                <div className={styles.chatHeader}>
                    <h2>Chat</h2>
                    <span className={styles.tokenBadge}>🪙 {user?.tokens || 5} tokens</span>
                </div>
                <div className={styles.messages}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`${styles.message} ${styles[msg.from]}`}>
                            {msg.from !== 'user' && <div className={styles.msgAvatar}>{msg.from === 'system' ? '⚡' : 'CC'}</div>}
                            <div className={styles.msgBubble}>{msg.text}</div>
                        </div>
                    ))}
                    {loading && (
                        <div className={`${styles.message} ${styles.bot}`}>
                            <div className={styles.msgAvatar}>CC</div>
                            <div className={styles.msgBubble}>
                                <span className={styles.typing}><span /><span /><span /></span>
                            </div>
                        </div>
                    )}
                </div>
                <form className={styles.inputArea} onSubmit={handleSend}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className={styles.chatInput}
                    />
                    <button type="submit" className={styles.sendBtn} disabled={loading || !input.trim()}>
                        Send →
                    </button>
                </form>
            </div>
        </div>
    );
}