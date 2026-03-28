import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

UNIVERSAL_API_KEY = os.getenv("GEMINI_API_KEY", os.getenv("OPENROUTER_API_KEY", os.getenv("OPENAI_API_KEY", "")))
OPENROUTER_API_KEY = UNIVERSAL_API_KEY
OPENAI_API_KEY = UNIVERSAL_API_KEY
GEMINI_API_KEY = UNIVERSAL_API_KEY
print("DEBUG: Loaded API Key starts with:", UNIVERSAL_API_KEY[:4] if UNIVERSAL_API_KEY else "Empty")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
CHROMA_PATH = os.getenv("CHROMA_PATH", "./chroma_data")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"  # Uses mock responses without real API keys
