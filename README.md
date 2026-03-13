# Resume Builder Tool

A modern, full-stack, AI-powered web application for creating, editing, and downloading beautiful, professional resumes.

## Features Implemented

1. **Resume Creation & Flow**:
   - **Template Selection Modal**: Pick your layout (Classic, Modern, Executive) *before* creation with real-time live previews.
   - Split-pane live editor with distinct sections (Personal, Summary, Experience, Education, Skills)
   - **Template-Specific Profile Photo**: Integrated with Cloudinary for seamless browser-based uploads (Modern template exclusive).
   - **Custom Sections**: Support for user-defined sections with dynamic rendering.
   - Real-time preview mapping directly to the chosen template.
   - Save and later edit through the user dashboard.

2. **Templates & Premium UI**:
   - **Live A4 Previews**: All template selection and browsing screens feature high-fidelity, aspect-locked live previews.
   - **Classic**: A clean, traditional serif layout (Free)
   - **Modern**: A striking two-column design with sidebar (Free)
   - **Executive**: An elegant, premium design (Paid)
   - Change templates instantly on the edit screen.

3. **Premium Landing Page**:
   - **Ambient Effects**: Glowing, animated background orbs for a modern SaaS feel.
   - **Glassmorphism**: Frosted glass inputs and cards using `backdrop-filter`.
   - **Smooth Animations**: Tailored entrance animations and micro-interactions.

4. **PDF Generation**:
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
- **Image Hosting**: Cloudinary (Unsigned Uploads)
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
   GEMINI_API_KEY=your_gemini_api_key

   # Cloudinary Configuration
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_name
   ```

3. **Database Schema**:
   Run the SQL provided in the `implementation_plan.md` in your Supabase SQL Editor.

4. **Run Locally**:
   ```bash
   npm run dev
   ```

## Documentation
Detailed design documents are available in the `docs` directory:
- [High Level Design (HLD)](docs/hld.md) - System architecture and data flow.
- [Low Level Design (LLD)](docs/lld.md) - Database schema, module logic, and API details.

## Design Aesthetics (WOW Factor)
- **Ambient Visuals**: Animated glowing orbs and a refined dot-grid background for depth.
- **Glassmorphism**: Integrated frosted glass containers for the landing form and template cards.
- **Aspect Locking**: Strict enforcement of A4 dimensions (794x1123px) across all templates and previews to prevent distortion.
- **Interactive Previews**: Dynamic, scaled live previews in the selection flow and templates page.
- **Smooth UX**: Multi-phase animations and micro-interactions throughout the app.

## Assumptions
- "Paid template doesn't require real payment" → Handled comprehensively via a mock Upgrade flow pushing an update request rather than Stripe.
- Open-ended AI approach → Used direct REST call to Gemini 2.0 Flash for speed. Implemented "mock string" fallback if the user fails to provide an API key, preventing empty data states.
- Local Storage vs DB → Kept user session bare-minimum mapping to LocalStorage while DB correctly persists heavy payload objects.
