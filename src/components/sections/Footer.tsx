import { profile } from "../../data/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <span className="ft-brand">{profile.shortName}</span>
        <p>
          © {year} {profile.name} · Built with React, Three.js & Framer Motion
        </p>
        <p style={{ marginTop: 6, fontSize: "0.78rem" }}>
          Designed as an interactive representation of how I see technology.
        </p>
      </div>
    </footer>
  );
}
