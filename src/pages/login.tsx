import { useState } from "react";
import { supabase } from "../client/supabaseClient";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const loginEmail = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const uid = data.user?.id;
    nav(`/user/${uid}`);
  };

  const loginGuest = async () => {
    // PANGGIL BACKEND → dapet email & password guest
    const res = await axios.post("http://localhost:4000/guest");
    const guest = res.data;

    // LOGIN KE SUPABASE PAKE CREDENTIAL YANG DI-BACKEND
    const { data, error } = await supabase.auth.signInWithPassword({
      email: guest.email,
      password: guest.password,
    });

    if (error) {
      alert("Guest login failed");
      return;
    }

    const uid = data.user?.id;
    nav(`/user/${uid}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

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

      <button onClick={loginEmail}>Login</button>
      <button onClick={loginGuest}>Continue as Guest</button>
    </div>
  );
}