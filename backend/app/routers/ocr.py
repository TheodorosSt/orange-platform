from __future__ import annotations

from fastapi import APIRouter, Depends, File, UploadFile

from app.middleware.auth import get_current_user
from app.models.schemas import CurrentUser, OCRResult
from app.services import google_vision

router = APIRouter(prefix="/api/ocr", tags=["ocr"])


@router.post("/process", response_model=OCRResult)
async def process_document(
    file: UploadFile = File(...),
    language_hints: str = "el,en",
    _user: CurrentUser = Depends(get_current_user),
) -> OCRResult:
    contents = await file.read()
    hints = [h.strip() for h in language_hints.split(",")]
    result = await google_vision.extract_text_from_image(contents, hints)
    return OCRResult(**result)
