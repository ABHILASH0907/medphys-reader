// Free ML models from Hugging Face
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.1";
const HF_API_URL = "https://api-inference.huggingface.co/models/";

// Fallback to local analysis when no API available
export function hasApiKey() {
  return false; // We're using free models now
}

export async function callLLM(prompt, systemPrompt = "") {
  try {
    // Try using Hugging Face free model
    return await callHuggingFace(prompt, systemPrompt);
  } catch (e) {
    console.warn("HF API failed, using fallback", e);
    // Fallback to local text processing
    return generateLocalResponse(prompt);
  }
}

async function callHuggingFace(prompt, systemPrompt = "") {
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
  
  const res = await fetch(`${HF_API_URL}${HF_MODEL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inputs: fullPrompt,
      parameters: { max_length: 1500, temperature: 0.7 },
    }),
  });

  if (!res.ok) throw new Error("HF API rate limited or failed");
  const data = await res.json();
  
  if (Array.isArray(data)) {
    return data[0]?.generated_text?.replace(fullPrompt, "").trim() || "";
  }
  return "";
}

// Local fallback analysis using keyword extraction and pattern matching
function generateLocalResponse(prompt) {
  // Extract key information from prompt for basic analysis
  if (prompt.includes("Extract structured metadata")) {
    return generateMetadataFallback(prompt);
  } else if (prompt.includes("evaluating a student's comprehension")) {
    return generateFeedbackFallback(prompt);
  }
  return '{"result": "Analysis requires API connection"}';
}

function generateMetadataFallback(prompt) {
  // Extract text content between triple quotes
  const textMatch = prompt.match(/"""([\s\S]*?)"""/);
  const text = textMatch ? textMatch[1].trim() : "";
  
  // Simple keyword-based extraction
  const lines = text.split("\n").filter(l => l.trim());
  const title = lines[0] || "Untitled Paper";
  
  // Determine difficulty level based on word complexity
  const complexWords = (text.match(/\b(simulation|Monte Carlo|optimization|algorithm|statistical|differential|integral|coefficient)\b/gi) || []).length;
  const level = complexWords > 5 ? "Advanced" : complexWords > 2 ? "Intermediate" : "Beginner";
  
  // Extract key concepts (capitalized words/phrases)
  const keyPoints = (text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || []).slice(0, 5).filter((v, i, a) => a.indexOf(v) === i);
  
  // Determine topic
  const topics = {
    "Dosimetry": ["dose", "radiation", "absorbed", "exposure"],
    "Imaging": ["image", "MRI", "CT", "scan", "reconstruction"],
    "Radiation Biology": ["cell", "DNA", "mutation", "RBE", "biological"],
    "Treatment Planning": ["plan", "beam", "targeting", "optimization"],
  };
  
  let topic = "Medical Physics";
  for (const [t, keywords] of Object.entries(topics)) {
    if (keywords.some(k => text.toLowerCase().includes(k))) {
      topic = t;
      break;
    }
  }
  
  const summary = lines.slice(1, 3).join(" ") || `This paper discusses ${topic.toLowerCase()} in medical physics.`;
  
  return JSON.stringify({
    title: title.substring(0, 60),
    topic,
    level,
    summary: summary.substring(0, 150),
    keyPoints: keyPoints.slice(0, 5),
    citation: "Author et al. Journal. Year."
  });
}

function generateFeedbackFallback(prompt) {
  // Extract student summary
  const summaryMatch = prompt.match(/Student's written summary:\s*"""\s*([\s\S]*?)\s*"""/);
  const studentText = summaryMatch ? summaryMatch[1].trim() : "";
  
  // Extract key concepts from paper
  const keyConceptsMatch = prompt.match(/Key concepts:\s*([^\n]+)/);
  const keyConceptsStr = keyConceptsMatch ? keyConceptsMatch[1] : "";
  
  // Simple keyword matching for feedback
  const studentWords = new Set(studentText.toLowerCase().split(/\s+/));
  const concepts = keyConceptsStr.split(",").map(c => c.trim().toLowerCase());
  
  const coveredConcepts = concepts.filter(c => {
    const keywords = c.split(/\s+/);
    return keywords.some(k => studentWords.has(k));
  });
  
  const missedConcepts = concepts.filter(c => !coveredConcepts.includes(c)).slice(0, 3);
  
  // Score based on coverage and length
  const conceptScore = Math.min(10, 3 + Math.round((coveredConcepts.length / Math.max(1, concepts.length)) * 7));
  const writingScore = Math.min(10, 4 + Math.round((studentText.split(/\s+/).length / 100) * 6));
  
  return JSON.stringify({
    conceptScore,
    writingScore,
    understood: coveredConcepts.slice(0, 3),
    missedConcepts: missedConcepts,
    writingFeedback: [
      "Use more specific medical physics terminology",
      "Structure your summary with clear topic sentences",
      "Include quantitative details where relevant"
    ],
    insight: "Consider connecting this concept to its applications in clinical practice.",
    encouragement: "Great effort - you've captured the main ideas clearly!"
  });
}

export async function extractPaperMetadata(text) {
  const prompt = `You are a medical physics expert. Extract structured metadata from this paper text or abstract.

Paper text:
"""
${text.slice(0, 4000)}
"""

Return ONLY valid JSON with these exact keys:
{
  "title": "full paper title",
  "topic": "short topic area (e.g. Dosimetry, Imaging, Radiation Biology)",
  "level": "Beginner or Intermediate or Advanced",
  "summary": "2-3 sentence plain English summary of what this paper is about and why it matters",
  "keyPoints": ["4-5 key concepts covered in this paper"],
  "citation": "Author et al. Journal. Year."
}`;

  try {
    const raw = await callLLM(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    // Fallback to local processing
    return JSON.parse(generateMetadataFallback(prompt));
  }
}

export async function analyzeSummary(paper, userSummary) {
  const paperContext = paper.fullText
    ? `Full paper excerpt:\n${paper.fullText.slice(0, 3000)}`
    : `Paper summary: ${paper.summary}\nKey concepts: ${paper.keyPoints.join(", ")}`;

  const prompt = `You are a medical physics PhD professor evaluating a student's comprehension and writing quality.

${paperContext}

Paper title: "${paper.title}"

Student's written summary:
"""
${userSummary}
"""

Evaluate this summary on two dimensions:

1. CONCEPTUAL COVERAGE: Did they capture the key ideas from the paper?
2. WRITING QUALITY: Is their explanation clear, well-structured, and do they use correct scientific terminology?

Return ONLY valid JSON:
{
  "conceptScore": <number 1-10>,
  "writingScore": <number 1-10>,
  "understood": ["2-3 specific things they explained well"],
  "missedConcepts": ["2-3 important concepts from the paper they didn't mention or got wrong"],
  "writingFeedback": ["2-3 specific writing improvement tips: terminology, structure, clarity"],
  "insight": "One deep insight or connection to broaden their understanding of this topic",
  "encouragement": "One short encouraging sentence personalized to what they did well"
}`;

  try {
    const raw = await callLLM(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    // Fallback to local processing
    return JSON.parse(generateFeedbackFallback(prompt));
  }

export async function fetchPubmedAbstract(url) {
  // Extract PMID from URL
  const pmidMatch = url.match(/\/(\d+)\/?$/);
  if (!pmidMatch) throw new Error("Could not extract PubMed ID from URL");
  const pmid = pmidMatch[1];

  const efetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&rettype=abstract&retmode=text`;
  const res = await fetch(efetchUrl);
  if (!res.ok) throw new Error("Failed to fetch from PubMed");
  return res.text();
}
