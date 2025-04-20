import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { autoCategorizeTags, detectLanguage } from "@/utils/snippetUtils";

// GET: Fetch all snippets for the current user or a specific snippet by ID
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        // If ID is provided, return a specific snippet
        if (id) {
            const snippet = await prisma.snippet.findUnique({
                where: {
                    id: id
                }
            });

            if (!snippet) {
                return Response.json(
                    { message: "Snippet not found" },
                    { status: 404 }
                );
            }

            // Check if this snippet belongs to the current user
            if (snippet.userId !== session.user.id) {
                return Response.json(
                    { message: "Not authorized to access this snippet" },
                    { status: 403 }
                );
            }

            return Response.json(snippet);
        }

        // Otherwise, return all snippets for the current user
        const snippets = await prisma.snippet.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return Response.json({ snippets });
    } catch (error) {
        console.error("Error fetching snippets:", error);
        return Response.json(
            { message: "Failed to fetch snippets" },
            { status: 500 }
        );
    }
}

// POST: Create a new snippet
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { title, code, language: providedLanguage, description, tags: manualTags = [] } = await request.json();

        // Validate input
        if (!title || !code) {
            return Response.json(
                { message: "Title and code are required" },
                { status: 400 }
            );
        }

        // Auto-detect language if not provided
        const language = providedLanguage || detectLanguage(code);

        // Auto-categorize tags
        const autoTags = autoCategorizeTags(code, language);

        // Merge manual and auto tags, ensuring uniqueness
        const allTags = [...new Set([...manualTags, ...autoTags])];

        const snippet = await prisma.snippet.create({
            data: {
                title,
                code,
                language,
                description,
                tags: allTags,
                userId: session.user.id
            }
        });

        return Response.json({ snippet }, { status: 201 });
    } catch (error) {
        console.error("Error creating snippet:", error);
        return Response.json(
            { message: "Failed to create snippet" },
            { status: 500 }
        );
    }
}

// PATCH: Update an existing snippet
export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id, title, code, language: providedLanguage, description, tags: manualTags = [] } = await request.json();

        // Validate input
        if (!id || !title || !code) {
            return Response.json(
                { message: "ID, title, and code are required" },
                { status: 400 }
            );
        }

        // Check if snippet exists and belongs to user
        const existingSnippet = await prisma.snippet.findUnique({
            where: { id }
        });

        if (!existingSnippet) {
            return Response.json(
                { message: "Snippet not found" },
                { status: 404 }
            );
        }

        if (existingSnippet.userId !== session.user.id) {
            return Response.json(
                { message: "Not authorized to update this snippet" },
                { status: 403 }
            );
        }

        // Auto-detect language if not provided
        const language = providedLanguage || detectLanguage(code);

        // Auto-categorize tags
        const autoTags = autoCategorizeTags(code, language);

        // Merge manual and auto tags, ensuring uniqueness
        const allTags = [...new Set([...manualTags, ...autoTags])];

        const updatedSnippet = await prisma.snippet.update({
            where: { id },
            data: {
                title,
                code,
                language,
                description,
                tags: allTags
            }
        });

        return Response.json({ snippet: updatedSnippet });
    } catch (error) {
        console.error("Error updating snippet:", error);
        return Response.json(
            { message: "Failed to update snippet" },
            { status: 500 }
        );
    }
}

// DELETE: Remove a snippet
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return Response.json(
                { message: "Snippet ID is required" },
                { status: 400 }
            );
        }

        // Check if snippet exists and belongs to user
        const snippet = await prisma.snippet.findUnique({
            where: { id }
        });

        if (!snippet) {
            return Response.json(
                { message: "Snippet not found" },
                { status: 404 }
            );
        }

        if (snippet.userId !== session.user.id) {
            return Response.json(
                { message: "Not authorized to delete this snippet" },
                { status: 403 }
            );
        }

        await prisma.snippet.delete({
            where: { id }
        });

        return Response.json(
            { message: "Snippet deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting snippet:", error);
        return Response.json(
            { message: "Failed to delete snippet" },
            { status: 500 }
        );
    }
}