"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <header className="sticky top-0 w-full bg-white dark:bg-gray-900 shadow-sm z-10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <div className="h-8 w-8 mr-2">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-blue-600">
                                    <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M19.5 15.75l-7.5 7.5-7.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="font-bold text-xl text-gray-900 dark:text-white">SnipStash</span>
                        </Link>

                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                href="/"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/'
                                        ? 'border-blue-500 text-gray-900 dark:text-white'
                                        : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                                    }`}
                            >
                                Home
                            </Link>

                            {isAuthenticated && (
                                <Link
                                    href="/dashboard"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/dashboard' || pathname.startsWith('/dashboard/')
                                            ? 'border-blue-500 text-gray-900 dark:text-white'
                                            : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {session.user.name}
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/login'
                                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                                            : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    Log in
                                </Link>

                                <Link
                                    href="/signup"
                                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div className="sm:hidden" id="mobile-menu">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="/"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/'
                                    ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-gray-800 dark:text-white'
                                    : 'border-transparent text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                }`}
                        >
                            Home
                        </Link>

                        {isAuthenticated && (
                            <Link
                                href="/dashboard"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/dashboard' || pathname.startsWith('/dashboard/')
                                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-gray-800 dark:text-white'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`}
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>

                    <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                        {isAuthenticated ? (
                            <div className="space-y-1">
                                <div className="px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300">
                                    {session.user.name}
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <Link
                                    href="/login"
                                    className={`block px-4 py-2 text-base font-medium ${pathname === '/login'
                                            ? 'bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-white'
                                            : 'text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    Log in
                                </Link>

                                <Link
                                    href="/signup"
                                    className="block px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}