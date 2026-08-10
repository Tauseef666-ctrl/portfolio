import { motion } from "framer-motion";
import type { ReactNode } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number;
};

export function MagneticButton({
  children,
  className,
  onClick,
  href,
  strength = 0.35,
}: MagneticButtonProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translate(0, 0)";
  };

  const inner = (
    <motion.div
      data-cursor="open"
      className={className}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
    >
      <span className="btn-shine" aria-hidden="true" />
      {children}
    </motion.div>
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block" }}
    >
      {href ? (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{ display: "inline-flex" }}>
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
