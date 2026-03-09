'use client';
import React, { useState, useRef, useEffect } from 'react';

interface ChatProps {
  agentId?: string;
  walletAddress?: string;
  onSendMessage: (message: string) => Promise<string>;
}

interface Message {
  role: 'user' | 'agent' | 'system';
  content: string;
}

export default function Chat({ agentId, walletAddress, onSendMessage }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !walletAddress) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await onSendMessage(userMessage);
      setMessages(prev => [...prev, { role: 'agent', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'system', content: "CRITICAL ERROR: NEURAL LINK FRAGMENTED. UNABLE TO RETRIEVE COGNITIVE RESPONSE." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="chat-container">
      <div className="messages-viewport">
        {messages.length === 0 ? (
          <div className="onboarding">
            <div className="onboarding-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3>NEURAL SYNC PENDING</h3>
            <p>Initiate conversation to populate cognitive buffer.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`msg-block ${msg.role}`}>
              <div className="msg-bubble">
                {msg.role === 'agent' && <div className="bot-tag">CENCERA.PROTOCUL</div>}
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="msg-block agent">
            <div className="msg-bubble loading">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-section">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={walletAddress ? "SEND COMMAND PROTOCOL..." : "NEURAL LINK REQUIRED"}
            disabled={!walletAddress || loading}
          />
          <button type="submit" disabled={!walletAddress || loading || !input.trim()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: rgba(0, 0, 0, 0.2);
        }

        .messages-viewport {
          flex: 1;
          overflow-y: auto;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .msg-block {
          display: flex;
          width: 100%;
        }

        .msg-block.user { justify-content: flex-end; }
        .msg-block.agent { justify-content: flex-start; }

        .msg-bubble {
          max-width: 85%;
          padding: 16px 20px;
          border-radius: 12px;
          font-size: 0.95rem;
          line-height: 1.5;
          word-break: break-word;
          position: relative;
        }

        .user .msg-bubble {
          background: var(--neon-cyan);
          color: #000;
          font-weight: 600;
          border-bottom-right-radius: 2px;
          box-shadow: 0 4px 15px rgba(0, 243, 255, 0.2);
        }

        .agent .msg-bubble {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #e0e0e0;
          border-bottom-left-radius: 2px;
        }

        .system .msg-bubble {
          background: rgba(255, 59, 105, 0.05);
          border: 1px solid rgba(255, 59, 105, 0.2);
          color: var(--neon-pink);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          width: 100%;
          text-align: center;
        }

        .bot-tag {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 800;
          color: var(--neon-purple);
          margin-bottom: 6px;
          letter-spacing: 1px;
        }

        .onboarding {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          opacity: 0.4;
        }

        .onboarding-icon { width: 40px; height: 40px; margin-bottom: 16px; color: #888; }
        .onboarding h3 { font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 2px; margin-bottom: 8px; }
        .onboarding p { font-size: 0.8rem; }

        .input-section {
          padding: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .input-form {
          display: flex;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 8px;
          border-radius: 12px;
          transition: 0.3s;
        }

        .input-form:focus-within {
          border-color: var(--neon-cyan);
          background: rgba(255, 255, 255, 0.05);
        }

        input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          padding: 8px 16px;
          outline: none;
          font-family: var(--font-main);
          font-size: 0.95rem;
        }

        button {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          background: rgba(0, 243, 255, 0.1);
          border: 1px solid rgba(0, 243, 255, 0.2);
          color: var(--neon-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.3s;
        }

        button:hover:not(:disabled) {
          background: var(--neon-cyan);
          color: #000;
        }

        button:disabled { opacity: 0.2; cursor: not-allowed; }
        button svg { width: 20px; height: 20px; }

        .loading { display: flex; gap: 4px; padding: 12px 20px !important; }
        .typing-dot { width: 4px; height: 4px; background: var(--neon-cyan); border-radius: 50%; animation: blink 1.4s infinite both; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }

        /* Scrollbar */
        .messages-viewport::-webkit-scrollbar { width: 4px; }
        .messages-viewport::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}
