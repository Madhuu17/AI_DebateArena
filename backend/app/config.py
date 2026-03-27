from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
CHROMA_PATH = os.getenv("CHROMA_PATH", "./chroma_data")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"  # Uses mock responses without real API keys
