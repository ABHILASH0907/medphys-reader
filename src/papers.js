export const CURATED_PAPERS = [
  {
    id: "c1",
    level: "Beginner",
    week: 1,
    topic: "Radiation Fundamentals",
    title: "Basic Radiation Physics: Types, Interactions & Clinical Relevance",
    summary: "A foundational overview of ionizing radiation types (alpha, beta, gamma, X-ray) and how they interact with matter — the bedrock of all medical physics.",
    keyPoints: [
      "Types of ionizing radiation and their properties",
      "Four main interaction mechanisms with matter (photoelectric, Compton, pair production, Rayleigh)",
      "Linear energy transfer (LET) and its clinical significance",
      "How dose deposition relates to radiation type"
    ],
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/16175659/",
    readTime: "35 min",
    citation: "Khan FM. The Physics of Radiation Therapy. 5th ed. Lippincott Williams & Wilkins; 2014.",
    curated: true
  },
  {
    id: "c2",
    level: "Beginner",
    week: 1,
    topic: "Dosimetry Basics",
    title: "AAPM TG-51: Clinical Reference Dosimetry Protocol",
    summary: "The landmark AAPM Task Group 51 report establishing the standard protocol for absorbed dose calibration of photon and electron beams in clinical radiotherapy settings.",
    keyPoints: [
      "Absorbed dose to water as the fundamental quantity",
      "Ion chamber calibration methodology and traceability",
      "Beam quality correction factors (kQ)",
      "Step-by-step clinical implementation"
    ],
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/10501062/",
    readTime: "40 min",
    citation: "Almond PR et al. AAPM TG-51 protocol. Med Phys. 1999;26(9):1847-1870.",
    curated: true
  },
  {
    id: "c3",
    level: "Beginner",
    week: 2,
    topic: "Imaging Physics",
    title: "X-ray Production and Image Formation in Diagnostic Radiology",
    summary: "Covers the physics of X-ray generation, attenuation, and image formation including contrast, noise, and spatial resolution fundamentals.",
    keyPoints: [
      "Bremsstrahlung and characteristic X-ray production",
      "Attenuation coefficients and Beer-Lambert law",
      "Image quality: contrast, noise, spatial resolution",
      "Detective quantum efficiency (DQE)"
    ],
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/12776483/",
    readTime: "30 min",
    citation: "Bushberg JT et al. The Essential Physics of Medical Imaging. 3rd ed. 2011.",
    curated: true
  },
  {
    id: "c4",
    level: "Intermediate",
    week: 3,
    topic: "Radiation Therapy QA",
    title: "AAPM TG-142: Quality Assurance of Medical Linear Accelerators",
    summary: "Comprehensive QA recommendations for linear accelerators covering mechanical, dosimetric, and safety checks across daily, monthly, and annual testing frequencies.",
    keyPoints: [
      "Mechanical isocenter and gantry checks",
      "Dosimetric output constancy tolerances",
      "Multileaf collimator (MLC) QA methods",
      "Image guidance system verification procedures"
    ],
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/19928910/",
    readTime: "45 min",
    citation: "Klein EE et al. AAPM TG-142. Med Phys. 2009;36(9):4197-4212.",
    curated: true
  },
  {
    id: "c5",
    level: "Intermediate",
    week: 3,
    topic: "Radiation Biology",
    title: "The Linear-Quadratic Model in Radiobiology and Clinical Fractionation",
    summary: "The LQ model underpins modern fractionated radiotherapy. This paper reviews its biological basis, clinical applications, and limitations in practice.",
    keyPoints: [
      "Alpha/beta ratio and tissue response classification",
      "DNA double-strand break repair mechanisms",
      "BED (Biologically Effective Dose) calculations",
      "Hypofractionation and SBRT biological rationale"
    ],
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/11180942/",
    readTime: "35 min",
    citation: "Fowler JF. The linear-quadratic formula and progress in fractionated radiotherapy. Br J Radiol. 1989.",
    curated: true
  },
  {
    id: "c6",
    level: "Intermediate",
    week: 4,
    topic: "CT Physics",
    title: "Computed Tomography: Principles, Design, Artifacts, and Recent Advances",
    summary: "A thorough review of CT scanner design, reconstruction algorithms, image artifacts, and dose optimization strategies in modern computed tomography.",
    keyPoints: [
      "Filtered back projection vs iterative reconstruction",
      "CT dose descriptors: CTDI and DLP",
      "Common artifacts and their physical origins",
      "Spectral CT and dual-energy applications"
    ],
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/15671254/",
    readTime: "40 min",
    citation: "Goldman LW. Principles of CT. J Nucl Med Technol. 2007;35(3):115-128.",
    curated: true
  },
  {
    id: "c7",
    level: "Advanced",
    week: 5,
    topic: "Treatment Planning",
    title: "IMRT: Intensity-Modulated Radiation Therapy — Current Status and Issues",
    summary: "AAPM review of IMRT physics, inverse optimization algorithms, plan verification methodologies, and clinical implementation challenges.",
    keyPoints: [
      "Inverse planning and multi-objective optimization",
      "Fluence modulation via MLC sequencing",
      "IMRT-specific QA: patient-specific verification",
      "Dose-volume histogram (DVH) analysis principles"
    ],
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/12875969/",
    readTime: "45 min",
    citation: "IMRT Collaborative Working Group. IJROBP. 2001.",
    curated: true
  },
  {
    id: "c8",
    level: "Advanced",
    week: 6,
    topic: "Emerging Technology",
    title: "Artificial Intelligence in Radiation Oncology Physics",
    summary: "State-of-the-art review of machine learning applications in auto-segmentation, treatment planning, QA automation, and outcome prediction in radiation oncology.",
    keyPoints: [
      "Deep learning for OAR auto-segmentation accuracy",
      "Knowledge-based and deep learning treatment planning",
      "Machine learning for LINAC QA fault prediction",
      "Clinical validation pipelines and regulatory pathway"
    ],
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/31170709/",
    readTime: "40 min",
    citation: "Haury S et al. AI in radiation oncology physics. Phys Med. 2019.",
    curated: true
  }
];
