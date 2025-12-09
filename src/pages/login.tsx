import { useState } from "react";
import { supabase } from "../client/supabaseClient";
import axios from "axios";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

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

    <div className="border-2 border-[#DFDFDF] rounded-3 w-[40%] h-[550px] flex flex-col justify-start mx-auto p-10 mt-20 text-left max-[429px]:w-[100%] max-[429px]:mt-0 max-[429px]:h-screen">
      <h1 className="font-bold text-[48px] max-[429px]:mt-[-10px]">{isSignup ? "Sign-in" : "Login"}</h1>
      {isSignup && (
        <>
          <p className="font-medium text-[20px]">Username</p>
          <input
            className="w-auto h-[50px] text-[20px] border-2 border-[#DFDFDF] rounded-2 p-2"
            placeholder="Input username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          /><br />
        </>
      )}
      <p className="font-medium text-[20px]">Email</p>
      <input
        className="w-auto h-[50px] text-[20px] border-2 border-[#DFDFDF] rounded-2 p-2"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <p className="font-medium text-[20px]">Password</p>
      <input
        className="w-auto h-[50px] text-[20px] border-2 border-[#DFDFDF] rounded-2 p-2"
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      {isSignup ? (
        <>
          <p className="text-[20px] font-medium">Already have an account?
            <button onClick={() => setIsSignup(false)} className="cursor-pointer relative ml-5 text-blue-500 max-[429px]:ml-5">Login</button>
          </p>
          <motion.button onClick={handleSignup} disabled={loading} className="relative border-2 h-8 border-[#DFDFDF] rounded-3 w-20 ml-auto h-10 mt-auto cursor-pointer font-medium" whileHover={{scale:1.05}} whileTap={{scale: 0.92}}>
            {loading ? "Loading..." : "Sign-in"}
          </motion.button>
        </>
      ) : (
        <>
          <p className="text-[20px] font-medium">Don't have an account?
            <button onClick={() => setIsSignup(true)} className="cursor-pointer relative ml-5 text-blue-500 max-[429px]:ml-5">Sign up</button>
          </p>
          <button onClick={loginGuest} disabled={loading} className="cursor-pointer relative mr-auto mt-5 text-blue-500 font-medium max-[429px]:ml-5">
            {loading ? "Loading..." : "Or continue as Guest"}
          </button>
          <motion.button onClick={loginEmail} disabled={loading}  className="relative border-2 h-8 border-[#DFDFDF] rounded-3 w-20 ml-auto h-10 mt-auto cursor-pointer font-medium" whileHover={{scale:1.05}} whileTap={{scale: 0.92}}>
            {loading ? "Loading..." : "Login"}
          </motion.button>
        </>
      )}
    </div>
  );
}