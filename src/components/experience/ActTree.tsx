import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export type TreeNode = {
  id: string;
  label: string;
  detail?: string;
  note?: string;
  accent?: string;
  meta?: string;
  tags?: string[];
  href?: string;
  links?: { label: string; href: string; kind?: "primary" | "ghost" }[];
  children?: TreeNode[];
};

type ActTreeProps = {
  title: string;
  detail?: string;
  count?: string;
  nodes: TreeNode[];
};

function TreeNodeList({ nodes, root }: { nodes: TreeNode[]; root: boolean }) {
  return (
    <ul className={`tree-children ${root ? "tree-children--root" : ""}`}>
      {nodes.map((n) => {
        const isBranch = !!n.children?.length;
        const rowInner = (
          <>
            <span className="tree-row-head">
              <span
                className="tree-node-mark"
                aria-hidden="true"
                style={
                  n.accent
                    ? { background: n.accent, boxShadow: `0 0 8px ${n.accent}aa` }
                    : undefined
                }
              />
              {n.meta ? <span className="tree-node-meta">{n.meta}</span> : null}
              <span className="tree-node-label">{n.label}</span>
            </span>
            {n.detail ? <span className="tree-node-detail">{n.detail}</span> : null}
            {n.note ? <span className="tree-node-note">{n.note}</span> : null}
            {n.tags?.length ? (
              <span className="tree-node-tags">
                {n.tags.map((t) => (
                  <b key={t}>{t}</b>
                ))}
              </span>
            ) : null}
            {n.links?.length ? (
              <span className="tree-row-links">
                {n.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor={l.kind === "primary" ? "OPEN" : "VIEW"}
                    className={l.kind === "primary" ? "btn btn-primary" : "btn btn-ghost"}
                  >
                    {l.label}
                  </a>
                ))}
              </span>
            ) : null}
          </>
        );
        const clickable = n.href && !n.links?.length;
        return (
          <li
            key={n.id}
            className={`tree-node ${isBranch ? "tree-node--branch" : "tree-node--leaf"}`}
          >
            {clickable ? (
              <a
                className="tree-row"
                href={n.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="VIEW"
              >
                {rowInner}
              </a>
            ) : (
              <div className="tree-row">{rowInner}</div>
            )}
            {n.children?.length ? <TreeNodeList nodes={n.children} root={false} /> : null}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * A fully-expanded nested listing rendered as a tree: a root heading, a spine
 * down the left rail, and branch/leaf rows hanging off it. Every node is always
 * on the page (nothing is collapsed behind a click).
 *
 * In animated mode the rows reveal in tree order, tied to how far the tree has
 * scrolled through the viewport (scrubbed, both ways), and the spine grows top
 * to bottom. With reduced motion the tree is simply rendered static.
 */
export function ActTree({ title, detail, count, nodes }: ActTreeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const targets = gsap.utils.toArray<HTMLElement>(".tree-row, .tree-root", el);
    if (!targets.length) return;
    let cancelled = false;
    // Initial state: hidden and translated down so they animate in from the bottom
    gsap.set(targets, { autoAlpha: 0, y: 32 });

    const ctx = gsap.context(() => {
      const spine = el.querySelector<HTMLElement>(".tree-spine");
      if (spine) {
        gsap.fromTo(
          spine,
          { scaleY: 0, transformOrigin: "top top" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "bottom 35%",
              scrub: 0.3,
            },
          }
        );
      }

      ScrollTrigger.batch(targets, {
        start: "top 92%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.05,
            ease: "power2.out",
            overwrite: "auto",
            clearProps: "transform",
          });
        },
      });
    }, el);
    document.fonts?.ready?.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [reduced]);

  return (
    <div className="act-tree" ref={ref}>
      <div className="tree-root">
        <span className="tree-root-mark" aria-hidden="true" />
        <h2 className="tree-root-title">{title}</h2>
        {count ? <span className="tree-root-count">{count}</span> : null}
        {detail ? <p className="tree-root-detail">{detail}</p> : null}
      </div>
      <span className="tree-spine" aria-hidden="true" />
      <TreeNodeList nodes={nodes} root />
    </div>
  );
}
export default ActTree;