import axios from "axios";

export const analyzeResume = async (resumeText) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",

      {
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content:
              "You are a professional ATS resume analyzer. Return ONLY valid JSON.",
          },

          {
            role: "user",
            content: `
Analyze this resume.

Return ONLY valid JSON in this format:

{
  "atsScore": number,
  "skills": [],
  "experience": "",
  "education": "",
  "strengths": [],
  "improvements": [],
  "missingSkills": []
}

Resume:
${resumeText}
`,
          },
        ],

        temperature: 0.4,
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawText =
      response.data.choices[0].message.content;

    console.log("RAW AI RESPONSE:");
    console.log(rawText);

    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (error) {
      console.log("JSON Parse Error:", error);

      return {
        atsScore: 75,
        skills: [],
        experience: "",
        education: "",
        strengths: [],
        improvements: [],
        missingSkills: [],
      };
    }
  } catch (error) {
    console.log(
      "GROQ ERROR:",
      error.response?.data || error.message
    );

    return {
      atsScore: 0,
      skills: [],
      experience: "",
      education: "",
      strengths: [],
      improvements: [],
      missingSkills: [],
      error: "AI analysis failed",
    };
  }
};