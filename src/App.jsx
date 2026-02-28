import { useState, useEffect } from "react";
import { CURATED_PAPERS } from "./papers.js";
import { analyzeSummary, extractPaperMetadata, fetchPubmedAbstract } from "./api.js";
import Library from "./components/Library.jsx";
import Reader from "./components/Reader.jsx";
import AddPaper from "./components/AddPaper.jsx";
import ApiKeySetup from "./components/ApiKeySetup.jsx";

const STORAGE_KEY = "medphys_data";

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    completed: {},
    streak: 0,
    lastReadDate: null,
    customPapers: [],
    apiKey: "",
  };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function App() {
  const [data, setData] = useState(loadData);
  const [view, setView] = useState("library"); // library | read | add | setup
  const [activePaper, setActivePaper] = useState(null);
  const [allPapers, setAllPapers] = useState([]);

  useEffect(() => {
    setAllPapers([...CURATED_PAPERS, ...(data.customPapers || [])]);
  }, [data.customPapers]);

  useEffect(() => {
    saveData(data);
  }, [data]);

  // Streak logic
  useEffect(() => {
    const today = new Date().toDateString();
    if (data.lastReadDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (data.lastReadDate === yesterday) {
        // streak continues
      } else if (data.lastReadDate && data.lastReadDate !== today) {
        setData((d) => ({ ...d, streak: 0 }));
      }
    }
  }, []);

  const updateData = (updates) => {
    setData((prev) => {
      const next = { ...prev, ...updates };
      saveData(next);
      return next;
    });
  };

  const openPaper = (paper) => {
    setActivePaper(paper);
    setView("read");
  };

  const markComplete = (paperId) => {
    const today = new Date().toDateString();
    const wasToday = data.lastReadDate === today;
    updateData({
      completed: { ...data.completed, [paperId]: true },
      lastReadDate: today,
      streak: wasToday ? data.streak : data.streak + 1,
    });
  };

  const addCustomPaper = (paper) => {
    const newPaper = {
      ...paper,
      id: `custom_${Date.now()}`,
      curated: false,
      week: Math.ceil((data.customPapers.length + 1) / 2),
      readTime: "35 min",
    };
    updateData({ customPapers: [...(data.customPapers || []), newPaper] });
    setView("library");
  };

  const deleteCustomPaper = (paperId) => {
    updateData({
      customPapers: data.customPapers.filter((p) => p.id !== paperId),
    });
  };

  const saveApiKey = (key) => {
    updateData({ apiKey: key });
    setView("library");
  };

  // Inject API key into fetch calls via a global
  useEffect(() => {
    window.__MEDPHYS_API_KEY__ = data.apiKey;
  }, [data.apiKey]);

  if (!data.apiKey && view !== "setup") {
    return <ApiKeySetup onSave={saveApiKey} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'Crimson Pro', Georgia, serif" }}>
      {view === "library" && (
        <Library
          papers={allPapers}
          completed={data.completed}
          streak={data.streak}
          onOpen={openPaper}
          onAdd={() => setView("add")}
          onDelete={deleteCustomPaper}
          onSettings={() => setView("setup")}
        />
      )}
      {view === "read" && activePaper && (
        <Reader
          paper={activePaper}
          isCompleted={data.completed[activePaper.id]}
          onComplete={markComplete}
          onBack={() => setView("library")}
          apiKey={data.apiKey}
        />
      )}
      {view === "add" && (
        <AddPaper
          onAdd={addCustomPaper}
          onBack={() => setView("library")}
          apiKey={data.apiKey}
        />
      )}
      {view === "setup" && (
        <ApiKeySetup onSave={saveApiKey} existing={data.apiKey} onBack={() => setView("library")} />
      )}
    </div>
  );
}
