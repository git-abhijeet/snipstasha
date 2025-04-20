"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            {/* Left side - Code Editor Theme */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white flex-col justify-center items-center p-8 relative overflow-hidden">
                <div className="absolute top-6 left-6 flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

                {/* Code snippet window */}
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
                            <span className="text-sm text-gray-300">code-samples.js</span>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">JavaScript</span>
                        </div>
                    </div>

                    {/* Code editor content */}
                    <div className="bg-gray-900 p-4 font-mono text-sm">
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">1</div>
                            <div>
                                <span className="text-green-400">{`// SnipStash - Code Snippet Manager`}</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">2</div>
                            <div><span className="text-white"></span></div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">3</div>
                            <div>
                                <span className="text-purple-400">class</span> <span className="text-yellow-300">SnippetManager</span> <span className="text-white">{`{`}</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">4</div>
                            <div>
                                <span className="text-white pl-4"></span><span className="text-purple-400">constructor</span><span className="text-white">() {`{`}</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">5</div>
                            <div>
                                <span className="text-white pl-8"></span><span className="text-purple-400">this</span><span className="text-white">.</span><span className="text-blue-300">snippets</span> <span className="text-white">= [];</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">6</div>
                            <div>
                                <span className="text-white pl-8"></span><span className="text-purple-400">this</span><span className="text-white">.</span><span className="text-blue-300">tags</span> <span className="text-white">= </span><span className="text-purple-400">new</span> <span className="text-yellow-300">Set</span><span className="text-white">();</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">7</div>
                            <div>
                                <span className="text-white pl-4">{`}`}</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">8</div>
                            <div><span className="text-white"></span></div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">9</div>
                            <div>
                                <span className="text-white pl-4"></span><span className="text-purple-400">async</span> <span className="text-green-400">fetchSnippets</span><span className="text-white">() {`{`}</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">10</div>
                            <div>
                                <span className="text-white pl-8"></span><span className="text-purple-400">const</span> <span className="text-blue-300">response</span> <span className="text-white">= </span><span className="text-purple-400">await</span> <span className="text-blue-300">fetch</span><span className="text-white">(</span><span className="text-yellow-300">&quot;/api/snippets&quot;</span><span className="text-white">);</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">11</div>
                            <div>
                                <span className="text-white pl-8"></span><span className="text-purple-400">return</span> <span className="text-purple-400">await</span> <span className="text-blue-300">response</span><span className="text-white">.</span><span className="text-green-400">json</span><span className="text-white">();</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">12</div>
                            <div>
                                <span className="text-white pl-4">{`}`}</span>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="text-gray-500 mr-4 select-none">13</div>
                            <div>
                                <span className="text-white">{`}`}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features display */}
                <div className="mt-8 text-center max-w-md">
                    <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
                    <p className="text-gray-300 mb-6">
                        Your code snippets library is waiting for you.
                    </p>

                    {/* Interactive code file icons */}
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-24 text-center hover:bg-gray-700 transition-colors cursor-pointer">
                            <div className="text-blue-400 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <p className="text-xs">react.js</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-24 text-center hover:bg-gray-700 transition-colors cursor-pointer">
                            <div className="text-yellow-400 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            <p className="text-xs">config.js</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-24 text-center hover:bg-gray-700 transition-colors cursor-pointer">
                            <div className="text-green-400 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                </svg>
                            </div>
                            <p className="text-xs">db.js</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Log in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Or{" "}
                        <Link
                            href="/signup"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            create a new account
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
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isLoading ? "Logging in..." : "Log in"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}