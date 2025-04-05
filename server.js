const express = require('express');
const path = require('path');
const qrcode = require('qrcode');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const Jimp = require('jimp'); // Import Jimp

const app = express();
const port = process.env.PORT || 3000;

// Ensure directories exist
const uploadDir = 'uploads';
// const defaultIconsDir = path.join(__dirname, 'images', 'default-icons'); // No longer needed

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
// No longer need to create default icons directory
// if (!fs.existsSync(defaultIconsDir)){
//     fs.mkdirSync(defaultIconsDir, { recursive: true });
//     fs.writeFileSync(path.join(defaultIconsDir, 'placeholder.txt'), 'Place default icons like url.png, wifi.png, spotify.png here.');
// }


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
    // Sanitize filename more robustly
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, Date.now() + '-' + safeName)
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    // Allow SVG as well
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/svg+xml"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      // Use the error handling middleware by passing the error
      return cb(new Error('Only .png, .jpg, .jpeg and .svg format allowed!'));
    }
  }
});

// Helper function to validate hex color
const isValidHexColor = (hex) => /^#[0-9A-F]{6}$/i.test(hex);

// Helper function to get default icon path (REMOVED)
// const getDefaultIconPath = (contentType) => { ... };


// --- Routes ---
// Use upload.single middleware here to handle file upload BEFORE accessing req.body
app.post('/generate', upload.single('logo'), async (req, res, next) => {
  // let logoToUsePath = null; // Path of the logo/icon to actually use (Simplified)
  const userUploadedLogoPath = req.file ? req.file.path : null; // Path of user-uploaded logo (if any)

  try {
    const contentType = req.body.content_type;
    if (!contentType) {
        throw new Error('Content type is required.');
    }

    let qrData = '';

    // Get and validate colors, provide defaults
    const darkColor = isValidHexColor(req.body.darkColor) ? req.body.darkColor : '#000000';
    const lightColor = isValidHexColor(req.body.lightColor) ? req.body.lightColor : '#FFFFFF';

    // --- Construct QR Data based on content type ---
    switch (contentType) {
      case 'url':
        qrData = req.body.url || '';
        if (!qrData) throw new Error('URL is required.');
        if (!qrData.startsWith('http://') && !qrData.startsWith('https://')) {
          qrData = 'https://' + qrData; // Default to https
        }
        break;
      case 'contact':
        // Ensure at least a last name is present
        if (!req.body.lastName) throw new Error('Last name is required for contact.');
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
        if (!ssid) throw new Error('WiFi SSID is required.');
        qrData = `WIFI:T:${encryption};S:${ssid};P:${password};${hidden};`;
        break;
      case 'text':
        qrData = req.body.text || '';
        // Allow empty text QR codes, so no error if empty
        break;
      case 'email':
        const emailAddress = req.body.email_address || '';
        if (!emailAddress) throw new Error('Email address is required.');
        const emailSubject = encodeURIComponent(req.body.email_subject || '');
        const emailBody = encodeURIComponent(req.body.email_body || '');
        qrData = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;
        break;
      case 'sms':
        const smsNumber = req.body.sms_number || '';
        if (!smsNumber) throw new Error('SMS phone number is required.');
        const smsBody = encodeURIComponent(req.body.sms_body || '');
        qrData = `smsto:${smsNumber}:${smsBody}`;
        break;
      case 'whatsapp':
        let whatsappNumber = req.body.whatsapp_number || '';
        if (!whatsappNumber) throw new Error('WhatsApp number is required.');
        whatsappNumber = whatsappNumber.replace(/\D/g, ''); // Remove non-digits
        const whatsappMessage = encodeURIComponent(req.body.whatsapp_message || '');
        qrData = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
        break;
      case 'spotify':
        qrData = req.body.spotify_url || '';
        if (!qrData) throw new Error('Spotify URL is required.');
        if (!qrData.includes('spotify.com')) {
            console.warn('Potentially invalid Spotify URL:', qrData);
        }
        if (!qrData.startsWith('http://') && !qrData.startsWith('https://')) {
          qrData = 'https://' + qrData;
        }
        break;
      case 'youtube':
        qrData = req.body.youtube_url || '';
        if (!qrData) throw new Error('YouTube URL is required.');
        if (!qrData.includes('youtube.com') && !qrData.includes('youtu.be')) {
             console.warn('Potentially invalid YouTube URL:', qrData);
        }
        if (!qrData.startsWith('http://') && !qrData.startsWith('https://')) {
          qrData = 'https://' + qrData;
        }
        break;
      default:
        throw new Error('Invalid content type');
    }

    // Check for empty data again, except for 'text'
    if (!qrData && contentType !== 'text') {
        throw new Error('No content provided for QR code');
    }

    // --- Determine which logo/icon to use --- REMOVED DEFAULT ICON LOGIC
    // if (userUploadedLogoPath) {
    //     logoToUsePath = userUploadedLogoPath; // Use user's logo
    // } else {
    //     logoToUsePath = getDefaultIconPath(contentType); // Try to get default icon
    // }
    // Simplified: logoToUsePath is just userUploadedLogoPath (can be null)
    const logoToUsePath = userUploadedLogoPath;

    // --- Generate QR Code ---
    const qrOptions = {
        errorCorrectionLevel: 'H', // High correction level, good for logos
        margin: 2,
        width: 300, // Adjust size as needed
        color: {
            dark: darkColor,
            light: lightColor
        }
    };

    let finalQrCodeUrl;

    if (logoToUsePath) { // Only proceed with Jimp if a logo was uploaded
        try {
            // Generate QR code as a buffer
            const qrCodeBuffer = await qrcode.toBuffer(qrData, qrOptions);

            // Load QR code and logo/icon with Jimp
            const qrImage = await Jimp.read(qrCodeBuffer);
            const logoImage = await Jimp.read(logoToUsePath);

            // Resize logo/icon (e.g., to 1/5th of the QR code width)
            const logoTargetWidth = qrOptions.width / 5;
            logoImage.resize(logoTargetWidth, Jimp.AUTO);

            // Calculate position to center the logo/icon
            const x = (qrOptions.width - logoImage.getWidth()) / 2;
            const y = (qrOptions.width - logoImage.getHeight()) / 2;

            // Composite logo/icon onto the QR code
            qrImage.composite(logoImage, x, y);

            // Get the final image as a base64 data URL
            finalQrCodeUrl = await qrImage.getBase64Async(Jimp.MIME_PNG);

        } catch (jimpError) {
             console.error("Error during image processing with Jimp:", jimpError);
             // Fallback: Generate QR code without logo/icon if Jimp fails
             console.warn("Falling back to QR code without logo/icon due to processing error.");
             finalQrCodeUrl = await qrcode.toDataURL(qrData, qrOptions);
        } finally {
             // Clean up the user-uploaded logo file (if it exists) asynchronously
             if (userUploadedLogoPath) {
                 fs.unlink(userUploadedLogoPath, (err) => {
                     if (err) console.error("Error deleting uploaded logo:", err);
                 });
             }
        }

    } else {
        // Generate QR code directly as data URL if no logo was uploaded
        finalQrCodeUrl = await qrcode.toDataURL(qrData, qrOptions);
    }

    res.json({ qrCodeUrl: finalQrCodeUrl });

  } catch (error) {
    console.error('Error in /generate route:', error);
    // Clean up user-uploaded logo if an error occurred before processing finished
     if (userUploadedLogoPath) {
        fs.unlink(userUploadedLogoPath, (err) => {
            if (err) console.error("Error deleting uploaded logo after failure:", err);
        });
    }
    // Pass error to the error handling middleware
    next(error);
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
  console.error("Error details:", err.stack || err); // Log the full error stack

  // Handle Multer errors specifically
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }

  // Handle specific errors thrown in the route handler or other middleware
  if (err.message) {
     // Determine status code based on error type if possible
     let statusCode = 500; // Default to internal server error
     if (err.message.includes('required') || err.message.includes('Invalid content type') || err.message.includes('Invalid') || err.message.includes('format allowed')) {
         statusCode = 400; // Bad request for validation errors
     }
     // Avoid sending detailed internal errors to the client in production
     const errorMessage = statusCode === 400 ? err.message : 'An unexpected server error occurred.';
     return res.status(statusCode).json({ error: errorMessage });
  }

  // Fallback for other unexpected errors
  if (!res.headersSent) {
    res.status(500).json({ error: 'An unexpected server error occurred.' });
  } else {
      // If headers already sent, delegate to default Express error handler
      next(err);
  }
});
