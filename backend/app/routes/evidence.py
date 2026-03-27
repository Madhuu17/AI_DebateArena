import uuid
import base64
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.models.schemas import EvidenceRequest, EvidenceResponse
from app.services.evidence import verify_url_evidence, verify_image_evidence

router = APIRouter(prefix="/evidence", tags=["evidence"])


@router.post("/submit", response_model=EvidenceResponse)
async def submit_evidence(request: EvidenceRequest):
    if request.type == "url":
        result = await verify_url_evidence(request.content)
    else:
        result = await verify_url_evidence(request.content)

    return EvidenceResponse(
        id=str(uuid.uuid4()),
        status=result["status"],
        explanation=result["explanation"],
        sources=result.get("sources", [])
    )


@router.post("/submit-file", response_model=EvidenceResponse)
async def submit_file_evidence(
    file: UploadFile = File(...),
    session_id: str = Form(...)
):
    content = await file.read()

    # Convert image to base64 data URL for GPT-4o Vision
    content_type = file.content_type or "image/jpeg"
    b64 = base64.b64encode(content).decode("utf-8")
    data_url = f"data:{content_type};base64,{b64}"

    result = await verify_image_evidence(data_url, file.filename or "uploaded_file")

    return EvidenceResponse(
        id=str(uuid.uuid4()),
        status=result["status"],
        explanation=result["explanation"],
        sources=result.get("sources", [])
    )
