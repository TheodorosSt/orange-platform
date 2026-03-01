from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.middleware.monitoring import init_sentry
from app.models.schemas import HealthResponse
from app.routers import audiobook, batch, billing, collab, ocr, translate, vault

# Initialize Sentry
init_sentry(settings.sentry_dsn_backend, environment="development" if settings.debug else "production")

app = FastAPI(
    title="ORANGE Platform API",
    version="1.0.0",
    description="Premium Digital Services API — OCR, Translation, Audiobook, Vault",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(ocr.router)
app.include_router(translate.router)
app.include_router(audiobook.router)
app.include_router(vault.router)
app.include_router(collab.router)
app.include_router(batch.router)
app.include_router(billing.router)


@app.get("/api/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        version="1.0.0",
        services={
            "api": "ok",
            "database": "ok",
            "ocr": "ok",
            "translate": "ok",
            "tts": "ok",
            "vault": "ok",
        },
    )
