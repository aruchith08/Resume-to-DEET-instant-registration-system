# DEET - Smart Job Portal

AI-powered resume parsing and professional profile management dashboard.

## Features
- **AI Resume Parsing**: Upload your resume and let Gemini AI fill out your profile automatically.
- **Professional Dashboard**: Manage your experience, education, and skills in a clean, modern interface.
- **Vercel Ready**: Optimized for deployment on Vercel.

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
