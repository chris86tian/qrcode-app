const express = require('express');
const path = require('path');
const qrcode = require('qrcode');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const Jimp = require('jimp'); // Import Jimp

const app = express();
const port = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// --- Middleware ---
app.use(cors());
app.use(express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
// Serve uploads statically (optional, for direct access if needed, consider security)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir + '/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')) // Sanitize filename
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/svg+xml") {
      cb(null, true);
    } else {
      cb(null, false);
      // Use the error handling middleware by passing the error
      return cb(new Error('Only .png, .jpg, .jpeg and .svg format allowed!'));
    }
  }
// Use upload.single in the route handler directly to access req.body etc.
});

// Helper function to validate hex color
const isValidHexColor = (hex) => /^#[0-9A-F]{6}$/i.test(hex);

// --- Routes ---
app.post('/generate', upload.single('logo'), async (req, res, next) => { // Added next for error handling
  const contentType = req.body.content_type;
  let qrData = '';
  const logoPath = req.file ? req.file.path : null;

  // Get and validate colors, provide defaults
  const darkColor = isValidHexColor(req.body.darkColor) ? req.body.darkColor : '#000000';
  const lightColor = isValidHexColor(req.body.lightColor) ? req.body.lightColor : '#FFFFFF';

  // --- Construct QR Data based on content type ---
  try {
    switch (contentType) {
      case 'url':
        qrData = req.body.url || '';
        if (qrData && !qrData.startsWith('http://') && !qrData.startsWith('https://')) {
          qrData = 'https://' + qrData; // Default to https
        }
        break;
      case 'contact':
        qrData = `BEGIN:VCARD
VERSION:3.0
N:${req.body.lastName || ''};${req.body.firstName || ''}
FN:${req.body.firstName || ''} ${req.body.lastName || ''}
ORG:${req.body.organization || ''}
TITLE:${req.body.position || ''}
TEL;TYPE=WORK,VOICE:${req.body.phoneWork || ''}
TEL;TYPE=CELL,VOICE:${req.body.phoneMobile || ''}
ADR;TYPE=WORK:;;${req.body.street || ''};${req.body.city || ''};${req.body.zip || ''};${req.body.country || ''}
EMAIL:${req.body.email || ''}
URL:${req.body.website || ''}
END:VCARD`;
        break;
      case 'wifi':
        const encryption = req.body.wifi_encryption || 'WPA';
        const ssid = req.body.wifi_ssid || '';
        const password = req.body.wifi_password || '';
        const hidden = req.body.wifi_hidden === 'true' ? 'H:true' : '';
        // Ensure required fields are present
        if (!ssid) throw new Error('WiFi SSID is required.');
        qrData = `WIFI:T:${encryption};S:${ssid};P:${password};${hidden};`;
        break;
      case 'text':
        qrData = req.body.text || '';
        break;
      // --- New Types ---
      case 'email':
        const emailAddress = req.body.email_address || '';
        const emailSubject = encodeURIComponent(req.body.email_subject || '');
        const emailBody = encodeURIComponent(req.body.email_body || '');
        if (!emailAddress) throw new Error('Email address is required.');
        qrData = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;
        break;
      case 'sms':
        const smsNumber = req.body.sms_number || '';
        const smsBody = encodeURIComponent(req.body.sms_body || '');
        if (!smsNumber) throw new Error('SMS phone number is required.');
        // Basic validation for phone number format might be needed
        qrData = `smsto:${smsNumber}:${smsBody}`;
        break;
      case 'whatsapp':
        let whatsappNumber = req.body.whatsapp_number || '';
        const whatsappMessage = encodeURIComponent(req.body.whatsapp_message || '');
        if (!whatsappNumber) throw new Error('WhatsApp number is required.');
        // Remove non-digits (like '+', ' ', '-')
        whatsappNumber = whatsappNumber.replace(/\D/g, '');
        qrData = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
        break;
      default:
        throw new Error('Invalid content type'); // Use error for consistency
    }

    if (!qrData && contentType !== 'text') { // Allow empty text QR codes
        throw new Error('No content provided for QR code');
    }

    // --- Generate QR Code ---
    const qrOptions = {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 300,
        color: {
            dark: darkColor,
            light: lightColor
        }
    };

    let finalQrCodeUrl;

    if (logoPath) {
        // Generate QR code as a buffer
        const qrCodeBuffer = await qrcode.toBuffer(qrData, qrOptions);

        // Load QR code and logo with Jimp
        const qrImage = await Jimp.read(qrCodeBuffer);
        const logoImage = await Jimp.read(logoPath);

        // Resize logo (e.g., to 1/5th of the QR code width)
        const logoSize = qrOptions.width / 5;
        logoImage.resize(logoSize, Jimp.AUTO);

        // Calculate position to center the logo
        const x = (qrOptions.width - logoSize) / 2;
        const y = (qrOptions.width - logoSize) / 2;

        // Composite logo onto the QR code
        qrImage.composite(logoImage, x, y);

        // Get the final image as a base64 data URL
        finalQrCodeUrl = await qrImage.getBase64Async(Jimp.MIME_PNG);

        // Clean up the uploaded logo file asynchronously
        fs.unlink(logoPath, (err) => {
            if (err) console.error("Error deleting uploaded logo after processing:", err);
        });

    } else {
        // Generate QR code directly as data URL if no logo
        finalQrCodeUrl = await qrcode.toDataURL(qrData, qrOptions);
    }

    res.json({ qrCodeUrl: finalQrCodeUrl });

  } catch (error) {
    console.error('Error generating QR code:', error);
    // Clean up logo if an error occurred
     if (logoPath) {
        fs.unlink(logoPath, (err) => {
            if (err) console.error("Error deleting uploaded logo after failure:", err);
        });
    }
    // Pass error to the error handling middleware
    next(error); // Forward the error
  }
});

// --- Static Page Routes ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/impressum.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'impressum.html'));
});

app.get('/datenschutz.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'datenschutz.html'));
});

// Route for the new blog page
app.get('/blog-qr-code-mit-logo.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog-qr-code-mit-logo.html'));
});


// --- Start Server ---
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// --- Error Handling Middleware --- MUST be last app.use()
app.use((err, req, res, next) => {
  console.error("Error details:", err); // Log the full error

  // Handle Multer errors specifically
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }

  // Handle specific errors thrown in the route handler
  if (err.message) {
     // Check if it's a known error message or a generic one
     const statusCode = err.message.includes('required') || err.message.includes('Invalid content type') ? 400 : 500;
     return res.status(statusCode).json({ error: err.message });
  }

  // Fallback for other unexpected errors
  if (!res.headersSent) {
    res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
});
