'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    generateQRCodeWithLogo,
    downloadQRCode,
    generateAndDownloadSVG,
    isValidUrl,
    type QRCodeOptions,
} from '@/lib/qrUtils';

export default function QRGenerator() {
    const [url, setUrl] = useState('');
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    // Customization options
    const [size, setSize] = useState(512);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
    const [logo, setLogo] = useState<string>('');

    // Generate QR code
    const generateQR = useCallback(async () => {
        if (!url.trim()) {
            setError('Please enter a URL');
            setQrDataUrl('');
            return;
        }

        if (!isValidUrl(url)) {
            setError('Please enter a valid URL');
            setQrDataUrl('');
            return;
        }

        setError('');
        setIsGenerating(true);

        try {
            const options: QRCodeOptions = {
                url,
                size,
                fgColor,
                bgColor,
                errorCorrectionLevel,
                logo: logo || undefined,
            };

            const dataUrl = await generateQRCodeWithLogo(options);
            setQrDataUrl(dataUrl);
        } catch (err) {
            setError('Failed to generate QR code. Please try again.');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    }, [url, size, fgColor, bgColor, errorCorrectionLevel, logo]);

    // Auto-generate on option changes (debounced)
    useEffect(() => {
        if (!url.trim() || !isValidUrl(url)) return;

        const timer = setTimeout(() => {
            generateQR();
        }, 500);

        return () => clearTimeout(timer);
    }, [url, size, fgColor, bgColor, errorCorrectionLevel, logo, generateQR]);

    // Handle logo upload
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setLogo(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Download handlers
    const handleDownloadPNG = () => {
        if (qrDataUrl) {
            downloadQRCode(qrDataUrl, 'qrcode.png');
        }
    };

    const handleDownloadSVG = async () => {
        if (!url.trim() || !isValidUrl(url)) return;

        try {
            const options: QRCodeOptions = {
                url,
                size,
                fgColor,
                bgColor,
                errorCorrectionLevel,
            };
            await generateAndDownloadSVG(options, 'qrcode.svg');
        } catch (err) {
            setError('Failed to download SVG. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="qr-generator">
            <div className="generator-container">
                {/* Input Section */}
                <div className="input-section card">
                    <h2 className="section-title">Enter URL</h2>
                    <input
                        type="text"
                        className="input url-input"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generateQR()}
                    />
                    {error && <p className="error-message">{error}</p>}

                    <button
                        className="btn btn-primary generate-btn"
                        onClick={generateQR}
                        disabled={isGenerating || !url.trim()}
                    >
                        {isGenerating ? 'Generating...' : 'Generate QR Code'}
                    </button>
                </div>

                {/* Customization Section */}
                <div className="customization-section card">
                    <h2 className="section-title">Customize Design</h2>

                    <div className="control-group">
                        <label htmlFor="size">Size: {size}px</label>
                        <input
                            id="size"
                            type="range"
                            min="256"
                            max="1024"
                            step="64"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            className="slider"
                        />
                    </div>

                    <div className="color-controls">
                        <div className="control-group">
                            <label htmlFor="fgColor">Foreground Color</label>
                            <div className="color-input-wrapper">
                                <input
                                    id="fgColor"
                                    type="color"
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    className="color-picker"
                                />
                                <input
                                    type="text"
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    className="input color-text"
                                    placeholder="#000000"
                                />
                            </div>
                        </div>

                        <div className="control-group">
                            <label htmlFor="bgColor">Background Color</label>
                            <div className="color-input-wrapper">
                                <input
                                    id="bgColor"
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="color-picker"
                                />
                                <input
                                    type="text"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="input color-text"
                                    placeholder="#ffffff"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="control-group">
                        <label htmlFor="errorCorrection">Error Correction</label>
                        <select
                            id="errorCorrection"
                            value={errorCorrectionLevel}
                            onChange={(e) => setErrorCorrectionLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                            className="input"
                        >
                            <option value="L">Low (7%)</option>
                            <option value="M">Medium (15%)</option>
                            <option value="Q">Quartile (25%)</option>
                            <option value="H">High (30%)</option>
                        </select>
                    </div>

                    <div className="control-group">
                        <label htmlFor="logo">Add Logo (Optional)</label>
                        <input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="file-input"
                        />
                        {logo && (
                            <button
                                onClick={() => setLogo('')}
                                className="btn btn-secondary remove-logo-btn"
                            >
                                Remove Logo
                            </button>
                        )}
                    </div>
                </div>

                {/* Preview Section */}
                <div className="preview-section card">
                    <h2 className="section-title">Preview</h2>

                    <div className="qr-preview">
                        {qrDataUrl ? (
                            <img src={qrDataUrl} alt="QR Code" className="qr-image" />
                        ) : (
                            <div className="qr-placeholder">
                                <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                                    <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                                    <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                                    <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
                                </svg>
                                <p>Your QR code will appear here</p>
                            </div>
                        )}
                    </div>

                    {qrDataUrl && (
                        <div className="download-buttons">
                            <button onClick={handleDownloadPNG} className="btn btn-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Download PNG
                            </button>
                            <button onClick={handleDownloadSVG} className="btn btn-secondary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Download SVG
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        .qr-generator {
          width: 100%;
          padding: var(--spacing-xl) 0;
        }

        .generator-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--spacing-lg);
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-md);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--spacing-md);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .url-input {
          margin-bottom: var(--spacing-sm);
        }

        .error-message {
          color: var(--secondary);
          font-size: 0.875rem;
          margin-bottom: var(--spacing-sm);
          animation: fadeIn 0.3s ease-out;
        }

        .generate-btn {
          width: 100%;
          margin-top: var(--spacing-sm);
        }

        .generate-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .control-group {
          margin-bottom: var(--spacing-md);
        }

        .control-group label {
          display: block;
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          color: var(--text-secondary);
        }

        .slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: var(--bg-secondary);
          outline: none;
          -webkit-appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--gradient-primary);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--gradient-primary);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
        }

        .color-controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .color-input-wrapper {
          display: flex;
          gap: var(--spacing-xs);
          align-items: center;
        }

        .color-picker {
          width: 50px;
          height: 40px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          cursor: pointer;
          background: transparent;
        }

        .color-text {
          flex: 1;
          font-family: monospace;
        }

        .file-input {
          width: 100%;
          padding: var(--spacing-sm);
          background: var(--bg-secondary);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .file-input:hover {
          border-color: var(--primary);
        }

        .remove-logo-btn {
          margin-top: var(--spacing-xs);
          width: 100%;
        }

        .qr-preview {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-md);
        }

        .qr-image {
          max-width: 100%;
          height: auto;
          border-radius: var(--radius-sm);
          animation: fadeIn 0.5s ease-out;
        }

        .qr-placeholder {
          text-align: center;
          color: var(--text-muted);
        }

        .placeholder-icon {
          width: 80px;
          height: 80px;
          margin-bottom: var(--spacing-md);
          opacity: 0.3;
        }

        .download-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-sm);
        }

        @media (max-width: 768px) {
          .generator-container {
            grid-template-columns: 1fr;
          }

          .color-controls {
            grid-template-columns: 1fr;
          }

          .download-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}
