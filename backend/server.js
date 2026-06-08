import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';
import mysql from 'mysql2/promise'; // Clean async/await driver

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allows your local Vite client to talk to this server
app.use(express.json()); // Parses incoming request payloads into standard JSON

// Core Authentication Middleware: Intercepts and parses incoming Clerk user tokens
app.use(clerkMiddleware());

// Setup a Database Connection Pool referencing your .env parameters
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// 💾 THE SAVE ROUTE: Triggers when the user clicks "Save Profile" on the frontend
app.post('/api/profile', requireAuth(), async (req, res) => {
  try {
    // Extracts the user ID securely verified by the Clerk middleware check
    const { userId } = getAuth(req);
    const { username, fullName, bio, role, location, mapUrl, profileImage } = req.body;

    if (!username) {
      return res.status(400).json({ success: false, error: "A valid profile username is required." });
    }

    // Explicit Relational SQL Command: Inserts your details, or Updates them if the user already exists
    const sqlQuery = `
      INSERT INTO creator_profiles (clerk_user_id, username, full_name, bio, role, location, map_url, profile_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        username = VALUES(username),
        full_name = VALUES(full_name),
        bio = VALUES(bio),
        role = VALUES(role),
        location = VALUES(location),
        map_url = VALUES(map_url),
        profile_image = VALUES(profile_image)
    `;

    const values = [
      userId,
      username.toLowerCase().trim(),
      fullName,
      bio,
      role,
      location,
      mapUrl,
      profileImage
    ];

    // Fire the query down into your local MySQL instance
    await pool.execute(sqlQuery, values);

    return res.status(200).json({ success: true, message: "Profile successfully Created!" });
  } catch (error) {
    console.error("Internal Engine Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 🔍 THE FETCH ROUTE: Triggers automatically when the frontend page loads
app.get('/api/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Query MySQL for the row matching this specific username
    const [rows] = await pool.execute(
      'SELECT username, full_name, bio, role, location, map_url, profile_image FROM creator_profiles WHERE username = ?',
      [username.toLowerCase().trim()]
    );

    // If no row is returned, tell the frontend nicely so it can show empty fields
    if (rows.length === 0) {
      return res.status(200).json({ success: true, data: null });
    }

    // Send the database row right back to your React app
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("MySQL Fetch Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js Backend Server active and listening on http://localhost:${PORT}`);
});