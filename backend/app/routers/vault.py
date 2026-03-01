from __future__ import annotations

from fastapi import APIRouter, Depends, File, Query, UploadFile

from app.middleware.auth import get_current_user
from app.models.schemas import (
    CurrentUser,
    DownloadUrlResponse,
    VaultDocument,
    VaultDocumentList,
)
from app.services import supabase_service

router = APIRouter(prefix="/api/vault", tags=["vault"])


@router.post("/upload", response_model=VaultDocument)
async def upload_document(
    file: UploadFile = File(...),
    user: CurrentUser = Depends(get_current_user),
) -> VaultDocument:
    contents = await file.read()
    doc = await supabase_service.upload_file(
        user_id=user.id,
        file_name=file.filename or "upload",
        file_bytes=contents,
        mime_type=file.content_type or "application/octet-stream",
    )
    return VaultDocument(
        id=doc["id"],
        name=doc["name"],
        size=doc["size"],
        mime_type=doc["mime_type"],
        created_at=doc["created_at"],
    )


@router.get("/documents", response_model=VaultDocumentList)
async def list_documents(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    user: CurrentUser = Depends(get_current_user),
) -> VaultDocumentList:
    result = await supabase_service.list_documents(user.id, page, limit)
    return VaultDocumentList(
        documents=[
            VaultDocument(
                id=d["id"],
                name=d["name"],
                size=d["size"],
                mime_type=d["mime_type"],
                created_at=d["created_at"],
            )
            for d in result["documents"]
        ],
        total=result["total"],
        page=page,
        limit=limit,
    )


@router.get("/documents/{document_id}/download", response_model=DownloadUrlResponse)
async def get_download_url(
    document_id: str,
    user: CurrentUser = Depends(get_current_user),
) -> DownloadUrlResponse:
    url = await supabase_service.get_download_url(document_id, user.id)
    return DownloadUrlResponse(url=url)


@router.delete("/documents/{document_id}", status_code=204)
async def delete_document(
    document_id: str,
    user: CurrentUser = Depends(get_current_user),
) -> None:
    await supabase_service.delete_document(document_id, user.id)
