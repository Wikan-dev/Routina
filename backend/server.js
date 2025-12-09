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

console.log("Server starting on port", process.env.PORT || 4000);

// Init supabase client (ADMIN mode)
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});

// ▶ UTILITY FUNCTIONS ===================================================

const profileFilePath = path.resolve(__dirname, "./data/profile.json");
const habitsFilePath = path.resolve(__dirname, "./data/habits.json");
const habitLogsFilePath = path.resolve(__dirname, "./data/habit_logs.json");

const loadProfiles = () => {
  try {
    if (fs.existsSync(profileFilePath)) {
      const data = JSON.parse(fs.readFileSync(profileFilePath, "utf-8"));
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

const findProfileByUserId = (userId) => {
  const profiles = loadProfiles();
  return profiles.find((p) => p.user_id === userId);
};

const createProfileWithUserId = (userId, name) => {
  const profiles = loadProfiles();
  
  if (!Array.isArray(profiles)) {
    throw new Error("Invalid profiles data structure");
  }

  const existing = profiles.find((p) => p.user_id === userId);
  if (existing) {
    throw new Error("User sudah terdaftar");
  }

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

app.put('/habit', (req, res) => {
  const { id, title, description } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: "ID habit diperlukan" });
  }

  const raw = fs.readFileSync(habitsFilePath);
  const data = JSON.parse(raw);
  let changed = false;

  const habit = data.habits.find(h => h.id === id);
  
  if (!habit) {
    return res.status(404).json({ error: "Habit tidak ditemukan" });
  }

  if (title) {
    habit.title = title;
    changed = true;
  } 
  if (description) {
    habit.description = description;
    changed = true;
  }
  if (!changed) {
    return res.status(400).json({ error: "Tidak ada data untuk diupdate" });
  }

  fs.writeFileSync(habitsFilePath, JSON.stringify(data, null, 2));

  res.json({ message: "Habit updated", habit });  
});

app.put('/habit/done', (req, res) => {
  const { id, day } = req.body;
  if (!id || !day) {
    return res.status(400).json({ error: "ID dan day diperlukan" });
  }

  const raw = fs.readFileSync(habitsFilePath);  
  const data = JSON.parse(raw);
  const habit = data.habits.find(h => h.id === id); 

  if (!habit) {
    return res.status(404).json({ error: "Habit tidak ditemukan" });
  }
  if (day < 1 || day > 7) {
    return res.status(400).json({ error: "Day harus antara 1-7" });
  }

  if (habit.week[day - 1] === "not_done") {
    habit.week[day - 1] = "done";
  } else {
    return res.status(400).json({ error: "Habit sudah ditandai done" });
  }

  fs.writeFileSync(habitsFilePath, JSON.stringify(data, null, 2));

  res.json({ message: "Habit marked as done", habit });
})


app.post("/auth/add_habit", async (req, res) => {
  try {
    const { title, description, days, color } = req.body;
    
    // Validasi required fields
    if (!title || !description || !Array.isArray(days)) {
      return res.status(400).json({ error: "Title, description, dan days (array) diperlukan" });
    }
    
    // Validasi dan process color
    let habitColor = "#3B82F6"; // Blue default
    
    if (color) {
      // Bersihkan color string (hapus # jika ada)
      const cleanColor = color.toString().replace('#', '').trim();
      
      // Validasi format hex (3 atau 6 karakter)
      if (!/^[0-9A-F]{3}([0-9A-F]{3})?$/i.test(cleanColor)) {
        return res.status(400).json({ 
          error: "Format color tidak valid. Gunakan format hex tanpa #, contoh: FF5733 atau F57" 
        });
      }
      
      // Tambahkan # ke depan
      habitColor = `#${cleanColor.toUpperCase()}`;
    }
    
    let week = Array(7).fill("none");
    days.forEach((day) => {
      const dayNum = parseInt(day);
      if (dayNum >= 1 && dayNum <= 7) {
        week[dayNum - 1] = "not_done";
      }
    });

    const habit = {
      id: crypto.randomBytes(8).toString("hex"),
      title,
      description,
      week,
      color: habitColor,
      created_at: new Date().toISOString(),
    };

    const raw = fs.readFileSync(habitsFilePath);
    const data = JSON.parse(raw);

    data.habits.push(habit);

    fs.writeFileSync(habitsFilePath, JSON.stringify(data, null, 2));

    res.json({ 
      message: "Habit berhasil ditambahkan", 
      habit 
    });

  } catch (err) {
    console.error("Add habit error:", err);
    res.status(500).json({ error: "Internal server error: " + err.message });
  }
});

// Signup pakai email, password & nama
app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    console.log("Signup request:", { email, name });

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, dan nama diperlukan" });
    }

    // STEP 1: Buat user di Supabase
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

    // STEP 2: Buat profile di profile.json
    let profile;
    try {
      profile = createProfileWithUserId(userId, name);
      console.log("Profile created:", profile.user_id);
    } catch (profileErr) {
      console.error("Profile creation error:", profileErr.message);
      
      // ROLLBACK: Hapus user dari Supabase
      try {
        await supabase.auth.admin.deleteUser(userId);
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

    if (!user_id) {
      return res.status(400).json({ error: "User ID diperlukan" });
    }

    const profile = findProfileByUserId(user_id);
    
    if (!profile) {
      return res.status(404).json({ error: "Profile tidak ditemukan" });
    }

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

    const { data, error } = await supabase.auth.admin.createUser({
      email: guestEmail,
      password: guestPassword,
      email_confirm: true,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const userId = data.user.id;

    let profile;
    try {
      profile = createProfileWithUserId(userId, guestName);
    } catch (profileErr) {
      try {
        await supabase.auth.admin.deleteUser(userId);
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
