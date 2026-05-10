import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.send("AI Resume SaaS API Running");
});

const PORT = process.env.PORT || 5000;
import axios from "axios";

app.get("/test-groq", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
       model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "user",
            content: "Say hello",
          },
        ],
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      response:
        response.data.choices[0].message.content,
    });
  } catch (error) {
    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      error:
        error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});