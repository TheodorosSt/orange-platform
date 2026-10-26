from __future__ import annotations

import time
import uuid
from typing import Any

from celery import Celery  # type: ignore

from app.config import settings

celery_app = Celery(
    "orange",
    broker=settings.redis_url,
    backend=settings.redis_url.replace("/0", "/1"),
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    worker_prefetch_multiplier=1,
    result_expires=86400,
)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def process_single_file(self: Any, file_path: str, pipeline: list[str], options: dict) -> dict:
    try:
        # Placeholder — real implementation would call OCR/translate services
        time.sleep(0.1)
        return {"file": file_path, "status": "completed"}
    except Exception as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries * 30)


def start_batch_job(
    file_paths: list[str],
    pipeline: list[str],
    target_language: str = "EN",
) -> dict[str, Any]:
    job_id = str(uuid.uuid4())
    # In production, dispatch Celery chord
    # chord([process_single_file.s(fp, pipeline, {"target_language": target_language}) for fp in file_paths])(finalize.s(job_id))
    return {
        "id": job_id,
        "status": "pending",
        "total": len(file_paths),
        "processed": 0,
        "failed": 0,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def get_job_status(job_id: str) -> dict[str, Any]:
    # In production, fetch from Redis db=2
    return {
        "id": job_id,
        "status": "processing",
        "total": 0,
        "processed": 0,
        "failed": 0,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
