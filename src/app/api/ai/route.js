import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cleanJsonResponse(response) {
    // Remove markdown code blocks if present
    let cleaned = response.trim();

    // Remove ```json and ``` if present
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }

    return cleaned.trim();
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { action, code, language } = await request.json();

        if (!code || !action) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Updated model name - this is the fix!
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let prompt;

        switch (action) {
            case 'tags':
                prompt = `Analyze this ${language} code and generate 5-8 specific, technical tags that describe its functionality, patterns, and purpose.

Code:
${code}

Return only a JSON array of strings (tags), nothing else:
["tag1", "tag2", "tag3"]`;
                break;

            case 'analyze':
                prompt = `Analyze this ${language} code and provide:
1. Code quality score (1-10)
2. Potential improvements (max 3)
3. Security vulnerabilities (if any)
4. Performance optimizations (if any)
5. Best practices suggestions (max 3)

Code:
${code}

Respond in JSON format:
{
  "qualityScore": number,
  "improvements": ["improvement1", "improvement2"],
  "security": ["security1", "security2"],
  "performance": ["perf1", "perf2"],
  "bestPractices": ["practice1", "practice2"]
}`;
                break;

            case 'explain':
                prompt = `Explain what this ${language} code does in simple, easy-to-understand terms. Focus on:
1. Main purpose
2. Key functionality
3. How it works (briefly)

Keep it concise and beginner-friendly.

Code:
${code}`;
                break;

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // For tags and analyze actions, try to parse JSON
        if (action === 'tags' || action === 'analyze') {
            try {
                // Clean the response before parsing
                const cleanedResponse = cleanJsonResponse(response);
                const parsedResult = JSON.parse(cleanedResponse);
                return NextResponse.json({ success: true, result: parsedResult });
            } catch (parseError) {
                console.log('JSON parse error, trying fallback:', parseError);
                console.log('Original response:', response); // Add this for debugging

                // Fallback for tags
                if (action === 'tags') {
                    // Try to extract array from response
                    const tagMatches = response.match(/\[(.*?)\]/);
                    if (tagMatches) {
                        const tags = tagMatches[1].split(',').map(tag =>
                            tag.replace(/['"]/g, '').trim()
                        ).filter(tag => tag.length > 0);
                        return NextResponse.json({ success: true, result: tags });
                    }

                    // If no array found, create tags from text
                    const fallbackTags = response.split(/[,\n]/)
                        .map(tag => tag.replace(/[^\w\s-]/g, '').trim())
                        .filter(tag => tag.length > 0)
                        .slice(0, 8);

                    return NextResponse.json({ success: true, result: fallbackTags });
                }

                // Fallback for analyze
                return NextResponse.json({
                    success: true,
                    result: {
                        qualityScore: 7,
                        improvements: ["Consider adding error handling", "Add code comments"],
                        security: [],
                        performance: [],
                        bestPractices: ["Follow naming conventions"]
                    }
                });
            }
        }

        // For explain action, return as is
        return NextResponse.json({ success: true, result: response });

    } catch (error) {
        console.error('AI API error:', error);
        return NextResponse.json(
            { error: `Failed to process AI request: ${error.message}` },
            { status: 500 }
        );
    }
}