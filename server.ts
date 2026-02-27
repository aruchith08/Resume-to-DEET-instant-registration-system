import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.NODE_ENV === "production" ? "/tmp/resume_ai.db" : "resume_ai.db";
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS resumes (
    email TEXT PRIMARY KEY,
    fullName TEXT,
    surname TEXT,
    phone TEXT,
    location TEXT,
    role TEXT,
    skills TEXT,
    experience TEXT,
    education TEXT,
    summary TEXT,
    isLocalTelangana INTEGER,
    dateOfBirth TEXT,
    gender TEXT,
    isPhysicallyChallenged INTEGER,
    disabilityType TEXT,
    disabilityPercentage INTEGER,
    socialStatus TEXT,
    religion TEXT,
    district TEXT,
    residenceType TEXT,
    mandal TEXT,
    village TEXT,
    houseNo TEXT,
    street TEXT,
    pincode TEXT,
    howDidYouHear TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get("/api/resume/:email", (req, res) => {
  try {
    const { email } = req.params;
    const row = db.prepare("SELECT * FROM resumes WHERE email = ?").get(email) as any;
    
    if (!row) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Parse JSON fields
    const resume = {
      ...row,
      skills: JSON.parse(row.skills || "[]"),
      experience: JSON.parse(row.experience || "[]"),
      education: JSON.parse(row.education || "[]"),
      isLocalTelangana: Boolean(row.isLocalTelangana),
      isPhysicallyChallenged: Boolean(row.isPhysicallyChallenged),
    };

    res.json(resume);
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/resume", (req, res) => {
  try {
    const data = req.body;
    const {
      email, fullName, surname, phone, location, role, skills,
      experience, education, summary, isLocalTelangana, dateOfBirth,
      gender, isPhysicallyChallenged, disabilityType, disabilityPercentage,
      socialStatus, religion, district, residenceType, mandal, village,
      houseNo, street, pincode, howDidYouHear
    } = data;

    const stmt = db.prepare(`
      INSERT INTO resumes (
        email, fullName, surname, phone, location, role, skills,
        experience, education, summary, isLocalTelangana, dateOfBirth,
        gender, isPhysicallyChallenged, disabilityType, disabilityPercentage,
        socialStatus, religion, district, residenceType, mandal, village,
        houseNo, street, pincode, howDidYouHear, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
      )
      ON CONFLICT(email) DO UPDATE SET
        fullName=excluded.fullName,
        surname=excluded.surname,
        phone=excluded.phone,
        location=excluded.location,
        role=excluded.role,
        skills=excluded.skills,
        experience=excluded.experience,
        education=excluded.education,
        summary=excluded.summary,
        isLocalTelangana=excluded.isLocalTelangana,
        dateOfBirth=excluded.dateOfBirth,
        gender=excluded.gender,
        isPhysicallyChallenged=excluded.isPhysicallyChallenged,
        disabilityType=excluded.disabilityType,
        disabilityPercentage=excluded.disabilityPercentage,
        socialStatus=excluded.socialStatus,
        religion=excluded.religion,
        district=excluded.district,
        residenceType=excluded.residenceType,
        mandal=excluded.mandal,
        village=excluded.village,
        houseNo=excluded.houseNo,
        street=excluded.street,
        pincode=excluded.pincode,
        howDidYouHear=excluded.howDidYouHear,
        updated_at=CURRENT_TIMESTAMP
    `);

    stmt.run(
      email, fullName, surname, phone, location, role, JSON.stringify(skills || []),
      JSON.stringify(experience || []), JSON.stringify(education || []), summary,
      isLocalTelangana ? 1 : 0, dateOfBirth, gender,
      isPhysicallyChallenged ? 1 : 0, disabilityType, disabilityPercentage,
      socialStatus, religion, district, residenceType, mandal, village,
      houseNo, street, pincode, howDidYouHear
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error saving resume:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Only listen if not in a serverless environment (like Vercel)
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
