import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 text-white text-center py-2 px-4">
        <p className="text-sm font-medium">
          🤖 New: AI-powered snippet analysis and intelligent code suggestions! <Link href="/signup" className="underline font-bold">Try it now</Link>
        </p>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">Your code snippets,</span>
                <span className="block text-blue-400">AI-powered organization</span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                SnipStash uses advanced AI to automatically categorize, analyze, and enhance your code snippets. Stop digging through notes and start coding smarter with intelligent insights.
              </p>
              <div className="mt-6 flex items-center justify-center lg:justify-start space-x-2 text-sm text-blue-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">Powered by Advanced AI Technology</span>
              </div>
              <div className="mt-10 flex justify-center lg:justify-start gap-4">
                <Link
                  href="/signup"
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Experience AI Magic
                </Link>
                <Link
                  href="#features"
                  className="px-8 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-200 bg-transparent hover:bg-gray-700 md:py-4 md:text-lg md:px-10"
                >
                  Learn more
                </Link>
              </div>

              {/* New: GitHub-style stats */}
              <div className="mt-10 grid grid-cols-3 gap-5 max-w-lg mx-auto lg:mx-0">
                <div className="border border-gray-700 rounded-md p-4 bg-gray-800/50">
                  <p className="text-3xl font-bold text-white">10k+</p>
                  <p className="text-gray-400 text-sm">AI-Enhanced Snippets</p>
                </div>
                <div className="border border-gray-700 rounded-md p-4 bg-gray-800/50">
                  <p className="text-3xl font-bold text-white">95%</p>
                  <p className="text-gray-400 text-sm">AI Accuracy</p>
                </div>
                <div className="border border-gray-700 rounded-md p-4 bg-gray-800/50">
                  <p className="text-3xl font-bold text-white">20+</p>
                  <p className="text-gray-400 text-sm">Languages</p>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:ml-8 relative">
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full animate-pulse">
                🤖 AI-POWERED
              </div>
              <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full max-w-lg mx-auto border border-gray-700">
                <div className="bg-gray-900 h-8 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center text-xs text-gray-400">snippet.js</div>
                </div>
                <pre className="p-4 text-green-400 font-mono text-sm overflow-x-auto">
                  <code>
                    {`// A smart fetch wrapper with error handling
const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};`}
                  </code>
                </pre>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 text-xs flex items-center justify-between">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    AI-tagged: API, error handling, fetch, utility
                  </span>
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                    Copy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New: AI-Powered Badge Section */}
      <section className="py-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">AI-Powered Intelligence</span>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-medium">TRUSTED BY DEVELOPERS FROM</p>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 opacity-70 mt-4 md:mt-0">
              <div className="h-6 text-gray-400 dark:text-gray-500">Microsoft</div>
              <div className="h-6 text-gray-400 dark:text-gray-500">Google</div>
              <div className="h-6 text-gray-400 dark:text-gray-500">Amazon</div>
              <div className="h-6 text-gray-400 dark:text-gray-500">Meta</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              AI-Enhanced Features for Developers
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
              Experience the future of code organization with intelligent AI that understands your development workflow.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <div className="h-12 w-12 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI-Powered Auto-Categorization</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced machine learning algorithms analyze your code patterns to automatically tag snippets by language, purpose, and functionality with 95% accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <div className="h-12 w-12 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Intelligent Search & Discovery</h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI-enhanced search understands context and intent. Find snippets using natural language queries like "authentication middleware" or "async error handling".
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <div className="h-12 w-12 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Smart Code Suggestions</h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI analyzes your snippets to suggest improvements, detect best practices, and recommend similar code patterns from your library.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New: Advertisement Banner */}
      <section className="bg-gradient-to-r from-blue-700 via-purple-700 to-blue-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-6 md:mb-0">
            <h3 className="text-xl font-bold flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              SnipStash AI Premium
            </h3>
            <p className="mt-1">Advanced AI features, unlimited snippets, and intelligent code insights</p>
          </div>
          <Link href="/signup" className="bg-white text-blue-700 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transform hover:scale-105 transition-all duration-200">
            Unlock AI Power →
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              How AI Transforms Your Workflow
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
              Experience intelligent code organization that learns from your patterns.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center text-xl font-bold">1</div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Save your snippet</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Paste your code into SnipStash. Our AI instantly analyzes it for patterns and context.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center text-xl font-bold">2</div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">AI Intelligence at Work</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Advanced algorithms automatically categorize, tag, and enhance your snippet with intelligent metadata.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center text-xl font-bold">3</div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Intelligent Discovery</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Find exactly what you need with AI-powered search that understands intent and suggests related snippets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New: Testimonials Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Loved by developers worldwide
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
              See what others are saying about SnipStash AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Sarah Chen</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Senior Frontend Developer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                &quot;The AI categorization is incredible! It understands my React patterns better than I expected. SnipStash has become my development companion.&quot;
              </p>
              <div className="mt-4 flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Michael Rodriguez</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full-stack Engineer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                &quot;The AI-powered search is game-changing! I can find complex algorithms using natural language. It's like having an intelligent coding assistant.&quot;
              </p>
              <div className="mt-4 flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Emma Thompson</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Backend Developer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                &quot;SnipStash AI suggests improvements to my code patterns and helps me discover better implementations. It's revolutionized my workflow!&quot;
              </p>
              <div className="mt-4 flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to experience AI-powered code organization?
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-blue-100 mx-auto">
            Join thousands of developers who are coding smarter with SnipStash AI.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transform hover:scale-105 transition-all duration-200"
            >
              Start with AI for free
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              Explore AI features
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-200">No credit card required • AI-powered from day one</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">AI Features</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Security</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-4">AI Technology</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">How it Works</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">AI Models</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Accuracy</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Research</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Blog</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Careers</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Terms</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <Link href="/" className="flex items-center">
                <div className="h-8 w-8 mr-2">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-blue-600">
                    <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19.5 15.75l-7.5 7.5-7.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">SnipStash</span>
                <span className="ml-2 text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-full">AI</span>
              </Link>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-base text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} SnipStash AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
