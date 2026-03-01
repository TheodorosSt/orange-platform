from __future__ import annotations

from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_user
from app.models.schemas import (
    CurrentUser,
    DeepLUsage,
    Language,
    TranslationRequest,
    TranslationResult,
)
from app.services import deepl_service

router = APIRouter(prefix="/api/translate", tags=["translate"])


@router.post("/text", response_model=TranslationResult)
async def translate_text(
    req: TranslationRequest,
    _user: CurrentUser = Depends(get_current_user),
) -> TranslationResult:
    result = await deepl_service.translate_text(req.text, req.target_language, req.source_language)
    return TranslationResult(**result)


@router.get("/languages", response_model=list[Language])
async def get_languages(
    _user: CurrentUser = Depends(get_current_user),
) -> list[Language]:
    langs = await deepl_service.get_languages()
    return [Language(**lang) for lang in langs]


@router.get("/usage", response_model=DeepLUsage)
async def get_usage(
    _user: CurrentUser = Depends(get_current_user),
) -> DeepLUsage:
    usage = await deepl_service.get_usage()
    return DeepLUsage(**usage)
