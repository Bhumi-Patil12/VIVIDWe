import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, getAuth } from '@clerk/express';
import mysql from 'mysql2/promise'; 
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ES Module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration Middleware (Explicitly allowing DELETE for CORS)
app.use(cors({ 
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true
})); 
app.use(express.json()); 

// 📁 STATIC ROUTE: Expose the uploads folder so frontend can access video streams
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Core Authentication Middleware (Clerk standard)
app.use(clerkMiddleware());

// Setup a Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// 🛠️ MULTER CONFIGURATION FOR LOCAL VIDEO STORAGE
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `reel-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB Max
});


// ==========================================
// 🎬 ROUTE 1: UPLOAD REEL TO LOCAL + MYSQL
// ==========================================
app.post('/api/upload-reel', upload.single('video'), async (req, res) => {
  try {
    const { userId } = getAuth(req); 

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized! Please login first." });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No video file uploaded." });
    }

    const videoUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

    const sqlQuery = `INSERT INTO reels (clerk_user_id, video_url) VALUES (?, ?)`;
    await pool.execute(sqlQuery, [userId, videoUrl]);

    return res.status(200).json({ 
      success: true, 
      message: "Reel uploaded and saved locally successfully!", 
      videoUrl 
    });

  } catch (error) {
    console.error("Reel Upload Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});


// ==========================================
// 🎬 ROUTE 2: FETCH ALL REELS FOR THE FEED
// ==========================================
app.get('/api/reels-feed', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM reels ORDER BY created_at DESC');
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Reels Feed Fetch Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});


// ==========================================
// 🗑️ ROUTE 3: SECURE DELETE REEL (Database + Local Folder)
// ==========================================
app.delete('/api/delete-reel/:id', async (req, res) => {
  try {
    const { userId } = getAuth(req); 
    
    if (!userId) {
      return res.status(401).json({ success: false, error: "Login status checking failed!" });
    }

    const { id } = req.params;
    console.log(`[DEBUG] Attempting delete for Reel ID: ${id} by User: ${userId}`);

    // 1. MySQL Check
    const [rows] = await pool.execute('SELECT * FROM reels WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: "Reel database mein nahi mili!" });
    }

    const reel = rows[0];

    // 2. Authorization check
    if (reel.clerk_user_id !== userId) {
      return res.status(403).json({ success: false, error: "Tum kisi aur ki reel delete nahi kar sakte!" });
    }

    // 3. File deletion logic
    try {
      const filename = reel.video_url.split('/uploads/')[1];
      const localFilePath = path.resolve(__dirname, 'uploads', filename);

      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log(`[DEBUG] File scrubbed from local storage: ${localFilePath}`);
      }
    } catch (fsErr) {
      console.error("[DEBUG] FS error, proceeding to clear DB anyway:", fsErr.message);
    }

    // 4. Clear from DB
    await pool.execute('DELETE FROM reels WHERE id = ?', [id]);
    console.log(`[DEBUG] Reel row ID ${id} deleted successfully from MySQL.`);

    return res.status(200).json({ success: true, message: "Deleted successfully!" });

  } catch (error) {
    console.error("Delete Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});


// 💾 THE SAVE PROFILE ROUTE
app.post('/api/profile', async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

    const username = req.body.username;
    const fullName = req.body.fullName || null;
    const email = req.body.email || null;
    const bio = req.body.bio || null;
    const role = req.body.role || 'creator';
    const location = req.body.location || null;
    const mapUrl = req.body.mapUrl || null;
    const profileImage = req.body.profileImage || null;
    
    const companyName = req.body.companyName || null;
    const companyEmail = req.body.companyEmail || null;
    const companyWebsite = req.body.companyWebsite || null;
    const hiringMember = req.body.hiringMember || null;
    const recruiterVerified = req.body.recruiterVerified ? 1 : 0;

    if (!username) {
      return res.status(400).json({ success: false, error: "A valid profile username is required." });
    }

    const cleanUsername = username.toLowerCase().trim();
    let sqlQuery = "";
    let values = [];

    if (role === "recruiter") {
      sqlQuery = `
        INSERT INTO recruiter_profiles 
          (clerk_user_id, username, full_name, email, bio, role, location, map_url, profile_image, company_name, company_email, company_website, hiring_member, recruiter_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          username = VALUES(username),
          full_name = VALUES(full_name),
          email = VALUES(email),
          bio = VALUES(bio),
          location = VALUES(location),
          map_url = VALUES(map_url),
          profile_image = VALUES(profile_image),
          company_name = VALUES(company_name),
          company_email = VALUES(company_email),
          company_website = VALUES(company_website),
          hiring_member = VALUES(hiring_member),
          recruiter_verified = VALUES(recruiter_verified)
      `;
      values = [userId, cleanUsername, fullName, email, bio, 'recruiter', location, mapUrl, profileImage, companyName, companyEmail, companyWebsite, hiringMember, recruiterVerified];

    } else if (role === "viewer") {
      sqlQuery = `
        INSERT INTO viewer_profiles 
          (clerk_user_id, username, full_name, email, bio, role, location, map_url, profile_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          username = VALUES(username),
          full_name = VALUES(full_name),
          email = VALUES(email),
          bio = VALUES(bio),
          location = VALUES(location),
          map_url = VALUES(map_url),
          profile_image = VALUES(profile_image)
      `;
      values = [userId, cleanUsername, fullName, email, bio, 'viewer', location, mapUrl, profileImage];

    } else {
      sqlQuery = `
        INSERT INTO creator_profiles (clerk_user_id, username, full_name, email, bio, role, location, map_url, profile_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          username = VALUES(username),
          full_name = VALUES(full_name),
          email = VALUES(email),
          bio = VALUES(bio),
          role = VALUES(role),
          location = VALUES(location),
          map_url = VALUES(map_url),
          profile_image = VALUES(profile_image)
      `;
      values = [userId, cleanUsername, fullName, email, bio, role, location, mapUrl, profileImage];
    }

    await pool.execute(sqlQuery, values);
    return res.status(200).json({ success: true, message: "Profile successfully saved!" });
  } catch (error) {
    console.error("Internal Engine Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 🔍 THE FETCH ROUTE
app.get('/api/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const cleanUsername = username.toLowerCase().trim();

    const [creatorRows] = await pool.execute(
      'SELECT username, full_name, bio, role, location, map_url, profile_image FROM creator_profiles WHERE username = ?',
      [cleanUsername]
    );
    if (creatorRows.length > 0) {
      return res.status(200).json({ success: true, data: { ...creatorRows[0], actualRole: 'creator' } });
    }

    const [recruiterRows] = await pool.execute(
      'SELECT username, full_name, bio, role, location, map_url, profile_image, company_name, company_email, company_website, hiring_member, recruiter_verified FROM recruiter_profiles WHERE username = ?',
      [cleanUsername]
    );
    if (recruiterRows.length > 0) {
      return res.status(200).json({ success: true, data: { ...recruiterRows[0], actualRole: 'recruiter' } });
    }

    const [viewerRows] = await pool.execute(
      'SELECT username, full_name, bio, role, location, map_url, profile_image FROM viewer_profiles WHERE username = ?',
      [cleanUsername]
    );
    if (viewerRows.length > 0) {
      return res.status(200).json({ success: true, data: { ...viewerRows[0], actualRole: 'viewer' } });
    }

    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    console.error("MySQL Fetch Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 🛠️ FALLBACKS: ERROR PAGES KO JSON MEIN BADALNE KE LIYE
// ==========================================

// 1. Agar koi galat URL call ho toh HTML ke badle JSON 404 return hoga
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.url} Not Found!` });
});



app.listen(PORT, () => {
  console.log(`🚀 Node.js Backend Server active and listening on http://localhost:${PORT}`);
});