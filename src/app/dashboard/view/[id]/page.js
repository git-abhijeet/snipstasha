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
                alert("Snippet copied to clipboard!");
            })
            .catch(err => {
                console.error("Failed to copy text: ", err);
            });
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-center h-64">
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
                    className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    ← Back to Dashboard
                </Link>
            </div>

            {error ? (
                <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-400 text-red-800 dark:text-red-300 rounded-md p-4">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {snippet.title}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(snippet.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {snippet.language}
                        </span>
                    </div>

                    {snippet.description && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                {snippet.description}
                            </p>
                        </div>
                    )}

                    <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code</h3>
                        <div className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm overflow-hidden">
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
                                    wordWrap: "on"
                                }}
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
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex space-x-3">
                            <button
                                onClick={() => copyToClipboard(snippet.code)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Copy to Clipboard
                            </button>
                            <Link
                                href={`/dashboard/edit/${id}`}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Edit Snippet
                            </Link>
                        </div>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Back
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}