import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all snippets for the current user or a specific snippet by ID
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

        return NextResponse.json(snippets);
    } catch (error) {
        console.error("Error fetching snippets:", error);
        return NextResponse.json(
            { error: "Failed to fetch snippets" },
            { status: 500 }
        );
    }
}

// POST: Create a new snippet
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            code,
            language,
            description,
            tags,
            // NEW AI FIELDS
            aiAnalysis,
            aiTags,
            aiExplanation,
            qualityScore
        } = body;

        if (!title || !code) {
            return NextResponse.json(
                { error: "Title and code are required" },
                { status: 400 }
            );
        }

        const snippet = await prisma.snippet.create({
            data: {
                title,
                code,
                language: language || "text",
                description: description || "",
                tags: tags || [],
                // NEW AI FIELDS
                aiAnalysis: aiAnalysis || null,
                aiTags: aiTags || [],
                aiExplanation: aiExplanation || null,
                qualityScore: qualityScore || null,
                userId: session.user.id
            }
        });

        return NextResponse.json(snippet, { status: 201 });
    } catch (error) {
        console.error("Error creating snippet:", error);
        return NextResponse.json(
            { error: "Failed to create snippet" },
            { status: 500 }
        );
    }
}

// PATCH: Update an existing snippet
export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            id,
            title,
            code,
            language,
            description,
            tags,
            // NEW AI FIELDS
            aiAnalysis,
            aiTags,
            aiExplanation,
            qualityScore
        } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Snippet ID is required" },
                { status: 400 }
            );
        }

        // Check if snippet belongs to user
        const existingSnippet = await prisma.snippet.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }
        });

        if (!existingSnippet) {
            return NextResponse.json(
                { error: "Snippet not found or unauthorized" },
                { status: 404 }
            );
        }

        const updatedSnippet = await prisma.snippet.update({
            where: { id: id },
            data: {
                title: title || existingSnippet.title,
                code: code || existingSnippet.code,
                language: language || existingSnippet.language,
                description: description !== undefined ? description : existingSnippet.description,
                tags: tags || existingSnippet.tags,
                // NEW AI FIELDS - only update if provided
                ...(aiAnalysis !== undefined && { aiAnalysis }),
                ...(aiTags !== undefined && { aiTags }),
                ...(aiExplanation !== undefined && { aiExplanation }),
                ...(qualityScore !== undefined && { qualityScore }),
                updatedAt: new Date()
            }
        });

        return NextResponse.json(updatedSnippet);
    } catch (error) {
        console.error("Error updating snippet:", error);
        return NextResponse.json(
            { error: "Failed to update snippet" },
            { status: 500 }
        );
    }
}

// DELETE: Remove a snippet
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: "Snippet ID is required" },
                { status: 400 }
            );
        }

        // Check if snippet belongs to user
        const snippet = await prisma.snippet.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }
        });

        if (!snippet) {
            return NextResponse.json(
                { error: "Snippet not found or unauthorized" },
                { status: 404 }
            );
        }

        await prisma.snippet.delete({
            where: { id: id }
        });

        return NextResponse.json({ message: "Snippet deleted successfully" });
    } catch (error) {
        console.error("Error deleting snippet:", error);
        return NextResponse.json(
            { error: "Failed to delete snippet" },
            { status: 500 }
        );
    }
}