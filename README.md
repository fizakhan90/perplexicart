# PerplexiCart: Your AI-Powered Value-Aligned Shopping Advisor

PerplexiCart is a smart shopping assistant that helps users make informed, value-aligned purchasing decisions. Powered by Perplexity's Sonar API, it cuts through online noise to provide tailored recommendations, pros & cons, cited reasoning, and tradeoff analysis based on user queries, chosen priorities (like "Best Value," "Eco-Friendly," "Ethical Brands," "Made in India," or "Long-term Durability"), and specific user context.

**Live Demo:** (https://perplexicart.vercel.app/)


## ✨ Features

*   **AI-Powered Advice:** Get intelligent recommendations beyond simple spec comparisons.
*   **Value-Alignment:** Choose a priority (Best Value, Eco-Friendly, Ethical, Durability, Made in India) to guide the AI's research.
*   **Contextual Understanding:** Provide specific needs (e.g., skin type for skincare, usage patterns for electronics) for more personalized results.
*   **Comprehensive Research:** PerplexiCart, via Perplexity API, searches e-commerce sites, review blogs, forums (like Reddit, Quora), and even sustainability reports.
*   **Structured Insights:** Receive clear breakdowns including:
    *   Overall Research Summary
    *   Top Product Recommendations
    *   Reasoning & Value Alignment for each product
    *   Pros & Cons
    *   Priority Match Analysis
    *   Key Specifications
    *   User Sentiment Summary (including forum insights)
    *   Cited Sources for transparency and further research
    *   Tradeoffs Explained
    *   General Shopping Tips

## 🚀 How PerplexiCart Uses Perplexity Sonar API

PerplexiCart leverages the **Perplexity Sonar API**  as its core intelligence engine.

1.  **Dynamic Prompt Engineering:** The FastAPI backend constructs detailed system and user prompts based on the user's:
    *   Search query (e.g., "vegan sunscreen")
    *   Selected priority (e.g., "eco_friendly", "made_in_india")
    *   Optional user context (e.g., "oily acne-prone skin, living in humid climate")
2.  **Structured JSON Output:** We instruct the Perplexity API to return its findings in a strictly defined JSON schema. This is achieved using the `response_format: { "type": "json_schema", "json_schema": { ... } }` parameter in the API request. The JSON schema is derived from our Pydantic models on the backend.
3.  **Web Search & Synthesis:** The prompt guides Perplexity to:
    *   Search the live web, including e-commerce sites, review platforms, and community forums (Reddit, Quora).
    *   Synthesize information to find suitable products.
    *   Analyze how products align with the user's stated priority and context.
    *   Extract pros, cons, specifications, and user sentiment.
    *   Identify and cite relevant sources for its claims.
4.  **Information Delivery:** The structured JSON response from Perplexity is then parsed by the FastAPI backend and delivered to the Next.js frontend for a rich, user-friendly display.
5.  **Specific Instructions for Priorities:** For priorities like "Made in India," the system prompt is augmented with critical instructions for the AI to actively search for and verify country of origin information, making the advice highly targeted.

This deep integration allows PerplexiCart to provide nuanced, well-researched, and transparent shopping advice that goes far beyond simple keyword matching or pre-canned product lists.

## 🛠️ Tech Stack

*   **Frontend:**
    *   Next.js (React Framework)
    *   TypeScript
    *   Tailwind CSS (Styling)
*   **Backend:**
    *   FastAPI (Python Web Framework)
*   **Deployment:**
    *   Frontend: Vercel
    *   Backend: Render (Dockerized)
*   **Core AI Engine:** Perplexity Sonar API

## ⚙️ Setup & Local Development

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn
*   Python (v3.9 or later recommended)
*   `pip` and `venv`
*   Docker (optional, for local backend container testing)
*   A Perplexity API Key

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/perplexicart.git
    cd perplexicart/backend
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # macOS/Linux
    # venv\Scripts\activate    # Windows
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Create a `.env` file** in the `backend` directory:
    ```env
    PERPLEXITY_API_KEY=your_actual_perplexity_api_key_here
    FRONTEND_URL=http://localhost:3000 # For local CORS
    PERPLEXITY_MODEL=sonar # Or your preferred valid model
    ```
5.  **Run the backend server:**
    ```bash
    uvicorn main:app --reload --port 8000
    ```
    The backend will be available at `http://localhost:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    # From the project root
    cd frontend 
    # Or if already in backend: cd ../frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  **Create a `.env.local` file** in the `frontend` directory:
    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
    ```
4.  **Run the frontend development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The frontend will be available at `http://localhost:3000`.
