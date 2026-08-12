// server/utils/analyzeResume.test.js
import { jest } from "@jest/globals";

// Mock axios BEFORE importing the module that uses it
jest.unstable_mockModule("axios", () => ({
  default: {
    post: jest.fn(),
  },
}));

// Dynamic imports so the mock is registered first
const axios = (await import("axios")).default;
const { analyzeResume } = await import("./analyzeResume.js");

describe("analyzeResume", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns parsed JSON when Groq responds with valid JSON", async () => {
    axios.post.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: JSON.stringify({
                atsScore: 88,
                skills: ["React", "Node.js"],
                experience: "2 years",
                education: "B.Tech CS",
                strengths: ["Clear formatting"],
                improvements: ["Add metrics"],
                missingSkills: ["Docker"],
              }),
            },
          },
        ],
      },
    });

    const result = await analyzeResume("Sample resume text");

    expect(result.atsScore).toBe(88);
    expect(result.skills).toContain("React");
  });

  test("strips markdown code fences before parsing", async () => {
    axios.post.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content:
                "```json\n" +
                JSON.stringify({
                  atsScore: 70,
                  skills: [],
                  experience: "",
                  education: "",
                  strengths: [],
                  improvements: [],
                  missingSkills: [],
                }) +
                "\n```",
            },
          },
        ],
      },
    });

    const result = await analyzeResume("Another resume");
    expect(result.atsScore).toBe(70);
  });

  test("falls back to default object when JSON parsing fails", async () => {
    axios.post.mockResolvedValue({
      data: { choices: [{ message: { content: "not valid json at all" } }] },
    });

    const result = await analyzeResume("Broken response test");
    expect(result.atsScore).toBe(75);
    expect(result.skills).toEqual([]);
  });

  test("returns error object when Groq API call fails", async () => {
    axios.post.mockRejectedValue(new Error("Network error"));

    const result = await analyzeResume("Resume during outage");
    expect(result.atsScore).toBe(0);
    expect(result.error).toBe("AI analysis failed");
  });
});