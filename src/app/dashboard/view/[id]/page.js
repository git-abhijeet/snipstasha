"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { detectLanguage } from "@/utils/snippetUtils";
import Editor from "@monaco-editor/react";
import { use } from "react";

export default function ViewSnippetPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const { id } = params;

    const { data: session } = useSession();
    const router = useRouter();

    const [snippet, setSnippet] = useState({
        title: "",
        code: "",
        language: "",
        description: "",
        tags: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    // Fetch the snippet data when the component mounts
    useEffect(() => {
        const fetchSnippet = async () => {
            try {
                const response = await fetch(`/api/snippets?id=${id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch snippet");
                }

                const data = await response.json();

                setSnippet({
                    title: data.title,
                    code: data.code,
                    language: data.language || "",
                    description: data.description || "",
                    tags: data.tags || [],
                    createdAt: data.createdAt
                });

                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching snippet:", err);
                setError("Failed to load snippet. It may have been deleted or you may not have permission to view it.");
                setIsLoading(false);
            }
        };

        if (session) {
            fetchSnippet();
        }
    }, [id, session]);

    // Copy snippet to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error("Failed to copy text: ", err);
            });
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading snippet...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">View Snippet</h1>
                <Link
                    href="/dashboard"
                    className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors duration-200 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>

            {error ? (
                <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-400 text-red-800 dark:text-red-300 rounded-md p-4">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div className="mb-4 sm:mb-0">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {snippet.title}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(snippet.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 shadow-sm">
                            {snippet.language}
                        </span>
                    </div>

                    {snippet.description && (
                        <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-md border border-gray-100 dark:border-gray-700">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                {snippet.description}
                            </p>
                        </div>
                    )}

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Code</h3>
                            <button
                                onClick={() => copyToClipboard(snippet.code)}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                            >
                                {copied ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Copy code
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="border border-gray-300 dark:border-gray-600 rounded-md shadow-md overflow-hidden">
                            <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 px-4 py-2 flex justify-between items-center">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {snippet.language || "plaintext"}
                                </span>
                                <div className="flex space-x-1">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                            </div>
                            <Editor
                                height="500px"
                                language={snippet.language || "plaintext"}
                                value={snippet.code}
                                theme={typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'light'}
                                options={{
                                    readOnly: true,
                                    minimap: { enabled: true },
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    wordWrap: "on",
                                    lineNumbers: "on",
                                    folding: true,
                                    contextmenu: false,
                                    renderLineHighlight: 'all'
                                }}
                                className="monaco-editor-enhanced"
                            />
                        </div>
                    </div>

                    {snippet.tags.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {snippet.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-100 dark:border-blue-800"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => copyToClipboard(snippet.code)}
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {copied ? "Copied!" : "Copy to Clipboard"}
                            </button>
                            <Link
                                href={`/dashboard/edit/${id}`}
                                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Snippet
                            </Link>
                        </div>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            )}

            <style jsx global>{`
                /* Enhanced editor styles */
                .monaco-editor-enhanced {
                    border-radius: 0 0 6px 6px;
                }
                /* Add any additional global styles here */
            `}</style>
        </div>
    );
}