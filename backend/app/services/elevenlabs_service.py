from __future__ import annotations

import httpx

from app.config import settings

ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1"
MODEL_ID = "eleven_multilingual_v2"


async def generate_speech(
    text: str,
    voice_id: str,
    speed: float = 1.0,
) -> bytes:
    headers = {
        "xi-api-key": settings.elevenlabs_api_key,
        "Content-Type": "application/json",
    }
    payload = {
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.0,
            "use_speaker_boost": True,
            "speed": speed,
        },
    }
    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(
            f"{ELEVENLABS_BASE_URL}/text-to-speech/{voice_id}",
            headers=headers,
            json=payload,
        )
        resp.raise_for_status()
        return resp.content


async def list_voices() -> list[dict]:
    headers = {"xi-api-key": settings.elevenlabs_api_key}
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(f"{ELEVENLABS_BASE_URL}/voices", headers=headers)
        resp.raise_for_status()
        data = resp.json()
        return [
            {
                "voice_id": v["voice_id"],
                "name": v["name"],
                "preview_url": v.get("preview_url"),
                "labels": v.get("labels", {}),
            }
            for v in data.get("voices", [])
        ]
