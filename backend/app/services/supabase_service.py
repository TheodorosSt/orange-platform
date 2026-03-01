from __future__ import annotations

from supabase import create_client, Client  # type: ignore
from app.config import settings

BUCKET_NAME = "orange-vault"
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


def get_supabase_admin() -> Client:
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


async def upload_file(
    user_id: str,
    file_name: str,
    file_bytes: bytes,
    mime_type: str,
) -> dict:
    client = get_supabase_admin()
    path = f"{user_id}/{file_name}"

    # Upload to storage
    client.storage.from_(BUCKET_NAME).upload(
        path,
        file_bytes,
        file_options={"content-type": mime_type, "upsert": "true"},
    )

    # Insert metadata record
    record = (
        client.table("documents")
        .insert(
            {
                "user_id": user_id,
                "name": file_name,
                "size": len(file_bytes),
                "mime_type": mime_type,
                "storage_path": path,
            }
        )
        .execute()
    )
    return record.data[0]


async def list_documents(user_id: str, page: int = 1, limit: int = 20) -> dict:
    client = get_supabase_admin()
    offset = (page - 1) * limit
    result = (
        client.table("documents")
        .select("*", count="exact")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return {"documents": result.data, "total": result.count or 0}


async def get_download_url(document_id: str, user_id: str) -> str:
    client = get_supabase_admin()
    doc = (
        client.table("documents")
        .select("storage_path")
        .eq("id", document_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    path = doc.data["storage_path"]
    response = client.storage.from_(BUCKET_NAME).create_signed_url(path, expires_in=3600)
    return response["signedURL"]


async def delete_document(document_id: str, user_id: str) -> None:
    client = get_supabase_admin()
    doc = (
        client.table("documents")
        .select("storage_path")
        .eq("id", document_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    path = doc.data["storage_path"]
    client.storage.from_(BUCKET_NAME).remove([path])
    client.table("documents").delete().eq("id", document_id).execute()
