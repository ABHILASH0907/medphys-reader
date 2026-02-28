import { useState } from "react";
import { analyzeSummary } from "../api.js";

export default function Reader({ paper, isCompleted, onComplete, onBack, apiKey }) {
  const [checked, setChecked] = useState({});
  const [summary, setSummary] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("checklist"); // checklist | write | feedback

  const allChecked = paper.keyPoints.every((_, i) => checked[i]);
  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;

  const handleAnalyze = async () => {
    if (wordCount < 30) {
      setError("Please write at least 30 words in your summary.");
      return;
    }
    setError("");
    setLoading(true);

    // Temporarily inject API key
    const originalKey = window.__MEDPHYS_API_KEY__;
    window.__MEDPHYS_API_KEY__ = apiKey;

    // Override fetch for this call to inject auth header
    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
      if (url.includes("anthropic.com")) {
        options.headers = {
          ...options.headers,
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        };
      }
      return originalFetch(url, options);
    };

    try {
      const result = await analyzeSummary(paper, summary);
      setFeedback(result);
      setTab("feedback");
      onComplete(paper.id);
    } catch (e) {
      setError("Analysis failed. Check your API key in Settings or try again.");
    }

    window.fetch = originalFetch;
    setLoading(false);
  };

  const ScoreRing = ({ score, label, color }) => {
    const pct = (score / 10) * 100;
    const r = 28;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
      <div style={{ textAlign: "center" }}>
        <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="36" cy="36" r={r} fill="none" stroke="#1a1a1a" strokeWidth="5" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.8s ease" }} />
        </svg>
        <div style={{ marginTop: "-56px", marginBottom: "8px", fontSize: "22px", fontWeight: 600, color, fontFamily: "'DM Mono', monospace" }}>
          {score}
        </div>
        <div style={{ marginTop: "36px", fontSize: "11px", color: "#666", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace" }}>{label}</div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'Crimson Pro', Georgia, serif" }}>
      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,8,8,0.94)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #1a1a1a", padding: "0 32px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", color: "#555",
            cursor: "pointer", fontSize: "15px", fontFamily: "'Crimson Pro', serif",
            display: "flex", alignItems: "center", gap: "6px"
          }}
        >← Library</button>

        <div style={{ display: "flex", gap: "4px" }}>
          {["checklist", "write", "feedback"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? "#1a1a1a" : "none",
                border: `1px solid ${tab === t ? "#2a2a2a" : "transparent"}`,
                borderRadius: "8px", padding: "6px 16px",
                color: tab === t ? "#ede9e3" : "#555",
                fontSize: "13px", cursor: "pointer", fontFamily: "'Crimson Pro', serif",
                textTransform: "capitalize"
              }}
            >
              {t === "checklist" ? "① Checklist" : t === "write" ? "② Write" : "③ Feedback"}
            </button>
          ))}
        </div>

        {isCompleted && (
          <span style={{ fontSize: "13px", color: "#4ade80", fontFamily: "'DM Mono', monospace" }}>✓ Completed</span>
        )}
      </header>

      <main style={{ maxWidth: "780px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Paper info */}
        <div style={{
          background: "#111", border: "1px solid #1e1e1e", borderRadius: "16px",
          padding: "28px 32px", marginBottom: "28px"
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px", alignItems: "center" }}>
            <span style={{
              fontSize: "11px", padding: "3px 12px", borderRadius: "20px",
              background: "#0d2d1a", color: "#4ade80", border: "1px solid #166534",
              fontFamily: "'DM Mono', monospace"
            }}>{paper.level}</span>
            <span style={{ fontSize: "12px", color: "#555", fontFamily: "'DM Mono', monospace" }}>{paper.topic} · ⏱ {paper.readTime}</span>
          </div>

          <h1 style={{ fontSize: "24px", fontWeight: 400, color: "#ede9e3", lineHeight: "1.3", marginBottom: "14px" }}>
            {paper.title}
          </h1>
          <p style={{ fontSize: "15px", color: "#888", lineHeight: "1.8", marginBottom: "18px" }}>
            {paper.summary}
          </p>
          <div style={{ fontSize: "13px", color: "#444", fontStyle: "italic", marginBottom: "18px" }}>
            {paper.citation}
          </div>

          {paper.pubmedUrl && (
            <a
              href={paper.pubmedUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "#0a1628", border: "1px solid #1e3a5f",
                borderRadius: "8px", padding: "10px 18px",
                color: "#60a5fa", textDecoration: "none", fontSize: "14px"
              }}
            >🔗 Open Paper on PubMed →</a>
          )}
          {paper.fullText && (
            <div style={{
              marginTop: "20px", background: "#0d0d0d", border: "1px solid #1a1a1a",
              borderRadius: "10px", padding: "16px", maxHeight: "200px", overflowY: "auto"
            }}>
              <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "10px" }}>Extracted Paper Text</div>
              <div style={{ fontSize: "13px", color: "#666", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                {paper.fullText.slice(0, 1500)}...
              </div>
            </div>
          )}
        </div>

        {/* CHECKLIST TAB */}
        {tab === "checklist" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#daa520", marginBottom: "6px" }}>
                ① Self-Reflection Checklist
              </h2>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.6" }}>
                Read the paper first. Then tick each concept you genuinely understood. Be honest — this isn't graded.
              </p>
            </div>

            {paper.keyPoints.map((pt, i) => (
              <div
                key={i}
                onClick={() => setChecked((prev) => ({ ...prev, [i]: !prev[i] }))}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "14px",
                  padding: "14px 18px", borderRadius: "10px", cursor: "pointer",
                  background: checked[i] ? "#0d2d1a" : "#111",
                  border: `1px solid ${checked[i] ? "#166534" : "#1e1e1e"}`,
                  marginBottom: "10px", transition: "all 0.2s"
                }}
              >
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, marginTop: "1px",
                  border: `2px solid ${checked[i] ? "#22c55e" : "#333"}`,
                  background: checked[i] ? "#22c55e" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s"
                }}>
                  {checked[i] && <span style={{ color: "#080808", fontSize: "12px", fontWeight: "bold" }}>✓</span>}
                </div>
                <span style={{ fontSize: "15px", color: checked[i] ? "#86efac" : "#888", lineHeight: "1.5" }}>{pt}</span>
              </div>
            ))}

            {allChecked && (
              <div style={{
                marginTop: "20px", padding: "16px 20px",
                background: "#0d2d1a", border: "1px solid #166534",
                borderRadius: "10px", fontSize: "15px", color: "#4ade80"
              }}>
                ✓ All concepts checked — now write your summary in tab ②
              </div>
            )}

            <button
              onClick={() => setTab("write")}
              style={{
                marginTop: "24px", background: "linear-gradient(135deg, #b8860b, #daa520)",
                border: "none", borderRadius: "10px", padding: "14px 32px",
                color: "#080808", fontSize: "15px", fontWeight: 600,
                cursor: "pointer", fontFamily: "'Crimson Pro', serif"
              }}
            >Continue to Write Summary →</button>
          </div>
        )}

        {/* WRITE TAB */}
        {tab === "write" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#daa520", marginBottom: "6px" }}>
                ② Write Your Summary
              </h2>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.6" }}>
                Close the paper. In your own words, explain what it was about, the key findings, and how it connects to medical physics practice. Aim for 3–5 paragraphs. The AI will check both your concepts AND your writing quality.
              </p>
            </div>

            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Start writing without looking at the paper... This is where the real learning happens. Explain it as if you're teaching someone else."
              style={{
                width: "100%", minHeight: "280px",
                background: "#0d0d0d", border: "1px solid #2a2a2a",
                borderRadius: "12px", padding: "20px",
                color: "#ede9e3", fontSize: "16px", lineHeight: "1.9",
                fontFamily: "'Crimson Pro', Georgia, serif",
                resize: "vertical", outline: "none"
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
              <span style={{ fontSize: "13px", color: "#444", fontFamily: "'DM Mono', monospace" }}>
                {wordCount} words · {summary.length} chars
              </span>
              <span style={{ fontSize: "13px", color: wordCount >= 30 ? "#4ade80" : "#555", fontFamily: "'DM Mono', monospace" }}>
                {wordCount >= 30 ? "✓ Ready to submit" : `${30 - wordCount} more words needed`}
              </span>
            </div>

            {error && (
              <div style={{
                marginTop: "12px", padding: "12px 16px", background: "#2d0f0f",
                border: "1px solid #7f1d1d", borderRadius: "8px",
                fontSize: "14px", color: "#f87171"
              }}>{error}</div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || wordCount < 30}
              style={{
                marginTop: "20px", width: "100%",
                background: loading || wordCount < 30
                  ? "#1a1a1a"
                  : "linear-gradient(135deg, #b8860b, #daa520)",
                border: "none", borderRadius: "12px", padding: "16px",
                color: loading || wordCount < 30 ? "#444" : "#080808",
                fontSize: "16px", fontWeight: 600, cursor: loading || wordCount < 30 ? "not-allowed" : "pointer",
                fontFamily: "'Crimson Pro', serif", transition: "all 0.2s"
              }}
            >
              {loading ? "Analyzing your summary..." : "Get AI Feedback on Concepts & Writing →"}
            </button>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {tab === "feedback" && feedback && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 400, color: "#daa520", marginBottom: "6px" }}>
                ③ AI Feedback
              </h2>
              <p style={{ fontSize: "14px", color: "#555" }}>
                Based on the actual paper content, here's how you did.
              </p>
            </div>

            {/* Scores */}
            <div style={{
              background: "#111", border: "1px solid #1e1e1e", borderRadius: "16px",
              padding: "28px", marginBottom: "20px",
              display: "flex", justifyContent: "center", gap: "60px"
            }}>
              <ScoreRing score={feedback.conceptScore} label="Concepts" color="#daa520" />
              <div style={{ width: "1px", background: "#1a1a1a" }} />
              <ScoreRing score={feedback.writingScore} label="Writing" color="#60a5fa" />
            </div>

            {/* Encouragement */}
            {feedback.encouragement && (
              <div style={{
                background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px",
                padding: "18px 22px", marginBottom: "16px", fontSize: "16px",
                color: "#daa520", fontStyle: "italic", lineHeight: "1.7"
              }}>
                "{feedback.encouragement}"
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              {/* Understood well */}
              <div style={{
                background: "#0d2d1a", border: "1px solid #166534",
                borderRadius: "12px", padding: "20px"
              }}>
                <div style={{ fontSize: "11px", color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "12px" }}>
                  ✓ Understood Well
                </div>
                {(feedback.understood || []).map((item, i) => (
                  <div key={i} style={{ fontSize: "14px", color: "#86efac", lineHeight: "1.7", marginBottom: "8px" }}>
                    · {item}
                  </div>
                ))}
              </div>

              {/* Missed */}
              <div style={{
                background: "#2d1a0d", border: "1px solid #92400e",
                borderRadius: "12px", padding: "20px"
              }}>
                <div style={{ fontSize: "11px", color: "#fb923c", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "12px" }}>
                  ⚠ Concepts to Revisit
                </div>
                {(feedback.missedConcepts || []).map((item, i) => (
                  <div key={i} style={{ fontSize: "14px", color: "#fdba74", lineHeight: "1.7", marginBottom: "8px" }}>
                    · {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Writing feedback */}
            <div style={{
              background: "#0a1628", border: "1px solid #1e3a5f",
              borderRadius: "12px", padding: "20px", marginBottom: "16px"
            }}>
              <div style={{ fontSize: "11px", color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "12px" }}>
                ✍ Writing Quality Feedback
              </div>
              {(feedback.writingFeedback || []).map((item, i) => (
                <div key={i} style={{ fontSize: "14px", color: "#93c5fd", lineHeight: "1.7", marginBottom: "8px" }}>
                  · {item}
                </div>
              ))}
            </div>

            {/* Insight */}
            <div style={{
              background: "#1a0d2d", border: "1px solid #6b21a8",
              borderRadius: "12px", padding: "20px", marginBottom: "24px"
            }}>
              <div style={{ fontSize: "11px", color: "#c084fc", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "10px" }}>
                💡 Deeper Insight
              </div>
              <div style={{ fontSize: "15px", color: "#d8b4fe", lineHeight: "1.8" }}>
                {feedback.insight}
              </div>
            </div>

            <button
              onClick={onBack}
              style={{
                width: "100%", background: "linear-gradient(135deg, #b8860b, #daa520)",
                border: "none", borderRadius: "12px", padding: "16px",
                color: "#080808", fontSize: "16px", fontWeight: 600,
                cursor: "pointer", fontFamily: "'Crimson Pro', serif"
              }}
            >✓ Done — Back to Library</button>
          </div>
        )}

        {tab === "feedback" && !feedback && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📝</div>
            <div style={{ fontSize: "16px" }}>Write your summary in tab ② first to get feedback.</div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function ScoreRing({ score, label, color }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = ((score / 10) * circ);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: "72px", height: "72px", margin: "0 auto" }}>
        <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="36" cy="36" r={r} fill="none" stroke="#1a1a1a" strokeWidth="5" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px", fontWeight: 600, color, fontFamily: "'DM Mono', monospace"
        }}>{score}</div>
      </div>
      <div style={{ marginTop: "8px", fontSize: "11px", color: "#666", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace" }}>{label}</div>
    </div>
  );
}
