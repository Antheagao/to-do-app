// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // <-- added Link
import { api } from "../api/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const loc = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!/\S+@\S+\.\S+/.test(email)) { setErr("Please enter a valid email."); return; }
    if (!password) { setErr("Please enter your password."); return; }
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      const redirectTo = loc.state?.from?.pathname || "/";
      nav(redirectTo);
    } catch {
      setErr("Invalid email or password.");
    }
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <h2 className="auth-title">Sign in</h2>
        <p className="auth-subtitle">Access your tasks securely</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-label">Email</label>
          <input
            className="input input-lg"
            placeholder="you@example.com"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />

          <label className="auth-label">Password</label>
          <input
            className="input input-lg"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />

          {err && <div className="pill overdue" role="alert">{err}</div>}

          <button className="btn btn-primary btn-lg" type="submit">Sign in</button>

          {/* Link under the button */}
          <p className="auth-subtitle center" style={{ marginTop: 10 }}>
            New here?{" "}
            <Link className="text-link" to="/signup">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
