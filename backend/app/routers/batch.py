from __future__ import annotations

from fastapi import APIRouter, Depends, File, UploadFile

from app.middleware.auth import get_current_user
from app.models.schemas import BatchJob, BatchStartRequest, CurrentUser
from app.services import batch_service

router = APIRouter(prefix="/api/batch", tags=["batch"])


@router.post("/start", response_model=BatchJob)
async def start_batch(
    files: list[UploadFile] = File(...),
    pipeline: str = "ocr,translate",
    target_language: str = "EN",
    _user: CurrentUser = Depends(get_current_user),
) -> BatchJob:
    file_names = [f.filename or f"file_{i}" for i, f in enumerate(files)]
    job = batch_service.start_batch_job(
        file_names,
        pipeline.split(","),
        target_language,
    )
    return BatchJob(**job)


@router.get("/status/{job_id}", response_model=BatchJob)
async def get_batch_status(
    job_id: str,
    _user: CurrentUser = Depends(get_current_user),
) -> BatchJob:
    job = batch_service.get_job_status(job_id)
    return BatchJob(**job)
