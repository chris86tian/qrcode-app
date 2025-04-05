require('dotenv').config(); // Load environment variables first
const express = require('express');
const path = require('path');
const qrcode = require('qrcode');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const Jimp = require('jimp');
const session = require('express-session');
const passport = require('passport'); // Import passport
const bcrypt = require('bcrypt'); // Import bcrypt
const { createClient } = require('@libsql/client'); // Import libsql client

const app = express();
const port = process.env.PORT || 3000;

// --- Database Setup ---
const dbConfig = {
  url: process.env.DATABASE_URL || 'file:./k1q_data.db', // Default to local file if not set
};
if (process.env.DATABASE_AUTH_TOKEN) {
  dbConfig.authToken = process.env.DATABASE_AUTH_TOKEN;
}

let db;
try {
    db = createClient(dbConfig);
    console.log("Database client created successfully.");
} catch (error) {
    console.error("Failed to create database client:", error);
    process.exit(1);
}


async function initializeDb() {
  try {
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT, -- Store hashed passwords only! Nullable for Google Login
        googleId TEXT UNIQUE,
        isVerified BOOLEAN DEFAULT FALSE,
        verificationToken TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Create qr_codes table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS qr_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        name TEXT,
        description TEXT, -- Added description field
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
// Call initializeDb immediately after defining it
initializeDb().catch(err => {
    console.error("Database initialization failed:", err);
    process.exit(1);
});


// Ensure directories exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
const configDir = 'config';
if (!fs.existsSync(configDir)){
    fs.mkdirSync(configDir);
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
    secret: process.env.SESSION_SECRET || 'fallback_secret_please_change', // Use secret from .env or a fallback
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Helps prevent XSS attacks
        maxAge: 1000 * 60 * 60 * 24 * 7 // Example: 1 week
    }
}));

// Passport Middleware Setup
app.use(passport.initialize());
app.use(passport.session());
// Pass passport and db instance to the config file
require('./config/passport')(passport, db);

// Body Parsers (Place AFTER static files and session, BEFORE routes needing req.body)
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Multer setup
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

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Store the URL they were trying to access
  // req.session.returnTo = req.originalUrl; // Optional: redirect back after login
  console.log("User not authenticated, redirecting to /login");
  res.redirect('/login'); // Redirect unauthenticated users to login
}

// Middleware to add user info to locals for templates (if using a template engine)
// For static files, we'll handle this client-side if needed, or pass data specifically
app.use((req, res, next) => {
  res.locals.user = req.user || null; // Make user object available
  next();
});


// --- Routes ---

// QR Code Generation Route
app.post('/generate', upload.single('logo'), async (req, res, next) => {
  const userUploadedLogoPath = req.file ? req.file.path : null;
  const logoFilenameForDb = req.file ? req.file.filename : null; // Filename to save in DB

  try {
    const contentType = req.body.content_type;
    if (!contentType) {
        throw new Error('Content type is required.');
    }

    let qrData = '';
    const darkColor = isValidHexColor(req.body.darkColor) ? req.body.darkColor : '#000000';
    const lightColor = isValidHexColor(req.body.lightColor) ? req.body.lightColor : '#FFFFFF';
    const qrName = req.body.qr_name || null; // Get optional name

    // Construct QR Data based on content type (same logic as before)
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
      // --- NEU: Bewertungen ---
      case 'review':
        qrData = req.body.review_url || '';
        if (!qrData) throw new Error('Review URL (z.B. Google Review Link) ist erforderlich.');
        // Basic validation - check if it looks like a URL
        if (!qrData.startsWith('http://') && !qrData.startsWith('https://')) {
          qrData = 'https://' + qrData; // Assume https if missing
        }
        // Optional: More specific validation for Google review links if needed
        break;
      default:
        throw new Error('Invalid content type');
    }

    if (!qrData && contentType !== 'text') { // Allow empty text QR codes
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
            const logoTargetWidth = qrOptions.width / 5; // Logo takes up 20% of width
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
             // Delete the uploaded temporary file only if it was uploaded by the user
             if (userUploadedLogoPath) {
                 fs.unlink(userUploadedLogoPath, (err) => {
                     if (err) console.error("Error deleting uploaded logo:", err);
                     else console.log("Deleted temporary uploaded logo:", userUploadedLogoPath);
                 });
             }
        }
    } else {
        finalQrCodeUrl = await qrcode.toDataURL(qrData, qrOptions);
    }

    // --- Save QR Code to DB if user is logged in and chose to save ---
    // Check if the "save" button was implicitly used (e.g., by checking for qr_name or a specific flag)
    // For simplicity, we assume if the user is logged in and provides a name, they want to save.
    // A better approach might be a dedicated "save" checkbox or button value.
    if (req.isAuthenticated() && qrName) { // Check if user is logged in AND provided a name
      try {
        const userId = req.user.id; // Get user ID from session

        await db.execute({
          sql: `INSERT INTO qr_codes (userId, name, contentType, contentData, darkColor, lightColor, logoFilename)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [userId, qrName, contentType, qrData, darkColor, lightColor, logoFilenameForDb]
        });
        console.log(`QR code '${qrName}' saved for user ${userId}`);
      } catch (dbError) {
        console.error('Error saving QR code to database:', dbError);
        // Decide if this should be a user-facing error or just logged
        // For now, log it but still return the generated QR code
      }
    } else if (req.isAuthenticated() && !qrName) {
        console.log("User logged in but did not provide a name, QR code not saved.");
    } else {
        console.log("User not logged in, QR code not saved.");
    }

    res.json({ qrCodeUrl: finalQrCodeUrl });

  } catch (error) {
    console.error('Error in /generate route:', error);
     // Ensure temp file is deleted even on error
     if (userUploadedLogoPath) {
        fs.unlink(userUploadedLogoPath, (err) => {
            if (err) console.error("Error deleting uploaded logo after failure:", err);
        });
    }
    next(error); // Pass error to the error handling middleware
  }
});

// --- Authentication Routes ---
app.get('/login', (req, res) => {
    // If already logged in, redirect to dashboard
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Use passport.authenticate middleware for the POST /login route
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard', // Redirect to dashboard on success
    failureRedirect: '/login?error=1', // Redirect back to login on failure (add query param for error message)
    // failureFlash: true // Optional: use connect-flash for flash messages if installed
}));

app.get('/register', (req, res) => {
     // If already logged in, redirect to dashboard
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.post('/register', async (req, res, next) => {
    const { email, password, password2 } = req.body;
    let errors = [];

    // Basic validation
    if (!email || !password || !password2) {
        errors.push({ msg: 'Bitte alle Felder ausfüllen.' });
    }
    if (password !== password2) {
        errors.push({ msg: 'Passwörter stimmen nicht überein.' });
    }
    if (password && password.length < 6) { // Example: require min 6 chars
        errors.push({ msg: 'Passwort muss mindestens 6 Zeichen lang sein.' });
    }

    if (errors.length > 0) {
        // Render registration page again with errors (need template engine or client-side handling)
        // For now, redirect back with error query params (less user-friendly)
        const errorQuery = errors.map(e => `error=${encodeURIComponent(e.msg)}`).join('&');
        return res.redirect(`/register?${errorQuery}`);
    }

    try {
        // Check if user already exists
        const result = await db.execute({
            sql: 'SELECT * FROM users WHERE email = ?',
            args: [email]
        });

        if (result.rows.length > 0) {
            errors.push({ msg: 'Diese E-Mail ist bereits registriert.' });
            const errorQuery = errors.map(e => `error=${encodeURIComponent(e.msg)}`).join('&');
            return res.redirect(`/register?${errorQuery}`);
        } else {
            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert new user
            await db.execute({
                sql: 'INSERT INTO users (email, password, isVerified) VALUES (?, ?, ?)',
                args: [email, hashedPassword, false] // Start as not verified
            });

            console.log(`User registered: ${email}`);
            // TODO: Implement email verification sending here if needed

            // Redirect to login page after successful registration
            res.redirect('/login?registered=1'); // Add query param to show success message
        }
    } catch (err) {
        console.error("Error during registration:", err);
        next(err); // Pass error to error handler
    }
});

app.get('/logout', (req, res, next) => {
  req.logout(function(err) { // req.logout requires a callback function
    if (err) {
        console.error("Error during logout:", err);
        return next(err); // Pass error to error handler
    }
    req.session.destroy((err) => { // Destroy the session
        if (err) {
            console.error("Error destroying session:", err);
            return next(err);
        }
        res.clearCookie('connect.sid'); // Clear the session cookie (name might vary)
        console.log("User logged out and session destroyed.");
        res.redirect('/'); // Redirect to homepage after logout
    });
  });
});


// Google OAuth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })); // Request profile and email

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google' }), // Redirect to login on Google auth failure
  function(req, res) {
    // Successful authentication, redirect dashboard.
    console.log("Google authentication successful, redirecting to dashboard.");
    res.redirect('/dashboard');
  });

// Email Verification Route (Placeholder - requires email sending setup)
app.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send('Verifizierungstoken fehlt.');
    }
    try {
        // Find user by token and mark as verified
        // const result = await db.execute({ sql: 'UPDATE users SET isVerified = TRUE, verificationToken = NULL WHERE verificationToken = ?', args: [token] });
        // if (result.rowsAffected > 0) {
        //    res.send('E-Mail erfolgreich verifiziert! Sie können sich jetzt anmelden.');
        // } else {
        //    res.status(400).send('Ungültiger oder abgelaufener Verifizierungstoken.');
        // }
        res.send('E-Mail-Verifizierung noch nicht implementiert.'); // Placeholder
    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).send('Fehler bei der E-Mail-Verifizierung.');
    }
});


// --- Protected Routes ---
app.get('/dashboard', ensureAuthenticated, async (req, res, next) => {
    try {
        const userId = req.user.id;
        console.log(`Fetching QR codes for user ID: ${userId}`);
        const result = await db.execute({
            sql: 'SELECT id, name, contentType, createdAt, scanCount, logoFilename FROM qr_codes WHERE userId = ? ORDER BY createdAt DESC',
            args: [userId]
        });
        console.log(`Found ${result.rows.length} QR codes for user ${userId}`);

        // Send the dashboard HTML file
        // We need a way to pass the QR code data to the HTML.
        // Since we're not using a template engine, we could:
        // 1. Send the static HTML and make an AJAX call from dashboard.js to a new API endpoint (/api/my-qrcodes)
        // 2. Inject the data directly into the HTML string (less clean).
        // Let's go with option 1 for better separation.
        res.sendFile(path.join(__dirname, 'dashboard.html'));

    } catch (error) {
        console.error("Error fetching QR codes for dashboard:", error);
        next(error); // Pass error to the error handler
    }
});

// API endpoint to get user's QR codes (protected)
app.get('/api/my-qrcodes', ensureAuthenticated, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await db.execute({
            sql: 'SELECT id, name, contentType, contentData, createdAt, scanCount, logoFilename, darkColor, lightColor FROM qr_codes WHERE userId = ? ORDER BY createdAt DESC',
            args: [userId]
        });
        res.json(result.rows); // Send QR code data as JSON
    } catch (error) {
        console.error("Error fetching QR codes via API:", error);
        res.status(500).json({ error: 'Fehler beim Abrufen der QR-Codes.' });
    }
});

// API endpoint to delete a QR code (protected)
app.delete('/api/qrcodes/:id', ensureAuthenticated, async (req, res, next) => {
    try {
        const qrCodeId = req.params.id;
        const userId = req.user.id;

        // Optional: Retrieve logo filename before deleting to remove the file
        const qrResult = await db.execute({
            sql: 'SELECT logoFilename FROM qr_codes WHERE id = ? AND userId = ?',
            args: [qrCodeId, userId]
        });

        // Delete the QR code entry from the database
        const deleteResult = await db.execute({
            sql: 'DELETE FROM qr_codes WHERE id = ? AND userId = ?',
            args: [qrCodeId, userId]
        });

        if (deleteResult.rowsAffected > 0) {
            console.log(`QR code ${qrCodeId} deleted for user ${userId}`);

            // Delete associated logo file if it exists
            if (qrResult.rows.length > 0 && qrResult.rows[0].logoFilename) {
                const logoPath = path.join(__dirname, uploadDir, qrResult.rows[0].logoFilename);
                fs.unlink(logoPath, (err) => {
                    if (err && err.code !== 'ENOENT') { // Ignore 'file not found' errors
                        console.error(`Error deleting logo file ${logoPath}:`, err);
                    } else if (!err) {
                        console.log(`Deleted associated logo file: ${logoPath}`);
                    }
                });
            }
            res.status(200).json({ message: 'QR-Code erfolgreich gelöscht.' });
        } else {
            console.log(`QR code ${qrCodeId} not found or user ${userId} not authorized to delete.`);
            res.status(404).json({ error: 'QR-Code nicht gefunden oder keine Berechtigung.' });
        }
    } catch (error) {
        console.error(`Error deleting QR code ${req.params.id}:`, error);
        res.status(500).json({ error: 'Fehler beim Löschen des QR-Codes.' });
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

app.get('/blog-qr-code-mit-logo.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog-qr-code-mit-logo.html'));
});


// --- Start Server ---
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// --- Error Handling Middleware --- MUST be last app.use()
app.use((err, req, res, next) => {
  console.error("Error details:", err.stack || err);

  // Handle Multer errors specifically
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }

  // Handle specific known errors from QR generation or validation
  if (err.message) {
     let statusCode = 500; // Default to Internal Server Error
     // Check for common client-side errors (400 Bad Request)
     if (err.message.includes('required') ||
         err.message.includes('Invalid content type') ||
         err.message.includes('Invalid') || // Generic invalid input
         err.message.includes('format allowed') || // File format error
         err.message.includes('No content provided')) {
         statusCode = 400;
     }
     // Use the error message directly if it's a client error, otherwise generic message
     const errorMessage = statusCode === 400 ? err.message : 'Ein unerwarteter Serverfehler ist aufgetreten.';
     // Ensure response is JSON if the request likely expected JSON
     if (req.xhr || req.headers.accept.includes('json')) {
        return res.status(statusCode).json({ error: errorMessage });
     } else {
        // Redirect back or render an error page for non-API requests
        // For simplicity, just send text
        return res.status(statusCode).send(errorMessage);
     }
  }

  // Generic fallback error handler
  if (!res.headersSent) {
     if (req.xhr || req.headers.accept.includes('json')) {
        res.status(500).json({ error: 'Ein unerwarteter Serverfehler ist aufgetreten.' });
     } else {
        res.status(500).send('Ein unerwarteter Serverfehler ist aufgetreten.');
     }
  } else {
      // If headers already sent, delegate to default Express error handler
      next(err);
  }
});
