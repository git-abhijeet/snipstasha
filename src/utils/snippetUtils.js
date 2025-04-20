/**
 * Auto-categorize code snippets based on content patterns
 * @param {string} code - The code snippet content
 * @param {string} language - The programming language
 * @returns {string[]} - Array of auto-generated tags
 */
export function autoCategorizeTags(code, language) {
    const tags = [];
    const lowerCode = code.toLowerCase();

    // Add language as a tag
    if (language) {
        tags.push(language.toLowerCase());
    }

    // Detect loops
    if (
        lowerCode.includes('for (') ||
        lowerCode.includes('while (') ||
        lowerCode.includes('foreach') ||
        lowerCode.includes(' map(') ||
        lowerCode.includes('.map(') ||
        lowerCode.includes('for ') && lowerCode.includes(' in ')
    ) {
        tags.push('loop');
    }

    // Detect API calls
    if (
        lowerCode.includes('fetch(') ||
        lowerCode.includes('axios.') ||
        lowerCode.includes('http.') ||
        lowerCode.includes('xmlhttprequest') ||
        lowerCode.includes('ajax') ||
        lowerCode.includes('api') ||
        lowerCode.includes('request(')
    ) {
        tags.push('api');
    }

    // Detect error handling
    if (
        lowerCode.includes('try ') && lowerCode.includes('catch') ||
        lowerCode.includes('throw ') ||
        lowerCode.includes('error') ||
        lowerCode.includes('exception') ||
        lowerCode.includes('finally')
    ) {
        tags.push('error handling');
    }

    // Detect array operations
    if (
        lowerCode.includes('.map(') ||
        lowerCode.includes('.filter(') ||
        lowerCode.includes('.reduce(') ||
        lowerCode.includes('.forEach(') ||
        lowerCode.includes('.some(') ||
        lowerCode.includes('.every(') ||
        lowerCode.includes('[') && lowerCode.includes(']')
    ) {
        tags.push('array');
    }

    // Detect debugging
    if (
        lowerCode.includes('console.log') ||
        lowerCode.includes('print(') ||
        lowerCode.includes('debug') ||
        lowerCode.includes('logger')
    ) {
        tags.push('debugging');
    }

    // Detect authentication
    if (
        lowerCode.includes('auth') ||
        lowerCode.includes('login') ||
        lowerCode.includes('password') ||
        lowerCode.includes('token') ||
        lowerCode.includes('jwt') ||
        lowerCode.includes('session')
    ) {
        tags.push('authentication');
    }

    // Detect database operations
    if (
        lowerCode.includes('select ') ||
        lowerCode.includes('insert ') ||
        lowerCode.includes('update ') ||
        lowerCode.includes('delete ') ||
        lowerCode.includes('from ') ||
        lowerCode.includes('where ') ||
        lowerCode.includes('mongo') ||
        lowerCode.includes('sql') ||
        lowerCode.includes('query') ||
        lowerCode.includes('database')
    ) {
        tags.push('database');
    }

    // Detect utility functions
    if (
        lowerCode.includes('util') ||
        lowerCode.includes('helper') ||
        lowerCode.includes('function ') ||
        lowerCode.includes('const ') && lowerCode.includes(' = (') ||
        lowerCode.includes('const ') && lowerCode.includes(' => ')
    ) {
        tags.push('utility');
    }

    // Detect UI/rendering code
    if (
        lowerCode.includes('component') ||
        lowerCode.includes('render') ||
        lowerCode.includes('react') ||
        lowerCode.includes('vue') ||
        lowerCode.includes('dom') ||
        lowerCode.includes('html') ||
        lowerCode.includes('css')
    ) {
        tags.push('ui');
    }

    // Detect data transformation
    if (
        lowerCode.includes('json') ||
        lowerCode.includes('parse') ||
        lowerCode.includes('stringify') ||
        lowerCode.includes('transform') ||
        lowerCode.includes('convert')
    ) {
        tags.push('data transformation');
    }

    // Return unique tags
    return [...new Set(tags)];
}

/**
 * Detect the programming language based on code content
 * @param {string} code - The code snippet
 * @returns {string} - Detected language or 'Text'
 */
export function detectLanguage(code) {
    const patterns = {
        'javascript': /var |let |const |function |async |await |=>/,
        'typescript': /interface |type |class .+{|export |import |<.+>/,
        'python': /def |import |from .+ import|elif |elif:|except:|if __name__ == "__main__":/,
        'html': /<html|<div|<body|<head|<script|<!DOCTYPE html>/i,
        'css': /body {|margin:|padding:|@media|background-color:/,
        'java': /public class |public static void main|private|protected|extends |implements /,
        'c#': /namespace |using System|class .+{|public static void|Console.WriteLine/,
        'php': /<\?php|\$_GET|\$_POST|\$_SERVER|echo /,
        'ruby': /def |end|require |puts |attr_accessor/,
        'sql': /SELECT |INSERT |UPDATE |DELETE |FROM |JOIN |WHERE |GROUP BY|ORDER BY/i,
        'bash': /#!/,
        'go': /func |import \(|package main|fmt\./,
    };

    for (const [language, pattern] of Object.entries(patterns)) {
        if (pattern.test(code)) {
            return language;
        }
    }

    return 'text';
}