# SnipStash - AI-Powered Code Snippet Organizer with Smart Categorization

SnipStash is a powerful web application that helps developers save, categorize, and organize code snippets with AI assistance. The app automatically analyzes your code using Google Gemini AI to provide quality insights, smart tags, explanations, and suggestions, making it easier to find and improve snippets when you need them.

## Features

-   **Save Code Snippets** - Store reusable code snippets with title, description, and language
-   **AI-Powered Code Analysis** - Get quality scores, improvement suggestions, and security insights using Google Gemini AI
-   **Smart AI Tag Generation** - Automatically generate relevant, technical tags for your code snippets
-   **AI Code Explanations** - Get detailed explanations of what your code does in simple terms
-   **Smart Auto-Categorization** - Snippets are automatically tagged based on their content using both AI and rule-based analysis
-   **Language Detection** - Automatically identifies programming languages
-   **AI Quality Comparison** - Compare code quality before and after edits with AI analysis
-   **AI Insights Dashboard** - View overall code quality metrics and language statistics
-   **Enhanced Search & Filter** - Quickly find snippets by language, tag, content, or AI-generated tags
-   **User Authentication** - Secure login/signup to manage your personal snippet collection
-   **One-Click Copy** - Easily copy snippets to your clipboard

## Tech Stack

-   **Frontend**: Next.js, React, TailwindCSS, Monaco Editor
-   **Backend**: Next.js API routes
-   **Database**: MongoDB with Prisma ORM
-   **Authentication**: NextAuth.js
-   **AI Integration**: Google Gemini API

## Getting Started

### Prerequisites

-   Node.js 16.8+ and npm
-   MongoDB database (local or cloud-based MongoDB Atlas)
-   Google Gemini API Key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

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
    GEMINI_API_KEY="your-google-gemini-api-key"
    ```

    DATABASE_URL="mongodb+srv://akc972527:akc972527@clusterswati.73qfujt.mongodb.net/snipstash?retryWrites=true&w=majority&appName=ClusterSwati"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET=snipstash-secret-key-replace-in-production
    GEMINI_API_KEY=AIzaSyArxKd9as8qP42EBOyASHcyC1tOWGrr8Dw

4. Generate Prisma client and update database schema:

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5. Run the development server:

    ```bash
    npm run dev
    ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Sign Up/Login**: Create an account or log in to access your dashboard
2. **Create a Snippet**: Click "Add New Snippet" on your dashboard
3. **AI Features**: Use AI-powered features while creating/editing snippets:
    - **AI Tags**: Generate smart, relevant tags automatically
    - **AI Analysis**: Get code quality scores, improvement suggestions, and security insights
    - **AI Explanation**: Generate detailed explanations of what your code does
4. **View & Search**: Browse your snippets, filter by language, manual tags, or AI-generated tags
5. **AI Insights**: Check your dashboard for overall code quality metrics and statistics
6. **Copy Code**: Use the copy button to quickly grab the code you need

## AI-Powered Features Usage

### Creating Snippets with AI

-   When creating a new snippet, paste your code and click **"AI Tags"** to generate relevant tags
-   Click **"AI Analysis"** to get quality scores, improvements, and best practices suggestions
-   The AI will automatically generate explanations and store quality metrics

### Viewing AI Analysis

-   Open any snippet to see AI analysis results including:
    -   **Quality Score** (1-10 scale)
    -   **Improvement Suggestions**
    -   **Security Vulnerabilities**
    -   **Performance Optimizations**
    -   **Best Practices**
-   Generate fresh explanations anytime with **"Generate New Explanation"**

### Editing with AI Comparison

-   When editing snippets, the AI can compare your changes
-   See quality score improvements/degradations
-   Get updated analysis for modified code

### Dashboard AI Insights

-   View overall code quality metrics
-   See average quality scores across languages
-   Track AI analysis coverage of your snippets

## Smart Categorization

SnipStash uses both AI-powered analysis and rule-based pattern matching to automatically identify code characteristics and add relevant tags:

### AI-Powered Analysis (Google Gemini)

-   **Intelligent Tag Generation**: Analyzes code context to generate specific, technical tags
-   **Quality Assessment**: Provides 1-10 quality scores based on best practices
-   **Security Analysis**: Identifies potential security vulnerabilities
-   **Performance Insights**: Suggests performance optimizations
-   **Code Explanations**: Generates human-readable explanations of code functionality

### Rule-Based Pattern Matching

-   **Loops**: Detects `for`, `while`, `foreach`, `.map()`, etc.
-   **API Calls**: Identifies `fetch`, `axios`, `http`, etc.
-   **Error Handling**: Recognizes `try/catch`, `throw`, etc.
-   **Array Operations**: Detects `.filter()`, `.reduce()`, etc.
-   **Database Operations**: SQL queries, ORM methods, etc.
-   **Authentication**: Login, JWT, OAuth patterns, etc.
-   **UI Components**: React, Vue, Angular patterns, etc.

## Database Schema

The application stores AI-generated data alongside your snippets:

```prisma
model Snippet {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  title           String
  code            String
  language        String
  description     String?
  tags            String[]

  // AI-Enhanced Fields
  aiAnalysis      Json?     // Store AI analysis results
  aiTags          String[]  // AI-generated tags
  aiExplanation   String?   // AI explanation of the code
  qualityScore    Int?      // AI-generated quality score (1-10)

  userId          String   @db.ObjectId
  user            User     @relation(fields: [userId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

-   Built with Next.js
-   Styled with TailwindCSS
-   Database managed with Prisma
