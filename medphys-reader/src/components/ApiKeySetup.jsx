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
          Welcome to MedPhys Reader
        </h1>
        <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.7", marginBottom: "32px" }}>
          This app uses the Claude AI API to analyze your summaries and give you deep feedback.
          You'll need a free Anthropic API key to get started.
        </p>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontSize: "12px", color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
            Anthropic API Key
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={show ? "text" : "password"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{
                width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a",
                borderRadius: "10px", padding: "14px 50px 14px 16px",
                color: "#ede9e3", fontSize: "14px", fontFamily: "monospace",
                outline: "none"
              }}
            />
            <button
              onClick={() => setShow(!show)}
              style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "16px"
              }}
            >{show ? "🙈" : "👁"}</button>
          </div>
        </div>

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

        <div style={{ display: "flex", gap: "12px" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                flex: 1, background: "#1a1a1a", border: "1px solid #2a2a2a",
                borderRadius: "10px", padding: "14px", color: "#888",
                fontSize: "15px", cursor: "pointer", fontFamily: "'Crimson Pro', serif"
              }}
            >Cancel</button>
          )}
          <button
            onClick={() => key.trim() && onSave(key.trim())}
            disabled={!key.trim()}
            style={{
              flex: 2, background: key.trim()
                ? "linear-gradient(135deg, #b8860b, #daa520)"
                : "#1a1a1a",
              border: "none", borderRadius: "10px", padding: "14px",
              color: key.trim() ? "#080808" : "#444",
              fontSize: "15px", fontWeight: "600", cursor: key.trim() ? "pointer" : "not-allowed",
              fontFamily: "'Crimson Pro', serif", transition: "all 0.2s"
            }}
          >
            Save & Enter →
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "#444", marginTop: "20px", lineHeight: "1.6" }}>
          Your API key is stored only in your browser's local storage and never sent anywhere except directly to Anthropic's API.
        </p>
      </div>
    </div>
  );
}
