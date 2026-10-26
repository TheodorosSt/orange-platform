from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


# OCR
class OCRRequest(BaseModel):
    language_hints: list[str] = ["el", "en"]


class OCRResult(BaseModel):
    text: str
    confidence: float
    pages: int
    language: str | None = None


# Translation
class TranslationRequest(BaseModel):
    text: str
    target_language: str
    source_language: str | None = None


class TranslationResult(BaseModel):
    translated_text: str
    source_language: str
    target_language: str
    detected_source_language: str | None = None


class Language(BaseModel):
    code: str
    name: str


class DeepLUsage(BaseModel):
    character_count: int
    character_limit: int


# Audiobook
class AudiobookRequest(BaseModel):
    text: str
    voice_id: str
    speed: float = Field(default=1.0, ge=0.5, le=2.0)


class AudiobookPreviewRequest(BaseModel):
    text: str
    voice_id: str


class AudiobookResult(BaseModel):
    audio_url: str
    duration_seconds: float
    voice_id: str


class Voice(BaseModel):
    voice_id: str
    name: str
    preview_url: str | None = None
    labels: dict[str, str] = {}


# Vault
class VaultDocument(BaseModel):
    id: str
    name: str
    size: int
    mime_type: str
    created_at: str
    download_url: str | None = None


class VaultDocumentList(BaseModel):
    documents: list[VaultDocument]
    total: int
    page: int
    limit: int


class DownloadUrlResponse(BaseModel):
    url: str


# Collaboration
class CollabSessionRequest(BaseModel):
    document_id: str


class CollabSession(BaseModel):
    session_id: str
    document_id: str
    participants: list[str] = []


class LockRequest(BaseModel):
    document_id: str
    session_id: str


class LockResponse(BaseModel):
    acquired: bool
    locked_by: str | None = None


# Batch
class BatchStartRequest(BaseModel):
    pipeline: list[str] = ["ocr", "translate"]
    target_language: str = "EN"


class BatchJob(BaseModel):
    id: str
    status: str
    total: int
    processed: int
    failed: int
    created_at: str


# Billing
class Plan(BaseModel):
    id: str
    name: str
    price: float
    currency: str = "EUR"
    interval: str = "month"
    features: dict[str, Any]
    stripe_price_id: str


class CheckoutRequest(BaseModel):
    price_id: str
    success_url: str = "https://orange.digital/success"
    cancel_url: str = "https://orange.digital/pricing"


class CheckoutResponse(BaseModel):
    url: str
    session_id: str


class PortalRequest(BaseModel):
    return_url: str = "https://orange.digital/settings"


class PortalResponse(BaseModel):
    url: str


class Subscription(BaseModel):
    id: str
    plan_id: str
    status: str
    current_period_end: str


class UsageSummary(BaseModel):
    ocr_pages_used: int
    ocr_pages_limit: int | None
    translate_words_used: int
    translate_words_limit: int | None
    tts_minutes_used: float
    tts_minutes_limit: float | None
    vault_bytes_used: int
    vault_bytes_limit: int


# Health
class HealthResponse(BaseModel):
    status: str
    version: str = "1.0.0"
    services: dict[str, str] = {}


# Auth
class CurrentUser(BaseModel):
    id: str
    email: str
