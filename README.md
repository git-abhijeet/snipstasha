# SnipStash - Code Snippet Organizer with Smart Categorization

SnipStash is a powerful web application that helps developers save, categorize, and organize code snippets. The app automatically analyzes your code to tag it appropriately, making it easier to find snippets when you need them.

## Features

-   **Save Code Snippets** - Store reusable code snippets with title, description, and language
-   **Smart Auto-Categorization** - Snippets are automatically tagged based on their content
-   **Language Detection** - Automatically identifies programming languages
-   **Search & Filter** - Quickly find snippets by language, tag, or content
-   **User Authentication** - Secure login/signup to manage your personal snippet collection
-   **One-Click Copy** - Easily copy snippets to your clipboard

## Tech Stack

-   **Frontend**: Next.js, React, TailwindCSS
-   **Backend**: Next.js API routes
-   **Database**: MongoDB with Prisma ORM
-   **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

-   Node.js 16.8+ and npm
-   MongoDB database (local or cloud-based MongoDB Atlas)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/snipstash.git
    cd snipstash
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up your environment variables by creating a `.env` file:

    ```
    DATABASE_URL="your-mongodb-connection-string"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-nextauth-secret-key"
    ```

4. Generate Prisma client:

    ```bash
    npx prisma generate
    ```

5. Run the development server:

    ```bash
    npm run dev
    ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Sign Up/Login**: Create an account or log in to access your dashboard
2. **Create a Snippet**: Click "Add New Snippet" on your dashboard
3. **View & Search**: Browse your snippets, filter by language or tag, and search by content
4. **Copy Code**: Use the copy button to quickly grab the code you need

## Smart Categorization

SnipStash uses rule-based pattern matching to automatically identify code characteristics and add relevant tags:

-   **Loops**: Detects `for`, `while`, `foreach`, `.map()`, etc.
-   **API Calls**: Identifies `fetch`, `axios`, `http`, etc.
-   **Error Handling**: Recognizes `try/catch`, `throw`, etc.
-   **Array Operations**: Detects `.filter()`, `.reduce()`, etc.
-   **Many more**: Database operations, authentication, UI code, etc.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

-   Built with Next.js
-   Styled with TailwindCSS
-   Database managed with Prisma
