"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Editor from "@monaco-editor/react";
import { detectLanguage, autoCategorizeTags } from "@/utils/snippetUtils";

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

export default function EditSnippetPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        code: "",
        language: "",
        description: "",
        tags: []
    });

    const [originalSnippet, setOriginalSnippet] = useState(null);
    const [newTag, setNewTag] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [detectedLanguage, setDetectedLanguage] = useState("");

    // NEW AI-RELATED STATE
    const [aiSuggestions, setAiSuggestions] = useState(null);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiTags, setAiTags] = useState([]);
    const [showAIPanel, setShowAIPanel] = useState(false);
    const [hasCodeChanged, setHasCodeChanged] = useState(false);
    const [showAIComparison, setShowAIComparison] = useState(false);

    useEffect(() => {
        if (id && session) {
            fetchSnippet();
        }
    }, [id, session]);

    // Detect language as user types code
    useEffect(() => {
        if (formData.code && formData.language === "") {
            const detected = detectLanguage(formData.code);
            setDetectedLanguage(detected);
        }
    }, [formData.code]);

    // Check if code has changed for AI re-analysis
    useEffect(() => {
        if (originalSnippet && formData.code !== originalSnippet.code) {
            setHasCodeChanged(true);
        } else {
            setHasCodeChanged(false);
        }
    }, [formData.code, originalSnippet]);

    const fetchSnippet = async () => {
        try {
            const response = await fetch(`/api/snippets?id=${id}`);

            if (response.ok) {
                const snippet = await response.json();
                setOriginalSnippet(snippet);
                setFormData({
                    title: snippet.title,
                    code: snippet.code,
                    language: snippet.language,
                    description: snippet.description || "",
                    tags: snippet.tags || []
                });

                // Load existing AI data
                if (snippet.aiAnalysis) {
                    setAiSuggestions(snippet.aiAnalysis);
                }
                if (snippet.aiTags) {
                    setAiTags(snippet.aiTags);
                }
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle Monaco Editor code changes
    const handleEditorChange = (value) => {
        setFormData(prev => ({
            ...prev,
            code: value || ""
        }));
    };

    // NEW AI FUNCTIONS
    const generateAITags = async () => {
        if (!formData.code.trim()) {
            alert("Please enter some code first");
            return;
        }

        setIsGeneratingAI(true);
        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'tags',
                    code: formData.code,
                    language: formData.language || detectedLanguage
                })
            });

            const data = await response.json();
            if (data.success) {
                setAiTags(data.result);
                setShowAIPanel(true);
            } else {
                console.error('AI tag generation failed:', data.error);
            }
        } catch (error) {
            console.error('Error generating AI tags:', error);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const analyzeCodeWithAI = async () => {
        if (!formData.code.trim()) {
            alert("Please enter some code first");
            return;
        }

        setIsGeneratingAI(true);
        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'analyze',
                    code: formData.code,
                    language: formData.language || detectedLanguage
                })
            });

            const data = await response.json();
            if (data.success) {
                setAiSuggestions(data.result);
                setShowAIPanel(true);
                setShowAIComparison(true);
            } else {
                console.error('AI analysis failed:', data.error);
            }
        } catch (error) {
            console.error('Error analyzing code:', error);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const addAITag = (tag) => {
        if (!formData.tags.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag]
            }));
        }
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!session) {
            setError("You must be logged in to edit snippets");
            return;
        }

        if (!formData.title.trim() || !formData.code.trim()) {
            setError("Title and code are required");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const finalLanguage = formData.language || detectedLanguage || "text";
            const finalTags = formData.tags.length > 0 ? formData.tags : autoCategorizeTags(formData.code, finalLanguage);

            // If code changed and we have new AI analysis, include it
            let updateData = {
                id: id,
                title: formData.title,
                code: formData.code,
                language: finalLanguage,
                description: formData.description,
                tags: finalTags
            };

            // Include AI data if code changed or if we have new analysis
            if (hasCodeChanged || aiSuggestions !== originalSnippet?.aiAnalysis) {
                updateData.aiAnalysis = aiSuggestions;
                updateData.qualityScore = aiSuggestions?.qualityScore || null;
            }

            if (aiTags.length > 0 && JSON.stringify(aiTags) !== JSON.stringify(originalSnippet?.aiTags)) {
                updateData.aiTags = aiTags;
            }

            // Generate fresh AI explanation if code changed significantly
            if (hasCodeChanged && formData.code.trim()) {
                try {
                    const explanationResponse = await fetch('/api/ai', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'explain',
                            code: formData.code,
                            language: finalLanguage
                        })
                    });
                    const explanationData = await explanationResponse.json();
                    if (explanationData.success) {
                        updateData.aiExplanation = explanationData.result;
                    }
                } catch (err) {
                    console.log('AI explanation failed, continuing without it');
                }
            }

            const response = await fetch("/api/snippets", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                router.push(`/dashboard/view/${id}`);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to update snippet");
            }
        } catch (error) {
            console.error("Error updating snippet:", error);
            setError("An error occurred while updating the snippet");
        } finally {
            setIsSubmitting(false);
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

    if (error && !originalSnippet) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Snippet
                    </h1>
                    <div className="flex gap-2">
                        {hasCodeChanged && (
                            <div className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                                ⚠️ Code changed - consider re-analyzing
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={generateAITags}
                            disabled={isGeneratingAI || !formData.code.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isGeneratingAI ? (
                                <>🔄 Generating...</>
                            ) : (
                                <>🤖 Update AI Tags</>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={analyzeCodeWithAI}
                            disabled={isGeneratingAI || !formData.code.trim()}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isGeneratingAI ? (
                                <>🔄 Analyzing...</>
                            ) : (
                                <>🔍 Re-analyze Code</>
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* AI Comparison Panel */}
                {showAIComparison && originalSnippet?.aiAnalysis && aiSuggestions && (
                    <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            🆚 AI Analysis Comparison
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Previous Analysis
                                </h4>
                                <div className="bg-white dark:bg-gray-800 rounded p-3">
                                    <div className="text-sm">
                                        Quality: {originalSnippet.aiAnalysis.qualityScore || 'N/A'}/10
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {originalSnippet.aiAnalysis.improvements?.length || 0} improvements suggested
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New Analysis
                                </h4>
                                <div className="bg-white dark:bg-gray-800 rounded p-3">
                                    <div className="text-sm">
                                        Quality: {aiSuggestions.qualityScore || 'N/A'}/10
                                        {aiSuggestions.qualityScore > (originalSnippet.aiAnalysis.qualityScore || 0) && (
                                            <span className="ml-2 text-green-600">📈</span>
                                        )}
                                        {aiSuggestions.qualityScore < (originalSnippet.aiAnalysis.qualityScore || 0) && (
                                            <span className="ml-2 text-red-600">📉</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {aiSuggestions.improvements?.length || 0} improvements suggested
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowAIComparison(false)}
                            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
                        >
                            Hide comparison
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Enter snippet title"
                        />
                    </div>

                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Language
                        </label>
                        <select
                            id="language"
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            {languageOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {detectedLanguage && !formData.language && (
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                Detected: {detectedLanguage}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Code *
                        </label>
                        <div className="border border-gray-300 rounded-md overflow-hidden">
                            <Editor
                                height="400px"
                                language={formData.language || detectedLanguage || "javascript"}
                                value={formData.code}
                                onChange={handleEditorChange}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: "on",
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true
                                }}
                            />
                        </div>
                    </div>

                    {/* AI Suggestions Panel */}
                    {showAIPanel && (aiSuggestions || aiTags.length > 0) && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    🤖 Updated AI Suggestions
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowAIPanel(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            {aiTags.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                                        Updated AI Tags:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {aiTags.map((tag, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => addAITag(tag)}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                                            >
                                                + {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {aiSuggestions && (
                                <div>
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                                        Updated Quality Score: {aiSuggestions.qualityScore}/10
                                        {originalSnippet?.qualityScore && (
                                            <span className={`ml-2 text-sm ${aiSuggestions.qualityScore > originalSnippet.qualityScore
                                                    ? 'text-green-600'
                                                    : aiSuggestions.qualityScore < originalSnippet.qualityScore
                                                        ? 'text-red-600'
                                                        : 'text-gray-600'
                                                }`}>
                                                ({aiSuggestions.qualityScore > originalSnippet.qualityScore ? '+' : ''}
                                                {aiSuggestions.qualityScore - originalSnippet.qualityScore})
                                            </span>
                                        )}
                                    </h4>

                                    {aiSuggestions.improvements?.length > 0 && (
                                        <div className="mb-3">
                                            <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                New Improvements:
                                            </h5>
                                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                                                {aiSuggestions.improvements.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {aiSuggestions.security?.length > 0 && (
                                        <div className="mb-3">
                                            <h5 className="font-medium text-red-700 dark:text-red-400 mb-1">
                                                Security Issues:
                                            </h5>
                                            <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
                                                {aiSuggestions.security.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Enter snippet description"
                        />
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tags
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Add a tag"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Updating..." : "Update Snippet"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push(`/dashboard/view/${id}`)}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}