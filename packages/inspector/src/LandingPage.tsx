import {
  type ReactNode,
  type ChangeEvent,
  type DragEvent,
} from "react";
import type { ParsedCapsule } from "./capsule.js";
import { ChronosLogo } from "./ChronosLogo.js";
import {
  GithubIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from "./Icons.js";

type LoadResult = { ok: true; capsule: ParsedCapsule; filename: string } | { ok: false; error: string };

export function LandingPage({
  result,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  loadDemo,
  children,
}: {
  result: LoadResult;
  dragOver: boolean;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  loadDemo: () => void;
  children?: ReactNode;
}): JSX.Element {


  return (
    <div
      className={`landing-page ${dragOver ? "dragover" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* 1. Hero Section (Navy Hero #02093a) */}
      <section className="hero-section">
        <div className="hero-glow" />

        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="nav-brand" onClick={loadDemo}>
            <ChronosLogo size={28} />
            <span className="nav-title">Chronos</span>
            <span className="nav-version">v0.0.0</span>
          </div>

          <div className="nav-links">
            <a href="https://github.com/sx4im/chronos" target="_blank" rel="noreferrer" className="nav-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <GithubIcon /> GitHub
            </a>
          </div>

          <div className="nav-actions">
            <button className="btn-primary" onClick={loadDemo}>
              Try Demo Capsule
            </button>
            <label>
              <input type="file" accept=".json,application/json" onChange={onFileChange} hidden />
              <span className="btn-secondary">Load Capsule JSON...</span>
            </label>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="hero-content" id="overview">
          <h1 className="hero-title">
            Find the race condition.<br />Replay it forever.
          </h1>
          <p className="hero-subtitle">
            Chronos virtualizes discrete time, seeded randomness (<code>xoshiro256**</code>), and simulated transport. Sweep thousands of seeds in Vitest and replay bugs bit-identically from a single integer seed.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={loadDemo}>
              Explore Interactive Workspace <ChevronDownIcon />
            </button>
            <label>
              <input type="file" accept=".json,application/json" onChange={onFileChange} hidden />
              <span className="btn-secondary">Drop or Open Capsule</span>
            </label>
          </div>
        </div>

        {/* 2. Floating Product Workspace Card */}
        <div className="workspace-mockup">
          <div className="mockup-header">
            <div className="mockup-controls">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <div className="mockup-title">
              <span>Time-Travel Inspector — {result.ok ? result.filename : "No Capsule Loaded"}</span>
              {result.ok && result.capsule.trace.result === "violation" && (
                <span className="mockup-badge">INVARIANT VIOLATION</span>
              )}
            </div>
            <label>
              <input type="file" accept=".json,application/json" onChange={onFileChange} hidden />
              <span style={{ fontSize: "12px", cursor: "pointer", color: "var(--color-accent-blue)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                Change Capsule <ArrowRightIcon style={{ width: "12px", height: "12px" }} />
              </span>
            </label>
          </div>

          <div className="inspector-body">
            {children}
          </div>
        </div>
      </section>


    </div>
  );
}
