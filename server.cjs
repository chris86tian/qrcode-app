const express = require('express');
const cors = require('cors');
const multer = require('multer');
const QRCode = require('qrcode');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from dist (built frontend)
app.use(express.static(path.join(__dirname, 'dist')));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Nur Bilddateien sind erlaubt!'), false);
    }
  }
});

// Serve QR codes
app.use('/qr-codes', express.static(path.join(__dirname, 'public', 'qr-codes')));

// Ensure qr-codes directory exists
const qrCodesDir = path.join(__dirname, 'public', 'qr-codes');
if (!fs.existsSync(qrCodesDir)) {
  fs.mkdirSync(qrCodesDir, { recursive: true });
}

// Helper function to generate QR content based on type
function generateQRContent(formData) {
  try {
    const { content_type } = formData;
    
    switch (content_type) {
      case 'url':
        return formData.url || '';
        
      case 'contact':
        const vcard = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          formData.firstName && formData.lastName ? `FN:${formData.firstName} ${formData.lastName}` : '',
          formData.firstName ? `N:${formData.lastName || ''};${formData.firstName};;;` : '',
          formData.organization ? `ORG:${formData.organization}` : '',
          formData.position ? `TITLE:${formData.position}` : '',
          formData.phoneWork ? `TEL;TYPE=WORK:${formData.phoneWork}` : '',
          formData.phoneMobile ? `TEL;TYPE=CELL:${formData.phoneMobile}` : '',
          formData.email ? `EMAIL:${formData.email}` : '',
          formData.website ? `URL:${formData.website}` : '',
          formData.street || formData.city || formData.zip || formData.country ? 
            `ADR:;;${formData.street || ''};${formData.city || ''};${formData.zip || ''};${formData.country || ''}` : '',
          'END:VCARD'
        ].filter(line => line).join('\n');
        return vcard;
        
      case 'wifi':
        const security = formData.wifi_encryption || 'WPA';
        const hidden = formData.wifi_hidden ? 'true' : 'false';
        return `WIFI:T:${security};S:${formData.wifi_ssid || ''};P:${formData.wifi_password || ''};H:${hidden};;`;
        
      case 'text':
        return formData.text || '';
        
      case 'email':
        const subject = formData.email_subject ? `?subject=${encodeURIComponent(formData.email_subject)}` : '';
        const body = formData.email_body ? `${subject ? '&' : '?'}body=${encodeURIComponent(formData.email_body)}` : '';
        return `mailto:${formData.email_address || ''}${subject}${body}`;
        
      case 'sms':
        const smsBody = formData.sms_body ? `?body=${encodeURIComponent(formData.sms_body)}` : '';
        return `sms:${formData.sms_number || ''}${smsBody}`;
        
      case 'whatsapp':
        const waMessage = formData.whatsapp_message ? `?text=${encodeURIComponent(formData.whatsapp_message)}` : '';
        return `https://wa.me/${formData.whatsapp_number || ''}${waMessage}`;
        
      case 'spotify':
        return formData.spotify_url || '';
        
      case 'youtube':
        return formData.youtube_url || '';
        
      case 'bewertung':
        return formData.review_url || '';
        
      default:
        return '';
    }
  } catch (error) {
    console.error('Error in generateQRContent:', error);
    throw new Error('Fehler beim Generieren des QR-Inhalts: ' + error.message);
  }
}

// Simplified glassmorphism dots QR code
async function createGlassmorphismQR(qrBuffer, size = 512) {
  try {
    console.log('Creating glassmorphism QR...');
    const qrImage = await Jimp.read(qrBuffer);
    console.log('QR image loaded, dimensions:', qrImage.getWidth(), 'x', qrImage.getHeight());
    
    const canvas = new Jimp(size, size, '#1a1a2e'); // Dark blue background
    
    // Get QR dimensions - use bitmap width/height for safety
    const qrWidth = qrImage.bitmap.width;
    const qrHeight = qrImage.bitmap.height;
    
    if (qrWidth === 0 || qrHeight === 0) {
      console.error('Invalid QR dimensions');
      return await Jimp.read(qrBuffer); // Fallback to original
    }
    
    const moduleSize = Math.floor(size / qrWidth);
    console.log('Module size calculated:', moduleSize);
    
    // Simple dot creation without complex loops
    for (let y = 0; y < qrHeight && y * moduleSize < size; y++) {
      for (let x = 0; x < qrWidth && x * moduleSize < size; x++) {
        try {
          const pixelColor = qrImage.getPixelColor(x, y);
          const { r } = Jimp.intToRGBA(pixelColor);
          
          if (r < 128) { // Dark pixel = QR module
            const centerX = Math.floor(x * moduleSize + moduleSize / 2);
            const centerY = Math.floor(y * moduleSize + moduleSize / 2);
            const radius = Math.floor(moduleSize * 0.4);
            
            // Create simple white dot
            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= radius) {
                  const plotX = centerX + dx;
                  const plotY = centerY + dy;
                  if (plotX >= 0 && plotX < size && plotY >= 0 && plotY < size) {
                    const alpha = Math.floor((1 - distance / radius) * 200 + 55);
                    const color = Jimp.rgbaToInt(255, 255, 255, alpha);
                    canvas.setPixelColor(color, plotX, plotY);
                  }
                }
              }
            }
          }
        } catch (pixelError) {
          console.error('Error processing pixel at', x, y, ':', pixelError.message);
          // Continue with next pixel
        }
      }
    }
    
    console.log('Glassmorphism QR created successfully');
    return canvas;
  } catch (error) {
    console.error('Error in createGlassmorphismQR:', error);
    // Fallback to original QR
    return await Jimp.read(qrBuffer);
  }
}

// Simplified pixel perfect QR code
async function createPixelPerfectQR(qrBuffer, size = 512) {
  try {
    console.log('Creating pixel perfect QR...');
    const qrImage = await Jimp.read(qrBuffer);
    console.log('QR image loaded, dimensions:', qrImage.getWidth(), 'x', qrImage.getHeight());
    
    const canvas = new Jimp(size, size, '#0a0a0a'); // Very dark background
    
    // Get QR dimensions
    const qrWidth = qrImage.bitmap.width;
    const qrHeight = qrImage.bitmap.height;
    
    if (qrWidth === 0 || qrHeight === 0) {
      console.error('Invalid QR dimensions');
      return await Jimp.read(qrBuffer); // Fallback to original
    }
    
    const pixelSize = Math.floor(size / qrWidth);
    console.log('Pixel size calculated:', pixelSize);
    
    // Neon colors
    const colors = [
      { r: 0, g: 255, b: 136 },   // Neon green
      { r: 0, g: 204, b: 255 },   // Cyan  
      { r: 255, g: 0, b: 128 }    // Pink
    ];
    
    for (let y = 0; y < qrHeight && y * pixelSize < size; y++) {
      for (let x = 0; x < qrWidth && x * pixelSize < size; x++) {
        try {
          const pixelColor = qrImage.getPixelColor(x, y);
          const { r } = Jimp.intToRGBA(pixelColor);
          
          const startX = x * pixelSize;
          const startY = y * pixelSize;
          const endX = Math.min(startX + pixelSize, size);
          const endY = Math.min(startY + pixelSize, size);
          
          if (r < 128) { // Dark pixel = QR module
            const colorIndex = (x + y) % colors.length;
            const color = colors[colorIndex];
            const pixelColor = Jimp.rgbaToInt(color.r, color.g, color.b, 255);
            
            // Fill pixel block
            for (let py = startY; py < endY; py++) {
              for (let px = startX; px < endX; px++) {
                canvas.setPixelColor(pixelColor, px, py);
              }
            }
          } else {
            // Background pixel
            const bgColor = Jimp.rgbaToInt(20, 20, 20, 255);
            for (let py = startY; py < endY; py++) {
              for (let px = startX; px < endX; px++) {
                canvas.setPixelColor(bgColor, px, py);
              }
            }
          }
        } catch (pixelError) {
          console.error('Error processing pixel at', x, y, ':', pixelError.message);
          // Continue with next pixel
        }
      }
    }
    
    console.log('Pixel perfect QR created successfully');
    return canvas;
  } catch (error) {
    console.error('Error in createPixelPerfectQR:', error);
    // Fallback to original QR
    return await Jimp.read(qrBuffer);
  }
}

// QR Code generation endpoint
app.post('/api/generate', upload.single('logo'), async (req, res) => {
  console.log('=== QR GENERATION REQUEST START ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request body keys:', Object.keys(req.body));
  console.log('QR Style:', req.body.qrStyle);
  console.log('Content Type:', req.body.content_type);
  
  try {
    const formData = req.body;
    const logoFile = req.file;
    const qrStyle = formData.qrStyle || 'classic';
    
    console.log('Step 1: Generating QR content...');
    // Generate QR content
    const qrContent = generateQRContent(formData);
    console.log('QR Content length:', qrContent.length);
    console.log('QR Content preview:', qrContent.substring(0, 100) + (qrContent.length > 100 ? '...' : ''));
    
    if (!qrContent) {
      console.log('ERROR: No QR content generated');
      return res.status(400).json({ error: 'Kein Inhalt für QR-Code angegeben.' });
    }
    
    console.log('Step 2: Setting QR options...');
    // QR Code options
    const qrOptions = {
      width: 512,
      margin: 2,
      color: {
        dark: formData.darkColor || '#000000',
        light: formData.transparent === 'true' ? '#00000000' : (formData.lightColor || '#FFFFFF')
      },
      errorCorrectionLevel: 'M'
    };
    console.log('QR Options:', qrOptions);
    
    console.log('Step 3: Generating base QR buffer...');
    // Generate base QR code as buffer
    const qrBuffer = await QRCode.toBuffer(qrContent, qrOptions);
    console.log('QR Buffer generated, size:', qrBuffer.length, 'bytes');
    
    console.log('Step 4: Processing style -', qrStyle);
    let finalImage;
    
    // Apply style-specific processing
    switch (qrStyle) {
      case 'glassmorphism-dots':
        console.log('Processing glassmorphism style...');
        finalImage = await createGlassmorphismQR(qrBuffer, 512);
        break;
        
      case 'pixel-perfect':
        console.log('Processing pixel perfect style...');
        finalImage = await createPixelPerfectQR(qrBuffer, 512);
        break;
        
      default: // classic
        console.log('Processing classic style...');
        finalImage = await Jimp.read(qrBuffer);
        break;
    }
    
    console.log('Step 5: Final image created, dimensions:', finalImage.getWidth(), 'x', finalImage.getHeight());
    
    // Add logo if present (only for classic style to maintain style integrity)
    if (logoFile && qrStyle === 'classic') {
      console.log('Step 6: Adding logo...');
      try {
        const logoImage = await Jimp.read(logoFile.buffer);
        const logoSize = Math.floor(finalImage.getWidth() * 0.2);
        logoImage.resize(logoSize, logoSize);
        
        const logoBackground = new Jimp(logoSize + 20, logoSize + 20, '#FFFFFF');
        logoBackground.composite(logoImage, 10, 10);
        
        const centerX = Math.floor((finalImage.getWidth() - logoBackground.getWidth()) / 2);
        const centerY = Math.floor((finalImage.getHeight() - logoBackground.getHeight()) / 2);
        
        finalImage.composite(logoBackground, centerX, centerY);
        console.log('Logo added successfully');
      } catch (logoError) {
        console.error('Logo processing error:', logoError);
        // Continue without logo if processing fails
      }
    }
    
    console.log('Step 7: Saving image...');
    // Generate unique filename with style
    const timestamp = Date.now();
    const filename = `qr-${qrStyle}-${timestamp}.png`;
    const filepath = path.join(qrCodesDir, filename);
    
    console.log('Saving to:', filepath);
    
    // Save image
    await finalImage.writeAsync(filepath);
    console.log('Image saved successfully');
    
    console.log('Step 8: Sending response...');
    // Return success response
    const response = {
      qrCodeUrl: `/qr-codes/${filename}`,
      success: true,
      style: qrStyle
    };
    console.log('Response:', response);
    console.log('=== QR GENERATION SUCCESS ===');
    
    res.json(response);
    
  } catch (error) {
    console.error('=== QR GENERATION ERROR ===');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Request Body:', req.body);
    console.error('QR Style:', req.body.qrStyle);
    console.error('=== END QR GENERATION ERROR ===');
    
    res.status(500).json({ 
      error: 'Fehler beim Generieren des QR-Codes: ' + error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch all handler: send back React's index.html file for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 QR Code Server läuft auf Port ${PORT}`);
  console.log(`📁 QR-Codes werden gespeichert in: ${qrCodesDir}`);
  console.log(`🌐 Frontend wird bereitgestellt von: ${path.join(__dirname, 'dist')}`);
  console.log(`✨ Unterstützte Stile: classic, glassmorphism-dots, pixel-perfect`);
});

module.exports = app;
