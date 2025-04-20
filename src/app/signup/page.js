"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("All fields are required");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Navigate to login page on successful signup
            router.push("/login?registered=success");
        } catch (error) {
            setError(error.message || "Failed to create account. Please try again.");
            console.error("Signup error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            {/* Left side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Log in
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/30 border border-red-400 text-red-800 dark:text-red-300 rounded-md p-4 mb-6">
                                <p>{error}</p>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Confirm Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isLoading ? "Creating account..." : "Sign up"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right side - Code Editor Theme */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white flex-col justify-center items-center p-8 relative overflow-hidden">
                <div className="absolute top-6 right-6 flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

                <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
                    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center">
                        <div className="flex-1 flex items-center">
                            <Image
                                src="/file.svg"
                                alt="SnipStash Logo"
                                width={20}
                                height={20}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-300">snippet.js</span>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">JavaScript</span>
                        </div>
                    </div>
                    <div className="bg-gray-900 p-4 font-mono text-sm">
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">1</div>
                            <div>
                                <span className="text-purple-400">const</span> <span className="text-blue-300">greeting</span> <span className="text-white">=</span> <span className="text-yellow-300">&apos;Welcome to SnipStash!&apos;</span><span className="text-white">;</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">2</div>
                            <div><span className="text-white"></span></div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">3</div>
                            <div>
                                <span className="text-purple-400">function</span> <span className="text-green-400">storeSnippet</span><span className="text-white">(</span><span className="text-orange-300">code</span><span className="text-white">) {`{`}</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">4</div>
                            <div>
                                <span className="text-white pl-4">{/* Save your valuable code snippets */}</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">5</div>
                            <div>
                                <span className="text-white pl-4"></span><span className="text-purple-400">return</span> <span className="text-blue-300">SnipStash</span><span className="text-white">.</span><span className="text-green-400">save</span><span className="text-white">(</span><span className="text-orange-300">code</span><span className="text-white">);</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">6</div>
                            <div>
                                <span className="text-white">{`}`}</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">7</div>
                            <div><span className="text-white"></span></div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">8</div>
                            <div>
                                <span className="text-purple-400">const</span> <span className="text-blue-300">features</span> <span className="text-white">= [</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">9</div>
                            <div>
                                <span className="text-white pl-4"></span><span className="text-yellow-300">&apos;Store code snippets securely&apos;</span><span className="text-white">,</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">10</div>
                            <div>
                                <span className="text-white pl-4"></span><span className="text-yellow-300">&apos;Organize with tags and categories&apos;</span><span className="text-white">,</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">11</div>
                            <div>
                                <span className="text-white pl-4"></span><span className="text-yellow-300">&apos;Access from any device&apos;</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">12</div>
                            <div>
                                <span className="text-white">];</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center max-w-md">
                    <h1 className="text-2xl font-bold mb-4">Your Code Snippet Library</h1>
                    <p className="text-gray-300 mb-6">
                        Save, organize, and access all your code snippets from one secure location.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                            <div className="text-blue-400 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                </svg>
                            </div>
                            <p className="text-xs text-center">Store</p>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                            <div className="text-green-400 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <p className="text-xs text-center">Organize</p>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                            <div className="text-purple-400 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <p className="text-xs text-center">Access</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}