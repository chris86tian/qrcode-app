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

// Robust "Glassmorphism Dots" QR code generator
async function createGlassmorphismQR(qrBuffer, size = 512) {
  try {
    console.log('Attempting to create robust Glassmorphism QR...');
    const qrImage = await Jimp.read(qrBuffer);
    const canvas = new Jimp(size, size, '#1a1a2e'); // Style-specific dark blue background

    const qrWidth = qrImage.bitmap.width;
    if (qrWidth === 0) {
        console.error('QR image has zero width.');
        return await Jimp.read(qrBuffer); // Fallback
    }

    const moduleSize = Math.floor(size / qrWidth);
    const radius = Math.floor(moduleSize * 0.4);
    const radiusSq = radius * radius;

    if (moduleSize <= 0 || radius <= 0) {
        console.error('Calculated module size or radius is too small.');
        return await Jimp.read(qrBuffer); // Fallback
    }

    // Create a reusable dot template image once
    const dot = new Jimp(radius * 2 + 1, radius * 2 + 1, 0x00000000);
    dot.scan(0, 0, dot.bitmap.width, dot.bitmap.height, function (x, y, idx) {
        const dx = x - radius;
        const dy = y - radius;
        const distSq = dx * dx + dy * dy;

        if (distSq <= radiusSq) {
            const distance = Math.sqrt(distSq);
            const alpha = Math.floor((1 - distance / radius) * 200 + 55);
            this.bitmap.data[idx + 0] = 255; // R (white)
            this.bitmap.data[idx + 1] = 255; // G (white)
            this.bitmap.data[idx + 2] = 255; // B (white)
            this.bitmap.data[idx + 3] = alpha; // Alpha for glass effect
        }
    });

    // Iterate over the source QR and composite the dot template
    for (let y = 0; y < qrWidth; y++) {
        for (let x = 0; x < qrWidth; x++) {
            const pixelColor = qrImage.getPixelColor(x, y);
            const { r } = Jimp.intToRGBA(pixelColor);

            if (r < 128) { // It's a dark module, so we draw a dot
                const centerX = Math.floor(x * moduleSize + moduleSize / 2);
                const centerY = Math.floor(y * moduleSize + moduleSize / 2);
                canvas.composite(dot, centerX - radius, centerY - radius);
            }
        }
    }

    console.log('Robust Glassmorphism QR created successfully.');
    return canvas;
  } catch (error) {
    console.error('CRITICAL ERROR in createGlassmorphismQR:', error);
    return await Jimp.read(qrBuffer); // Fallback to original QR on any error
  }
}

// Robust "Pixel Perfect" QR code generator
async function createPixelPerfectQR(qrBuffer, size = 512) {
  try {
    console.log('Attempting to create robust Pixel Perfect QR...');
    const qrImage = await Jimp.read(qrBuffer);
    const canvas = new Jimp(size, size, '#0a0a0a'); // Style-specific very dark background

    const qrWidth = qrImage.bitmap.width;
    if (qrWidth === 0) {
        console.error('QR image has zero width.');
        return await Jimp.read(qrBuffer); // Fallback
    }

    const pixelSize = Math.floor(size / qrWidth);
    if (pixelSize <= 0) {
        console.error('Calculated pixel size is too small.');
        return await Jimp.read(qrBuffer); // Fallback
    }

    // Define neon colors using Jimp's hex parser
    const colors = [
      Jimp.cssColorToHex('#00ff88'), // Neon green
      Jimp.cssColorToHex('#00ccff'), // Cyan
      Jimp.cssColorToHex('#ff0080')  // Pink
    ];
    const bgColor = Jimp.cssColorToHex('#141414');

    // Iterate over QR and draw colored blocks using blit for efficiency
    for (let y = 0; y < qrWidth; y++) {
        for (let x = 0; x < qrWidth; x++) {
            const pixelColor = qrImage.getPixelColor(x, y);
            const { r } = Jimp.intToRGBA(pixelColor);

            const startX = x * pixelSize;
            const startY = y * pixelSize;
            
            const colorToUse = (r < 128) 
                ? colors[(x + y) % colors.length] 
                : bgColor;

            // Create a colored block and blit it onto the canvas
            const block = new Jimp(pixelSize, pixelSize, colorToUse);
            canvas.blit(block, startX, startY);
        }
    }

    console.log('Robust Pixel Perfect QR created successfully.');
    return canvas;
  } catch (error) {
    console.error('CRITICAL ERROR in createPixelPerfectQR:', error);
    return await Jimp.read(qrBuffer); // Fallback to original QR on any error
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
    const qrContent = generateQRContent(formData);
    console.log('QR Content length:', qrContent.length);
    
    if (!qrContent) {
      console.log('ERROR: No QR content generated');
      return res.status(400).json({ error: 'Kein Inhalt für QR-Code angegeben.' });
    }
    
    console.log('Step 2: Setting QR options...');
    const qrOptions = {
      width: 512,
      margin: 2,
      color: {
        dark: formData.darkColor || '#000000',
        light: formData.transparent === 'true' ? '#00000000' : (formData.lightColor || '#FFFFFF')
      },
      errorCorrectionLevel: 'M'
    };
    
    console.log('Step 3: Generating base QR buffer...');
    const qrBuffer = await QRCode.toBuffer(qrContent, qrOptions);
    console.log('QR Buffer generated, size:', qrBuffer.length, 'bytes');
    
    console.log('Step 4: Processing style -', qrStyle);
    let finalImage;
    
    switch (qrStyle) {
      case 'glassmorphism-dots':
        finalImage = await createGlassmorphismQR(qrBuffer, 512);
        break;
        
      case 'pixel-perfect':
        finalImage = await createPixelPerfectQR(qrBuffer, 512);
        break;
        
      default: // classic
        console.log('Processing classic style...');
        finalImage = await Jimp.read(qrBuffer);
        break;
    }
    
    console.log('Step 5: Final image created, dimensions:', finalImage.getWidth(), 'x', finalImage.getHeight());
    
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
      }
    }
    
    console.log('Step 7: Saving image...');
    const timestamp = Date.now();
    const filename = `qr-${qrStyle}-${timestamp}.png`;
    const filepath = path.join(qrCodesDir, filename);
    
    await finalImage.writeAsync(filepath);
    console.log('Image saved successfully to:', filepath);
    
    console.log('Step 8: Sending response...');
    const response = {
      qrCodeUrl: `/qr-codes/${filename}`,
      success: true,
      style: qrStyle
    };
    res.json(response);
    
  } catch (error) {
    console.error('=== QR GENERATION ERROR ===');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
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
