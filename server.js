const express = require('express');
const path = require('path');
const qrcode = require('qrcode');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const Jimp = require('jimp'); // Import Jimp

const app = express();
// Use the PORT environment variable provided by Dokploy/hosting, or default to 3000
const port = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// --- Middleware ---
// Enable CORS for all routes
app.use(cors());

// Serve static files (HTML, CSS, JS) from the project root
app.use(express.static(path.join(__dirname)));
// Serve static files from css directory
app.use('/css', express.static(path.join(__dirname, 'css')));
// Serve static files from js directory
app.use('/js', express.static(path.join(__dirname, 'js')));
// Serve static files from images directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Multer setup for file uploads (logo)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir + '/') // Save logos in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Basic filename, consider adding timestamp or unique ID for production
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    // Allow only specific image types
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/svg+xml") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg, .jpeg and .svg format allowed!'));
    }
  }
});

// --- Routes ---
// Route to handle QR code generation
app.post('/generate', upload.single('logo'), async (req, res) => {
  const contentType = req.body.content_type;
  let qrData = '';
  const logoPath = req.file ? req.file.path : null; // Get logo path if uploaded

  // --- Construct QR Data based on content type ---
  try {
    switch (contentType) {
      case 'url':
        qrData = req.body.url || '';
        if (!qrData.startsWith('http://') && !qrData.startsWith('https://')) {
          qrData = 'http://' + qrData; // Add protocol if missing
        }
        break;
      case 'contact':
        // Basic vCard format
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
        // Wi-Fi Network Config format
        const encryption = req.body.wifi_encryption || 'WPA';
        const ssid = req.body.wifi_ssid || '';
        const password = req.body.wifi_password || '';
        const hidden = req.body.wifi_hidden === 'true' ? 'H:true' : '';
        qrData = `WIFI:T:${encryption};S:${ssid};P:${password};${hidden};`;
        break;
      case 'text':
        qrData = req.body.text || '';
        break;
      default:
        // Clean up logo if invalid content type
        if (logoPath) fs.unlink(logoPath, (err) => { if (err) console.error("Error deleting logo on invalid type:", err); });
        return res.status(400).json({ error: 'Invalid content type' });
    }

    if (!qrData) {
        // Clean up logo if no content provided
        if (logoPath) fs.unlink(logoPath, (err) => { if (err) console.error("Error deleting logo on no content:", err); });
        return res.status(400).json({ error: 'No content provided for QR code' });
    }

    // --- Generate QR Code ---
    const qrOptions = {
        errorCorrectionLevel: 'H', // High error correction needed for logo overlay
        margin: 2,
        width: 300, // Define width for calculations
        color: {
            dark: "#000000", // Black dots
            light: "#FFFFFF" // White background
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

        // Clean up the uploaded logo file
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
    // Clean up logo if an error occurred during generation/merging
     if (logoPath) {
        fs.unlink(logoPath, (err) => {
            if (err) console.error("Error deleting uploaded logo after failure:", err);
        });
    }
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Serve the main HTML file for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve impressum and datenschutz
app.get('/impressum.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'impressum.html'));
});
app.get('/datenschutz.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'datenschutz.html'));
});


// --- Start Server ---
app.listen(port, () => {
  // Log the actual port the server is listening on
  console.log(`Server listening on port ${port}`);
});

// Optional: Add a basic error handler middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  // Handle Multer errors specifically
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  } else if (err) {
    // Handle other errors (like file type filter)
    return res.status(400).json({ error: err.message });
  }
  // Fallback for other unexpected errors
  if (!res.headersSent) {
    res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
});
