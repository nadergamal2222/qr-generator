'use client';

import { useState } from 'react';
import {
    generateQRCodeWithLogo,
    downloadQRCode,
    isValidUrl,
    type QRCodeOptions,
} from '@/lib/qrUtils';

interface QRItem {
    id: string;
    url: string;
    label: string;
    logo?: string;
    qrDataUrl?: string;
    isGenerating?: boolean;
    error?: string;
}

export default function BatchQRGenerator() {
    const [items, setItems] = useState<QRItem[]>([
        { id: '1', url: '', label: '' }
    ]);
    const [isGeneratingAll, setIsGeneratingAll] = useState(false);

    // Global customization options
    const [size, setSize] = useState(512);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [labelBgColor, setLabelBgColor] = useState('#6366f1'); // Label background color
    const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
    const [logo, setLogo] = useState<string>('');

    // Add new URL field
    const addNewItem = () => {
        setItems([...items, { id: Date.now().toString(), url: '', label: '' }]);
    };

    // Remove URL field
    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    // Update URL
    const updateUrl = (id: string, url: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, url, error: undefined } : item
        ));
    };

    // Update label
    const updateLabel = (id: string, label: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, label } : item
        ));
    };

    // Generate single QR code
    const generateSingleQR = async (id: string) => {
        const item = items.find(i => i.id === id);
        if (!item || !item.url.trim()) return;

        if (!isValidUrl(item.url)) {
            setItems(items.map(i =>
                i.id === id ? { ...i, error: 'Invalid URL' } : i
            ));
            return;
        }

        setItems(items.map(i =>
            i.id === id ? { ...i, isGenerating: true, error: undefined } : i
        ));

        try {
            // Capture current global settings to avoid stale closure
            const currentSize = size;
            const currentFgColor = fgColor;
            const currentBgColor = bgColor;
            const currentErrorLevel = errorCorrectionLevel;
            const currentLogo = logo;

            const options: QRCodeOptions = {
                url: item.url,
                size: currentSize,
                fgColor: currentFgColor,
                bgColor: currentBgColor,
                errorCorrectionLevel: currentErrorLevel,
                logo: item.logo || currentLogo || undefined, // Use item logo first, then global logo
            };

            const dataUrl = await generateQRCodeWithLogo(options);
            setItems(items.map(i =>
                i.id === id ? { ...i, qrDataUrl: dataUrl, isGenerating: false } : i
            ));
        } catch (err) {
            setItems(items.map(i =>
                i.id === id ? { ...i, error: 'Failed to generate', isGenerating: false } : i
            ));
        }
    };

    // Generate all QR codes
    const generateAllQRCodes = async () => {
        const validItems = items.filter(item => item.url.trim() && isValidUrl(item.url));

        if (validItems.length === 0) {
            alert('Please add at least one valid URL');
            return;
        }

        setIsGeneratingAll(true);

        for (const item of validItems) {
            await generateSingleQR(item.id);
        }

        setIsGeneratingAll(false);
    };

    // Download single QR code as PNG with label
    const downloadPNG = async (item: QRItem) => {
        if (!item.qrDataUrl) return;

        try {
            let finalDataUrl = item.qrDataUrl;

            // Add label if provided
            if (item.label) {
                const { addLabelToQRCode } = await import('@/lib/qrUtils');
                finalDataUrl = await addLabelToQRCode(item.qrDataUrl, item.label, size, labelBgColor);
            }

            const filename = item.label
                ? `${item.label.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qrcode.png`
                : 'qrcode.png';

            const { downloadQRCode } = await import('@/lib/qrUtils');
            downloadQRCode(finalDataUrl, filename);
        } catch (err) {
            console.error('Failed to download PNG:', err);
        }
    };

    // Download single QR code as SVG (actually PNG with label for consistency)
    const downloadSVG = async (item: QRItem) => {
        if (!item.url.trim() || !isValidUrl(item.url)) return;

        try {
            // Capture current settings
            const currentSize = size;
            const currentFgColor = fgColor;
            const currentBgColor = bgColor;
            const currentErrorLevel = errorCorrectionLevel;
            const currentLabelBgColor = labelBgColor;

            // Generate QR code first
            const QRCode = (await import('qrcode')).default;
            const { normalizeUrl } = await import('@/lib/qrUtils');

            const qrDataUrl = await QRCode.toDataURL(normalizeUrl(item.url), {
                width: currentSize,
                margin: 2,
                color: {
                    dark: currentFgColor,
                    light: currentBgColor,
                },
                errorCorrectionLevel: currentErrorLevel,
            });

            let finalDataUrl = qrDataUrl;

            // Add label if provided
            if (item.label) {
                const { addLabelToQRCode } = await import('@/lib/qrUtils');
                finalDataUrl = await addLabelToQRCode(qrDataUrl, item.label, currentSize, currentLabelBgColor);
            }

            const filename = item.label
                ? `${item.label.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qrcode.png`
                : 'qrcode.png';

            const { downloadQRCode } = await import('@/lib/qrUtils');
            downloadQRCode(finalDataUrl, filename);
        } catch (err) {
            console.error('Failed to download:', err);
        }
    };

    // Download all QR codes as PNG
    const downloadAllPNG = async () => {
        // Capture settings once for all downloads
        const currentSize = size;
        const currentLabelBgColor = labelBgColor;

        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if (item.qrDataUrl) {
                await new Promise(resolve => setTimeout(resolve, index * 300));

                try {
                    let finalDataUrl = item.qrDataUrl;

                    if (item.label) {
                        const { addLabelToQRCode } = await import('@/lib/qrUtils');
                        finalDataUrl = await addLabelToQRCode(item.qrDataUrl, item.label, currentSize, currentLabelBgColor);
                    }

                    const filename = item.label
                        ? `${item.label.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qrcode.png`
                        : `qrcode_${index + 1}.png`;

                    const { downloadQRCode } = await import('@/lib/qrUtils');
                    downloadQRCode(finalDataUrl, filename);
                } catch (err) {
                    console.error('Failed to download PNG:', err);
                }
            }
        }
    };

    // Download all QR codes as SVG (PNG with labels)
    const downloadAllSVG = async () => {
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if (item.qrDataUrl) {
                await new Promise(resolve => setTimeout(resolve, index * 300));
                await downloadSVG(item);
            }
        }
    };

    // Download all as ZIP file
    const downloadAllAsZip = async () => {
        try {
            // Capture current settings
            const currentSize = size;
            const currentFgColor = fgColor;
            const currentBgColor = bgColor;
            const currentErrorLevel = errorCorrectionLevel;
            const currentLabelBgColor = labelBgColor;

            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();

            // Create folders
            const pngFolder = zip.folder('PNG');
            const svgFolder = zip.folder('SVG');

            if (!pngFolder || !svgFolder) {
                throw new Error('Failed to create zip folders');
            }

            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                if (!item.qrDataUrl || !item.url.trim() || !isValidUrl(item.url)) continue;

                const baseName = item.label
                    ? item.label.replace(/[^a-z0-9]/gi, '_').toLowerCase()
                    : `qrcode_${index + 1}`;

                // Add PNG with label
                try {
                    let pngDataUrl = item.qrDataUrl;

                    if (item.label) {
                        const { addLabelToQRCode } = await import('@/lib/qrUtils');
                        pngDataUrl = await addLabelToQRCode(item.qrDataUrl, item.label, currentSize, currentLabelBgColor);
                    }

                    // Convert data URL to blob
                    const pngBase64 = pngDataUrl.split(',')[1];
                    pngFolder.file(`${baseName}.png`, pngBase64, { base64: true });
                } catch (err) {
                    console.error(`Failed to add PNG for ${baseName}:`, err);
                }

                // Add SVG (actual vector SVG without label)
                try {
                    const QRCode = (await import('qrcode')).default;
                    const { normalizeUrl } = await import('@/lib/qrUtils');

                    // Generate actual SVG
                    const svg = await QRCode.toString(normalizeUrl(item.url), {
                        type: 'svg',
                        width: currentSize,
                        margin: 2,
                        color: {
                            dark: currentFgColor,
                            light: currentBgColor,
                        },
                        errorCorrectionLevel: currentErrorLevel,
                    });

                    svgFolder.file(`${baseName}.svg`, svg);
                } catch (err) {
                    console.error(`Failed to add SVG for ${baseName}:`, err);
                }
            }

            // Generate and download zip
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'qr_codes.zip';
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to create zip file:', err);
            alert('Failed to create zip file. Please try again.');
        }
    };

    // Handle individual logo upload
    const handleItemLogoUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result;
            if (result && typeof result === 'string') {
                setItems(items.map(item =>
                    item.id === id ? { ...item, logo: result } : item
                ));
            }
        };
        reader.readAsDataURL(file);
    };

    // Remove individual logo
    const removeItemLogo = (id: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, logo: undefined } : item
        ));
    };

    const generatedCount = items.filter(item => item.qrDataUrl).length;

    return (
        <div className="batch-qr-generator">
            <div className="container">
                <div className="batch-header">
                    <h2 className="batch-title">Batch QR Code Generator</h2>
                    <p className="batch-description">
                        Add multiple URLs and generate all QR codes at once
                    </p>
                </div>

                <div className="batch-layout">
                    {/* Left: URL List */}
                    <div className="urls-section card">
                        <div className="section-header">
                            <h3 className="section-title">URLs ({items.length})</h3>
                            <button onClick={addNewItem} className="btn btn-secondary btn-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Add URL
                            </button>
                        </div>

                        <div className="url-list">
                            {items.map((item, index) => (
                                <div key={item.id} className="url-item">
                                    <div className="url-item-header">
                                        <span className="url-number">#{index + 1}</span>
                                        {items.length > 1 && (
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="btn-remove"
                                                title="Remove"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        className="input input-sm"
                                        placeholder="Label (optional)"
                                        value={item.label}
                                        onChange={(e) => updateLabel(item.id, e.target.value)}
                                    />

                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="https://example.com"
                                        value={item.url}
                                        onChange={(e) => updateUrl(item.id, e.target.value)}
                                    />

                                    {item.error && <p className="error-message">{item.error}</p>}

                                    {/* Individual Logo Upload */}
                                    <div className="logo-upload-section">
                                        <label className="logo-upload-label">Logo for this QR (Optional)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleItemLogoUpload(item.id, e)}
                                            className="file-input file-input-sm"
                                        />
                                        {item.logo && (
                                            <button
                                                onClick={() => removeItemLogo(item.id)}
                                                className="btn-remove-logo"
                                            >
                                                Remove Logo
                                            </button>
                                        )}
                                    </div>

                                    <div className="url-item-actions">
                                        <button
                                            onClick={() => generateSingleQR(item.id)}
                                            disabled={!item.url.trim() || item.isGenerating}
                                            className="btn btn-primary btn-sm"
                                        >
                                            {item.isGenerating ? 'Generating...' : 'Generate'}
                                        </button>

                                        {item.qrDataUrl && (
                                            <>
                                                <button
                                                    onClick={() => downloadPNG(item)}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="7 10 12 15 17 10" />
                                                        <line x1="12" y1="15" x2="12" y2="3" />
                                                    </svg>
                                                    Download
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="batch-actions">
                            <button
                                onClick={generateAllQRCodes}
                                disabled={isGeneratingAll}
                                className="btn btn-primary"
                            >
                                {isGeneratingAll ? 'Generating All...' : 'Generate All QR Codes'}
                            </button>

                            {generatedCount > 0 && (
                                <>
                                    <button
                                        onClick={downloadAllPNG}
                                        className="btn btn-secondary"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        Download All ({generatedCount})
                                    </button>
                                    <button
                                        onClick={downloadAllAsZip}
                                        className="btn btn-primary"
                                        style={{ background: 'var(--gradient-secondary)' }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="21 8 21 21 3 21 3 8" />
                                            <rect x="1" y="3" width="22" height="5" />
                                            <line x1="10" y1="12" x2="14" y2="12" />
                                        </svg>
                                        Download ZIP ({generatedCount})
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Customization & Preview */}
                    <div className="right-section">
                        {/* Customization */}
                        <div className="customization-section card">
                            <h3 className="section-title">Global Settings</h3>

                            <div className="control-group">
                                <label htmlFor="batch-size">Size: {size}px</label>
                                <input
                                    id="batch-size"
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
                                    <label htmlFor="batch-fg">Foreground</label>
                                    <div className="color-input-wrapper">
                                        <input
                                            id="batch-fg"
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
                                        />
                                    </div>
                                </div>

                                <div className="control-group">
                                    <label htmlFor="batch-bg">Background</label>
                                    <div className="color-input-wrapper">
                                        <input
                                            id="batch-bg"
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
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="control-group">
                                <label htmlFor="batch-label-bg">Label Background</label>
                                <div className="color-input-wrapper">
                                    <input
                                        id="batch-label-bg"
                                        type="color"
                                        value={labelBgColor}
                                        onChange={(e) => setLabelBgColor(e.target.value)}
                                        className="color-picker"
                                    />
                                    <input
                                        type="text"
                                        value={labelBgColor}
                                        onChange={(e) => setLabelBgColor(e.target.value)}
                                        className="input color-text"
                                    />
                                </div>
                            </div>

                            <div className="control-group">
                                <label htmlFor="batch-error">Error Correction</label>
                                <select
                                    id="batch-error"
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
                                <label htmlFor="batch-logo">Global Logo (Optional - applies to all without individual logos)</label>
                                <input
                                    id="batch-logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            const result = event.target?.result;
                                            if (result && typeof result === 'string') {
                                                setLogo(result);
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    }}
                                    className="file-input"
                                />
                                {logo && (
                                    <button
                                        onClick={() => setLogo('')}
                                        className="btn btn-secondary btn-sm"
                                        style={{ marginTop: '0.5rem', width: '100%' }}
                                    >
                                        Remove Global Logo
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Preview Grid */}
                        <div className="preview-grid-section card">
                            <h3 className="section-title">Preview ({generatedCount})</h3>

                            <div className="preview-grid">
                                {items.filter(item => item.qrDataUrl).map((item) => (
                                    <div key={item.id} className="preview-item">
                                        <img src={item.qrDataUrl} alt={item.label || 'QR Code'} />
                                        {item.label && <p className="preview-label">{item.label}</p>}
                                    </div>
                                ))}

                                {generatedCount === 0 && (
                                    <div className="preview-empty">
                                        <p>Generated QR codes will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .batch-qr-generator {
          padding: var(--spacing-lg) 0;
        }

        .batch-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .batch-title {
          font-size: 2rem;
          font-weight: 700;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--spacing-sm);
        }

        .batch-description {
          color: var(--text-secondary);
          font-size: 1.125rem;
        }

        .batch-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .url-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
          max-height: 500px;
          overflow-y: auto;
          padding-right: var(--spacing-xs);
        }

        .url-item {
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .url-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .url-number {
          font-weight: 600;
          color: var(--primary-light);
        }

        .btn-remove {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          transition: color var(--transition-fast);
        }

        .btn-remove:hover {
          color: var(--secondary);
        }

        .input-sm {
          font-size: 0.875rem;
          padding: 0.5rem 0.75rem;
        }

        .url-item-actions {
          display: flex;
          gap: var(--spacing-xs);
          flex-wrap: wrap;
        }

        .logo-upload-section {
          padding-top: var(--spacing-sm);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logo-upload-label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
          font-weight: 600;
        }

        .file-input-sm {
          font-size: 0.75rem;
          padding: 0.4rem 0.6rem;
        }

        .btn-remove-logo {
          margin-top: var(--spacing-xs);
          padding: 0.4rem 0.8rem;
          background: var(--bg-tertiary);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-remove-logo:hover {
          background: var(--bg-secondary);
          color: var(--secondary);
          border-color: var(--secondary);
        }

        .batch-actions {
          display: flex;
          gap: var(--spacing-sm);
          padding-top: var(--spacing-md);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .batch-actions .btn {
          flex: 1;
        }

        .right-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .control-group {
          margin-bottom: var(--spacing-md);
        }

        .control-group label {
          display: block;
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          color: var(--text-secondary);
          font-size: 0.875rem;
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
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--gradient-primary);
          cursor: pointer;
        }

        .color-controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-sm);
        }

        .color-input-wrapper {
          display: flex;
          gap: var(--spacing-xs);
        }

        .color-picker {
          width: 40px;
          height: 36px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .color-text {
          flex: 1;
          font-family: monospace;
          font-size: 0.875rem;
        }

        .file-input {
          width: 100%;
          padding: var(--spacing-sm);
          background: var(--bg-secondary);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          cursor: pointer;
          font-size: 0.875rem;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: var(--spacing-md);
          max-height: 400px;
          overflow-y: auto;
        }

        .preview-item {
          text-align: center;
        }

        .preview-item img {
          width: 100%;
          border-radius: var(--radius-sm);
          background: white;
          padding: 0.25rem;
        }

        .preview-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: var(--spacing-xs);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .preview-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: var(--spacing-xl);
          color: var(--text-muted);
        }

        .error-message {
          color: var(--secondary);
          font-size: 0.75rem;
        }

        @media (max-width: 1024px) {
          .batch-layout {
            grid-template-columns: 1fr;
          }

          .color-controls {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}
