import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBsNXG41mzTMXp74mtiNOH6_mgP0KTf9Y8");

const SYSTEM_PROMPT = `
You are a crisis intelligence AI assistant. Your job is to analyze emergency reports and extract critical information. 
Process the incident report and return ONLY valid JSON (no markdown, no explanation). 
Extract: incident title, category, priority (1-10), required services, estimated people affected, hazards, environmental factors.
Be concise. Be accurate. Return only JSON.
`;

export const processIncident = async (incidentData) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `${SYSTEM_PROMPT}\n\nIncident Report:\nDescription: ${incidentData.description}\nType: ${incidentData.type}\nLocation: ${incidentData.location.address}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini processing error:", error);
    throw error;
  }
};

export const detectDuplicates = async (newIncident, existingIncidents) => {
  if (!existingIncidents || existingIncidents.length === 0) return [];
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const context = existingIncidents.map(inc => `ID: ${inc.id}, Title: ${inc.structuredData?.title || inc.title}, Summary: ${inc.description}`).join("\n");
  
  const prompt = `
    Compare this new incident with the recent ones listed below.
    New Incident: "${newIncident.title} - ${newIncident.description}"
    Recent Incidents:
    ${context}
    
    Is the new incident a duplicate or significantly similar to any of these?
    Return ONLY valid JSON array of objects:
    [ { "incidentId": "id", "similarity": 0-100, "reason": "why" } ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini duplicate detection error:", error);
    return [];
  }
};

export const generateSummary = async (incident) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Generate a 10-word actionable summary for this emergency: ${incident.description}`;
  const result = await model.generateContent(prompt);
  return (await result.response).text();
};
