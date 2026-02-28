import { useState } from "react";

export default function ApiKeySetup({ onSave, existing = "", onBack }) {
  const [key, setKey] = useState(existing);
  const [show, setShow] = useState(false);

  return (
    <div style={{
      minHeight: "100vh", background: "#080808", display: "flex",
      alignItems: "center", justifyContent: "center", padding: "24px",
      fontFamily: "'Crimson Pro', Georgia, serif"
    }}>
      <div style={{
        maxWidth: "480px", width: "100%",
        background: "#111", border: "1px solid #222", borderRadius: "20px",
        padding: "48px 40px"
      }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "14px",
          background: "linear-gradient(135deg, #b8860b, #daa520)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "26px", marginBottom: "28px"
        }}>⚛</div>

        <h1 style={{ fontSize: "28px", fontWeight: 300, color: "#ede9e3", marginBottom: "8px" }}>
          MedPhys Reader
        </h1>
        <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.7", marginBottom: "32px" }}>
          This app uses free AI models to analyze your summaries and give you feedback.
          <br/><br/>
          <strong style={{color: "#888"}}>API Key (Optional):</strong> Provide your own key to use advanced models for better feedback. Otherwise, we'll use free models.
        </p>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontSize: "12px", color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
            Optional: Claude API Key (for premium analysis)
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={show ? "text" : "password"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-ant-... (optional)"
              style={{
                width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a",
                borderRadius: "10px", padding: "14px 50px 14px 16px",
                color: "#ede9e3", fontSize: "14px", fontFamily: "monospace",
                outline: "none"
              }}
            />
            {key && (
              <button
                onClick={() => setShow(!show)}
                style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "16px"
                }}
              >{show ? "🙈" : "👁"}</button>
            )}
          </div>
        </div>

        {key && (
          <a
            href="https://console.anthropic.com/keys"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block", fontSize: "13px", color: "#b8860b",
              textDecoration: "none", marginBottom: "28px"
            }}
          >
            → Get your free API key from console.anthropic.com
          </a>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                flex: 1, background: "#1a1a1a", border: "1px solid #2a2a2a",
                borderRadius: "10px", padding: "14px", color: "#888",
                fontSize: "15px", cursor: "pointer", fontFamily: "'Crimson Pro', serif"
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={() => onSave(key)}
            style={{
              flex: 1, background: "linear-gradient(135deg, #b8860b, #daa520)", border: "none",
              borderRadius: "10px", padding: "14px", color: "#000",
              fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "'Crimson Pro', serif"
            }}
          >
            {key ? "Save API Key" : "Continue with Free Models"}
          </button>
        </div>
      </div>
    </div>
  );
}
