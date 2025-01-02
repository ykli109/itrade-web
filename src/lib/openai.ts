import OpenAI from "openai";

// const deepSeekKey = "sk-440a770994bb47c59fb63e4763a5ac8f";
export const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});
