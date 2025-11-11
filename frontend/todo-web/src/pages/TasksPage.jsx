import { useEffect, useState } from "react";
import { api } from "../api/client";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("open");
  const [sort, setSort] = useState("due");
  const [dir, setDir] = useState("asc");

  const load = async () => {
    const { data } = await api.get("/tasks", { params: { status } });
    
    const sorted = [...data].sort((a,b) => {
      if (sort === "due") {
        const ad = `${a.dueDate} ${a.dueTime ?? "23:59"}`;
        const bd = `${b.dueDate} ${b.dueTime ?? "23:59"}`;
        return dir === "asc" ? ad.localeCompare(bd) : bd.localeCompare(ad);
      }
      if (sort === "urgency") return dir === "asc" ? a.urgency - b.urgency : b.urgency - a.urgency;
      if (sort === "title")  return dir === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      return 0;
    });
    setTasks(sorted);
  };

  useEffect(() => { load(); }, [status, sort, dir]);

  const onCreate = async (payload) => { await api.post("/tasks", payload); await load(); };
  const onToggle = async (id) => { await api.post(`/tasks/${id}/complete`); await load(); };
  const onDelete = async (id) => { await api.delete(`/tasks/${id}`); await load(); };
  const onUpdate = async (id, payload) => {
    // Ensure payload.id matches route id (our Edit form sets it)
    await api.put(`/tasks/${id}`, payload);
    await load();
  };

  return (
    <>
      <div className="form">
        <div className="toolbar">
          <strong style={{color:"var(--muted)"}}>View</strong>
          <select className="select" style={{width:160}} value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="open">Open</option>
            <option value="completed">Completed</option>
            <option value="all">All</option>
          </select>
          <div className="sep" />
          <strong style={{color:"var(--muted)"}}>Sort</strong>
          <select className="select" style={{width:160}} value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="due">Due date</option>
            <option value="urgency">Urgency</option>
            <option value="title">Title</option>
          </select>
          <select className="select" style={{width:120}} value={dir} onChange={e=>setDir(e.target.value)}>
            <option value="asc">↑ Asc</option>
            <option value="desc">↓ Desc</option>
          </select>
        </div>
      </div>

      <TaskForm onSubmit={onCreate} />

      <div className="grid">
        {tasks.map(t => (
          <TaskCard key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate}/>
        ))}
      </div>
    </>
  );
}
