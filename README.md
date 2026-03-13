# QR Code Generator 🎨

A modern, high-quality QR code generator built with Next.js 14, featuring full customization options, logo embedding, and multiple export formats.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)

## ✨ Features

- 🎨 **Full Customization** - Custom colors, sizes, and error correction levels
- 🖼️ **Logo Embedding** - Add your brand logo to the center of QR codes
- 📥 **Multiple Export Formats** - Download as PNG or SVG
- ⚡ **Live Preview** - Real-time updates as you customize
- 🎯 **High Quality** - Generate QR codes up to 1024px resolution
- 📱 **Responsive Design** - Works perfectly on all devices
- 🌙 **Premium Dark Theme** - Modern UI with vibrant gradients

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:
```bash
cd qr-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: CSS-in-JS with CSS Custom Properties
- **QR Generation**: qrcode, qrcode.react
- **Image Processing**: html2canvas
- **Font**: Inter (Google Fonts)

## 📖 How to Use

1. **Enter a URL** - Type or paste any URL in the input field
2. **Customize** - Adjust colors, size, and error correction level
3. **Add Logo** (Optional) - Upload an image to embed in the QR code center
4. **Preview** - See real-time updates as you customize
5. **Download** - Click PNG or SVG to download your QR code

## 🎨 Customization Options

### Colors
- **Foreground Color**: The color of the QR code pattern
- **Background Color**: The background color of the QR code

### Size
- Adjustable from **256px to 1024px**
- Higher resolution for print materials

### Error Correction Levels
- **L (Low)**: 7% error correction - Smallest QR code
- **M (Medium)**: 15% error correction - Balanced (default)
- **Q (Quartile)**: 25% error correction - Good for logos
- **H (High)**: 30% error correction - Maximum reliability

> 💡 **Tip**: Use High (H) error correction when adding logos for best scanning reliability

### Logo Embedding
- Upload any image file (PNG, JPG, etc.)
- Logo is automatically sized to 20% of QR code size
- White background added for better contrast

## 📁 Project Structure

```
qr-generator/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles and design system
├── components/
│   └── QRGenerator.tsx     # Main QR generator component
├── lib/
│   └── qrUtils.ts          # QR generation utilities
├── public/                 # Static assets
└── package.json
```

## 🎯 Use Cases

- **Marketing Materials** - Custom branded QR codes for campaigns
- **Business Cards** - Professional QR codes with company logos
- **Product Packaging** - High-quality codes for product information
- **Event Tickets** - Scannable codes with event branding
- **Restaurant Menus** - Contactless menu access
- **Social Media** - Shareable QR codes for profiles and links

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📦 Dependencies

### Core Dependencies
- `next` - React framework with App Router
- `react` & `react-dom` - React library
- `qrcode` - QR code generation
- `qrcode.react` - React QR code component
- `html2canvas` - Canvas manipulation for logo overlay
- `file-saver` - File download functionality

### Dev Dependencies
- `typescript` - Type safety
- `@types/*` - TypeScript definitions
- `eslint` - Code linting

## 🌟 Key Features Explained

### Real-time Generation
QR codes are generated automatically with a 500ms debounce as you type or adjust settings, providing instant visual feedback.

### URL Validation
The app validates URLs and automatically adds `https://` if no protocol is specified, ensuring QR codes always work correctly.

### Logo Overlay
Logos are embedded using canvas manipulation:
1. Generate base QR code
2. Create canvas element
3. Draw QR code on canvas
4. Overlay logo in center with white background
5. Export as high-quality image

### Export Formats
- **PNG**: Raster format with logo support, perfect for digital use
- **SVG**: Vector format for scalability, ideal for print (without logo)

## 🎨 Design System

### Color Palette
- **Primary**: Indigo to Pink gradient (#6366f1 → #ec4899)
- **Secondary**: Teal accent (#14b8a6)
- **Background**: Dark slate theme (#0f172a, #1e293b)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold with gradient text effects
- **Body**: Clean, readable with proper hierarchy

### Animations
- Smooth transitions (150ms - 500ms)
- Fade-in animations for content
- Hover effects with transform and shadows
- Ripple effects on buttons

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

If you have any questions or need help, feel free to open an issue.

---

**Built with ❤️ using Next.js** | Ready for production deployment
