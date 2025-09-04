import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze code with AI to provide insights and suggestions
 */
export async function analyzeCodeWithAI(code, language) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Analyze this ${language} code and provide:
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

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Parse JSON response
        try {
            return JSON.parse(response);
        } catch (parseError) {
            // Fallback if JSON parsing fails
            return {
                qualityScore: 7,
                improvements: ["Consider adding error handling"],
                security: [],
                performance: [],
                bestPractices: ["Add comments for better readability"]
            };
        }
    } catch (error) {
        console.error('AI analysis error:', error);
        throw new Error('Failed to analyze code with AI');
    }
}

/**
 * Generate enhanced tags using AI
 */
export async function generateAITags(code, language) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Analyze this ${language} code and generate 5-8 specific, technical tags that describe its functionality, patterns, and purpose.

Code:
${code}

Return only a JSON array of strings (tags), nothing else:
["tag1", "tag2", "tag3"]`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        try {
            const tags = JSON.parse(response);
            return Array.isArray(tags) ? tags : [];
        } catch (parseError) {
            // Fallback parsing
            const tagMatches = response.match(/\[(.*?)\]/);
            if (tagMatches) {
                return tagMatches[1].split(',').map(tag =>
                    tag.replace(/['"]/g, '').trim()
                ).filter(tag => tag.length > 0);
            }
            return [];
        }
    } catch (error) {
        console.error('AI tag generation error:', error);
        return [];
    }
}

/**
 * Explain code in simple terms
 */
export async function explainCode(code, language) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Explain what this ${language} code does in simple, easy-to-understand terms. Focus on:
1. Main purpose
2. Key functionality
3. How it works (briefly)

Keep it concise and beginner-friendly.

Code:
${code}`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('AI explanation error:', error);
        throw new Error('Failed to explain code with AI');
    }
}