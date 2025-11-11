// src/pages/SignupPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setOk("");
    if (!/\S+@\S+\.\S+/.test(email)) { setErr("Please enter a valid email."); return; }
    if (password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setErr("Passwords do not match."); return; }
    try {
      await api.post("/auth/register", { email, password });
      setOk("Account created. You can sign in now.");
      setTimeout(() => nav("/login"), 800);
    } catch (ex) {
      // Try Identity error array, ModelState, or raw string, then fallback
      const d = ex?.response?.data;
      const identityMsg = Array.isArray(d) ? d[0]?.description : undefined;
      const modelStateMsg = d?.errors ? Object.values(d.errors).flat()[0] : undefined;
      const rawMsg = typeof d === "string" ? d : undefined;
      const status = ex?.response?.status;

      setErr(identityMsg || modelStateMsg || rawMsg || `Could not sign up (status ${status ?? "network"})`);
    }

  };

  return (
    <div className="auth">
      <div className="auth-card">
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Sign up to manage your tasks</p>
        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-label">Email</label>
          <input className="input input-lg" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <label className="auth-label">Password</label>
          <input className="input input-lg" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
          <label className="auth-label">Confirm password</label>
          <input className="input input-lg" type="password" placeholder="••••••••" value={confirm} onChange={e=>setConfirm(e.target.value)} />
          {err && <div className="pill overdue" role="alert">{err}</div>}
          {ok && <div className="pill urg-1" role="status">{ok}</div>}
          <button className="btn btn-primary btn-lg" type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
}
