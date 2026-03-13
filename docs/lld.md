# Low Level Design (LLD) - CVFlow

## 1. Database Schema (`resumes` table)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key to users |
| title | String | User-defined resume title |
| template_id | String | 'classic', 'modern', or 'executive' |
| personal_info | JSONB | Nested object: {name, email, phone, photoUrl, linkedin, location} |
| summary | Text | Professional summary |
| experience | JSONB[] | List of experience objects |
| education | JSONB[] | List of education objects |
| skills | String[] | Flat list of skills |
| updated_at | Timestamp | For sorting in dashboard |

## 2. Core Modules
### A. Cloudinary Uploader
- **Mechanism**: Unsigned Upload Preset.
- **Implementation**: `fetch` POST to `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`.
- **Logic**: Prevents backend load by handling high-resolution images client-side.

### B. AI Assistance Handler
- **Endpoints**: Uses Gemini's `generateContent` stream-less REST endpoint.
- **Prompts**: Dynamically constructed based on the context (e.g., combining `job_title` + `company` for experience refinement).
- **Safe Fallback**: Implements a "mock" response if API keys are missing to ensure UX continuity.

### C. PDF Render Logic
- **Library**: `html2pdf.js` (Wrapper for `jspdf` and `html2canvas`).
- **Optimization**: Uses `useCORS: true` to ensure Cloudinary photos are rendered in the PDF without cross-origin tainting.

## 3. API Routes
- `POST /api/resumes`: Initializes a blank record.
- `PUT /api/resumes/[id]`: Optimized update using JSONB merge.
- `GET /api/resumes?user_id=...`: Listing for dashboard.
- `POST /api/upgrade`: Updates user state to unlock premium features.
