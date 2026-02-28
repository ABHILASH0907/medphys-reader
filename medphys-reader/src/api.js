const CLAUDE_API = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

export async function callClaude(prompt, systemPrompt = "") {
  const body = {
    model: MODEL,
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  };
  if (systemPrompt) body.system = systemPrompt;

  const res = await fetch(CLAUDE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data.content.map((b) => b.text || "").join("");
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

  const raw = await callClaude(prompt);
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
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

  const raw = await callClaude(prompt);
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
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
