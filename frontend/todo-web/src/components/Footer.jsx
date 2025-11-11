export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span>© {year} Anthony Mendez</span>
      </div>
    </footer>
  );
}
