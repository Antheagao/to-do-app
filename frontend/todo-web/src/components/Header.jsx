import { Link, useLocation } from "react-router-dom";
import notebook from "../assets/notebook.svg";
import { isAuthed, signOut, getUserEmail } from "../auth";

export default function Header() {
  const { pathname } = useLocation();
  const authed = isAuthed();
  const email = authed ? getUserEmail() : null;

  return (
    <header className="site-header">
      <div className="site-header__bg" />
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand link-reset" aria-label="Go to home">
          <img src={notebook} alt="Notebook" style={{ width: 28, height: 28 }} />
          <h1 className="h1">To-Do List</h1>
        </Link>

        <div className="toolbar">
          {authed ? (
            <>
              {email && <span className="badge">{email}</span>}
              <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
            </>
          ) : pathname !== "/login" && (
            <>
              <Link className="btn btn-ghost" to="/signup">Sign up</Link>
              <Link className="btn btn-primary" to="/login">Sign in</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
