'use client';
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-content">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .modal-container {
          background: var(--glass-bg);
          border: 1px solid rgba(0, 243, 255, 0.2);
          width: 90%;
          max-width: 500px;
          border-radius: 12px;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 243, 255, 0.1);
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
        }

        .modal-title {
          font-family: var(--font-mono);
          font-size: 1rem;
          margin: 0;
          color: var(--neon-cyan);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #666;
          font-size: 1.5rem;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0;
          line-height: 1;
        }

        .close-btn:hover {
          color: var(--neon-pink);
        }

        .modal-content {
          padding: 24px;
          color: #ccc;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: rgba(255, 255, 255, 0.01);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
