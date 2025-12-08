import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

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


// ▶ ROUTES ===================================================

// Signup pakai email
app.post("/auth/signup", async (req, res) => {
  const { email } = req.body;

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "OTP terkirim!" });
});

// Guest login
app.post("/auth/guest", async (req, res) => {
  const randomId = "guest_" + Math.random().toString(36).substring(2, 10);

  res.json({
    id: randomId,
    type: "guest",
  });
});

// ============================================================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server nyala di http://localhost:${PORT}`);
});
