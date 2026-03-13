# Resume Builder Tool

A modern, full-stack, AI-powered web application for creating, editing, and downloading beautiful, professional resumes.

## Features Implemented

1. **Resume Creation & Editing**:
   - Create multiple resumes per account
   - Split-pane live editor with distinct sections (Personal, Summary, Experience, Education, Skills)
   - Real-time preview mapping directly to the chosen template
   - Save and later edit through the user dashboard

2. **Templates & Preview**:
   - **Classic**: A clean, traditional serif layout (Free)
   - **Modern**: A striking two-column design with sidebar (Free)
   - **Executive**: An elegant, premium design (Paid - simulated via "Upgrade" flow)
   - Change templates instantly on the edit screen

3. **PDF Generation**:
   - Fully client-side generation using `html2pdf.js`
   - High-fidelity preservation of styles (CSS print styles included)

4. **AI Assistance (Google Gemini Integration)**:
   - "Generate Summary": Craft professional intros based on entered profile data
   - "Improve Description": Revise and refine work bullets
   - "Suggest Skills": Recommend relevant skills based on role/industry
   - Built-in graceful degradation: If no API key is provided, system falls back to generic sensible defaults silently

5. **Premium Upgrade Simulation**:
   - Simulated payment flow via an upgrade modal
   - Persists `is_upgraded` flag onto the user database record

6. **Authentication & Persistence**:
   - Password-less email-based auth mapping to unique users
   - Supabase PostgreSQL persistence (table schema handles JSONB arrays natively for distinct sections)

## Tech Stack

- **Framework**: Next.js 14 App Router
- **Database**: Supabase PostgreSQL (via `@supabase/supabase-js`)
- **Styling**: Vanilla CSS Variables (Dark theme, glassmorphism)
- **PDF Generation**: `html2pdf.js`
- **AI/LLM**: Google Gemini (`generativelanguage.googleapis.com`)

## Setup Instructions

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` containing:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key  # Optional if using fallback
   ```

3. **Database Schema**:
   Run the SQL provided in the `implementation_plan.md` in your Supabase SQL Editor.

4. **Run Locally**:
   ```bash
   npm run dev
   ```

## Design Aesthetics (WOW Factor)
- Cohesive dark mode base with targeted `.glass` and gradient touches.
- Heavy use of transitions and micro-animations for responsiveness.
- Smooth form UX with split-view layout reflecting a contemporary SaaS builder style.

## Assumptions
- "Paid template doesn't require real payment" → Handled comprehensively via a mock Upgrade flow pushing an update request rather than Stripe.
- Open-ended AI approach → Used direct REST call to Gemini 2.0 Flash for speed. Implemented "mock string" fallback if the user fails to provide an API key, preventing empty data states.
- Local Storage vs DB → Kept user session bare-minimum mapping to LocalStorage while DB correctly persists heavy payload objects.
