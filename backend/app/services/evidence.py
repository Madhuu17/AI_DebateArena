import json
import uuid
from app.config import OPENAI_API_KEY, TAVILY_API_KEY, DEMO_MODE
from app.agents.prompts import FACT_CHECK_PROMPT

MOCK_EVIDENCE_RESULTS = {
    "verified": {
        "status": "verified",
        "explanation": "The content aligns with multiple credible peer-reviewed sources and established fact-checking organizations.",
        "sources": ["Reuters Fact Check", "PubMed Central", "WHO Database"]
    },
    "uncertain": {
        "status": "uncertain",
        "explanation": "The content contains some accurate elements but lacks sufficient sourcing to fully verify. Exercise caution.",
        "sources": []
    },
    "false": {
        "status": "false",
        "explanation": "This content contradicts verified data from authoritative sources and shows characteristics of misinformation.",
        "sources": ["Associated Press", "FactCheck.org"]
    }
}


async def verify_url_evidence(url: str) -> dict:
    """Verify a URL using Tavily search + GPT-4o analysis."""
    if DEMO_MODE or not OPENAI_API_KEY:
        # Cycle through mock results for demo
        import hashlib
        hash_val = int(hashlib.md5(url.encode()).hexdigest(), 16) % 3
        key = ["verified", "uncertain", "false"][hash_val]
        return MOCK_EVIDENCE_RESULTS[key]

    # Real implementation: use Tavily to fetch content, then GPT-4o to analyze
    try:
        if TAVILY_API_KEY:
            from tavily import TavilyClient
            tavily = TavilyClient(api_key=TAVILY_API_KEY)
            results = tavily.search(query=f"fact check: {url}", max_results=3)
            content_summary = "\n".join([r.get("content", "")[:300] for r in results.get("results", [])])
        else:
            content_summary = f"Article at URL: {url}"

        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=OPENAI_API_KEY)
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": FACT_CHECK_PROMPT},
                {"role": "user", "content": f"Verify this content:\nURL: {url}\nSearch results:\n{content_summary}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
        )
        return json.loads(response.choices[0].message.content)
    except Exception:
        return MOCK_EVIDENCE_RESULTS["uncertain"]


async def verify_image_evidence(image_content: str, file_name: str = "") -> dict:
    """Verify image evidence using GPT-4o Vision."""
    if DEMO_MODE or not OPENAI_API_KEY:
        return {
            "status": "uncertain",
            "explanation": f"Image '{file_name}' analyzed. In demo mode, full vision analysis requires OpenAI API key.",
            "sources": []
        }

    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=OPENAI_API_KEY)
        
        messages = [
            {"role": "system", "content": FACT_CHECK_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Analyze this image for factual accuracy and potential misinformation:"},
                    {"type": "image_url", "image_url": {"url": image_content}}
                ]
            }
        ]
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.1,
        )
        return json.loads(response.choices[0].message.content)
    except Exception:
        return MOCK_EVIDENCE_RESULTS["uncertain"]
