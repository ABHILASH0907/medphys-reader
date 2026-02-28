import { useState } from "react";
import { extractPaperMetadata, fetchPubmedAbstract } from "../api.js";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function AddPaper({ onAdd, onBack }) {
  const [mode, setMode] = useState(null); // "pdf" | "pubmed" | "text"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [extracted, setExtracted] = useState(null); // after AI extraction
  const [editing, setEditing] = useState(null); // editable form state
  const [pubmedUrl, setPubmedUrl] = useState("");
  const [rawText, setRawText] = useState("");

  const handlePdf = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const mammoth = await import("mammoth");
      // For PDF, we read as ArrayBuffer and try to extract text
      const ab = await file.arrayBuffer();

      let text = "";
      // Try mammoth for docx, otherwise handle as PDF text extraction via FileReader
      if (file.name.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ arrayBuffer: ab });
        text = result.value;
      } else {
        // PDF: For now, show error message since we need text content
        // In a real app, we'd use PDF.js or similar library
        setError("PDF extraction requires manual copy-paste. Please use Text mode instead.");
        setLoading(false);
        return;
      }

      const meta = await extractPaperMetadata(text);
      setExtracted({ ...meta, fullText: text.slice(0, 2000) });
      setEditing({ ...meta, fullText: text.slice(0, 2000), pubmedUrl: "", readTime: "35 min" });
    } catch (e) {
      setError("Could not extract paper. Make sure it's a DOCX file. Error: " + e.message);
    }
    setLoading(false);
  };

  const handlePubmed = async () => {
    if (!pubmedUrl.trim()) return;
    setLoading(true);
    setError("");
    try {
      const abstract = await fetchPubmedAbstract(pubmedUrl.trim());
      const meta = await extractPaperMetadata(abstract);
      setExtracted({ ...meta, fullText: abstract.slice(0, 2000) });
      setEditing({ ...meta, fullText: abstract.slice(0, 2000), pubmedUrl: pubmedUrl.trim(), readTime: "35 min" });
    } catch (e) {
      setError("Could not fetch paper. Check the PubMed URL. Error: " + e.message);
    }
    setLoading(false);
  };

  const handleRawText = async () => {
    if (rawText.trim().length < 100) {
      setError("Please paste at least 100 characters of paper text.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const meta = await extractPaperMetadata(rawText);
      setExtracted({ ...meta, fullText: rawText.slice(0, 2000) });
      setEditing({ ...meta, fullText: rawText.slice(0, 2000), pubmedUrl: "", readTime: "35 min" });
    } catch (e) {
      setError("Could not extract metadata. Try again. Error: " + e.message);
    }
    setLoading(false);
  };

  const handleSave = () => {
    if (!editing.title || !editing.summary) {
      setError("Please fill in at least the title and summary.");
      return;
    }
    onAdd(editing);
  };

  const updateField = (field, val) =>
    setEditing((prev) => ({ ...prev, [field]: val }));

  const updateKeyPoint = (i, val) =>
    setEditing((prev) => {
      const kp = [...prev.keyPoints];
      kp[i] = val;
      return { ...prev, keyPoints: kp };
    });

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,8,8,0.94)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #1a1a1a", padding: "0 32px", height: "60px",
        display: "flex", alignItems: "center", gap: "20px"
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", color: "#555",
          cursor: "pointer", fontSize: "15px", fontFamily: "'Crimson Pro', serif"
        }}>← Library</button>
        <span style={{ fontSize: "16px", color: "#ede9e3" }}>Add a Paper</span>
      </header>

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px" }}>

        {!editing && (
          <>
            <h1 style={{ fontSize: "32px", fontWeight: 300, color: "#ede9e3", marginBottom: "8px" }}>Add Your Own Paper</h1>
            <p style={{ fontSize: "15px", color: "#666", marginBottom: "40px", lineHeight: "1.7" }}>
              The AI will read your paper, extract the key concepts, and then compare them against your written summary — just like the curated papers.
            </p>

            {!mode && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                {[
                  { id: "pdf", icon: "📄", label: "Upload PDF", desc: "or .docx file" },
                  { id: "pubmed", icon: "🔗", label: "PubMed Link", desc: "Paste a PubMed URL" },
                  { id: "text", icon: "📋", label: "Paste Text", desc: "Abstract or full text" },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    style={{
                      background: "#111", border: "1px solid #1e1e1e",
                      borderRadius: "14px", padding: "28px 20px",
                      cursor: "pointer", textAlign: "center", transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "#b8860b55"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1e1e1e"}
                  >
                    <div style={{ fontSize: "32px", marginBottom: "12px" }}>{m.icon}</div>
                    <div style={{ fontSize: "16px", color: "#ede9e3", marginBottom: "4px" }}>{m.label}</div>
                    <div style={{ fontSize: "13px", color: "#555" }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {/* PDF Mode */}
            {mode === "pdf" && (
              <div>
                <button onClick={() => setMode(null)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", marginBottom: "20px", fontFamily: "'Crimson Pro', serif" }}>← Choose different method</button>
                <div style={{
                  border: "2px dashed #2a2a2a", borderRadius: "14px", padding: "48px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>📄</div>
                  <div style={{ fontSize: "16px", color: "#888", marginBottom: "16px" }}>Drop your PDF or DOCX here</div>
                  <label style={{
                    display: "inline-block", background: "linear-gradient(135deg, #b8860b, #daa520)",
                    borderRadius: "8px", padding: "12px 24px", color: "#080808",
                    fontSize: "15px", fontWeight: 600, cursor: "pointer"
                  }}>
                    Choose File
                    <input type="file" accept=".pdf,.docx" onChange={handlePdf} style={{ display: "none" }} />
                  </label>
                  <div style={{ fontSize: "12px", color: "#444", marginTop: "12px" }}>PDF or DOCX · Max ~10MB</div>
                </div>
              </div>
            )}

            {/* PubMed Mode */}
            {mode === "pubmed" && (
              <div>
                <button onClick={() => setMode(null)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", marginBottom: "20px", fontFamily: "'Crimson Pro', serif" }}>← Choose different method</button>
                <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "8px" }}>PubMed URL</label>
                <input
                  value={pubmedUrl}
                  onChange={(e) => setPubmedUrl(e.target.value)}
                  placeholder="https://pubmed.ncbi.nlm.nih.gov/12345678/"
                  style={{
                    width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a",
                    borderRadius: "10px", padding: "14px 16px", color: "#ede9e3",
                    fontSize: "14px", fontFamily: "monospace", outline: "none", marginBottom: "16px"
                  }}
                />
                <button
                  onClick={handlePubmed}
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #b8860b, #daa520)",
                    border: "none", borderRadius: "10px", padding: "14px 28px",
                    color: "#080808", fontSize: "15px", fontWeight: 600, cursor: "pointer"
                  }}
                >{loading ? "Fetching..." : "Fetch & Extract →"}</button>
              </div>
            )}

            {/* Raw Text Mode */}
            {mode === "text" && (
              <div>
                <button onClick={() => setMode(null)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", marginBottom: "20px", fontFamily: "'Crimson Pro', serif" }}>← Choose different method</button>
                <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "8px" }}>Paste abstract or paper text</label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste the abstract or any portion of the paper here..."
                  style={{
                    width: "100%", minHeight: "200px", background: "#0d0d0d",
                    border: "1px solid #2a2a2a", borderRadius: "10px",
                    padding: "16px", color: "#ede9e3", fontSize: "15px",
                    fontFamily: "'Crimson Pro', serif", lineHeight: "1.7",
                    outline: "none", resize: "vertical", marginBottom: "16px"
                  }}
                />
                <button
                  onClick={handleRawText}
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #b8860b, #daa520)",
                    border: "none", borderRadius: "10px", padding: "14px 28px",
                    color: "#080808", fontSize: "15px", fontWeight: 600, cursor: "pointer"
                  }}
                >{loading ? "Extracting..." : "Extract Metadata →"}</button>
              </div>
            )}

            {loading && (
              <div style={{ marginTop: "20px", fontSize: "15px", color: "#daa520" }}>
                ⚛ AI is reading the paper and extracting key concepts...
              </div>
            )}

            {error && (
              <div style={{ marginTop: "16px", padding: "14px", background: "#2d0f0f", border: "1px solid #7f1d1d", borderRadius: "10px", fontSize: "14px", color: "#f87171" }}>
                {error}
              </div>
            )}
          </>
        )}

        {/* Edit extracted metadata */}
        {editing && (
          <div>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "12px", color: "#4ade80", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
                ✓ Paper extracted successfully — review and edit before saving
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 300, color: "#ede9e3" }}>Review Paper Details</h2>
            </div>

            <Field label="Title">
              <input value={editing.title || ""} onChange={(e) => updateField("title", e.target.value)}
                style={inputStyle} />
            </Field>

            <Field label="Topic">
              <input value={editing.topic || ""} onChange={(e) => updateField("topic", e.target.value)}
                style={inputStyle} />
            </Field>

            <Field label="Level">
              <div style={{ display: "flex", gap: "8px" }}>
                {LEVELS.map((l) => (
                  <button key={l} onClick={() => updateField("level", l)}
                    style={{
                      background: editing.level === l ? "#1a2d14" : "#111",
                      border: `1px solid ${editing.level === l ? "#166534" : "#2a2a2a"}`,
                      borderRadius: "8px", padding: "8px 16px",
                      color: editing.level === l ? "#4ade80" : "#666",
                      fontSize: "14px", cursor: "pointer", fontFamily: "'Crimson Pro', serif"
                    }}>{l}</button>
                ))}
              </div>
            </Field>

            <Field label="Summary (2-3 sentences)">
              <textarea value={editing.summary || ""} onChange={(e) => updateField("summary", e.target.value)}
                style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} />
            </Field>

            <Field label="Key Concepts (editable)">
              {(editing.keyPoints || []).map((kp, i) => (
                <input key={i} value={kp} onChange={(e) => updateKeyPoint(i, e.target.value)}
                  style={{ ...inputStyle, marginBottom: "8px" }} />
              ))}
            </Field>

            <Field label="Citation">
              <input value={editing.citation || ""} onChange={(e) => updateField("citation", e.target.value)}
                style={inputStyle} />
            </Field>

            <Field label="PubMed URL (optional)">
              <input value={editing.pubmedUrl || ""} onChange={(e) => updateField("pubmedUrl", e.target.value)}
                placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
                style={inputStyle} />
            </Field>

            <Field label="Estimated Read Time">
              <input value={editing.readTime || "35 min"} onChange={(e) => updateField("readTime", e.target.value)}
                style={{ ...inputStyle, width: "120px" }} />
            </Field>

            {error && (
              <div style={{ marginBottom: "16px", padding: "12px 16px", background: "#2d0f0f", border: "1px solid #7f1d1d", borderRadius: "8px", fontSize: "14px", color: "#f87171" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button onClick={() => { setEditing(null); setExtracted(null); setMode(null); }}
                style={{
                  flex: 1, background: "#1a1a1a", border: "1px solid #2a2a2a",
                  borderRadius: "10px", padding: "14px", color: "#888",
                  fontSize: "15px", cursor: "pointer", fontFamily: "'Crimson Pro', serif"
                }}>Start Over</button>
              <button onClick={handleSave}
                style={{
                  flex: 2, background: "linear-gradient(135deg, #b8860b, #daa520)",
                  border: "none", borderRadius: "10px", padding: "14px",
                  color: "#080808", fontSize: "15px", fontWeight: 600,
                  cursor: "pointer", fontFamily: "'Crimson Pro', serif"
                }}>Save to My Library →</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a",
  borderRadius: "8px", padding: "12px 14px", color: "#ede9e3",
  fontSize: "15px", fontFamily: "'Crimson Pro', Georgia, serif",
  outline: "none", lineHeight: "1.6"
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ fontSize: "12px", color: "#666", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", display: "block", marginBottom: "8px" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
