'use client';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Chat from './components/Chat';
import Modal from './components/Modal';

interface Agent {
  id: string;
  owner: string;
  innovationScore: string;
  memoryCount: string;
  name: string;
  isIdentityRegistered: boolean;
  isAuthorized: boolean;
}

interface ModalData {
  message: string;
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'identity' | 'auth' | 'success' | null>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  // Constants
  const BACKEND_URL = 'http://localhost:3001';
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xCA10569a993154c051E0F4306172743375E63fC1';

  // Smart Contract ABI definitions
  const ABI = [
    "function getAgentsByOwner(address _owner) external view returns (uint256[])",
    "function getAgent(uint256 _agentId) view returns (tuple(uint256 id, address owner, uint96 innovationScore, string memoryHash))",
    "function createAgent(string calldata _initialMemoryHash) external returns (uint256)",
    "function registerIdentity(string calldata _did, string calldata _personalDataHash) external",
    "function authorizeAgent(address _agentAddress) external",
    "function identities(address) view returns (tuple(string did, string personalDataHash, bool isActive))",
    "function authorizedAgents(address, address) view returns (bool)"
  ];

  // The Bot's Public Address
  const BOT_PUBLIC_ADDRESS = '0xCA10569a993154c051E0F4306172743375E63fC1';

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
          fetchAgentData(accounts[0].address);
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
        const address = await signer.getAddress();
        setWalletAddress(address);
        fetchAgentData(address);
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

  const fetchAgentData = async (address: string) => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const agentIds: bigint[] = await contract.getAgentsByOwner(address);
      if (agentIds.length > 0) {
        const agentId = agentIds[0];
        const agentData = await contract.getAgent(agentId);

        // Check if Identity is registered
        const identityData = await contract.identities(address);

        // Check if Bot is authorized
        const isBotAuthorized: boolean = await contract.authorizedAgents(address, BOT_PUBLIC_ADDRESS);

        setAgent({
          id: agentId.toString(),
          owner: agentData.owner,
          innovationScore: agentData.innovationScore.toString(),
          memoryCount: agentData.innovationScore.toString(),
          name: "Cencera Prime",
          isIdentityRegistered: identityData.isActive,
          isAuthorized: isBotAuthorized
        });
      } else {
        setAgent(null);
      }
    } catch (error) {
      console.error("Failed to fetch agent from blockchain:", error);
      setAgent(null);
    } finally {
      setLoading(false);
    }
  };

  const initializeAgent = async () => {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.createAgent("Genesis Memory");
      await tx.wait();

      await fetchAgentData(walletAddress);
    } catch (error) {
      console.error("Failed to initialize agent:", error);
      alert("Transaction failed.");
      setLoading(false);
    }
  };

  const registerIdentity = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const did = `did:cencera:${walletAddress}`;
      const tx = await contract.registerIdentity(did, "ipfs://genesis_identity");
      await tx.wait();

      setModalData({ message: "Sovereign Identity registered! Your DID is now live on BNB Chain." });
      setModalType('success');
      await fetchAgentData(walletAddress);
    } catch (error) {
      console.error("Identity registration failed:", error);
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const authorizeAgentAction = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.authorizeAgent(BOT_PUBLIC_ADDRESS);
      await tx.wait();

      setModalData({ message: "Autonomous Delegation Active! The bot can now protect your innovation." });
      setModalType('success');
      await fetchAgentData(walletAddress);
    } catch (error) {
      console.error("Authorization failed:", error);
      alert("Authorization failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      const response = await axios.post(`${BACKEND_URL}/chat`, {
        message,
        agentId: agent?.id,
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
          <div className="logo-icon">C</div>
          <h1 className="logo-text">CENCERA AI</h1>
        </div>

        <div className="nav-badges">
          <img src="https://img.shields.io/badge/innovationlab-3D8BD3" alt="Innovation Lab" />
          <img src="https://img.shields.io/badge/asi-3D8BD3" alt="ASI" />
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
              <button onClick={disconnectWallet} className="disconnect-btn">退出</button>
            </div>
          ) : (
            <button onClick={connectWallet} className="connect-btn">Connect Wallet</button>
          )}
        </div>
      </header>

      {/* Hero Content */}
      <div className="content-wrapper">

        {/* Left Panel: Agent Identity */}
        <div className="glass-card agent-panel">
          <div className="panel-header">
            <h2><span className="icon">◈</span> IDENTITY MATRIX</h2>
            <div className={`status-indicator ${agent ? 'active' : ''}`}>
              {agent ? 'CORE ONLINE' : 'SYSTEM STANDBY'}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cognitive Sync in Progress...</p>
            </div>
          ) : agent ? (
            <div className="agent-content">
              <div className="agent-avatar">
                <div className="avatar-core">ASI</div>
                <div className="avatar-rings">
                  <div className="ring"></div>
                  <div className="ring"></div>
                </div>
              </div>

              <div className="stat-grid">
                <div className="stat-card full">
                  <span className="stat-label">Designation</span>
                  <span className="stat-value highlight">{agent.name}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Innovation</span>
                  <span className="stat-value">{agent.innovationScore}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Token ID</span>
                  <span className="stat-value">#{agent.id}</span>
                </div>
              </div>

              <div className="action-center">
                <h3>SECURITY & PERMISSIONS</h3>
                {!agent.isIdentityRegistered ? (
                  <button onClick={() => setModalType('identity')} className="action-btn primary">REGISTER DID IDENTITY</button>
                ) : (
                  <div className="success-tag">D.I.D SECURED</div>
                )}

                {!agent.isAuthorized ? (
                  <button onClick={() => setModalType('auth')} className="action-btn secondary">AUTHORIZE BOT ACCESS</button>
                ) : (
                  <div className="success-tag active">AGENT AUTHORIZED</div>
                )}
              </div>
            </div>
          ) : walletAddress ? (
            <div className="empty-state">
              <div className="icon">🧬</div>
              <p>No Agent found for this wallet address.</p>
              <button onClick={initializeAgent} className="action-btn pulse">CREATE NEW AGENT</button>
            </div>
          ) : (
            <div className="empty-state">
              <div className="icon">🔒</div>
              <p>Please establish a neural link by connecting your wallet.</p>
            </div>
          )}
        </div>

        {/* Right Panel: Neural Interface (Chat) */}
        <div className="glass-card chat-panel">
          <Chat agentId={agent?.id} walletAddress={walletAddress} onSendMessage={handleSendMessage} />
        </div>
      </div>

      {/* Identity Registration Modal */}
      <Modal
        isOpen={modalType === 'identity'}
        onClose={() => setModalType(null)}
        title="Register Sovereign Identity"
        footer={(
          <>
            <button className="action-btn secondary" onClick={() => setModalType(null)}>CANCEL</button>
            <button className="action-btn primary" onClick={() => { setModalType(null); registerIdentity(); }}>COMMIT TO CHAIN</button>
          </>
        )}
      >
        <p>You are about to link your wallet to a <strong>Decentralized Identifier (DID)</strong>.</p>
        <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#888' }}>This creates a permanent, verifiable identity for your AI agent on the BNB Chain. This action requires a small gas fee.</p>
      </Modal>

      {/* Bot Authorization Modal */}
      <Modal
        isOpen={modalType === 'auth'}
        onClose={() => setModalType(null)}
        title="Authorize Autonomous Agency"
        footer={(
          <>
            <button className="action-btn secondary" onClick={() => setModalType(null)}>DECLINE</button>
            <button className="action-btn primary" onClick={() => { setModalType(null); authorizeAgentAction(); }}>GRANT PERMISSION</button>
          </>
        )}
      >
        <p>Authorizing the <strong>Cencera Bot</strong> allows it to:</p>
        <ul style={{ marginTop: '15px', paddingLeft: '20px', fontSize: '0.9rem' }}>
          <li style={{ marginBottom: '8px' }}>Update your Innovation Score autonomously.</li>
          <li style={{ marginBottom: '8px' }}>Perform token swaps based on AI reasoning.</li>
          <li style={{ marginBottom: '8px' }}>Manage decentralized memory updates.</li>
        </ul>
        <p style={{ marginTop: '15px', color: 'var(--neon-cyan)', fontWeight: '700' }}>Security: The bot NEVER sees your private key.</p>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={modalType === 'success'}
        onClose={() => setModalType(null)}
        title="Action Confirmed"
        footer={<button className="action-btn primary" onClick={() => setModalType(null)}>ACKNOWLEDGE</button>}
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✅</div>
          <p>{modalData?.message || "Operation completed successfully on the BNB Chain."}</p>
        </div>
      </Modal>

      <style jsx>{`
        .main-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: var(--font-main);
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.5rem;
          color: #000;
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.3);
        }
        .logo-text {
          font-family: var(--font-mono);
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 2px;
          margin: 0;
        }

        .nav-badges {
          display: flex;
          gap: 10px;
        }

        .wallet-badge {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px 16px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: var(--neon-green);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--neon-green);
        }

        .connect-btn {
          background: var(--neon-cyan);
          color: #000;
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .connect-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 243, 255, 0.4);
        }

        .content-wrapper {
          display: flex;
          gap: 30px;
          flex: 1;
          padding: 30px 0;
          overflow: hidden;
        }

        .glass-card {
          background: var(--glass-bg);
          border: var(--glass-border);
          border-radius: 16px;
          box-shadow: var(--card-shadow);
          display: flex;
          flex-direction: column;
        }

        .agent-panel {
          width: 400px;
          padding: 30px;
        }

        .panel-header {
          margin-bottom: 30px;
        }
        .panel-header h2 {
          font-size: 0.9rem;
          color: #666;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .status-indicator {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: #444;
        }
        .status-indicator.active {
          color: var(--neon-green);
        }

        .agent-avatar {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-core {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--neon-purple);
          z-index: 2;
          text-shadow: 0 0 20px var(--neon-purple);
        }
        .avatar-rings .ring {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border: 1px solid rgba(188, 19, 254, 0.2);
          border-radius: 50%;
          animation: rotate 10s linear infinite;
        }
        .avatar-rings .ring:nth-child(2) {
          border: 1px dashed var(--neon-purple);
          animation-duration: 20s;
          animation-direction: reverse;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: rgba(255,255,255,0.02);
          padding: 15px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .stat-card.full { grid-column: span 2; }
        .stat-label { font-size: 0.7rem; color: #555; display: block; margin-bottom: 5px; text-transform: uppercase; }
        .stat-value { font-family: var(--font-mono); font-size: 1.1rem; color: #fff; }
        .stat-value.highlight { color: var(--neon-cyan); font-size: 1.3rem; font-weight: 700; }

        .action-center {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .action-center h3 { font-size: 0.8rem; color: #444; letter-spacing: 1px; margin-bottom: 10px; }
        
        .action-btn {
          padding: 12px;
          border-radius: 8px;
          border: none;
          font-weight: 700;
          font-family: var(--font-main);
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn.primary { background: var(--neon-purple); color: #fff; }
        .action-btn.secondary { background: transparent; border: 1px solid var(--neon-cyan); color: var(--neon-cyan); }
        .action-btn:hover { opacity: 0.8; transform: translateY(-2px); }

        .success-tag {
          font-size: 0.8rem;
          font-weight: 700;
          color: #444;
          text-align: center;
          padding: 10px;
          border: 1px solid #222;
          border-radius: 8px;
        }
        .success-tag.active { color: var(--neon-green); border-color: var(--neon-green); background: rgba(10, 255, 104, 0.05); }

        .chat-panel {
          flex: 1;
          overflow: hidden;
        }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px;
        }
        .empty-state .icon { font-size: 4rem; margin-bottom: 20px; opacity: 0.2; }
        .empty-state p { color: #666; font-size: 1.1rem; margin-bottom: 30px; }

        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .disconnect-btn {
          background: transparent;
          border: 1px solid rgba(255,0,0,0.3);
          color: #ff4444;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.7rem;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
