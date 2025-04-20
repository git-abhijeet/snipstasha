import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Announcement Banner */}
      <div className="bg-blue-700 text-white text-center py-2 px-4">
        <p className="text-sm font-medium">
          ✨ New: Smart language detection and syntax highlighting just launched! <Link href="/signup" className="underline font-bold">Try it now</Link>
        </p>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">Your code snippets,</span>
                <span className="block text-blue-400">intelligently organized</span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                SnipStash automatically categorizes and tags your code snippets so you can find them when you need them. Stop digging through notes and start coding smarter.
              </p>
              <div className="mt-10 flex justify-center lg:justify-start gap-4">
                <Link
                  href="/signup"
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get started for free
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
                  <p className="text-gray-400 text-sm">Developers</p>
                </div>
                <div className="border border-gray-700 rounded-md p-4 bg-gray-800/50">
                  <p className="text-3xl font-bold text-white">1M+</p>
                  <p className="text-gray-400 text-sm">Snippets saved</p>
                </div>
                <div className="border border-gray-700 rounded-md p-4 bg-gray-800/50">
                  <p className="text-3xl font-bold text-white">20+</p>
                  <p className="text-gray-400 text-sm">Languages</p>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:ml-8 relative">
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">NEW</div>
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
                <div className="bg-blue-600 text-white p-2 text-xs flex items-center justify-between">
                  <span>Auto-tagged: API, error handling, fetch, utility</span>
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

      {/* New: Trusted By Section */}
      <section className="py-8 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">TRUSTED BY DEVELOPERS FROM</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-70">
            <div className="h-6 text-gray-400 dark:text-gray-500">Microsoft</div>
            <div className="h-6 text-gray-400 dark:text-gray-500">Google</div>
            <div className="h-6 text-gray-400 dark:text-gray-500">Amazon</div>
            <div className="h-6 text-gray-400 dark:text-gray-500">Meta</div>
            <div className="h-6 text-gray-400 dark:text-gray-500">Stripe</div>
            <div className="h-6 text-gray-400 dark:text-gray-500">Shopify</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Features built for developers
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
              Save time and boost productivity with smart organization for your code snippets.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <div className="h-12 w-12 rounded-md bg-blue-600 text-white flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Smart Auto-Categorization</h3>
              <p className="text-gray-600 dark:text-gray-400">
                SnipStash automatically recognizes code patterns to tag snippets by language, purpose, and functionality without requiring AI.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <div className="h-12 w-12 rounded-md bg-blue-600 text-white flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Powerful Search & Filtering</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Find exactly what you need with powerful search capabilities. Filter by language, tags, or content to locate snippets instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <div className="h-12 w-12 rounded-md bg-blue-600 text-white flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">One-Click Copy</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No more digging through old projects. Copy any snippet directly to your clipboard with a single click and paste it where you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New: Advertisement Banner */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-6 md:mb-0">
            <h3 className="text-xl font-bold">Try SnipStash Premium</h3>
            <p className="mt-1">Unlimited snippets, team sharing, and private collections</p>
          </div>
          <Link href="/signup" className="bg-white text-blue-700 px-6 py-3 rounded-md font-medium hover:bg-blue-50">
            Start 14-day free trial →
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              How SnipStash Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
              Save time with a simple workflow designed for developers.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">1</div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Save your snippet</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Paste your code into SnipStash with a title and optional manual tags.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">2</div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Smart Auto-Categorization</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                SnipStash analyzes your code and automatically adds relevant tags.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">3</div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Find & Use Anywhere</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Search, filter, and copy snippets with a single click whenever you need them.
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
              Loved by developers
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
              See what others are saying about SnipStash
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
                &quot;SnipStash has saved me hours of searching through old projects. The auto-categorization is exactly what I needed.&quot;
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
                &quot;Finally a snippet manager that understands my code! I use SnipStash every day for both personal and team projects.&quot;
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
                &quot;The search functionality is incredible. I can find any snippet in seconds instead of digging through notes or GitHub gists.&quot;
              </p>
              <div className="mt-4 flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to organize your code snippets?
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-blue-100 mx-auto">
            Join thousands of developers who save time with SnipStash.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
            >
              Sign up for free
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              Learn more
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-200">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Features</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Security</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Documentation</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">API</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Guides</Link></li>
                <li><Link href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Help</Link></li>
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
              </Link>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-base text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} SnipStash. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
