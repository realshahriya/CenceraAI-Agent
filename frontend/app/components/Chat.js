'use client';
import { useState, useRef, useEffect } from 'react';

export default function Chat({ agentId, walletAddress, onSendMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !agentId || !walletAddress) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    // Add user message to UI immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await onSendMessage(userMessage);
      setMessages(prev => [...prev, { role: 'agent', content: response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'system', content: "Error: Neural Link Fragmented. Failed to get response." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="chat-interface">
      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🧠</div>
            <h3>CENCERA SYSTEM STANDBY</h3>
            <p>Initiate cognitive synchronization sequence.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`message-row ${msg.role}`}>
              <div className="bubble">
                {msg.role === 'agent' && <span className="sender-label">CENCERA AI</span>}
                {msg.content}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="message-row agent">
            <div className="bubble loading-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-wrapper">
        <form onSubmit={handleSubmit} className="input-box">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={walletAddress ? "Enter command protocol..." : "Neural link required"}
            disabled={!walletAddress || loading}
          />
          <button type="submit" disabled={!walletAddress || loading || !input.trim()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
                .chat-interface {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    position: relative;
                }
                
                .messages-area {
                    flex: 1;
                    overflow-y: auto;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .message-row {
                    display: flex;
                    width: 100%;
                }
                
                .message-row.user {
                    justify-content: flex-end;
                }
                
                .message-row.agent {
                    justify-content: flex-start;
                }

                .sender-label {
                    display: block;
                    font-size: 0.6rem;
                    color: var(--neon-cyan);
                    margin-bottom: 4px;
                    letter-spacing: 1px;
                    font-weight: 700;
                }

                .bubble {
                    max-width: 80%;
                    padding: 14px 20px;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    position: relative;
                    word-wrap: break-word;
                    font-family: var(--font-mono);
                }

                .message-row.user .bubble {
                    background: rgba(0, 243, 255, 0.1);
                    color: var(--neon-cyan);
                    border: 1px solid rgba(0, 243, 255, 0.3);
                    border-bottom-right-radius: 2px;
                    box-shadow: 0 0 15px rgba(0, 243, 255, 0.05);
                }

                .message-row.agent .bubble {
                    background: rgba(0, 0, 0, 0.6);
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-bottom-left-radius: 2px;
                }
                
                .message-row.system .bubble {
                    background: rgba(255, 0, 0, 0.1);
                    color: #ff4444;
                    border: 1px solid rgba(255, 0, 0, 0.2);
                    font-size: 0.85rem;
                }

                .empty-state {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #555;
                    text-align: center;
                }
                .empty-state .icon {
                    font-size: 3rem;
                    margin-bottom: 15px;
                    opacity: 0.3;
                    filter: grayscale(100%);
                }
                .empty-state h3 {
                    margin: 0 0 5px 0;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 0.9rem;
                    font-family: var(--font-mono);
                }

                /* Input Area */
                .input-wrapper {
                    padding: 20px;
                    background: rgba(0,0,0,0.4);
                    border-top: 1px solid rgba(255,255,255,0.08);
                }

                .input-box {
                    display: flex;
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                    padding: 5px;
                    transition: all 0.2s;
                }

                .input-box:focus-within {
                    border-color: var(--neon-cyan);
                    box-shadow: 0 0 15px rgba(0, 243, 255, 0.1);
                }

                input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: white;
                    padding: 12px 20px;
                    font-size: 1rem;
                    outline: none;
                    font-family: var(--font-mono);
                }

                input::placeholder {
                    color: #444;
                    font-style: italic;
                }

                button {
                    background: rgba(0, 243, 255, 0.1);
                    border: 1px solid rgba(0, 243, 255, 0.2);
                    width: 45px;
                    height: 45px;
                    border-radius: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: var(--neon-cyan);
                    transition: all 0.2s;
                }

                button:hover:not(:disabled) {
                    background: rgba(0, 243, 255, 0.2);
                    box-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
                }

                button:disabled {
                    background: transparent;
                    border-color: #333;
                    color: #444;
                    cursor: not-allowed;
                }
                
                button svg {
                    width: 20px;
                    height: 20px;
                }

                /* Loading Dots Animation */
                .loading-bubble {
                    display: flex;
                    gap: 6px;
                    padding: 15px 20px;
                }
                .dot {
                    width: 4px;
                    height: 4px;
                    background: var(--neon-cyan);
                    border-radius: 50%;
                    animation: pulse 1s infinite ease-in-out alternate;
                }
                .dot:nth-child(1) { animation-delay: 0s; }
                .dot:nth-child(2) { animation-delay: 0.2s; }
                .dot:nth-child(3) { animation-delay: 0.4s; }
            `}</style>
    </div>
  );
}
