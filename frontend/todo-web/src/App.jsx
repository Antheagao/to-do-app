// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

export default function App() {
  return (
    <div className="page">
      <Header />
      <main className="app">
        <div className="panel">
          <Routes>
            <Route path="/" element={<TasksPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}
