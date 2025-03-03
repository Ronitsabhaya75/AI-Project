import axios from "axios";

export const analyzeCode = async (code, question) => {
  try {
    console.log("🔹 Sending code to AI:", { code, question });

    const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText";
    const API_KEY = process.env.GEMINI_API_KEY; 

    if (!API_KEY) {
      throw new Error("❌ Missing Gemini API Key");
    }

    const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
      contents: [
        { parts: [{ text: `Analyze this code: ${code}\nQuestion: ${question}` }] }
      ]
    });

    console.log("✅ AI Response:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("❌ AI Analysis Failed:", error.response ? error.response.data : error.message);
    return null;
  }
};
