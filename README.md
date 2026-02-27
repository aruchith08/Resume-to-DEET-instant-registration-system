# Resume To DEET Instant registration system

AI-powered resume parsing and professional profile management dashboard.


<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/adfe9042-3ab3-4318-81a3-c8995275fded" />

## Features
- **AI Resume Parsing**: Upload your resume and let Gemini AI fill out your profile automatically.
- **Professional Dashboard**: Manage your experience, education, and skills in a clean, modern interface.
- **Vercel Ready**: Optimized for deployment on Vercel.

## 🧠 Overview

Resume to DEET eliminates manual data entry by using Google Gemini 3 Flash to extract structured information directly from uploaded resumes (PDF, DOCX, Image). The system auto-fills a professional profile form, allowing users to review and submit instantly.

This project demonstrates AI-driven automation combined with a clean serverless cloud architecture.

---

## 🏗️ Technical Architecture

The system follows a modular full-stack architecture:

### 🔹 Client Layer (Frontend)
- React + Vite (Single Page Application)
- Tailwind CSS for UI
- Motion for animations
- Converts uploaded files → Base64
- Sends structured prompt + schema to Gemini API

### 🔹 AI Service Layer
- Google Gemini 3 Flash
- Performs:
  - OCR (for image/scanned PDFs)
  - NLP extraction
  - Layout understanding
- Returns structured JSON profile data

### 🔹 API Layer (Backend)
- Express.js running as a Vercel Serverless Function
- Routes:
  - `POST /api/resume`
  - `GET /api/resume/:email`
- Handles validation and UPSERT logic

### 🔹 Data Layer
- SQLite (better-sqlite3)
- Stores structured profile information
- JSON-stringified arrays for skills, experience, and education

---

<img width="1175" height="700" alt="image" src="https://github.com/user-attachments/assets/bbd8bb0a-36c3-4a1a-91c9-b55f7f45dcf2" />


## 🔄 System Flow

### 1️⃣ AI Resume Parsing ("Magic Fill")
1. User uploads resume.
2. Frontend converts file to Base64.
3. Resume sent to Gemini 3 Flash with strict JSON schema.
4. Gemini returns structured profile JSON.
5. UI auto-fills form fields.
6. User reviews and confirms.

### 2️⃣ Profile Persistence
1. Frontend sends JSON to `POST /api/resume`.
2. Backend validates and performs UPSERT.
3. SQLite stores profile data.

### 3️⃣ Dashboard Retrieval
1. App requests `GET /api/resume/:email`.
2. Backend fetches from SQLite.
3. Dashboard renders professional profile view.

---

## 🛠️ Local Development

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
## Local Development

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your `GEMINI_API_KEY`.
4. Start the development server:
   ```bash
   npm run dev
   ```

## Vercel Deployment

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. In the Vercel dashboard, go to **Settings > Environment Variables**.
4. Add a new variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API Key.
5. Deploy!

## Database Note
This application uses SQLite (`better-sqlite3`) for data persistence. On Vercel, the database is stored in `/tmp`, which is ephemeral. For a production-grade application, consider migrating to a persistent database service like Vercel Postgres or Supabase.

## Security Note
The API key is handled via environment variables and is injected during the build process. It is never hardcoded in the source code.
