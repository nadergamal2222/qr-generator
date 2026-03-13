'use client';

import { useState } from 'react';
import QRGenerator from '@/components/QRGenerator';
import BatchQRGenerator from '@/components/BatchQRGenerator';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');

  return (
    <main className="main-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Create Stunning
              <span className="gradient-text"> QR Codes</span>
            </h1>
            <p className="hero-description">
              Generate high-quality, customizable QR codes with custom colors, logos, and designs.
              Perfect for marketing, business cards, and more.
            </p>
            <div className="hero-features">
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <span>High Quality</span>
              </div>
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
                </svg>
                <span>Fully Customizable</span>
              </div>
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Instant Download</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generator Section with Tabs */}
      <section className="generator-section">
        <div className="container">
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'single' ? 'active' : ''}`}
                onClick={() => setActiveTab('single')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                Single QR Code
              </button>
              <button
                className={`tab ${activeTab === 'batch' ? 'active' : ''}`}
                onClick={() => setActiveTab('batch')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="8" height="8" />
                  <rect x="14" y="2" width="8" height="8" />
                  <rect x="2" y="14" width="8" height="8" />
                  <rect x="14" y="14" width="8" height="8" />
                </svg>
                Batch Generator
              </button>
            </div>
          </div>

          <div className="tab-content">
            {activeTab === 'single' ? <QRGenerator /> : <BatchQRGenerator />}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-heading">
            Why Choose Our <span className="gradient-text">QR Generator</span>?
          </h2>
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3>Custom Branding</h3>
              <p>Add your logo to the center of QR codes for enhanced brand recognition.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <h3>Color Customization</h3>
              <p>Choose any color combination to match your brand or design aesthetic.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <h3>Multiple Formats</h3>
              <p>Download your QR codes as PNG or SVG for any use case.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3>Error Correction</h3>
              <p>Adjustable error correction levels ensure your QR codes work even if damaged.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3>Instant Preview</h3>
              <p>See your QR code update in real-time as you customize it.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3>High Resolution</h3>
              <p>Generate QR codes up to 1024px for crisp, clear scanning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="footer-text">
            Built with ❤️ using Next.js | Free QR Code Generator
          </p>
        </div>
      </footer>

      <style jsx>{`
        .main-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .hero-section {
          padding: var(--spacing-xl) 0;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: var(--spacing-md);
          letter-spacing: -0.02em;
        }

        .hero-description {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          margin-bottom: var(--spacing-lg);
          line-height: 1.6;
        }

        .hero-features {
          display: flex;
          justify-content: center;
          gap: var(--spacing-lg);
          flex-wrap: wrap;
          margin-top: var(--spacing-xl);
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-md);
          background: var(--bg-card);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          transition: all var(--transition-base);
        }

        .feature-item:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: var(--shadow-glow);
        }

        .feature-icon {
          width: 32px;
          height: 32px;
          color: var(--primary-light);
        }

        .feature-item span {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .generator-section {
          padding: var(--spacing-lg) 0;
        }

        .tabs-container {
          margin-bottom: var(--spacing-lg);
        }

        .tabs {
          display: flex;
          gap: var(--spacing-sm);
          justify-content: center;
          background: var(--bg-card);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xs);
          width: fit-content;
          margin: 0 auto;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
          white-space: nowrap;
        }

        .tab:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .tab.active {
          background: var(--gradient-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .tab svg {
          flex-shrink: 0;
        }

        .tab-content {
          animation: fadeIn 0.4s ease-out;
        }

        .features-section {
          padding: var(--spacing-xl) 0;
          background: linear-gradient(180deg, transparent 0%, var(--bg-secondary) 50%, transparent 100%);
        }

        .section-heading {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-lg);
        }

        .feature-card {
          text-align: center;
          padding: var(--spacing-lg);
        }

        .feature-card-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--gradient-primary);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-card-icon svg {
          width: 100%;
          height: 100%;
          color: white;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: var(--spacing-sm);
          color: var(--text-primary);
        }

        .feature-card p {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .footer {
          margin-top: auto;
          padding: var(--spacing-lg) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-text {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .hero-features {
            gap: var(--spacing-sm);
          }

          .feature-item {
            padding: var(--spacing-sm);
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
