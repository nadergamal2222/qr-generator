import QRCode from 'qrcode';

export interface QRCodeOptions {
    url: string;
    size: number;
    fgColor: string;
    bgColor: string;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    logo?: string;
}

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
    if (!url || url.trim() === '') return false;

    try {
        new URL(url);
        return true;
    } catch {
        // Try adding https:// if no protocol is specified
        try {
            new URL(`https://${url}`);
            return true;
        } catch {
            return false;
        }
    }
}

/**
 * Normalizes URL by adding https:// if no protocol is specified
 */
export function normalizeUrl(url: string): string {
    if (!url) return '';

    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }

    return `https://${trimmed}`;
}

/**
 * Generates QR code as data URL
 */
export async function generateQRCode(options: QRCodeOptions): Promise<string> {
    const { url, size, fgColor, bgColor, errorCorrectionLevel } = options;

    try {
        const dataUrl = await QRCode.toDataURL(normalizeUrl(url), {
            width: size,
            margin: 2,
            color: {
                dark: fgColor,
                light: bgColor,
            },
            errorCorrectionLevel,
        });

        return dataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
}

/**
 * Generates QR code with logo overlay
 */
export async function generateQRCodeWithLogo(
    options: QRCodeOptions
): Promise<string> {
    const { logo, size, bgColor } = options;

    // First generate the base QR code
    const qrDataUrl = await generateQRCode(options);

    if (!logo) {
        return qrDataUrl;
    }

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
        }

        canvas.width = size;
        canvas.height = size;

        const qrImage = new Image();
        qrImage.onload = () => {
            // Draw QR code
            ctx.drawImage(qrImage, 0, 0, size, size);

            // Draw logo in center
            const logoImage = new Image();
            logoImage.onload = () => {
                // Optimized logo sizing - 22% of QR code for better visibility
                const logoSize = size * 0.22;
                const logoX = (size - logoSize) / 2;
                const logoY = (size - logoSize) / 2;

                // Padding around logo
                const padding = size * 0.015; // 1.5% padding
                const bgSize = logoSize + (padding * 2);
                const bgX = logoX - padding;
                const bgY = logoY - padding;

                // Border radius for rounded corners
                const borderRadius = size * 0.02; // 2% border radius

                // Draw rounded rectangle background
                ctx.save();
                ctx.fillStyle = bgColor || '#ffffff';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                ctx.shadowBlur = size * 0.01;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = size * 0.005;

                // Create rounded rectangle path
                ctx.beginPath();
                ctx.moveTo(bgX + borderRadius, bgY);
                ctx.lineTo(bgX + bgSize - borderRadius, bgY);
                ctx.quadraticCurveTo(bgX + bgSize, bgY, bgX + bgSize, bgY + borderRadius);
                ctx.lineTo(bgX + bgSize, bgY + bgSize - borderRadius);
                ctx.quadraticCurveTo(bgX + bgSize, bgY + bgSize, bgX + bgSize - borderRadius, bgY + bgSize);
                ctx.lineTo(bgX + borderRadius, bgY + bgSize);
                ctx.quadraticCurveTo(bgX, bgY + bgSize, bgX, bgY + bgSize - borderRadius);
                ctx.lineTo(bgX, bgY + borderRadius);
                ctx.quadraticCurveTo(bgX, bgY, bgX + borderRadius, bgY);
                ctx.closePath();
                ctx.fill();

                ctx.restore();

                // Draw logo with rounded corners
                ctx.save();
                ctx.beginPath();
                const logoRadius = borderRadius * 0.7;
                ctx.moveTo(logoX + logoRadius, logoY);
                ctx.lineTo(logoX + logoSize - logoRadius, logoY);
                ctx.quadraticCurveTo(logoX + logoSize, logoY, logoX + logoSize, logoY + logoRadius);
                ctx.lineTo(logoX + logoSize, logoY + logoSize - logoRadius);
                ctx.quadraticCurveTo(logoX + logoSize, logoY + logoSize, logoX + logoSize - logoRadius, logoY + logoSize);
                ctx.lineTo(logoX + logoRadius, logoY + logoSize);
                ctx.quadraticCurveTo(logoX, logoY + logoSize, logoX, logoY + logoSize - logoRadius);
                ctx.lineTo(logoX, logoY + logoRadius);
                ctx.quadraticCurveTo(logoX, logoY, logoX + logoRadius, logoY);
                ctx.closePath();
                ctx.clip();

                // Draw the logo image
                ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
                ctx.restore();

                resolve(canvas.toDataURL('image/png'));
            };

            logoImage.onerror = () => {
                // If logo fails to load, return QR code without logo
                resolve(qrDataUrl);
            };

            logoImage.src = logo;
        };

        qrImage.onerror = () => {
            reject(new Error('Failed to load QR code image'));
        };

        qrImage.src = qrDataUrl;
    });
}

/**
 * Downloads the QR code as PNG
 */
export function downloadQRCode(dataUrl: string, filename: string = 'qrcode.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
}

/**
 * Generates and downloads QR code as SVG
 */
export async function generateAndDownloadSVG(options: QRCodeOptions, filename: string = 'qrcode.svg') {
    const { url, fgColor, bgColor, errorCorrectionLevel } = options;

    try {
        const svg = await QRCode.toString(normalizeUrl(url), {
            type: 'svg',
            margin: 2,
            color: {
                dark: fgColor,
                light: bgColor,
            },
            errorCorrectionLevel,
        });

        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url_blob = URL.createObjectURL(blob);

        const link = document.createElement('a');

        URL.revokeObjectURL(url_blob);
    } catch (error) {
        console.error('Error generating SVG:', error);
        throw new Error('Failed to generate SVG');
    }
}

/**
 * Adds a styled text label above the QR code image with border
 */
export function addLabelToQRCode(
    dataUrl: string,
    label: string,
    size: number,
    labelBgColor: string = '#6366f1'
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            // Calculate dimensions
            const padding = size * 0.08; // 8% padding
            const fontSize = Math.max(20, size * 0.05);
            const labelHeight = fontSize * 2.8;
            const borderWidth = 4;
            const cornerRadius = 12;

            canvas.width = size + (padding * 2) + (borderWidth * 2);
            canvas.height = size + labelHeight + (padding * 3) + (borderWidth * 2);

            // Helper function to draw rounded rectangle
            const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
            };

            // Draw outer border with rounded corners
            ctx.fillStyle = '#d1d5db';
            drawRoundedRect(0, 0, canvas.width, canvas.height, cornerRadius);
            ctx.fill();

            // Draw white background
            ctx.fillStyle = '#ffffff';
            drawRoundedRect(borderWidth, borderWidth, canvas.width - (borderWidth * 2), canvas.height - (borderWidth * 2), cornerRadius - 2);
            ctx.fill();

            // Draw label background with gradient
            const gradient = ctx.createLinearGradient(
                0,
                borderWidth + padding,
                0,
                borderWidth + padding + labelHeight
            );

            // Create gradient from labelBgColor
            const lighterColor = adjustColorBrightness(labelBgColor, 20);
            const darkerColor = adjustColorBrightness(labelBgColor, -20);

            gradient.addColorStop(0, lighterColor);
            gradient.addColorStop(1, darkerColor);

            ctx.fillStyle = gradient;
            ctx.save();
            drawRoundedRect(
                borderWidth + padding,
                borderWidth + padding,
                canvas.width - (borderWidth * 2) - (padding * 2),
                labelHeight,
                8
            );
            ctx.fill();
            ctx.restore();

            // Add subtle shadow to label
            ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetY = 2;

            // Draw label text
            ctx.fillStyle = '#ffffff';
            ctx.font = `700 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const textY = borderWidth + padding + labelHeight / 2;
            ctx.fillText(label, canvas.width / 2, textY);

            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;

            // Draw QR code
            const qrX = borderWidth + padding;
            const qrY = borderWidth + padding * 2 + labelHeight;
            ctx.drawImage(img, qrX, qrY, size, size);

            // Draw subtle inner shadow around QR code
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.lineWidth = 1;
            ctx.strokeRect(qrX, qrY, size, size);

            resolve(canvas.toDataURL('image/png'));
        };

        img.onerror = () => {
            reject(new Error('Failed to load QR code image'));
        };

        img.src = dataUrl;
    });
}

/**
 * Helper function to adjust color brightness
 */
function adjustColorBrightness(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
