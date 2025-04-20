"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
    const { data: session } = useSession();
    const [snippets, setSnippets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterLanguage, setFilterLanguage] = useState("");
    const [filterTag, setFilterTag] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [languages, setLanguages] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        // Fetch snippets when component mounts
        const fetchSnippets = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/snippets");

                if (!response.ok) {
                    throw new Error("Failed to fetch snippets");
                }

                const data = await response.json();
                setSnippets(data.snippets);

                // Extract unique languages and tags
                const uniqueLanguages = [...new Set(data.snippets.map(snippet => snippet.language))];
                setLanguages(uniqueLanguages);

                const allTags = data.snippets.flatMap(snippet => snippet.tags);
                const uniqueTags = [...new Set(allTags)];
                setTags(uniqueTags);

            } catch (err) {
                setError(err.message);
                console.error("Error fetching snippets:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSnippets();
    }, []);

    // Filter snippets based on search criteria
    const filteredSnippets = snippets.filter(snippet => {
        const matchesLanguage = filterLanguage ? snippet.language === filterLanguage : true;
        const matchesTag = filterTag ? snippet.tags.includes(filterTag) : true;
        const matchesSearch = searchQuery
            ? snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snippet.code.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        return matchesLanguage && matchesTag && matchesSearch;
    });

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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Snippets</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Manage and organize your code snippets
                    </p>
                </div>
                <Link
                    href="/dashboard/new"
                    className="mt-4 md:mt-0 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    Add New Snippet
                </Link>
            </div>

            {/* Search and filters */}
            <div className="mb-8 grid gap-4 md:flex md:items-center md:space-x-4">
                <div className="flex-1">
                    <label htmlFor="search" className="sr-only">Search snippets</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search snippets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div className="w-full md:w-40">
                    <label htmlFor="language-filter" className="sr-only">Filter by language</label>
                    <select
                        id="language-filter"
                        value={filterLanguage}
                        onChange={(e) => setFilterLanguage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">All Languages</option>
                        {languages.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>
                </div>
                <div className="w-full md:w-40">
                    <label htmlFor="tag-filter" className="sr-only">Filter by tag</label>
                    <select
                        id="tag-filter"
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">All Tags</option>
                        {tags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-400 text-red-800 dark:text-red-300 rounded-md p-4">
                    <p>{error}</p>
                </div>
            ) : filteredSnippets.length === 0 ? (
                <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No snippets found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {filterLanguage || filterTag || searchQuery
                            ? "Try adjusting your filters or search query"
                            : "Get started by creating a new snippet"}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredSnippets.map((snippet) => (
                        <div
                            key={snippet.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                                        {snippet.title}
                                    </h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                        {snippet.language}
                                    </span>
                                </div>
                                <div className="mt-2 bg-gray-50 dark:bg-gray-900 rounded p-3 overflow-x-auto">
                                    <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                                        <code>
                                            {snippet.code.length > 150
                                                ? `${snippet.code.substring(0, 150)}...`
                                                : snippet.code}
                                        </code>
                                    </pre>
                                </div>
                                <div className="mt-4">
                                    <div className="flex flex-wrap gap-1">
                                        {snippet.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 flex justify-between">
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => copyToClipboard(snippet.code)}
                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Copy
                                    </button>
                                    <Link
                                        href={`/dashboard/view/${snippet.id}`}
                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        View Full
                                    </Link>
                                    <Link
                                        href={`/dashboard/edit/${snippet.id}`}
                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Edit
                                    </Link>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(snippet.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}