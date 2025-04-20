import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return Response.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return Response.json(
                { message: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return Response.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash the password
        const hashedPassword = await hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Return success without password
        const { password: _, ...userWithoutPassword } = user;

        return Response.json(
            { message: "User created successfully", user: userWithoutPassword },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}