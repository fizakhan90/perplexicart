from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import requests
import json

load_dotenv() 

app = FastAPI()
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
deployed_frontend_url = "https://perplexicart-kldqbbzuh-fizakhan90s-projects.vercel.app"

origins_list = [
    "http://localhost:3000",
    "localhost:3000", 
    deployed_frontend_url
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],


)

# --- Pydantic Models ---
class QueryRequest(BaseModel): 
    query: str
    priority: str
    user_context: str | None = None

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


PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions"
PERPLEXITY_MODEL = os.getenv("PERPLEXITY_MODEL", "sonar") 


# --- Perplexity API Call Logic ---
async def call_perplexity_api(
    user_query: str, 
    user_priority: str, 
    api_key: str, 
    user_context_from_request: str | None = None
) -> AdviceResponse | None:
    
    system_prompt_core = (
        "You are an expert shopping advisor named PerplexiCart. Your primary goal is to help users make "
        "smarter, value-aligned purchases based on their query, chosen priority, AND any specific user context "
        "they provide (such as skin type, specific concerns, location, budget details, etc.). Your advice should be actionable and empower confident decisions. "
        "Your response MUST be a JSON object adhering strictly to the provided JSON schema. "
        "For each recommendation, you MUST analyze how it aligns with BOTH the user's priority AND their "
        "specific context. In your 'reasoning_summary' and 'value_alignment_details', clearly explain *how* specific product features address these user needs. "
        "Highlight pros, cons, or user sentiments that are particularly relevant to this context. "
        "For example, if the user mentions oily skin, focus on how suitable the product is for oily skin. "
        "When researching, actively seek out and synthesize user experiences and discussions from community forums "
        "like Reddit (e.g., relevant subreddits like r/IndianSkincareAddicts, r/VeganBeauty, or product-specific subreddits) "
        "and Q&A platforms like Quora. Use forum data primarily for user sentiment, real-world experiences, and context-specific suitability. "
        "In the 'user_sentiment_summary' field for each product, incorporate a summary of what real users are discussing on these forums, "
        "especially if their experiences relate to the user's query, priority, or provided context. "
        "If you find highly relevant and informative forum threads or Quora answers, include them in 'cited_sources'. "
        "If a specific, concise quote or commonly expressed sentiment from a forum vividly illustrates a key pro/con or is "
        "highly relevant to the user's context, you may include a paraphrased version or short direct quote within the "
        "'user_sentiment_summary', or as a pro/con, using phrases like 'Forum users on [Platform/Subreddit] often mention...' to note its anecdotal origin. "
        "Always cite your sources for key claims and product information, prioritizing reputable review sites or official pages for factual data. "
        "If you cannot find products that perfectly match all criteria, clearly state the limitations or tradeoffs the user would need to consider. If information is highly conflicting, acknowledge this."
    )

    made_in_india_instructions = ""
    if user_priority == "made_in_india":
        made_in_india_instructions = (
            " CRITICAL INSTRUCTION FOR 'made_in_india' PRIORITY: "
            "You MUST actively search for and prioritize products that are verifiably manufactured, assembled, or primarily sourced within India. "
            "Look for definitive information on product descriptions, brand websites (e.g., 'About Us' pages, manufacturing details), 'Country of Origin' labels on e-commerce sites (like Amazon.in, Flipkart), and articles discussing Indian manufacturing for this product category. "
            "For each recommended product, in the 'priority_match_analysis' field, explicitly state how the product meets (or doesn't fully meet) the 'Made in India' criterion. Cite your specific sources for this 'Made in India' claim. "
            "If definitive 'Made in India' information is hard to find for a product but other factors (e.g., an Indian brand headquarters known for local production, explicit marketing as 'Make in India') suggest a strong likelihood, state this nuance. "
            "If a product is from an international brand but has significant manufacturing operations in India for the Indian market, that can also be considered. "
            "Be skeptical of vague claims and prioritize products with clear 'Made in India' indicators."
        )
    
    final_system_prompt = system_prompt_core + made_in_india_instructions

    context_details_for_prompt = ""
    if user_context_from_request:
        context_details_for_prompt = f" My specific needs and context are: {user_context_from_request}."

    user_content = (
        f"I'm looking for advice on: '{user_query}'. "
        f"My main priority is '{user_priority}'.{context_details_for_prompt} "
        f"Please provide detailed recommendations in the specified JSON format. "
        f"Ensure your analysis (especially reasoning_summary, value_alignment_details, pros, cons, and user_sentiment_summary) "
        f"directly addresses how each product fits my stated priority AND my specific context details. "
        f"Please enrich your analysis with insights from user discussions on forums like Reddit and Quora, focusing on experiences "
        f"that align with my query, priority, and any specific context I've provided. I'm interested in what real users are saying."
    )
    if user_priority == "made_in_india":
        user_content += " Please give strong preference to products that are 'Made in India' and clearly state their origin in your analysis."


    json_schema_for_perplexity = {"schema": AdviceResponse.model_json_schema()}

    payload = {
        "model": PERPLEXITY_MODEL, 
        "messages": [
            {"role": "system", "content": final_system_prompt},
            {"role": "user", "content": user_content},
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": json_schema_for_perplexity,
        },
        "temperature": 0.7 
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    try:
       
        response = requests.post(PERPLEXITY_API_URL, headers=headers, json=payload, timeout=90)
        response.raise_for_status() 
        response_data = response.json()
        
        json_string_from_perplexity = response_data["choices"][0]["message"]["content"]
  
        
        parsed_advice = AdviceResponse.model_validate_json(json_string_from_perplexity)
        return parsed_advice

    except requests.exceptions.Timeout:
        print(f"ERROR: Perplexity API request timed out for query: '{user_query}'")
        raise HTTPException(status_code=504, detail="Perplexity API request timed out. This can happen with new schemas or complex queries. Please try again.")
    except requests.exceptions.HTTPError as e:
        error_detail = f"Perplexity API HTTP error: {e.response.status_code}"
        try:
            error_content = e.response.json()
            error_detail += f" - {error_content.get('error', {}).get('message', e.response.text)}"
        except json.JSONDecodeError:
            error_detail += f" - {e.response.text}"
        print(f"ERROR: {error_detail} for query: '{user_query}'")
        raise HTTPException(status_code=e.response.status_code, detail=error_detail)
    except (json.JSONDecodeError, KeyError, IndexError, TypeError) as e: # Includes Pydantic's ValidationError
        raw_content_for_error = "Could not retrieve raw content during parsing/validation error."
        if 'json_string_from_perplexity' in locals():
            raw_content_for_error = json_string_from_perplexity
        elif 'response_data' in locals() and response_data and response_data.get("choices") and response_data["choices"]:
            raw_content_for_error = response_data["choices"][0]["message"]["content"]
        
        print(f"ERROR: Error decoding/validating Perplexity response for query: '{user_query}'. Error: {str(e)}. Raw content snippet: {raw_content_for_error[:500]}...") # Log a snippet
        raise HTTPException(status_code=500, detail=f"Error processing response from Perplexity. The AI's output did not match the expected format. Details: {str(e)}")
    except Exception as e:
        print(f"ERROR: An unexpected error occurred in call_perplexity_api for query: '{user_query}'. Error: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected server error occurred: {str(e)}")
    
    return None 

# --- API Endpoints ---
@app.get("/")
async def read_root():
    return {"message": "PerplexiCart Backend is running!"}

@app.post("/api/get-advice", response_model=AdviceResponse)
async def get_advice(request: QueryRequest):
    user_query = request.query
    user_priority = request.priority
    user_context = request.user_context
    perplexity_api_key = os.getenv("PERPLEXITY_API_KEY")

    if not perplexity_api_key:
        print("CRITICAL ERROR: PERPLEXITY_API_KEY not found in environment variables.")
        raise HTTPException(status_code=500, detail="API Key for Perplexity not configured on the server.")

    print(f"INFO: Received request: Query='{user_query}', Priority='{user_priority}', Context='{user_context}'")

    try:
        advice_response = await call_perplexity_api(
            user_query,
            user_priority,
            perplexity_api_key,
            user_context_from_request=user_context
        )
        
        if not advice_response:
            print(f"ERROR: call_perplexity_api returned None unexpectedly for query: '{user_query}'")
            raise HTTPException(status_code=500, detail="Failed to get valid advice from Perplexity due to an internal processing issue.")
        
        return advice_response
        
    except HTTPException:
      
        raise 
    except Exception as e: 
        print(f"ERROR: Unexpected error in get_advice endpoint for query: '{user_query}'. Error: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected internal server error occurred: {str(e)}")

