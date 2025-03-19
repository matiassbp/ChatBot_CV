import axios from "axios";

export const fetchGeminiResponse = async (prompt) => {
  return await axios.post(
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    },
    {
      headers: { "Content-Type": "application/json" },
      params: { key: process.env.REACT_APP_GEMINI_API_KEY },
    }
  );
};