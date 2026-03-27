import asyncio
from duckduckgo_search import DDGS

async def fetch_realtime_data(topic: str, side: str) -> str:
    """
    Fetches real-time studies, statistics, and surveys for a given debate topic and side.
    """
    try:
        query = f'"{topic}" research studies statistics surveys {side} 2024 OR 2025'
        
        # Use asyncio executor for the sync DDGS call to avoid blocking the event loop
        def _search():
            with DDGS() as ddgs:
                return list(ddgs.text(query, max_results=3))
                
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(None, _search)
        
        if not results:
            return "No recent real-time survey or study data found."
            
        snippets = []
        for r in results:
            if 'title' in r and 'body' in r:
                snippets.append(f"- Source: {r['title']} | Snippet: {r['body']}")
            
        return "\n".join(snippets)
    except Exception as e:
        print(f"Search failed for {topic}: {e}")
        return "Real-time search unavailable right now."
