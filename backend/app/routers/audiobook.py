from __future__ import annotations

import io
import uuid

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.middleware.auth import get_current_user
from app.models.schemas import (
    AudiobookPreviewRequest,
    AudiobookRequest,
    AudiobookResult,
    CurrentUser,
    Voice,
)
from app.services import elevenlabs_service

router = APIRouter(prefix="/api/audiobook", tags=["audiobook"])


@router.post("/generate")
async def generate_audiobook(
    req: AudiobookRequest,
    _user: CurrentUser = Depends(get_current_user),
) -> StreamingResponse:
    audio_bytes = await elevenlabs_service.generate_speech(req.text, req.voice_id, req.speed)
    # Estimate duration (avg 150 words/min)
    word_count = len(req.text.split())
    duration = (word_count / 150) * 60 / req.speed

    # Return as streaming response
    return StreamingResponse(
        io.BytesIO(audio_bytes),
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": f"attachment; filename=audiobook-{uuid.uuid4()}.mp3",
            "X-Duration-Seconds": str(round(duration, 2)),
        },
    )


@router.post("/preview", response_model=AudiobookResult)
async def generate_preview(
    req: AudiobookPreviewRequest,
    _user: CurrentUser = Depends(get_current_user),
) -> AudiobookResult:
    # Limit preview to first 200 chars
    preview_text = req.text[:200]
    # Preview storage is not yet implemented; do not bill for generated audio that is discarded.
    # In production, generate and upload the preview, then return its storage URL.
    return AudiobookResult(
        audio_url="",  # Would be storage URL in production
        duration_seconds=round(len(preview_text.split()) / 150 * 60, 2),
        voice_id=req.voice_id,
    )


@router.get("/voices", response_model=list[Voice])
async def list_voices(
    _user: CurrentUser = Depends(get_current_user),
) -> list[Voice]:
    voices = await elevenlabs_service.list_voices()
    return [Voice(**v) for v in voices]
