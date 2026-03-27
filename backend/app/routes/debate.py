import asyncio
import json
import uuid
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from app.models.schemas import TopicRequest, StartDebateResponse, HumanInputRequest
from app.graph.debate_graph import run_debate_graph
from app.db.mongo import save_session, get_session, queue_human_input

router = APIRouter(prefix="/debate", tags=["debate"])

# Active debate tasks
_active_streams: dict = {}


@router.post("/start", response_model=StartDebateResponse)
async def start_debate(request: TopicRequest):
    session_id = str(uuid.uuid4())
    session = {
        "session_id": session_id,
        "topic": request.topic,
        "status": "running",
        "arguments": [],
        "verdict": None,
    }
    await save_session(session)
    return StartDebateResponse(session_id=session_id, topic=request.topic)


@router.get("/{session_id}/stream")
async def stream_debate(session_id: str):
    session = await get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    async def event_generator():
        try:
            async for event in run_debate_graph(session_id, session["topic"]):
                event_name = event["event"]
                event_data = json.dumps(event["data"])
                yield f"event: {event_name}\ndata: {event_data}\n\n"
                await asyncio.sleep(0)
        except asyncio.CancelledError:
            pass
        except Exception as e:
            yield f"event: error_event\ndata: {json.dumps({'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        }
    )


@router.post("/{session_id}/human")
async def submit_human_input(session_id: str, request: HumanInputRequest):
    session = await get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await queue_human_input(session_id, f"[{request.type.upper()}] {request.content}")
    return {"message": "Input queued successfully", "session_id": session_id}
