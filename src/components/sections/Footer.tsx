export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} Tauseef Khan ·{" "}
        <a href="https://github.com/Tauseef666-ctrl" target="_blank" rel="noreferrer">
          GitHub
        </a>{" "}
        · Built as a scroll-driven film
      </p>
    </footer>
  );
}
export default Footer;