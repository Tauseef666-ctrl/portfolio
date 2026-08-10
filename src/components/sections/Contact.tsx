import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { contact } from "../../data/profile";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Reveal } from "../../components/ui/Reveal";
import { MagneticButton } from "../../components/ui/MagneticButton";

type Errors = { name?: string; email?: string; message?: string };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const socialLinks = [
  { key: "email", label: "Email", value: contact.email, icon: "✉", prefix: "mailto:" },
  { key: "github", label: "GitHub", value: contact.github, icon: "⌥", prefix: "" },
];

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!emailRe.test(form.email.trim())) next.email = "That email doesn't look right.";
    if (!form.message.trim()) next.message = "Please write a short message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    if (contact.email) {
      const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
      const body = encodeURIComponent(
        `${form.message}\n\n— ${form.name}\nReply to: ${form.email}`
      );
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    }

    setSent(true);
    setTimeout(() => {
      setForm({ name: "", email: "", message: "" });
      setSent(false);
    }, 5000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field as keyof Errors]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeading kicker="Contact" title={contact.heading} />

        <div className="contact-grid">
          <div>
            <Reveal>
              <p className="contact-note">{contact.note}</p>
              <div className="contact-links">
                  {socialLinks.map((link) => {
                    const filled = !!link.value;
                    const href = filled ? link.prefix + link.value : undefined;
                    const inner = (
                      <>
                        <span className="cl-icon" aria-hidden="true">
                          {link.icon}
                        </span>
                        <span className="cl-text">
                          <strong>{link.label}</strong>
                          <span className="cl-sub">
                            {filled
                              ? link.key === "email"
                                ? "Send me an email"
                                : "Open my profile"
                              : `Add your ${link.label.toLowerCase()} link in src/data/profile.ts`}
                          </span>
                        </span>
                        <span className="cl-arrow" aria-hidden="true">
                          {filled ? "↗" : ""}
                        </span>
                      </>
                    );
                    return filled ? (
                      <a
                        key={link.key}
                        className="contact-link"
                        href={href}
                        target={link.key !== "email" ? "_blank" : undefined}
                        rel="noreferrer"
                      >
                        {inner}
                      </a>
                    ) : (
                    <div key={link.key} className="contact-link disabled" aria-disabled="true">
                      {inner}
                    </div>
                  );
                })}
                {contact.socials.map((s) => (
                  <a key={s.label} className="contact-link" href={s.href} target="_blank" rel="noreferrer">
                    <span className="cl-icon">→</span>
                    <span>{s.label}</span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  className="form-success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="fs-icon">✓</div>
                  <strong>Message ready!</strong>
                  <p style={{ marginTop: 8, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                    Your email app should have opened with your message addressed to{" "}
                    {contact.email}. If it didn't, send it directly — I'd love to hear from you.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="contact-form glass"
                  style={{ padding: "30px 28px", border: "1px solid var(--border)" }}
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className={`field ${errors.name ? "has-error" : ""}`}>
                    <label htmlFor="cf-name">Name</label>
                    <input
                      id="cf-name"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={set("name")}
                      autoComplete="name"
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>

                  <div className={`field ${errors.email ? "has-error" : ""}`}>
                    <label htmlFor="cf-email">Email</label>
                    <input
                      id="cf-email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set("email")}
                      autoComplete="email"
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>

                  <div className={`field ${errors.message ? "has-error" : ""}`}>
                    <label htmlFor="cf-message">Message</label>
                    <textarea
                      id="cf-message"
                      placeholder="Tell me about your idea…"
                      value={form.message}
                      onChange={set("message")}
                    />
                    {errors.message && <span className="field-error">{errors.message}</span>}
                  </div>

                  <MagneticButton
                    className="btn btn-primary"
                    strength={0.2}
                    onClick={submit}
                  >
                    Send Message →
                  </MagneticButton>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
