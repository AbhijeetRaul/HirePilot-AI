import { createRequire } from "module";
import { analyzeResume } from "../utils/analyzeResume.js";
import { extractTextFromPDF } from "../utils/extractTextFromPDF.js";

//const require = createRequire(import.meta.url);

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        error: "Only PDF files allowed",
      });
    }

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(req.file.buffer);
    console.log(extractedText);
    
    if (!extractedText) {
      return res.status(400).json({
    error:
      "Could not read this PDF. Please upload a text-based resume PDF.",
  });
}

    // Analyze Resume
    const analysis = await analyzeResume(extractedText);

    res.status(200).json({
      success: true,
      extractedText,
      analysis,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
};
export const matchJobDescription = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error: "Resume text and job description required",
      });
    }

    // MOCK AI MATCHING

    const skills = [
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
    ];

    const missingSkills = [
      "Docker",
      "AWS",
      "TypeScript",
    ];

    const matchScore = 76;

    const suggestions = [
      "Add TypeScript projects",
      "Mention deployment experience",
      "Include cloud technologies",
    ];

    res.status(200).json({
      success: true,
      overallMatch: matchScore,
      skillsAlignment: 82,
      keywordCoverage: 70,
      matchingSkills: skills,
      missingKeywords: missingSkills,
      suggestions,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
};