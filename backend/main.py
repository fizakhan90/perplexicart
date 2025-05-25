from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import requests
import json # For logging payloads and potential decode errors

load_dotenv() # Make sure this is called to load your .env file

app = FastAPI()

# ---CORS Middleware ---
origins = [
    "http://localhost:3000", # Default Next.js dev port
    "localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class QueryRequest(BaseModel): # <<<< ADD THIS BACK
    query: str
    priority: str # e.g., "best_value", "eco_friendly"

class Source(BaseModel):
    title: str | None = None
    url: str
    snippet: str | None = None

class ProductInsight(BaseModel):
    product_name: str
    reasoning_summary: str
    value_alignment_details: str
    pros: list[str]
    cons: list[str]
    priority_match_analysis: str
    key_specifications: dict[str, str] | None = None
    estimated_price_range: str | None = None
    user_sentiment_summary: str | None = None
    cited_sources: list[Source]

class AdviceResponse(BaseModel):
    recommendations: list[ProductInsight]
    overall_search_summary: str
    tradeoffs_explained: str | None = None
    general_tips: list[str] | None = None

# --- Perplexity API Configuration ---
PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions"

# --- Perplexity API Call Logic ---
async def call_perplexity_api(user_query: str, user_priority: str, api_key: str) -> AdviceResponse | None:
    system_prompt = (
        "You are an expert shopping advisor named BuyWise. Your goal is to help users make smarter, "
        "value-aligned purchases. The user will provide a query and a priority (e.g., best_value, "
        "eco_friendly, ethical_brands, long-term_durability). Your response MUST be a JSON object "
        "that strictly adheres to the provided JSON schema. Provide 1 to 3 top recommendations. "
        "For each recommendation, detail its pros, cons, key specifications relevant to the query, "
        "and specifically analyze how it matches the user's stated priority, including any tradeoffs. "
        "If possible, include an estimated price range and a summary of user sentiment from online sources. "
        "Crucially, for all factual claims, pros, cons, sentiments, and priority alignments, "
        "provide specific cited_sources with a title, URL, and a relevant snippet from the source. "
        "Be comprehensive and objective."
    )

    user_content = (
        f"I am looking for advice on purchasing: '{user_query}'. "
        f"My primary priority is '{user_priority}'. "
        f"Please provide your expert advice structured according to the JSON schema."
    )

    json_schema_for_perplexity = {"schema": AdviceResponse.model_json_schema()}

    payload = {
        "model": "sonar-medium-online", # Or "sonar-small-online" for faster, cheaper initial tests
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": json_schema_for_perplexity,
        },
        # "temperature": 0.7, # Optional: experiment with this
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    try:
        # print(f"Calling Perplexity API. Payload: {json.dumps(payload, indent=2)}") # Useful for debugging
        response = requests.post(PERPLEXITY_API_URL, headers=headers, json=payload, timeout=90) # Increased timeout
        response.raise_for_status()

        response_data = response.json()
        # print(f"Raw Perplexity response: {json.dumps(response_data, indent=2)}") # Useful for debugging

        json_string_from_perplexity = response_data["choices"][0]["message"]["content"]
        # print(f"JSON string from Perplexity: {json_string_from_perplexity}") # Useful for debugging

        # If using a reasoning model (e.g., sonar-reasoning-pro), you'd parse out the <think> block here.
        # For sonar-medium-online, it should directly be JSON (or try to be).

        parsed_advice = AdviceResponse.model_validate_json(json_string_from_perplexity)
        return parsed_advice

    except requests.exceptions.Timeout:
        print("Perplexity API request timed out.")
        raise HTTPException(status_code=504, detail="Perplexity API request timed out. This can happen with new schemas. Please try again.")
    except requests.exceptions.HTTPError as e:
        error_detail = f"Perplexity API HTTP error: {e.response.status_code}"
        try:
            error_detail += f" - {e.response.json()}" # Try to get JSON error message
        except json.JSONDecodeError:
            error_detail += f" - {e.response.text}" # Fallback to text
        print(error_detail)
        raise HTTPException(status_code=e.response.status_code, detail=error_detail)
    except (json.JSONDecodeError, KeyError, IndexError, TypeError) as e:
        # Catch errors if Perplexity response isn't as expected or Pydantic validation fails
        error_msg = f"Error decoding/validating Perplexity response: {str(e)}"
        # Log the problematic content if possible
        # problematic_content = response_data["choices"][0]["message"]["content"] if 'response_data' in locals() and response_data.get("choices") else "Unknown content"
        # print(f"{error_msg}. Problematic content: {problematic_content}")
        # raise HTTPException(status_code=500, detail=f"{error_msg}. See server logs for problematic content.")
        # For hackathon, more direct error might be okay:
        raw_content_for_error = "Could not retrieve raw content for error"
        if 'response_data' in locals() and response_data and response_data.get("choices") and response_data["choices"]:
            raw_content_for_error = response_data["choices"][0]["message"]["content"]
        print(f"Error processing Perplexity response: {e}. Raw content from Perplexity: {raw_content_for_error}")
        raise HTTPException(status_code=500, detail=f"Error processing response from Perplexity. The AI's output did not match the expected format. Details: {str(e)}")

    except Exception as e:
        print(f"An unexpected error occurred in call_perplexity_api: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected server error occurred: {str(e)}")


# --- API Endpoints ---
@app.get("/")
async def read_root():
    return {"message": "BuyWise Backend is running!"}

@app.post("/api/get-advice", response_model=AdviceResponse)
async def get_advice(request: QueryRequest): # QueryRequest is now defined
    user_query = request.query
    user_priority = request.priority
    perplexity_api_key = os.getenv("PERPLEXITY_API_KEY")

    if not perplexity_api_key:
        print("ERROR: PERPLEXITY_API_KEY not found in environment variables.")
        raise HTTPException(status_code=500, detail="API Key for Perplexity not configured on the server.")

    print(f"Received query: '{user_query}', Priority: '{user_priority}'")

    try:
        advice_response = await call_perplexity_api(user_query, user_priority, perplexity_api_key)
        # The call_perplexity_api function now raises HTTPExceptions on error or returns valid AdviceResponse
        return advice_response # FastAPI will automatically handle if advice_response is None due to an unhandled case
                               # but call_perplexity_api should raise exceptions for error states.
    except HTTPException:
        raise # Re-raise HTTPExceptions that were raised by call_perplexity_api
    except Exception as e: # Catch any other unexpected errors
        print(f"Unexpected error in get_advice endpoint: {e}")
        raise HTTPException(status_code=500, detail="An unexpected internal server error occurred.")