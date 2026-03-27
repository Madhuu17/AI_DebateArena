from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URI, DEMO_MODE
from typing import Optional, List
import asyncio

_client: Optional[AsyncIOMotorClient] = None
_db = None

# In-memory store for DEMO_MODE
_in_memory_sessions: dict = {}
_in_memory_human_inputs: dict = {}


async def connect_db():
    global _client, _db
    if DEMO_MODE:
        return
    try:
        _client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        await _client.server_info()
        _db = _client["debate_arena"]
        print("✅ MongoDB connected")
    except Exception as e:
        print(f"⚠️  MongoDB connection failed: {e}. Using in-memory store.")


async def disconnect_db():
    global _client
    if _client:
        _client.close()


async def save_session(session_data: dict):
    if DEMO_MODE or _db is None:
        _in_memory_sessions[session_data["session_id"]] = session_data
        return
    await _db.debates.replace_one(
        {"session_id": session_data["session_id"]},
        session_data,
        upsert=True
    )


async def get_session(session_id: str) -> Optional[dict]:
    if DEMO_MODE or _db is None:
        return _in_memory_sessions.get(session_id)
    return await _db.debates.find_one({"session_id": session_id}, {"_id": 0})


async def queue_human_input(session_id: str, content: str):
    if session_id not in _in_memory_human_inputs:
        _in_memory_human_inputs[session_id] = []
    _in_memory_human_inputs[session_id].append(content)
    if not DEMO_MODE and _db is not None:
        await _db.human_inputs.insert_one({"session_id": session_id, "content": content})


async def get_human_inputs(session_id: str) -> List[str]:
    inputs = _in_memory_human_inputs.pop(session_id, [])
    return inputs
