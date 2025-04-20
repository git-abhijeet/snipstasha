"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { detectLanguage } from "@/utils/snippetUtils";
import Editor from "@monaco-editor/react";
import { use } from "react";

const languageOptions = [
    { value: "", label: "Auto Detect" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "c#", label: "C#" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "rust", label: "Rust" },
    { value: "sql", label: "SQL" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "bash", label: "Bash/Shell" },
    { value: "text", label: "Plain Text" }
];

export default function EditSnippetPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const { id } = params;

    const { data: session } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        code: "",
        language: "",
        description: "",
        tags: []
    });

    const [newTag, setNewTag] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [detectedLanguage, setDetectedLanguage] = useState("");
    const [editorTheme, setEditorTheme] = useState("light");

    // Fetch the snippet data when the component mounts
    useEffect(() => {
        const fetchSnippet = async () => {
            try {
                const response = await fetch(`/api/snippets?id=${id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch snippet");
                }

                const data = await response.json();

                setFormData({
                    title: data.title,
                    code: data.code,
                    language: data.language || "",
                    description: data.description || "",
                    tags: data.tags || []
                });

                setDetectedLanguage(data.language || detectLanguage(data.code));
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching snippet:", err);
                setError("Failed to load snippet. It may have been deleted or you may not have permission to edit it.");
                setIsLoading(false);
            }
        };

        if (session) {
            fetchSnippet();
        }

        // Set editor theme based on system preference
        if (typeof window !== 'undefined') {
            const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setEditorTheme(darkMode ? 'vs-dark' : 'light');

            // Listen for changes in color scheme preference
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e) => {
                setEditorTheme(e.matches ? 'vs-dark' : 'light');
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [id, session]);

    // Detect language as user types code
    useEffect(() => {
        if (formData.code) {
            const detected = detectLanguage(formData.code);
            setDetectedLanguage(detected);
        } else {
            setDetectedLanguage("");
        }
    }, [formData.code]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle Monaco Editor code changes
    const handleEditorChange = (value) => {
        setFormData(prevState => ({
            ...prevState,
            code: value
        }));
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prevState => ({
                ...prevState,
                tags: [...prevState.tags, newTag.trim()]
            }));
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prevState => ({
            ...prevState,
            tags: prevState.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.title || !formData.code) {
            setError("Title and code are required");
            return;
        }

        setIsSubmitting(true);

        try {
            // Use the detected language if none is selected
            const snippetData = {
                ...formData,
                id,
                language: formData.language || detectedLanguage
            };

            const response = await fetch(`/api/snippets`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(snippetData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update snippet");
            }

            // Redirect to dashboard on success
            router.push("/dashboard");
            router.refresh();

        } catch (err) {
            setError(err.message || "An error occurred while updating the snippet");
            console.error("Error updating snippet:", err);
        } finally {
            setIsSubmitting(false);
        }
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Snippet</h1>
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

            {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-400 text-red-800 dark:text-red-300 rounded-md p-4">
                    <div className="flex">
                        <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Snippet Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200"
                        placeholder="A descriptive title for your snippet"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Code <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-300 dark:border-gray-600 rounded-md shadow-md overflow-hidden">
                        <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 px-4 py-2 flex justify-between items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formData.language || detectedLanguage || "plaintext"}
                            </span>
                            <div className="flex space-x-1">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                        <Editor
                            height="400px"
                            language={formData.language || detectedLanguage || "plaintext"}
                            value={formData.code}
                            onChange={handleEditorChange}
                            theme={editorTheme}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 2,
                                wordWrap: "on",
                                lineNumbers: "on",
                                folding: true,
                                renderLineHighlight: 'all'
                            }}
                            className="monaco-editor-enhanced"
                        />
                    </div>
                    {detectedLanguage && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            Detected language: <span className="font-semibold ml-1">{detectedLanguage}</span>
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Language
                    </label>
                    <div className="relative mt-1">
                        <select
                            id="language"
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white appearance-none cursor-pointer transition-colors duration-200 pr-10"
                        >
                            {languageOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description (optional)
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200"
                        placeholder="Add a description of what this code does"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags (optional)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {formData.tags.map(tag => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-100 dark:border-blue-800"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-100 cursor-pointer transition-colors duration-200"
                                >
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="sr-only">Remove tag</span>
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200"
                            placeholder="Add a tag"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add
                        </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Tags help organize your snippets.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200 cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>

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