import chromadb
from chromadb.config import Settings
from app.config import CHROMA_PATH, OPENAI_API_KEY, DEMO_MODE
from typing import List

_chroma_client = None
_collection = None


async def init_chroma():
    global _chroma_client, _collection
    if DEMO_MODE:
        return
    try:
        _chroma_client = chromadb.PersistentClient(
            path=CHROMA_PATH,
            settings=Settings(anonymized_telemetry=False)
        )
        _collection = _chroma_client.get_or_create_collection(
            name="debate_arguments",
            metadata={"hnsw:space": "cosine"}
        )
        print("✅ ChromaDB initialized")
    except Exception as e:
        print(f"⚠️  ChromaDB init failed: {e}. Semantic recall disabled.")


async def store_argument(session_id: str, arg_id: str, text: str, metadata: dict):
    if DEMO_MODE or _collection is None:
        return
    try:
        _collection.add(
            documents=[text],
            ids=[arg_id],
            metadatas=[{"session_id": session_id, **metadata}]
        )
    except Exception:
        pass


async def find_contradictions(session_id: str, text: str) -> List[str]:
    """Find semantically similar past arguments from the same session."""
    if DEMO_MODE or _collection is None:
        return []
    try:
        results = _collection.query(
            query_texts=[text],
            n_results=3,
            where={"session_id": session_id}
        )
        return results.get("documents", [[]])[0]
    except Exception:
        return []
