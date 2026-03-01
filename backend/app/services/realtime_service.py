from __future__ import annotations

import time
import uuid
from typing import Any

# In-memory store for active sessions (Redis-backed in production)
_sessions: dict[str, dict[str, Any]] = {}
_locks: dict[str, dict[str, Any]] = {}


def create_or_join_session(document_id: str, user_id: str) -> dict[str, Any]:
    # Find existing session for this document
    for sid, session in _sessions.items():
        if session["document_id"] == document_id:
            if user_id not in session["participants"]:
                session["participants"].append(user_id)
            return {"session_id": sid, **session}

    # Create new session
    sid = str(uuid.uuid4())
    _sessions[sid] = {
        "document_id": document_id,
        "participants": [user_id],
        "created_at": time.time(),
    }
    return {"session_id": sid, **_sessions[sid]}


def acquire_lock(document_id: str, session_id: str, user_id: str) -> dict[str, Any]:
    lock = _locks.get(document_id)
    now = time.time()

    # Release stale locks (>5 minutes)
    if lock and now - lock["acquired_at"] > 300:
        del _locks[document_id]
        lock = None

    if lock and lock["user_id"] != user_id:
        return {"acquired": False, "locked_by": lock["user_id"]}

    _locks[document_id] = {"user_id": user_id, "session_id": session_id, "acquired_at": now}
    return {"acquired": True, "locked_by": user_id}
