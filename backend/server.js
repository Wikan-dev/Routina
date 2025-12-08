import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

// Ambil project ref dari .env
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF;

// Generate Supabase URL
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

// Ambil key dari .env
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

console.log("DEBUG ENV:", {
  PROJECT_REF: process.env.SUPABASE_PROJECT_REF,
  SERVICE_KEY_EXISTS: !!process.env.SUPABASE_SERVICE_KEY,
  RAW_KEY: process.env.SUPABASE_SERVICE_KEY
});


// Init supabase client (ADMIN mode)
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});


// ▶ UTILITY FUNCTIONS ===================================================

// Load atau create profile.json
const profileFilePath = path.resolve(__dirname, "./data/profile.json");

const loadProfiles = () => {
  try {
    if (fs.existsSync(profileFilePath)) {
      const data = JSON.parse(fs.readFileSync(profileFilePath, "utf-8"));
      // Pastikan selalu return array
      return Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error("Error loading profiles:", err);
  }
  return [];
};

const saveProfiles = (profiles) => {
  if (!Array.isArray(profiles)) {
    throw new Error("Profiles must be an array");
  }
  fs.writeFileSync(profileFilePath, JSON.stringify(profiles, null, 2));
};

const findProfileByEmail = (email) => {
  const profiles = loadProfiles();
  return profiles.find((p) => p.email === email);
};

const findProfileByUserId = (userId) => {
  const profiles = loadProfiles();
  return profiles.find((p) => p.user_id === userId);
};

const createProfile = (email, name) => {
  const profiles = loadProfiles();
  
  if (!Array.isArray(profiles)) {
    throw new Error("Invalid profiles data structure");
  }

  // Cek apakah email sudah ada
  const existing = profiles.find((p) => p.email === email);
  if (existing) {
    throw new Error("Email sudah terdaftar");
  }

  // Buat profile baru
  const newProfile = {
    id: "user_" + crypto.randomBytes(8).toString("hex"),
    email,
    name,
    created_at: new Date().toISOString(),
  };

  profiles.push(newProfile);
  saveProfiles(profiles);
  return newProfile;
};

const createProfileWithUserId = (userId, name) => {
  const profiles = loadProfiles();
  
  if (!Array.isArray(profiles)) {
    throw new Error("Invalid profiles data structure");
  }

  // Cek apakah user_id sudah ada
  const existing = profiles.find((p) => p.user_id === userId);
  if (existing) {
    throw new Error("User sudah terdaftar");
  }

  // Buat profile baru dengan user_id dari Supabase
  const newProfile = {
    user_id: userId,
    name,
    created_at: new Date().toISOString(),
  };

  profiles.push(newProfile);
  saveProfiles(profiles);
  return newProfile;
};

// ▶ ROUTES ===================================================

// Signup pakai email, password & nama
app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    console.log("Signup request:", { email, name, passwordLength: password?.length });

    if (!email || !password || !name) {
      console.error("Missing fields:", { email, password, name });
      return res.status(400).json({ error: "Email, password, dan nama diperlukan" });
    }

    // STEP 1: Buat user di Supabase terlebih dahulu
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      console.error("Supabase creation error:", error);
      return res.status(400).json({ error: error.message });
    }

    const userId = data.user.id;
    console.log("User created in Supabase:", userId);

    // STEP 2: Buat profile di profile.json dengan user_id dari Supabase
    let profile;
    try {
      profile = createProfileWithUserId(userId, name);
      console.log("Profile created successfully:", profile.user_id);
    } catch (profileErr) {
      console.error("Profile creation error:", profileErr.message);
      
      // ROLLBACK: Hapus user dari Supabase jika profile gagal
      try {
        await supabase.auth.admin.deleteUser(userId);
        console.log("User rolled back from Supabase");
      } catch (rollbackErr) {
        console.error("Rollback error:", rollbackErr);
      }
      
      return res.status(400).json({ error: profileErr.message });
    }

    res.json({ 
      message: "User berhasil dibuat",
      user: data.user,
      profile,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error: " + err.message });
  }
});

// Get profile by user_id
app.post("/auth/profile", async (req, res) => {
  try {
    const { user_id } = req.body;

    console.log("Profile request:", { user_id });

    if (!user_id) {
      console.error("User ID not provided");
      return res.status(400).json({ error: "User ID diperlukan" });
    }

    const profile = findProfileByUserId(user_id);
    
    if (!profile) {
      console.error("Profile not found:", user_id);
      return res.status(404).json({ error: "Profile tidak ditemukan" });
    }

    console.log("Profile found:", profile.user_id);
    res.json(profile);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Internal server error: " + err.message });
  }
});

// Guest login
app.post("/auth/guest", async (req, res) => {
  try {
    const randomId = "guest_" + Math.random().toString(36).substring(2, 10);
    const guestEmail = `guest_${randomId}@routina.local`;
    const guestPassword = crypto.randomBytes(16).toString("hex");
    const guestName = "Guest " + randomId;

    console.log("Guest login request:", { guestEmail });

    // Create guest user di Supabase
    const { data, error } = await supabase.auth.admin.createUser({
      email: guestEmail,
      password: guestPassword,
      email_confirm: true,
    });

    if (error) {
      console.error("Guest creation error:", error);
      return res.status(400).json({ error: error.message });
    }

    const userId = data.user.id;
    console.log("Guest created in Supabase:", userId);

    // Simpan guest profile dengan user_id
    let profile;
    try {
      profile = createProfileWithUserId(userId, guestName);
      console.log("Guest profile created:", profile.user_id);
    } catch (profileErr) {
      console.error("Guest profile error:", profileErr.message);
      
      // ROLLBACK: Hapus guest user dari Supabase jika profile gagal
      try {
        await supabase.auth.admin.deleteUser(userId);
        console.log("Guest user rolled back from Supabase");
      } catch (rollbackErr) {
        console.error("Guest rollback error:", rollbackErr);
      }
      
      return res.status(400).json({ error: profileErr.message });
    }

    res.json({
      id: randomId,
      type: "guest",
      email: guestEmail,
      password: guestPassword,
      profile,
    });
  } catch (err) {
    console.error("Guest login error:", err);
    res.status(500).json({ error: "Internal server error: " + err.message });
  }
});

// ============================================================

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server nyala di http://localhost:${PORT}`);
});
