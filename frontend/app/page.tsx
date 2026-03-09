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

interface ActivityLog {
  id: number;
  type: 'analysis' | 'trade' | 'memory' | 'security';
  text: string;
  time: string;
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'identity' | 'auth' | 'success' | 'wallet_select' | null>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

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

    // Simulate Neural Activity Logs
    const logInterval = setInterval(() => {
      const types = ['analysis', 'trade', 'memory', 'security'] as const;
      const texts = [
        "Analyzing BNB Chain liquidity pools...",
        "Deep pattern detected in $CEN volatility.",
        "Updating decentralized memory buffer...",
        "Security Sweep: No unauthorized link found.",
        "Learning from previous trade execution...",
        "ASI-1 Mini reasoning: Optimizing swap path.",
        "Memory evolution: Synapse weight adjusted."
      ];

      const newLog: ActivityLog = {
        id: Date.now(),
        type: types[Math.floor(Math.random() * types.length)],
        text: texts[Math.floor(Math.random() * texts.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setActivities(prev => [newLog, ...prev].slice(0, 8));
    }, 6000);

    return () => clearInterval(logInterval);
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      // Check if user previously chose to disconnect
      if (localStorage.getItem('cencera_disconnected') === 'true') return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum!);
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
        localStorage.removeItem('cencera_disconnected');
        const provider = new ethers.BrowserProvider(window.ethereum!);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        fetchAgentData(address);
      } catch (error) {
        console.error("Connection failed", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    localStorage.setItem('cencera_disconnected', 'true');
    setWalletAddress('');
    setAgent(null);
  };

  const fetchAgentData = async (address: string) => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const agentIds: bigint[] = await contract.getAgentsByOwner(address);
      if (agentIds.length > 0) {
        const agentId = agentIds[0];
        const agentData = await contract.getAgent(agentId);
        const identityData = await contract.identities(address);
        const isBotAuthorized: boolean = await contract.authorizedAgents(address, BOT_PUBLIC_ADDRESS);

        setAgent({
          id: agentId.toString(),
          owner: agentData.owner,
          innovationScore: agentData.innovationScore.toString(),
          memoryCount: agentData.innovationScore.toString(),
          name: "CENCERA.PRIME",
          isIdentityRegistered: identityData.isActive,
          isAuthorized: isBotAuthorized
        });
      } else {
        setAgent(null);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setAgent(null);
    } finally {
      setLoading(false);
    }
  };

  const initializeAgent = async () => {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.createAgent("Genesis Memory");
      await tx.wait();
      await fetchAgentData(walletAddress);
    } catch (error) {
      console.error("Init error:", error);
      setLoading(false);
    }
  };

  const registerIdentity = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const did = `did:cencera:${walletAddress}`;
      const tx = await contract.registerIdentity(did, "ipfs://genesis");
      await tx.wait();
      setModalData({ message: "Sovereign Identity registered! Your DID is now live on BNB Chain." });
      setModalType('success');
      await fetchAgentData(walletAddress);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const authorizeAgentAction = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.authorizeAgent(BOT_PUBLIC_ADDRESS);
      await tx.wait();
      setModalData({ message: "Autonomous Delegation Active! The bot can now protect your innovation." });
      setModalType('success');
      await fetchAgentData(walletAddress);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      const response = await axios.post(`${BACKEND_URL}/chat`, { message, agentId: agent?.id, walletAddress });
      return response.data.reply;
    } catch (error) { throw error; }
  };

  return (
    <main className="container">
      {/* Dynamic Background Noise/Pulse */}
      <div className="bg-vignette"></div>

      <header className="nav">
        <div className="logo">
          <div className="logo-hex">
            <svg viewBox="0 0 100 100" className="hex-svg">
              <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
            </svg>
            <span>C</span>
          </div>
          <div className="logo-text">
            <h2>CENCERA AI</h2>
            <span>NEURAL NETWORK • V0.1</span>
          </div>
        </div>

        <div className="nav-center">
          <div className="badge innovation">INNOVATION LAB</div>
          <div className="badge asi">ASI-1 MINI</div>
        </div>

        <div className="nav-right">
          {walletAddress ? (
            <div className="wallet-pill" onClick={disconnectWallet}>
              <div className="status-dot"></div>
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              <span className="tooltip">DISCONNECT</span>
            </div>
          ) : (
            <button className="connect-btn" onClick={() => setModalType('wallet_select')}>
              CONNECT NEURAL LINK
            </button>
          )}
        </div>
      </header>

      <div className="grid">
        {/* Left: Agent Core */}
        <section className="panel agent-panel">
          <div className="panel-label">IDENTITY MATRIX</div>

          <div className="agent-display">
            {loading ? (
              <div className="sync-overlay">
                <div className="scanline"></div>
                <p>SYNCING NEURAL WEIGHTS...</p>
              </div>
            ) : agent ? (
              <>
                <div className="agent-visual">
                  <div className="cyber-circle">
                    <div className="inner-ring"></div>
                    <div className="core-glow"></div>
                    <span className="asi-label">ASI</span>
                  </div>
                </div>

                <div className="agent-meta">
                  <div className="meta-row">
                    <span className="m-label">DESIGNATION</span>
                    <span className="m-value">{agent.name}</span>
                  </div>
                  <div className="meta-row">
                    <span className="m-label">INNOVATION SCORE</span>
                    <span className="m-value cyan">{agent.innovationScore}</span>
                  </div>
                  <div className="meta-row">
                    <span className="m-label">AGENT ID</span>
                    <span className="m-value">#{agent.id.padStart(4, '0')}</span>
                  </div>
                </div>

                <div className="agent-actions">
                  <div className="permission-group">
                    <span className="group-title">SECURITY PROTOCOLS</span>
                    <div className="p-item">
                      <span>D.I.D. IDENTITY</span>
                      {agent.isIdentityRegistered ? (
                        <span className="p-status active">VERIFIED</span>
                      ) : (
                        <button className="p-btn" onClick={() => setModalType('identity')}>REGISTER</button>
                      )}
                    </div>
                    <div className="p-item">
                      <span>AUTONOMOUS AGENCY</span>
                      {agent.isAuthorized ? (
                        <span className="p-status active">ACTIVE</span>
                      ) : (
                        <button className="p-btn" onClick={() => setModalType('auth')}>AUTHORIZE</button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : walletAddress ? (
              <div className="no-agent">
                <div className="empty-icon">⚠️</div>
                <p>NO NEURAL CORE FOUND</p>
                <button className="init-btn" onClick={initializeAgent}>INITIALIZE AGENT</button>
              </div>
            ) : (
              <div className="no-agent locked">
                <div className="empty-icon">🔒</div>
                <p>ENCRYPTED - LINK REQUIRED</p>
              </div>
            )}
          </div>
        </section>

        {/* Center: Neural Link (Chat) */}
        <section className="panel chat-panel">
          <div className="panel-label">NEURAL INTERFACE</div>
          <Chat agentId={agent?.id} walletAddress={walletAddress} onSendMessage={handleSendMessage} />
        </section>

        {/* Right: Activity Stream */}
        <section className="panel stream-panel">
          <div className="panel-label">SYSTEM TELEMETRY</div>
          <div className="telemetry-box">
            {activities.map(log => (
              <div key={log.id} className={`log-item ${log.type}`}>
                <div className="log-header">
                  <span className="l-type">{log.type.toUpperCase()}</span>
                  <span className="l-time">{log.time}</span>
                </div>
                <p className="l-text">{log.text}</p>
              </div>
            ))}
            {activities.length === 0 && <p className="waiting">BOOTING TELEMETRY STREAM...</p>}
          </div>
        </section>
      </div>

      {/* Wallet Select Modal */}
      <Modal isOpen={modalType === 'wallet_select'} onClose={() => setModalType(null)} title="Select Provider">
        <div className="wallet-options">
          <div className="w-option" onClick={() => { setModalType(null); connectWallet(); }}>
            <div className="w-icon metamask">
              <svg viewBox="0 0 32 32"><path d="M28.024 16.035l-3.238 4.793 4.848-2.618s1.168-.62.91-1.398c-.286-.87-2.52-1.285-2.52-1.285v.508zM19.342 13.91l4.47-1.3l-2.015-4.22s-.415-.815-1.22-.647c-.83.175-1.235.63-1.235.63v5.537z" fill="#E17120" /><path d="M12.658 13.91l-4.47-1.3 2.015-4.22s.415-.815 1.22-.647c.83.175 1.235.63 1.235.63v5.537z" fill="#E17120" /><path d="M3.976 16.035l3.238 4.793-4.848-2.618s-1.168-.62-.91-1.398c.286-.87 2.52-1.285 2.52-1.285v.508z" fill="#E17120" /><path d="M22.56 22.09l1.795-3.08-4.47-1.488s-1.615-.558-1.522.6c.092 1.157-.046 3.968-.046 3.968z" fill="#E17120" /><path d="M9.44 22.09l-1.795-3.08 4.47-1.488s1.615-.558 1.522.6c-.092 1.157.046 3.968.046 3.968z" fill="#E17120" /><path d="M26.417 19.467l-2.062 1.135 1.764 4.545s.31.81.996.65c.67-.156 1.056-.63 1.056-.63l-1.754-5.7z" fill="#E17120" /><path d="M5.583 19.467l2.062 1.135-1.764 4.545s-.31.81-.996.65c-.67-.156-1.056-.63-1.056-.63l1.754-5.7z" fill="#E17120" /><path d="M16 30l-.25-5s-.082-1.734-.84-1.734h-1.82L9.445 22.09s-.6-.23-.6.643c0 .875 1.455 5.617 1.455 5.617s.24.63.85.63H16z" fill="#E17120" /><path d="M16 30l.25-5s.082-1.734.84-1.734h1.82l3.645 1.176s.6-.23.6.643c0 .875-1.455 5.617-1.455 5.617s-.24.63-.85.63H16z" fill="#E17120" /><circle cx="11.5" cy="11.5" r="1" fill="#231F20" /><circle cx="20.5" cy="11.5" r="1" fill="#231F20" /></svg>
            </div>
            <div className="w-info">
              <span className="w-name">METAMASK</span>
              <span className="w-desc">LINK TO YOUR BROWSER EXTENSION</span>
            </div>
            <div className="w-badge">HOT</div>
          </div>

          <div className="w-option disabled">
            <div className="w-icon">WC</div>
            <div className="w-info">
              <span className="w-name">WALLETCONNECT</span>
              <span className="w-desc">SCAN FROM YOUR MOBILE DEVICE</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Identity Modal */}
      <Modal isOpen={modalType === 'identity'} onClose={() => setModalType(null)} title="Identity Registration">
        <p className="mod-desc">Establishing a Decentralized Identifier (DID) locks your agent to this wallet globally. This ensures sovereign data ownership.</p>
        <div className="mod-action">
          <button className="confirm-btn" onClick={registerIdentity}>INITIALIZE REGISTRATION</button>
        </div>
      </Modal>

      {/* Auth Modal */}
      <Modal isOpen={modalType === 'auth'} onClose={() => setModalType(null)} title="Autonomous Agency">
        <p className="mod-desc">Granting authorization allows CENCERA.BOT to perform on-chain actions during your absence. Use with caution.</p>
        <div className="mod-action">
          <button className="confirm-btn pink" onClick={authorizeAgentAction}>GRANT AGENCY</button>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={modalType === 'success'} onClose={() => setModalType(null)} title="Protocol Success">
        <div className="success-content">
          <div className="check-icon">✓</div>
          <p>{modalData?.message}</p>
        </div>
      </Modal>

      <style jsx>{`
        .container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 24px 32px;
          position: relative;
          z-index: 1;
        }

        .bg-vignette {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 50% 50%, transparent, rgba(0,0,0,0.4));
          pointer-events: none;
          z-index: -1;
        }

        /* Nav Styles */
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .logo-hex {
            position: relative;
            width: 42px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .hex-svg {
            position: absolute;
            width: 100%;
            height: 100%;
            fill: none;
            stroke: var(--neon-cyan);
            stroke-width: 2;
            filter: drop-shadow(0 0 5px var(--neon-cyan));
        }
        .logo-hex span {
            font-family: var(--font-mono);
            font-weight: 800;
            font-size: 1.4rem;
            color: #fff;
            z-index: 2;
        }
        .logo-text h2 {
            font-size: 1.2rem;
            letter-spacing: 2px;
            margin: 0;
            line-height: 1;
        }
        .logo-text span {
            font-family: var(--font-mono);
            font-size: 0.6rem;
            color: #555;
            letter-spacing: 1px;
        }

        .nav-center {
            display: flex;
            gap: 12px;
        }
        .badge {
            font-family: var(--font-mono);
            font-size: 0.65rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 4px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: #888;
        }
        .badge.innovation { color: var(--neon-cyan); border-color: rgba(0, 243, 255, 0.2); }
        .badge.asi { color: var(--neon-purple); border-color: rgba(188, 19, 254, 0.2); }

        .wallet-pill {
            background: rgba(0, 243, 255, 0.05);
            border: 1px solid rgba(0, 243, 255, 0.1);
            padding: 10px 18px;
            border-radius: 40px;
            font-family: var(--font-mono);
            font-size: 0.9rem;
            color: var(--neon-cyan);
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
        }
        .wallet-pill:hover { background: rgba(0, 243, 255, 0.1); border-color: var(--neon-cyan); }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--neon-green); box-shadow: 0 0 8px var(--neon-green); }
        .tooltip { 
            position: absolute; top: 110%; right: 0; font-size: 0.6rem; background: #000; padding: 4px 8px; border-radius: 4px;
            opacity: 0; visibility: hidden; transition: 0.3s; 
        }
        .wallet-pill:hover .tooltip { opacity: 1; visibility: visible; }

        .connect-btn {
            background: var(--neon-cyan);
            color: #000;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: var(--font-mono);
            font-weight: 800;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 0 15px rgba(0, 243, 255, 0.2);
        }
        .connect-btn:hover { box-shadow: 0 0 30px rgba(0, 243, 255, 0.5); transform: translateY(-2px); }

        /* Grid Layout */
        .grid {
            display: grid;
            grid-template-columns: 340px 1fr 340px;
            gap: 24px;
            flex: 1;
            overflow: hidden;
            margin-bottom: 12px;
        }

        .panel {
            background: var(--glass-bg);
            border: var(--glass-border);
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
        }
        .panel-label {
            position: absolute;
            top: 20px; left: 24px;
            font-family: var(--font-mono);
            font-size: 0.65rem;
            font-weight: 800;
            color: #444;
            letter-spacing: 2px;
        }

        /* Left Panel */
        .agent-display {
            padding-top: 60px;
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .agent-visual {
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .cyber-circle {
            width: 140px;
            height: 140px;
            border: 2px solid rgba(188, 19, 254, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .inner-ring {
            position: absolute;
            width: 120%; height: 120%;
            border: 1px dashed rgba(0, 243, 255, 0.2);
            border-radius: 50%;
            animation: rotate 20s linear infinite;
        }
        .core-glow {
            width: 60px; height: 60px;
            background: radial-gradient(circle, var(--neon-purple), transparent);
            filter: blur(20px);
            opacity: 0.6;
        }
        .asi-label { position: absolute; font-weight: 900; font-size: 1.8rem; color: #fff; text-shadow: 0 0 15px var(--neon-purple); }

        .agent-meta {
            padding: 0 24px;
            margin-bottom: 30px;
        }
        .meta-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 14px;
            border-bottom: 1px solid rgba(255,255,255,0.03);
            padding-bottom: 8px;
        }
        .m-label { font-family: var(--font-mono); font-size: 0.65rem; color: #444; }
        .m-value { font-weight: 700; font-size: 1rem; }
        .m-value.cyan { color: var(--neon-cyan); }

        .agent-actions { padding: 0 24px 24px; }
        .permission-group {
            background: rgba(0,0,0,0.2);
            padding: 16px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.02);
        }
        .group-title { display: block; font-size: 0.6rem; font-weight: 800; color: #666; margin-bottom: 12px; letter-spacing: 1px; }
        .p-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-size: 0.75rem;
            color: #888;
            font-weight: 600;
        }
        .p-status.active { color: var(--neon-green); font-weight: 800; }
        .p-btn {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.65rem;
            font-weight: 800;
            cursor: pointer;
            transition: 0.2s;
        }
        .p-btn:hover { background: var(--neon-cyan); color: #000; border-color: var(--neon-cyan); }

        /* Sync Overlay */
        .sync-overlay {
            flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
            position: relative;
        }
        .scanline {
            width: 100%; height: 2px; background: rgba(0, 243, 255, 0.4);
            position: absolute; top: 0; left: 0;
            animation: scan 3s linear infinite;
        }
        .sync-overlay p { font-family: var(--font-mono); font-size: 0.7rem; color: var(--neon-cyan); letter-spacing: 2px; }

        /* Telemetry Stream */
        .stream-panel { padding-top: 60px; }
        .telemetry-box {
            flex: 1; padding: 0 24px 24px;
            overflow-y: auto;
            display: flex; flex-direction: column; gap: 12px;
        }
        .log-item {
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.02);
            padding: 12px;
            border-radius: 10px;
            transition: 0.2s;
        }
        .log-item:hover { background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.05); }
        .log-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .l-type { font-family: var(--font-mono); font-size: 0.6rem; font-weight: 800; }
        .l-time { color: #555; font-size: 0.6rem; }
        .l-text { font-size: 0.75rem; color: #888; line-height: 1.4; }

        .log-item.analysis .l-type { color: var(--neon-cyan); }
        .log-item.trade .l-type { color: var(--neon-green); }
        .log-item.memory .l-type { color: var(--neon-purple); }
        .log-item.security .l-type { color: var(--neon-pink); }

        .no-agent {
            flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
            text-align: center; color: #555;
        }
        .empty-icon { font-size: 2.5rem; margin-bottom: 16px; opacity: 0.5; }
        .init-btn {
            background: transparent; border: 1px solid var(--neon-cyan); color: var(--neon-cyan);
            padding: 12px 24px; border-radius: 8px; font-weight: 800; margin-top: 20px; cursor: pointer;
            transition: 0.3s;
        }
        .init-btn:hover { background: var(--neon-cyan); color: #000; box-shadow: 0 0 20px var(--neon-cyan); }

        /* Wallet Select UI */
        .wallet-options { display: flex; flex-direction: column; gap: 12px; }
        .w-option {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            padding: 16px; border-radius: 12px;
            display: flex; align-items: center; gap: 16px;
            cursor: pointer; transition: 0.2s;
            position: relative;
        }
        .w-option:hover:not(.disabled) { border-color: var(--neon-cyan); background: rgba(0, 243, 255, 0.05); transform: translateX(5px); }
        .w-option.disabled { opacity: 0.3; cursor: not-allowed; }
        .w-icon { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
        .w-info { display: flex; flex-direction: column; }
        .w-name { font-weight: 800; font-size: 0.9rem; color: #fff; }
        .w-desc { font-size: 0.7rem; color: #555; }
        .w-badge { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 0.55rem; font-weight: 900; background: var(--neon-cyan); color: #000; padding: 2px 6px; border-radius: 4px; }

        /* Modal specific details */
        .mod-desc { color: #777; font-size: 0.9rem; line-height: 1.6; margin-bottom: 24px; }
        .confirm-btn {
            width: 100%; background: var(--neon-cyan); color: #000; font-weight: 800;
            padding: 14px; border: none; border-radius: 12px; cursor: pointer; transition: 0.3s;
        }
        .confirm-btn.pink { background: var(--neon-pink); color: #fff; }
        .confirm-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }

        .success-content { text-align: center; padding: 20px 0; }
        .check-icon { width: 60px; height: 60px; background: var(--neon-green); color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 2rem; font-weight: 900; }

        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: 0; } to { top: 100%; } }
      `}</style>
    </main>
  );
}
