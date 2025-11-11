// src/components/TaskForm.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [urgency, setUrgency] = useState(3);

  const nav = useNavigate();
  const loc = useLocation();

  const submit = (e) => {
    e.preventDefault();
    const authed = !!localStorage.getItem("token");
    if (!authed) {
      
      nav("/login", { state: { from: loc } });
      return;
    }
    if (!title || !dueDate) return;
    onSubmit({
      title, description, dueDate,
      dueTime: dueTime || null, urgency: Number(urgency),
    });
    setTitle(""); setDescription(""); setDueDate(""); setDueTime(""); setUrgency(3);
  };

  return (
    <form className="form" onSubmit={submit}>
      <div className="row">
        <input className="input" placeholder="Task title *" value={title} onChange={e=>setTitle(e.target.value)} />
      </div>
      <textarea className="textarea" placeholder="Description (optional)" value={description} onChange={e=>setDescription(e.target.value)} />
      <div className="row">
        <input className="input" type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
        <input className="input" type="time" value={dueTime} onChange={e=>setDueTime(e.target.value)} />
        <select className="select" value={urgency} onChange={e=>setUrgency(e.target.value)}>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>Urgency {n}</option>)}
        </select>
        <button className="btn btn-primary" type="submit">Add Task</button>
      </div>
    </form>
  );
}
