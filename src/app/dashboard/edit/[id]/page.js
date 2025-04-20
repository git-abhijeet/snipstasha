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
                <div className="flex items-center justify-center h-64">
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
                    className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    ← Back to Dashboard
                </Link>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-400 text-red-800 dark:text-red-300 rounded-md p-4">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                        placeholder="A descriptive title for your snippet"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Code <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm overflow-hidden">
                        <Editor
                            height="400px"
                            language={formData.language || detectedLanguage || "plaintext"}
                            value={formData.code}
                            onChange={handleEditorChange}
                            theme={typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'light'}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 2,
                                wordWrap: "on"
                            }}
                        />
                    </div>
                    {detectedLanguage && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Detected language: <span className="font-semibold">{detectedLanguage}</span>
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Language
                    </label>
                    <select
                        id="language"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                    >
                        {languageOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                        placeholder="Add a description of what this code does"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags (optional)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map(tag => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-100"
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
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                            placeholder="Add a tag"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Add
                        </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Tags help organize your snippets.
                    </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}