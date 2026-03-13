import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function generateWithGemini(prompt) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return null;
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  const data = await response.json();
  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }

  return null;
}

export async function POST(request) {
  try {
    const { type, context } = await request.json();

    let prompt = '';

    switch (type) {
      case 'summary':
        prompt = `Write a professional resume summary/about section for a person with the following details. Keep it concise (2-3 sentences), impactful, and written in first person. Do not use markdown formatting, just plain text.
        
Details:
- Name: ${context.name || 'Not provided'}
- Title/Role: ${context.title || 'Not provided'}
- Experience: ${context.experience || 'Not provided'}
- Skills: ${context.skills || 'Not provided'}

Write only the summary text, nothing else.`;
        break;

      case 'experience':
        prompt = `Improve this work experience description for a resume. Make it more impactful using action verbs and quantifiable achievements where possible. Keep it professional and concise. Do not use markdown formatting, just plain text with bullet points using "•" character.

Original description: ${context.description || 'Not provided'}
Job title: ${context.jobTitle || 'Not provided'}
Company: ${context.company || 'Not provided'}

Write only the improved description, nothing else.`;
        break;

      case 'skills':
        prompt = `Suggest 8-12 relevant professional skills for a person with the following profile. Return them as a comma-separated list. Do not include numbering or bullet points.

Title/Role: ${context.title || 'Not provided'}
Industry: ${context.industry || 'Not provided'}
Experience: ${context.experience || 'Not provided'}

Write only the comma-separated skills list, nothing else.`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const result = await generateWithGemini(prompt);

    if (!result) {
      // Fallback responses when AI is not available
      const fallbacks = {
        summary: 'Dedicated professional with a proven track record of delivering results. Skilled in problem-solving and collaboration, with a passion for continuous improvement and innovation.',
        experience: '• Led cross-functional initiatives to improve operational efficiency\n• Collaborated with team members to deliver projects on time\n• Implemented process improvements resulting in increased productivity',
        skills: 'Communication, Problem Solving, Team Leadership, Project Management, Critical Thinking, Time Management, Adaptability, Technical Writing',
      };

      return NextResponse.json({
        result: fallbacks[type],
        isFallback: true,
      });
    }

    return NextResponse.json({ result, isFallback: false });
  } catch (err) {
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
  }
}
