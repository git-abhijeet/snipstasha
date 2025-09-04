"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiCopy, FiCode } from "react-icons/fi";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [snippets, setSnippets] = useState([]);
    const [filteredSnippets, setFilteredSnippets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [copiedId, setCopiedId] = useState(null);

    // NEW AI-RELATED STATE
    const [sortBy, setSortBy] = useState("createdAt"); // createdAt, qualityScore, title
    const [showAIInsights, setShowAIInsights] = useState(true);

    useEffect(() => {
        if (session) {
            fetchSnippets();
        }
    }, [session]);

    useEffect(() => {
        filterSnippets();
    }, [snippets, searchTerm, selectedLanguage, selectedTags, sortBy]);

    const fetchSnippets = async () => {
        try {
            const response = await fetch("/api/snippets");
            if (response.ok) {
                const data = await response.json();
                setSnippets(data);

                // Extract unique languages and tags
                const languages = [...new Set(data.map(snippet => snippet.language))];
                const tags = [...new Set(data.flatMap(snippet => [...(snippet.tags || []), ...(snippet.aiTags || [])]))];

                setAvailableLanguages(languages);
                setAvailableTags(tags);
            } else {
                setError("Failed to fetch snippets");
            }
        } catch (error) {
            console.error("Error fetching snippets:", error);
            setError("An error occurred while fetching snippets");
        } finally {
            setLoading(false);
        }
    };

    const filterSnippets = () => {
        let filtered = [...snippets];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(snippet =>
                snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                snippet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                snippet.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                snippet.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                snippet.aiTags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by language
        if (selectedLanguage) {
            filtered = filtered.filter(snippet => snippet.language === selectedLanguage);
        }

        // Filter by tags
        if (selectedTags.length > 0) {
            filtered = filtered.filter(snippet =>
                selectedTags.every(tag =>
                    snippet.tags?.includes(tag) || snippet.aiTags?.includes(tag)
                )
            );
        }

        // Sort snippets
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "qualityScore":
                    const scoreA = a.qualityScore || 0;
                    const scoreB = b.qualityScore || 0;
                    return scoreB - scoreA; // Highest first
                case "title":
                    return a.title.localeCompare(b.title);
                case "createdAt":
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        setFilteredSnippets(filtered);
    };

    const copyToClipboard = async (code, id) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    const deleteSnippet = async (id) => {
        if (confirm("Are you sure you want to delete this snippet?")) {
            try {
                const response = await fetch(`/api/snippets?id=${id}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setSnippets(snippets.filter(snippet => snippet.id !== id));
                } else {
                    setError("Failed to delete snippet");
                }
            } catch (error) {
                console.error("Error deleting snippet:", error);
                setError("An error occurred while deleting the snippet");
            }
        }
    };

    const addTagFilter = (tag) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const removeTagFilter = (tag) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    };

    // NEW AI FUNCTIONS
    const getQualityScoreColor = (score) => {
        if (!score) return "bg-gray-100 text-gray-800";
        if (score >= 8) return "bg-green-100 text-green-800";
        if (score >= 6) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    const getAIInsightsSummary = () => {
        const totalSnippets = snippets.length;
        const snippetsWithAI = snippets.filter(s => s.qualityScore || s.aiAnalysis).length;
        const avgQuality = snippets
            .filter(s => s.qualityScore)
            .reduce((sum, s) => sum + s.qualityScore, 0) / snippets.filter(s => s.qualityScore).length || 0;

        const languageQuality = availableLanguages.map(lang => {
            const langSnippets = snippets.filter(s => s.language === lang && s.qualityScore);
            const avgScore = langSnippets.reduce((sum, s) => sum + s.qualityScore, 0) / langSnippets.length || 0;
            return { language: lang, avgScore: avgScore.toFixed(1), count: langSnippets.length };
        }).filter(item => item.count > 0).sort((a, b) => b.avgScore - a.avgScore);

        return { totalSnippets, snippetsWithAI, avgQuality: avgQuality.toFixed(1), languageQuality };
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const aiInsights = getAIInsightsSummary();

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        My Snippets
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {filteredSnippets.length} of {snippets.length} snippets
                        {aiInsights.snippetsWithAI > 0 && (
                            <span className="ml-2 text-purple-600">
                                • {aiInsights.snippetsWithAI} with AI analysis
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAIInsights(!showAIInsights)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                    >
                        🤖 {showAIInsights ? 'Hide' : 'Show'} AI Insights
                    </button>
                    <Link
                        href="/dashboard/new"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <FiCode className="w-4 h-4" />
                        New Snippet
                    </Link>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* AI Insights Panel */}
            {showAIInsights && aiInsights.snippetsWithAI > 0 && (
                <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        🤖 AI Code Insights
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Overall Quality</h3>
                            <div className="text-2xl font-bold text-purple-600">
                                {aiInsights.avgQuality}/10
                            </div>
                            <p className="text-sm text-gray-500">Average across {aiInsights.snippetsWithAI} snippets</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Coverage</h3>
                            <div className="text-2xl font-bold text-blue-600">
                                {Math.round((aiInsights.snippetsWithAI / aiInsights.totalSnippets) * 100)}%
                            </div>
                            <p className="text-sm text-gray-500">Snippets with AI analysis</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Top Language</h3>
                            {aiInsights.languageQuality.length > 0 && (
                                <>
                                    <div className="text-lg font-bold text-green-600">
                                        {aiInsights.languageQuality[0].language}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {aiInsights.languageQuality[0].avgScore}/10 avg quality
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search snippets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">All Languages</option>
                        {availableLanguages.map(language => (
                            <option key={language} value={language}>
                                {language}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="createdAt">Sort by Date</option>
                        <option value="title">Sort by Title</option>
                        <option value="qualityScore">Sort by AI Quality</option>
                    </select>
                </div>

                {/* Active Filters */}
                {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Filters:</span>
                        {selectedTags.map(tag => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                                {tag}
                                <button
                                    onClick={() => removeTagFilter(tag)}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Snippets Grid */}
            {filteredSnippets.length === 0 ? (
                <div className="text-center py-12">
                    <FiCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        {snippets.length === 0 ? "No snippets yet" : "No snippets match your filters"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {snippets.length === 0
                            ? "Create your first code snippet to get started"
                            : "Try adjusting your search terms or filters"
                        }
                    </p>
                    {snippets.length === 0 && (
                        <Link
                            href="/dashboard/new"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <FiCode className="w-4 h-4 mr-2" />
                            Create Your First Snippet
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSnippets.map((snippet) => (
                        <div
                            key={snippet.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Card Header */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                            {snippet.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                                {snippet.language}
                                            </span>
                                            {snippet.qualityScore && (
                                                <span className={`px-2 py-1 rounded text-xs ${getQualityScoreColor(snippet.qualityScore)}`}>
                                                    🤖 {snippet.qualityScore}/10
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4">
                                {snippet.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                        {snippet.description}
                                    </p>
                                )}

                                {/* Code Preview */}
                                <div className="bg-gray-900 rounded text-gray-100 p-3 mb-3 overflow-hidden">
                                    <pre className="text-xs line-clamp-3 whitespace-pre-wrap">
                                        {snippet.code.substring(0, 150)}
                                        {snippet.code.length > 150 && '...'}
                                    </pre>
                                </div>

                                {/* Tags */}
                                {(snippet.tags?.length > 0 || snippet.aiTags?.length > 0) && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {snippet.tags?.slice(0, 2).map((tag, index) => (
                                            <button
                                                key={`manual-${index}`}
                                                onClick={() => addTagFilter(tag)}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                        {snippet.aiTags?.slice(0, 2).map((tag, index) => (
                                            <button
                                                key={`ai-${index}`}
                                                onClick={() => addTagFilter(tag)}
                                                className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
                                            >
                                                🤖 {tag}
                                            </button>
                                        ))}
                                        {(snippet.tags?.length > 2 || snippet.aiTags?.length > 2) && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                                                +{(snippet.tags?.length || 0) + (snippet.aiTags?.length || 0) - 4}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* AI Insights Preview */}
                                {snippet.aiAnalysis && (
                                    <div className="mb-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-xs">
                                        <div className="flex items-center gap-1 text-purple-700 dark:text-purple-300">
                                            🔍 AI Analysis Available
                                        </div>
                                        {snippet.aiAnalysis.improvements?.length > 0 && (
                                            <div className="mt-1 text-gray-600 dark:text-gray-400">
                                                {snippet.aiAnalysis.improvements.length} improvements suggested
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(snippet.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => copyToClipboard(snippet.code, snippet.id)}
                                            className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                                            title="Copy code"
                                        >
                                            {copiedId === snippet.id ? (
                                                <span className="text-green-600 text-xs">✓</span>
                                            ) : (
                                                <FiCopy className="w-4 h-4" />
                                            )}
                                        </button>
                                        <Link
                                            href={`/dashboard/view/${snippet.id}`}
                                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                            title="View snippet"
                                        >
                                            <FiEye className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/dashboard/edit/${snippet.id}`}
                                            className="p-2 text-gray-600 hover:text-yellow-600 transition-colors"
                                            title="Edit snippet"
                                        >
                                            <FiEdit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => deleteSnippet(snippet.id)}
                                            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                            title="Delete snippet"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}