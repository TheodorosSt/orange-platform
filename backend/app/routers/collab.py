from __future__ import annotations

from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_user
from app.models.schemas import (
    CollabSession,
    CollabSessionRequest,
    CurrentUser,
    LockRequest,
    LockResponse,
)
from app.services import realtime_service

router = APIRouter(prefix="/api/collab", tags=["collaboration"])


@router.post("/sessions", response_model=CollabSession)
async def create_or_join_session(
    req: CollabSessionRequest,
    user: CurrentUser = Depends(get_current_user),
) -> CollabSession:
    session = realtime_service.create_or_join_session(req.document_id, user.id)
    return CollabSession(
        session_id=session["session_id"],
        document_id=req.document_id,
        participants=session.get("participants", []),
    )


@router.post("/lock", response_model=LockResponse)
async def acquire_lock(
    req: LockRequest,
    user: CurrentUser = Depends(get_current_user),
) -> LockResponse:
    result = realtime_service.acquire_lock(req.document_id, req.session_id, user.id)
    return LockResponse(**result)
