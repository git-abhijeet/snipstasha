"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Editor from "@monaco-editor/react";
import Link from "next/link";

export default function ViewSnippetPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const router = useRouter();

    const [snippet, setSnippet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    // NEW AI-RELATED STATE
    const [showAIAnalysis, setShowAIAnalysis] = useState(false);
    const [showAIExplanation, setShowAIExplanation] = useState(false);
    const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
    const [liveExplanation, setLiveExplanation] = useState("");

    useEffect(() => {
        if (id && session) {
            fetchSnippet();
        }
    }, [id, session]);

    const fetchSnippet = async () => {
        try {
            const response = await fetch(`/api/snippets?id=${id}`);

            if (response.ok) {
                const data = await response.json();
                setSnippet(data);
            } else {
                setError("Failed to fetch snippet");
            }
        } catch (error) {
            console.error("Error fetching snippet:", error);
            setError("An error occurred while fetching the snippet");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (snippet?.code) {
            try {
                await navigator.clipboard.writeText(snippet.code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (error) {
                console.error("Failed to copy:", error);
            }
        }
    };

    const deleteSnippet = async () => {
        if (confirm("Are you sure you want to delete this snippet?")) {
            try {
                const response = await fetch(`/api/snippets?id=${id}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    router.push("/dashboard");
                } else {
                    setError("Failed to delete snippet");
                }
            } catch (error) {
                console.error("Error deleting snippet:", error);
                setError("An error occurred while deleting the snippet");
            }
        }
    };

    // NEW AI FUNCTIONS
    const generateLiveExplanation = async () => {
        if (!snippet?.code) return;

        setIsGeneratingExplanation(true);
        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'explain',
                    code: snippet.code,
                    language: snippet.language
                })
            });

            const data = await response.json();
            if (data.success) {
                setLiveExplanation(data.result);
                setShowAIExplanation(true);
            } else {
                console.error('AI explanation failed:', data.error);
            }
        } catch (error) {
            console.error('Error generating explanation:', error);
        } finally {
            setIsGeneratingExplanation(false);
        }
    };

    const refreshAIAnalysis = async () => {
        if (!snippet?.code) return;

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'analyze',
                    code: snippet.code,
                    language: snippet.language
                })
            });

            const data = await response.json();
            if (data.success) {
                // Update the snippet with new AI analysis
                const updateResponse = await fetch('/api/snippets', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: snippet.id,
                        aiAnalysis: data.result,
                        qualityScore: data.result.qualityScore
                    })
                });

                if (updateResponse.ok) {
                    const updatedSnippet = await updateResponse.json();
                    setSnippet(updatedSnippet);
                }
            }
        } catch (error) {
            console.error('Error refreshing AI analysis:', error);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded mb-4"></div>
                    <div className="h-64 bg-gray-300 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (!snippet) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center text-gray-500">
                    Snippet not found
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {snippet.title}
                            </h1>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {snippet.language}
                                </span>
                                {snippet.qualityScore && (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                                        🤖 Quality: {snippet.qualityScore}/10
                                    </span>
                                )}
                                <span>Created: {new Date(snippet.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                {copied ? "Copied!" : "Copy"}
                            </button>
                            <Link
                                href={`/dashboard/edit/${snippet.id}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={deleteSnippet}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    {/* Description */}
                    {snippet.description && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Description
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded p-3">
                                {snippet.description}
                            </p>
                        </div>
                    )}

                    {/* AI Controls */}
                    <div className="mb-6 flex flex-wrap gap-3">
                        {snippet.aiAnalysis && (
                            <button
                                onClick={() => setShowAIAnalysis(!showAIAnalysis)}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"
                            >
                                🔍 {showAIAnalysis ? 'Hide' : 'Show'} AI Analysis
                            </button>
                        )}

                        {snippet.aiExplanation && (
                            <button
                                onClick={() => setShowAIExplanation(!showAIExplanation)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                            >
                                💡 {showAIExplanation ? 'Hide' : 'Show'} AI Explanation
                            </button>
                        )}

                        <button
                            onClick={generateLiveExplanation}
                            disabled={isGeneratingExplanation}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isGeneratingExplanation ? (
                                <>🔄 Generating...</>
                            ) : (
                                <>🤖 Generate New Explanation</>
                            )}
                        </button>

                        <button
                            onClick={refreshAIAnalysis}
                            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 flex items-center gap-2"
                        >
                            🔄 Refresh AI Analysis
                        </button>
                    </div>

                    {/* AI Analysis Panel */}
                    {showAIAnalysis && snippet.aiAnalysis && (
                        <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                🔍 AI Code Analysis
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                                        Quality Score: {snippet.aiAnalysis.qualityScore || 'N/A'}/10
                                    </h4>

                                    {snippet.aiAnalysis.improvements?.length > 0 && (
                                        <div className="mb-3">
                                            <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                💡 Improvements:
                                            </h5>
                                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                {snippet.aiAnalysis.improvements.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    {snippet.aiAnalysis.security?.length > 0 && (
                                        <div className="mb-3">
                                            <h5 className="font-medium text-red-700 dark:text-red-400 mb-1">
                                                🚨 Security Issues:
                                            </h5>
                                            <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 space-y-1">
                                                {snippet.aiAnalysis.security.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {snippet.aiAnalysis.performance?.length > 0 && (
                                        <div className="mb-3">
                                            <h5 className="font-medium text-orange-700 dark:text-orange-400 mb-1">
                                                ⚡ Performance:
                                            </h5>
                                            <ul className="list-disc list-inside text-sm text-orange-600 dark:text-orange-400 space-y-1">
                                                {snippet.aiAnalysis.performance.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {snippet.aiAnalysis.bestPractices?.length > 0 && (
                                        <div>
                                            <h5 className="font-medium text-green-700 dark:text-green-400 mb-1">
                                                ✅ Best Practices:
                                            </h5>
                                            <ul className="list-disc list-inside text-sm text-green-600 dark:text-green-400 space-y-1">
                                                {snippet.aiAnalysis.bestPractices.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Explanation Panel */}
                    {(showAIExplanation && snippet.aiExplanation) && (
                        <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                💡 AI Explanation
                            </h3>
                            <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                                {snippet.aiExplanation.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-2">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Live Generated Explanation */}
                    {liveExplanation && (
                        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                🤖 Fresh AI Explanation
                            </h3>
                            <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                                {liveExplanation.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-2">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Code Editor */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Code
                        </h3>
                        <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                            <Editor
                                height="400px"
                                language={snippet.language}
                                value={snippet.code}
                                theme="vs-dark"
                                options={{
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: "on",
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true
                                }}
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    {(snippet.tags?.length > 0 || snippet.aiTags?.length > 0) && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {snippet.tags?.map((tag, index) => (
                                    <span
                                        key={`manual-${index}`}
                                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {snippet.aiTags?.map((tag, index) => (
                                    <span
                                        key={`ai-${index}`}
                                        className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                    >
                                        🤖 {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Back to Dashboard */}
            <div className="mt-6 text-center">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}