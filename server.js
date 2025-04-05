require('dotenv').config(); // Load environment variables first
const express = require('express');
const path = require('path');
const qrcode = require('qrcode');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const Jimp = require('jimp');
const session = require('express-session'); // Import express-session
// const passport = require('passport'); // Will be used later
// const { createClient } = require('@libsql/client'); // Will be used later

const app = express();
const port = process.env.PORT || 3000;

// --- Database Setup (Placeholder) ---
/* // Uncomment and configure later
const dbConfig = {
  url: process.env.DATABASE_URL,
};
if (process.env.DATABASE_AUTH_TOKEN) {
  dbConfig.authToken = process.env.DATABASE_AUTH_TOKEN;
}
const db = createClient(dbConfig);

async function initializeDb() {
  try {
    // Create users table (example)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL, -- Store hashed passwords only!
        googleId TEXT UNIQUE,
        isVerified BOOLEAN DEFAULT FALSE,
        verificationToken TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Create qr_codes table (example)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS qr_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        name TEXT,
        description TEXT,
        contentType TEXT NOT NULL,
        contentData TEXT NOT NULL, -- Store the raw data used for QR
        darkColor TEXT DEFAULT '#000000',
        lightColor TEXT DEFAULT '#FFFFFF',
        logoFilename TEXT, -- Store filename of uploaded logo if any
        scanCount INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('Database tables checked/created successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1); // Exit if DB setup fails
  }
}
initializeDb();
*/

// Ensure directories exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes
app.use(express.static(path.join(__dirname))); // Serve static files from root
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded logos

// Session Middleware Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret', // Use secret from .env or a fallback
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 1000 * 60 * 60 * 24 * 7 // Example: 1 week
    }
}));

// Passport Middleware Setup (Placeholder)
/* // Uncomment and configure later
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport, db); // Pass passport and db to config file
*/

// Body Parsers (Place AFTER static files and session, BEFORE routes needing req.body)
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Multer setup (Place AFTER body parsers if needed, but generally fine here)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir + '/')
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, Date.now() + '-' + safeName)
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/svg+xml"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg, .jpeg and .svg format allowed!'));
    }
  }
});

// Helper function to validate hex color
const isValidHexColor = (hex) => /^#[0-9A-F]{6}$/i.test(hex);

// --- Routes ---

// QR Code Generation Route
// Use upload.single middleware here to handle file upload BEFORE accessing req.body
app.post('/generate', upload.single('logo'), async (req, res, next) => {
  const userUploadedLogoPath = req.file ? req.file.path : null;

  try {
    const contentType = req.body.content_type;
    if (!contentType) {
        throw new Error('Content type is required.');
    }

    let qrData = '';
    const darkColor = isValidHexColor(req.body.darkColor) ? req.body.darkColor : '#000000';
    const lightColor = isValidHexColor(req.body.lightColor) ? req.body.lightColor : '#FFFFFF';

    // Construct QR Data based on content type
    switch (contentType) {
      case 'url':
        qrData = req.body.url || '';
        if (!qrData) throw new Error('URL is required.');
        if (!qrData.startsWith('http://') && !qrData.startsWith('https://')) {
          qrData = 'https://' + qrData;
        }
        break;
      case 'contact':
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
        whatsappNumber = whatsappNumber.replace(/\D/g, '');
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
      case 'bewertung': // New Case
        qrData = req.body.review_url || '';
        if (!qrData) throw new Error('Bewertungs-URL is required.');
        if (!qrData.startsWith('http://') && !qrData.startsWith('https://')) {
          qrData = 'https://' + qrData;
        }
        break;
      default:
        throw new Error('Invalid content type');
    }

    if (!qrData && contentType !== 'text') {
        throw new Error('No content provided for QR code');
    }

    const logoToUsePath = userUploadedLogoPath;

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

    if (logoToUsePath) {
        try {
            const qrCodeBuffer = await qrcode.toBuffer(qrData, qrOptions);
            const qrImage = await Jimp.read(qrCodeBuffer);
            const logoImage = await Jimp.read(logoToUsePath);
            const logoTargetWidth = qrOptions.width / 5;
            logoImage.resize(logoTargetWidth, Jimp.AUTO);
            const x = (qrOptions.width - logoImage.getWidth()) / 2;
            const y = (qrOptions.width - logoImage.getHeight()) / 2;
            qrImage.composite(logoImage, x, y);
            finalQrCodeUrl = await qrImage.getBase64Async(Jimp.MIME_PNG);
        } catch (jimpError) {
             console.error("Error during image processing with Jimp:", jimpError);
             console.warn("Falling back to QR code without logo/icon due to processing error.");
             finalQrCodeUrl = await qrcode.toDataURL(qrData, qrOptions);
        } finally {
             if (userUploadedLogoPath) {
                 fs.unlink(userUploadedLogoPath, (err) => {
                     if (err) console.error("Error deleting uploaded logo:", err);
                 });
             }
        }
    } else {
        finalQrCodeUrl = await qrcode.toDataURL(qrData, qrOptions);
    }

    // --- TODO: Save QR Code to DB if user is logged in ---
    // if (req.isAuthenticated()) { // Check if user is logged in (using Passport)
    //   try {
    //     const userId = req.user.id; // Get user ID from session
    //     const qrName = req.body.qr_name || null; // Get optional name
    //     const logoFilename = req.file ? req.file.filename : null; // Get saved logo filename
    //
    //     await db.execute({
    //       sql: `INSERT INTO qr_codes (userId, name, contentType, contentData, darkColor, lightColor, logoFilename)
    //             VALUES (?, ?, ?, ?, ?, ?, ?)`,
    //       args: [userId, qrName, contentType, qrData, darkColor, lightColor, logoFilename]
    //     });
    //     console.log(`QR code saved for user ${userId}`);
    //   } catch (dbError) {
    //     console.error('Error saving QR code to database:', dbError);
    //     // Don't fail the request, just log the error for now
    //   }
    // }

    res.json({ qrCodeUrl: finalQrCodeUrl });

  } catch (error) {
    console.error('Error in /generate route:', error);
     if (userUploadedLogoPath) {
        fs.unlink(userUploadedLogoPath, (err) => {
            if (err) console.error("Error deleting uploaded logo after failure:", err);
        });
    }
    next(error);
  }
});

// --- Authentication Routes (Placeholders) ---
/* // Uncomment and configure later
app.get('/login', (req, res) => {
    // Render login page (needs a login.html or similar)
    // res.sendFile(path.join(__dirname, 'login.html'));
    res.send('Login Page Placeholder'); // Placeholder
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard', // Redirect to dashboard on success
    failureRedirect: '/login', // Redirect back to login on failure
    // failureFlash: true // Optional: use connect-flash for flash messages
}));

app.get('/register', (req, res) => {
    // Render registration page (needs a register.html or similar)
    // res.sendFile(path.join(__dirname, 'register.html'));
     res.send('Register Page Placeholder'); // Placeholder
});

app.post('/register', async (req, res, next) => {
    // Registration logic here (hash password, save user, send confirmation email)
    res.send('Registration logic placeholder');
});

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/'); // Redirect to homepage after logout
  });
});

// Google OAuth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })); // Request profile and email

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect dashboard.
    res.redirect('/dashboard');
  });

// Email Verification Route
app.get('/verify-email', async (req, res) => {
    // Verification logic here (find user by token, mark as verified)
    res.send('Email verification placeholder');
});
*/

// --- Protected Routes (Example) ---
/* // Uncomment and configure later
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login'); // Redirect unauthenticated users to login
}

app.get('/dashboard', ensureAuthenticated, async (req, res) => {
    // Fetch user's saved QR codes from DB and render dashboard page
    // const userId = req.user.id;
    // const result = await db.execute({ sql: 'SELECT * FROM qr_codes WHERE userId = ? ORDER BY createdAt DESC', args: [userId] });
    // Render dashboard.html (needs to be created) passing the QR codes
    res.send(`Welcome User ${req.user.id}! Your QR Codes Dashboard Placeholder. Codes: ${JSON.stringify(result?.rows || [])}`);
});
*/

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

app.get('/blog-qr-code-mit-logo.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog-qr-code-mit-logo.html'));
});

// New route for the Unicode page
app.get('/social-media-unicode.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'social-media-unicode.html'));
});


// --- Start Server ---
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// --- Error Handling Middleware --- MUST be last app.use()
app.use((err, req, res, next) => {
  console.error("Error details:", err.stack || err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }

  if (err.message) {
     let statusCode = 500;
     if (err.message.includes('required') || err.message.includes('Invalid content type') || err.message.includes('Invalid') || err.message.includes('format allowed')) {
         statusCode = 400;
     }
     const errorMessage = statusCode === 400 ? err.message : 'An unexpected server error occurred.';
     return res.status(statusCode).json({ error: errorMessage });
  }

  if (!res.headersSent) {
    res.status(500).json({ error: 'An unexpected server error occurred.' });
  } else {
      next(err);
  }
});
