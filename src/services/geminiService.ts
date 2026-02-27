import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    isValidResume: { 
      type: Type.BOOLEAN, 
      description: "Set to true if the document is a resume or contains professional profile information. Set to false if it's completely irrelevant (e.g., a picture of food, a generic letter, etc.)." 
    },
    isInsufficient: { 
      type: Type.BOOLEAN, 
      description: "Set to true if the resume is a resume but lacks basic information like full name, contact details, or any work/education history. Set to false if it has at least some usable details." 
    },
    fullName: { type: Type.STRING },
    surname: { type: Type.STRING },
    email: { type: Type.STRING },
    phone: { type: Type.STRING },
    location: { type: Type.STRING },
    role: { 
      type: Type.STRING,
      description: "Guess the user's role: 'hr', 'founder', or 'employee' based on their experience."
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          duration: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["company", "role"]
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          year: { type: Type.STRING }
        },
        required: ["institution", "degree"]
      }
    },
    summary: { type: Type.STRING },
    isLocalTelangana: { 
      type: Type.BOOLEAN,
      description: "Determine if the candidate is likely from Telangana, India based on address, education, or experience."
    },
    dateOfBirth: { 
      type: Type.STRING,
      description: "Extract date of birth if available, format as YYYY-MM-DD. Otherwise leave empty."
    },
    gender: { 
      type: Type.STRING,
      description: "Infer gender from name or explicit mention: 'M', 'F', or 'Others'."
    },
    isPhysicallyChallenged: { type: Type.BOOLEAN },
    disabilityType: { type: Type.STRING },
    disabilityPercentage: { type: Type.NUMBER },
    socialStatus: { 
      type: Type.STRING,
      description: "Extract social category if mentioned (e.g., OC, SC, ST, BC-A, etc.)."
    },
    religion: { type: Type.STRING },
    district: { type: Type.STRING },
    residenceType: { 
      type: Type.STRING,
      description: "Infer if address is 'Rural' or 'Urban'."
    },
    mandal: { type: Type.STRING },
    village: { type: Type.STRING },
    houseNo: { type: Type.STRING },
    street: { type: Type.STRING },
    pincode: { type: Type.STRING },
    howDidYouHear: { type: Type.STRING }
  },
  required: ["isValidResume", "isInsufficient"]
};

export async function parseResume(fileBase64: string, mimeType: string): Promise<ResumeData> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set GEMINI_API_KEY in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType
            }
          },
          {
            text: "Analyze this document. First, determine if it is a resume or a professional profile. If it is not, set isValidResume to false. If it is a resume but has very little information (e.g., just a name and nothing else), set isInsufficient to true. Otherwise, extract all relevant information into the JSON structure. Pay special attention to extracting: fullName, surname, email, phone, location, role, skills, experience, education, summary, isLocalTelangana (if address/edu is in Telangana), dateOfBirth, gender (infer if not explicit), isPhysicallyChallenged, disabilityType, socialStatus, district, residenceType (Rural/Urban), mandal, village, houseNo, street, and pincode."
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: resumeSchema as any
    }
  });

  const data = JSON.parse(response.text || "{}") as ResumeData;
  return data;
}
