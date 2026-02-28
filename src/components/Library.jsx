const levelColors = {
  Beginner: { bg: "#0d2d1a", text: "#4ade80", border: "#166534" },
  Intermediate: { bg: "#2d1a0d", text: "#fb923c", border: "#92400e" },
  Advanced: { bg: "#1a0d2d", text: "#c084fc", border: "#6b21a8" },
};

export default function Library({ papers, completed, streak, onOpen, onAdd, onDelete, onSettings }) {
  const completedCount = Object.keys(completed).length;
  const totalCount = papers.length;
  const progressPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const curated = papers.filter((p) => p.curated);
  const custom = papers.filter((p) => !p.curated);

  // Find next unread
  const nextUnread = papers.find((p) => !completed[p.id]);

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'Crimson Pro', Georgia, serif" }}>
      {/* Noise texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.3,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`
      }} />

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,8,8,0.94)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #1a1a1a",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: "68px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #b8860b, #daa520)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
          }}>⚛</div>
          <div>
            <div style={{ fontSize: "17px", color: "#ede9e3", letterSpacing: "0.01em" }}>MedPhys Reader</div>
            <div style={{ fontSize: "11px", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Daily Learning System</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "20px" }}>🔥</span>
            <span style={{ color: "#daa520", fontSize: "15px", fontFamily: "'DM Mono', monospace" }}>{streak}</span>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "100px", height: "4px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${progressPct}%`,
                background: "linear-gradient(90deg, #b8860b, #daa520)",
                borderRadius: "2px", transition: "width 0.6s ease"
              }} />
            </div>
            <span style={{ fontSize: "13px", color: "#555", fontFamily: "'DM Mono', monospace" }}>{completedCount}/{totalCount}</span>
          </div>

          <button
            onClick={onAdd}
            style={{
              background: "linear-gradient(135deg, #b8860b, #daa520)",
              border: "none", borderRadius: "8px", padding: "8px 18px",
              color: "#080808", fontSize: "14px", fontWeight: "600",
              cursor: "pointer", fontFamily: "'Crimson Pro', serif"
            }}
          >+ Add Paper</button>

          <button
            onClick={onSettings}
            style={{
              background: "#1a1a1a", border: "1px solid #2a2a2a",
              borderRadius: "8px", padding: "8px 14px",
              color: "#666", fontSize: "14px", cursor: "pointer"
            }}
          >⚙</button>
        </div>
      </header>

      <main style={{ position: "relative", zIndex: 1, maxWidth: "860px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Hero */}
        <div style={{ marginBottom: "48px" }}>
          <p style={{ fontSize: "12px", color: "#b8860b", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "12px" }}>
            Systematic Knowledge Building
          </p>
          <h1 style={{ fontSize: "42px", fontWeight: 300, lineHeight: "1.15", color: "#ede9e3", marginBottom: "16px" }}>
            Your Medical Physics<br />Reading Curriculum
          </h1>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", maxWidth: "500px" }}>
            One paper a day. 30–45 minutes. Write what you understood. Get AI feedback on your concepts and writing clarity. Build real intuition before your PhD.
          </p>
        </div>

        {/* Next up card */}
        {nextUnread && (
          <div
            onClick={() => onOpen(nextUnread)}
            style={{
              background: "linear-gradient(135deg, #111 0%, #161206 100%)",
              border: "1px solid #b8860b44", borderRadius: "16px",
              padding: "28px 32px", marginBottom: "40px",
              cursor: "pointer", transition: "all 0.2s",
              position: "relative", overflow: "hidden"
            }}
          >
            <div style={{
              position: "absolute", top: 0, right: 0, width: "200px", height: "200px",
              background: "radial-gradient(circle, #b8860b11 0%, transparent 70%)",
              borderRadius: "50%", transform: "translate(30%, -30%)"
            }} />
            <div style={{ fontSize: "11px", color: "#b8860b", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "10px" }}>
              📖 Up Next — Today's Paper
            </div>
            <div style={{ fontSize: "20px", color: "#ede9e3", marginBottom: "8px" }}>{nextUnread.title}</div>
            <div style={{ fontSize: "14px", color: "#666" }}>{nextUnread.topic} · {nextUnread.level} · ⏱ {nextUnread.readTime}</div>
            <div style={{
              display: "inline-block", marginTop: "16px",
              fontSize: "14px", color: "#daa520"
            }}>Start Reading →</div>
          </div>
        )}

        {/* Curated papers */}
        <SectionHeader title="Curated Curriculum" subtitle={`${curated.length} papers · Beginner to Advanced`} />
        <PaperList papers={curated} completed={completed} onOpen={onOpen} />

        {/* Custom papers */}
        {custom.length > 0 && (
          <>
            <SectionHeader title="Your Added Papers" subtitle={`${custom.length} paper${custom.length !== 1 ? "s" : ""} added by you`} />
            <PaperList papers={custom} completed={completed} onOpen={onOpen} onDelete={onDelete} />
          </>
        )}
      </main>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: "20px", marginTop: "16px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#ede9e3" }}>{title}</h2>
        <span style={{ fontSize: "13px", color: "#555", fontFamily: "'DM Mono', monospace" }}>{subtitle}</span>
      </div>
      <div style={{ height: "1px", background: "#1a1a1a", marginTop: "12px" }} />
    </div>
  );
}

function PaperList({ papers, completed, onOpen, onDelete }) {
  const levelColors = {
    Beginner: { bg: "#0d2d1a", text: "#4ade80", border: "#166534" },
    Intermediate: { bg: "#2d1a0d", text: "#fb923c", border: "#92400e" },
    Advanced: { bg: "#1a0d2d", text: "#c084fc", border: "#6b21a8" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "40px" }}>
      {papers.map((paper, idx) => {
        const done = completed[paper.id];
        const lc = levelColors[paper.level] || levelColors.Beginner;
        return (
          <div
            key={paper.id}
            style={{
              background: done ? "#0a0a0a" : "#111",
              border: `1px solid ${done ? "#1a1a1a" : "#1e1e1e"}`,
              borderRadius: "12px", padding: "18px 22px",
              cursor: "pointer", transition: "border-color 0.2s, background 0.2s",
              opacity: done ? 0.55 : 1,
              display: "flex", alignItems: "flex-start", gap: "16px"
            }}
            onMouseEnter={(e) => { if (!done) e.currentTarget.style.borderColor = "#333"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = done ? "#1a1a1a" : "#1e1e1e"; }}
            onClick={() => onOpen(paper)}
          >
            {/* Index */}
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: done ? "#1a1a1a" : "#161616",
              border: `1px solid ${done ? "#222" : "#2a2a2a"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: "14px", color: done ? "#4ade80" : "#555",
              fontFamily: "'DM Mono', monospace"
            }}>
              {done ? "✓" : idx + 1}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "6px", alignItems: "center" }}>
                <span style={{
                  fontSize: "11px", padding: "2px 10px", borderRadius: "20px",
                  background: lc.bg, color: lc.text, border: `1px solid ${lc.border}`,
                  fontFamily: "'DM Mono', monospace"
                }}>{paper.level}</span>
                <span style={{ fontSize: "11px", color: "#444", fontFamily: "'DM Mono', monospace" }}>{paper.topic}</span>
                {!paper.curated && <span style={{ fontSize: "11px", color: "#555", fontFamily: "'DM Mono', monospace" }}>· Custom</span>}
              </div>
              <div style={{ fontSize: "16px", color: "#ede9e3", lineHeight: "1.4" }}>{paper.title}</div>
              <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>{paper.citation}</div>
            </div>

            {/* Right */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
              <span style={{ fontSize: "12px", color: "#444", fontFamily: "'DM Mono', monospace" }}>⏱ {paper.readTime}</span>
              {onDelete && !paper.curated && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(paper.id); }}
                  style={{
                    background: "none", border: "none", color: "#444",
                    cursor: "pointer", fontSize: "14px", padding: "2px"
                  }}
                  title="Remove paper"
                >✕</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
