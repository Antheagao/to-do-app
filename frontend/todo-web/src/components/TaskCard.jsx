import { useState } from "react";
import Modal from "./Modal";

export default function TaskCard({ task, onToggle, onDelete, onUpdate }) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const overdue = !task.isCompleted && new Date(`${task.dueDate}T${task.dueTime ?? "23:59"}:00`) < new Date();
  const urgClass = `pill urg-${Math.min(Math.max(task.urgency,1),5)}`;

  return (
    <>
      <div className="card">
        <div className="strip" />
        <div className="card-body">
          <div className="card-title">{task.title}</div>
          {task.description && <div className="card-desc">{task.description}</div>}

          <div className="meta">
            <span className="pill">Due {task.dueDate}{task.dueTime ? ` ${task.dueTime}` : ""}</span>
            <span className={urgClass}>Urgency {task.urgency}</span>
            {overdue && <span className="pill overdue">Overdue</span>}
            {task.isCompleted && <span className="pill" style={{borderColor:"var(--success)", color:"#c8f7d4", background:"rgba(34,197,94,.12)"}}>Completed</span>}
          </div>

          <div className="actions">
            <button className="btn btn-primary" onClick={() => onToggle(task.id)}>
              {task.isCompleted ? "Mark Open" : "Complete"}
            </button>
            <button className="btn btn-ghost" onClick={() => setViewOpen(true)}>View</button>
            <button className="btn btn-ghost" onClick={() => setEditOpen(true)}>Edit</button>
            <button className="btn btn-danger" onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </div>
      </div>

      
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Task details">
        <div style={{display:"grid", gap:8}}>
          <div><strong>Title:</strong> {task.title}</div>
          {task.description && <div><strong>Description:</strong> {task.description}</div>}
          <div><strong>Due:</strong> {task.dueDate}{task.dueTime ? ` ${task.dueTime}` : ""}</div>
          <div><strong>Urgency:</strong> {task.urgency}</div>
          <div><strong>Status:</strong> {task.isCompleted ? "Completed" : "Open"}</div>
          <div style={{display:"flex", gap:8, marginTop:8}}>
            <button className="btn btn-primary" onClick={() => { setViewOpen(false); onToggle(task.id); }}>
              {task.isCompleted ? "Reopen" : "Complete"}
            </button>
            <button className="btn btn-ghost" onClick={() => setViewOpen(false)}>Close</button>
          </div>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit task">
        <EditTaskForm
          initial={task}
          onCancel={() => setEditOpen(false)}
          onSave={async (payload) => {
            await onUpdate(task.id, payload);
            setEditOpen(false);
          }}
        />
      </Modal>
    </>
  );
}

/* Inline edit form */
function EditTaskForm({ initial, onCancel, onSave }) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description ?? "");
  const [dueDate, setDueDate] = useState(initial.dueDate);
  const [dueTime, setDueTime] = useState(initial.dueTime ?? "");
  const [urgency, setUrgency] = useState(initial.urgency);

  const submit = (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    onSave({
      id: initial.id,
      title,
      description,
      dueDate,
      dueTime: dueTime || null,
      urgency: Number(urgency),
      isCompleted: initial.isCompleted,
      createdAt: initial.createdAt,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <input className="input" placeholder="Title *" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="textarea" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <div className="row">
        <input className="input" type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
        <input className="input" type="time" value={dueTime} onChange={e=>setDueTime(e.target.value)} />
        <select className="select" value={urgency} onChange={e=>setUrgency(e.target.value)}>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>Urgency {n}</option>)}
        </select>
      </div>
      <div className="row">
        <button className="btn btn-primary" type="submit">Save changes</button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
