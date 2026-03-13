# High Level Design (HLD) - CVFlow

## 1. Introduction
CVFlow is a comprehensive resume builder application designed for professional users. It leverages AI for content generation and Cloudinary for media management, built on a robust serverless architecture.

## 2. System Architecture
The application follows a standard **Full-Stack Serverless Architecture** using Next.js.

### Components:
- **Frontend**: Next.js (React) for the UI, split-pane editor, and live preview.
- **Backend (API)**: Next.js Serverless Routes for business logic and database orchestration.
- **Database**: Supabase (PostgreSQL) for persistence of user data and resume objects.
- **Media Storage**: Cloudinary for direct browser-to-cloud profile photo uploads.
- **AI Engine**: Google Gemini API for intelligent content suggestion and refinement.

## 3. Data Flow
1. **Authentication**: User logs in via email; session is managed by Supabase/LocalStorage.
2. **Dashboard**: Fetches resume list from Supabase PostgREST API.
3. **Editor**: 
   - User inputs data into a structured state.
   - AI Assist triggers REST calls to Gemini to populate/refine fields.
   - Photo Upload hits Cloudinary API directly and stores the URL in the resume object.
4. **Export**: The HTML preview is converted to a high-quality PDF using `html2pdf.js` in the client.

## 4. Tech Stack Reasons
- **Next.js**: Hybrid rendering (SSR for SEO/Landing, CSR for Editor).
- **Supabase**: Real-time database capabilities and rapid back-end development.
- **Cloudinary**: Best-in-class image optimization and unsigned upload security.
- **Gemini**: State-of-the-art LLM with highly efficient REST API.
