'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Image from 'next/image';
import Chat from './components/Chat';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Constants
  const BACKEND_URL = 'http://localhost:3001';

  // Mock Agent Data for Prototype
  const MOCK_AGENT = {
    id: 1,
    innovationScore: 42,
    memoryCount: 1337,
    name: "Cencera Prime"
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0].address);
          fetchAgentData(1);
        }
      } catch (error) {
        console.error("Connection check failed", error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        setWalletAddress(await signer.getAddress());
        fetchAgentData(1);
      } catch (error) {
        console.error("Connection failed", error);
        alert("Failed to connect wallet.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setAgent(null);
  };

  const fetchAgentData = async (agentId) => {
    setLoading(true);
    // Simulating blockchain fetch
    setTimeout(() => {
      setAgent(MOCK_AGENT);
      setLoading(false);
    }, 800);
  };

  const handleSendMessage = async (message) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/chat`, {
        message,
        agentId: agent.id,
        walletAddress
      });
      return response.data.reply;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  return (
    <main className="main-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo-container glow-text">
          <Image
            src="/logo.png"
            alt="Cencera"
            width={32}
            height={32}
            className="logo-img"
          />
          <h1 className="logo-text">CENCERA</h1>
        </div>

        <div className="wallet-container">
          {walletAddress ? (
            <div className="wallet-connected">
              <div className="wallet-badge">
                <span className="dot"></span>
                <span className="address">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
              <button
                onClick={disconnectWallet}
                className="disconnect-btn"
                title="Disconnect Wallet"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                  <line x1="12" y1="2" x2="12" y2="12"></line>
                </svg>
              </button>
            </div>
          ) : (
            <button onClick={connectWallet} className="connect-btn">
              <span>INITIALIZE LINK</span>
              <div className="btn-glow"></div>
            </button>
          )}
        </div>
      </header>

      {/* Hero Content */}
      <div className="content-wrapper">

        {/* Left Panel: Agent Identity */}
        <div className="glass-card agent-panel">
          <div className="panel-header">
            <h2><span className="icon">◈</span> Identity Matrix</h2>
            <div className={`status-indicator ${agent ? 'active' : ''}`}>
              {agent ? 'ONLINE' : 'OFFLINE'}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Establishing Neural Handshake...</p>
            </div>
          ) : agent ? (
            <div className="agent-stats">
              <div className="agent-avatar">
                <div className="avatar-ring"></div>
                <span className="avatar-text">AI</span>
              </div>

              <div className="stat-grid">
                <div className="stat-item large">
                  <span className="stat-label">Designation</span>
                  <span className="stat-value highlight glow-text">{agent.name}</span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">Token ID</span>
                  <span className="stat-value">#{agent.id}</span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">Innovation</span>
                  <span className="stat-value score">{agent.innovationScore}</span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">Memory Blocks</span>
                  <span className="stat-value">{agent.memoryCount}</span>
                </div>
              </div>

              <div className="contract-info">
                <div className="chain-badge">
                  <span className="bnb-icon">❖</span> BNB Testnet
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="lock-icon">🔒</div>
              <p>Connect wallet to access your<br /><strong>Immortal Agent</strong></p>
            </div>
          )}
        </div>

        {/* Right Panel: Neural Interface (Chat) */}
        <div className="glass-card chat-panel">
          <Chat
            agentId={agent?.id}
            walletAddress={walletAddress}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>

      <style jsx>{`
        .main-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 40px;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Navbar */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100px;
          padding: 0;
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: default;
        }
        .logo-text {
          font-family: var(--font-mono);
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 4px;
          color: white;
          margin: 0;
        }
        
        .wallet-connected {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wallet-badge {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--neon-cyan);
          padding: 10px 20px;
          border-radius: 4px;
          font-family: var(--font-mono);
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.1);
        }
        .dot {
          width: 8px;
          height: 8px;
          background: var(--neon-cyan);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--neon-cyan);
          animation: pulse 2s infinite;
        }
        .address {
          color: var(--neon-cyan);
          font-weight: 600;
          letter-spacing: 1px;
        }

        .disconnect-btn {
          background: rgba(255, 50, 50, 0.1);
          border: 1px solid rgba(255, 50, 50, 0.3);
          width: 42px;
          height: 42px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ff4444;
          transition: all 0.2s;
        }
        .disconnect-btn:hover {
          background: rgba(255, 50, 50, 0.2);
          border-color: #ff4444;
          box-shadow: 0 0 10px rgba(255, 50, 50, 0.2);
        }
        .disconnect-btn svg {
          width: 20px;
          height: 20px;
        }

        .connect-btn {
          position: relative;
          background: transparent;
          color: var(--neon-cyan);
          border: 1px solid var(--neon-cyan);
          padding: 12px 32px;
          font-family: var(--font-mono);
          font-weight: 700;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s;
          overflow: hidden;
          text-transform: uppercase;
        }
        .connect-btn:hover {
          background: rgba(0, 243, 255, 0.1);
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.2);
          text-shadow: 0 0 8px var(--neon-cyan);
        }

        /* Layout */
        .content-wrapper {
          display: flex;
          gap: 40px;
          flex: 1;
          margin-bottom: 60px;
          margin-top: 20px;
        }
        
        .glass-card {
          background: var(--glass-bg);
          border: var(--glass-border);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          box-shadow: var(--card-shadow);
        }

        /* Agent Panel */
        .agent-panel {
          flex: 1;
          max-width: 450px;
          min-width: 350px;
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 20px;
        }
        .panel-header h2 {
          margin: 0;
          font-size: 1.2rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .panel-header .icon {
          color: var(--neon-purple);
        }
        
        .status-indicator {
          font-size: 0.8rem;
          background: rgba(40,40,40,0.8);
          color: #666;
          padding: 6px 12px;
          border-radius: 2px;
          border: 1px solid rgba(255,255,255,0.05);
          font-family: var(--font-mono);
        }
        .status-indicator.active {
          color: var(--neon-green);
          border-color: rgba(10, 255, 104, 0.3);
          background: rgba(10, 255, 104, 0.1);
          box-shadow: 0 0 10px rgba(10, 255, 104, 0.1);
        }

        .agent-stats {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .agent-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--neon-purple);
          align-self: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 0 30px rgba(188, 19, 254, 0.2);
        }
        .avatar-ring {
          position: absolute;
          width: 140%;
          height: 140%;
          border: 1px dashed rgba(188, 19, 254, 0.3);
          border-radius: 50%;
          animation: spin 20s linear infinite;
        }
        .avatar-text {
          font-size: 2rem;
          font-weight: 800;
          color: var(--neon-purple);
        }

        .stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .stat-item {
          background: rgba(255,255,255,0.02);
          padding: 15px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .stat-item.large {
          grid-column: span 2;
          text-align: center;
          background: linear-gradient(90deg, rgba(0, 243, 255, 0.05) 0%, transparent 100%);
          border-left: 2px solid var(--neon-cyan);
        }
        .stat-label {
          display: block;
          color: #666;
          font-size: 0.75rem;
          text-transform: uppercase;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        .stat-value {
          font-family: var(--font-mono);
          font-size: 1.1rem;
          color: white;
        }
        .stat-value.highlight {
          font-size: 1.4rem;
          color: var(--neon-cyan);
        }
        
        .contract-info {
          margin-top: auto;
          text-align: center;
          padding-top: 20px;
        }
        .chain-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #1a1a1a;
          color: #f3ba2f;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #555;
          gap: 20px;
        }
        .lock-icon {
          font-size: 3rem;
          opacity: 0.3;
        }
        
        .loading-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: var(--neon-cyan);
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(0, 243, 255, 0.1);
          border-top-color: var(--neon-cyan);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Chat Panel */
        .chat-panel {
          flex: 2;
          padding: 0; /* Chat component handles its own padding */
          overflow: hidden;
          position: relative;
        }
        .chat-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 12px;
          box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
          pointer-events: none;
          z-index: 10;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        
        /* Mobile Responsive */
        @media (max-width: 968px) {
          .content-wrapper {
            flex-direction: column;
          }
          .agent-panel {
            max-width: 100%;
          }
          .main-container {
            padding: 0 20px;
            height: auto;
          }
          .navbar {
            height: 80px;
          }
        }
      `}</style>
    </main>
  );
}

