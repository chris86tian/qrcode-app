const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');

module.exports = function(passport, db) {

  // --- Local Strategy (Email/Password) ---
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      // Find user by email
      const result = await db.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [email]
      });

      if (result.rows.length === 0) {
        return done(null, false, { message: 'Diese E-Mail ist nicht registriert.' });
      }

      const user = result.rows[0];

      // Match password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // TODO: Check if email is verified if implementing email verification
        // if (!user.isVerified) {
        //   return done(null, false, { message: 'Bitte bestätigen Sie Ihre E-Mail-Adresse.' });
        // }
        return done(null, user);
      } else {
        return done(null, false, { message: 'Passwort ist inkorrekt.' });
      }
    } catch (err) {
      console.error("Error in LocalStrategy:", err);
      return done(err);
    }
  }));

  // --- Google OAuth 2.0 Strategy ---
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback", // Ensure this matches Google Console and .env
      scope: ['profile', 'email'] // Request profile and email
    },
    async (accessToken, refreshToken, profile, done) => {
      const googleId = profile.id;
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
      // const displayName = profile.displayName; // Optional: Store display name

      if (!email) {
        return done(new Error("Google-Konto hat keine E-Mail-Adresse."), null);
      }

      try {
        // Check if user already exists via Google ID
        let result = await db.execute({
          sql: 'SELECT * FROM users WHERE googleId = ?',
          args: [googleId]
        });

        if (result.rows.length > 0) {
          // User found via Google ID
          return done(null, result.rows[0]);
        } else {
          // Check if user exists via email (maybe registered locally before)
          result = await db.execute({
            sql: 'SELECT * FROM users WHERE email = ?',
            args: [email]
          });

          if (result.rows.length > 0) {
            // User exists with this email, link Google ID
            const user = result.rows[0];
            await db.execute({
              sql: 'UPDATE users SET googleId = ? WHERE id = ?',
              args: [googleId, user.id]
            });
            return done(null, user);
          } else {
            // New user: Create account
            // Note: We don't have a password for Google sign-ups
            const insertResult = await db.execute({
              sql: 'INSERT INTO users (email, googleId, isVerified) VALUES (?, ?, ?)',
              args: [email, googleId, true] // Mark as verified since Google handles email verification
            });
            // Fetch the newly created user to get their ID
             const newUserResult = await db.execute({
                sql: 'SELECT * FROM users WHERE id = ?',
                args: [insertResult.lastInsertRowid]
             });
             if (newUserResult.rows.length > 0) {
                return done(null, newUserResult.rows[0]);
             } else {
                return done(new Error("Konnte neuen Benutzer nach der Erstellung nicht finden."), null);
             }
          }
        }
      } catch (err) {
        console.error("Error in GoogleStrategy:", err);
        return done(err, null);
      }
    }
  ));

  // --- Serialize and Deserialize User ---
  // Stores user ID in session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Retrieves user details from session using ID
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await db.execute({
        sql: 'SELECT * FROM users WHERE id = ?',
        args: [id]
      });
      if (result.rows.length > 0) {
        done(null, result.rows[0]); // Attach user object to req.user
      } else {
        done(null, false); // User not found
      }
    } catch (err) {
      done(err, null);
    }
  });
};
