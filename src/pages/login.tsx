import { useState } from "react";
import { supabase } from "../client/supabaseClient";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSignup = async () => {
    if (!email || !password || !name) {
      alert("Email, password, dan nama harus diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/auth/signup", {
        email,
        password,
        name,
      });

      alert(res.data.message);
      setIsSignup(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      const errorMsg = err instanceof axios.AxiosError 
        ? err.response?.data?.error || err.message 
        : (err instanceof Error ? err.message : "Unknown error");
      console.error("Signup error:", err);
      alert("Signup failed: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const loginEmail = async () => {
    if (!email || !password) {
      alert("Email dan password harus diisi");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Login gagal: " + error.message);
        return;
      }

      // Ambil profile dari backend berdasarkan user_id
      const profileRes = await axios.post("http://localhost:4000/auth/profile", {
        user_id: data.user.id,
      });

      const uid = data.user?.id;
      const profile = profileRes.data;

      // Simpan profile ke localStorage
      localStorage.setItem("user_profile", JSON.stringify(profile));
      
      nav(`/user/${uid}`);
    } catch (err) {
      const errorMsg = err instanceof axios.AxiosError 
        ? err.response?.data?.error || err.message 
        : (err instanceof Error ? err.message : "Unknown error");
      console.error("Login error:", err);
      alert("Login error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const loginGuest = async () => {
    setLoading(true);
    try {
      // PANGGIL BACKEND → dapet email & password guest
      const res = await axios.post("http://localhost:4000/auth/guest");
      const guest = res.data;

      // LOGIN KE SUPABASE PAKE CREDENTIAL YANG DI-BACKEND
      const { data, error } = await supabase.auth.signInWithPassword({
        email: guest.email,
        password: guest.password,
      });

      if (error) {
        alert("Guest login failed: " + error.message);
        return;
      }

      // Simpan guest profile
      localStorage.setItem("user_profile", JSON.stringify(guest.profile));

      const uid = data.user?.id;
      nav(`/user/${uid}`);
    } catch (err) {
      const errorMsg = err instanceof axios.AxiosError 
        ? err.response?.data?.error || err.message 
        : (err instanceof Error ? err.message : "Unknown error");
      console.error("Guest login error:", err);
      alert("Guest login error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>{isSignup ? "Daftar" : "Login"}</h1>

      {isSignup && (
        <>
          <input
            placeholder="nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          /><br />
        </>
      )}

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      {isSignup ? (
        <>
          <button onClick={handleSignup} disabled={loading}>
            {loading ? "Loading..." : "Daftar"}
          </button>
          <button  onClick={() => setIsSignup(false)}>Kembali ke Login</button>
        </>
      ) : (
        <>
          <button onClick={loginEmail} disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
          <button onClick={loginGuest} disabled={loading}>
            {loading ? "Loading..." : "Continue as Guest"}
          </button>
          <button onClick={() => setIsSignup(true)}>Belum punya akun? Daftar</button>
        </>
      )}
    </div>
  );
}