from __future__ import annotations

import deepl  # type: ignore

from app.config import settings


def _get_translator() -> deepl.Translator:
    return deepl.Translator(settings.deepl_api_key)


async def translate_text(
    text: str,
    target_lang: str,
    source_lang: str | None = None,
) -> dict[str, str]:
    translator = _get_translator()
    result = translator.translate_text(
        text,
        target_lang=target_lang,
        source_lang=source_lang,
        preserve_formatting=True,
    )
    detected = getattr(result, "detected_source_lang", None)
    return {
        "translated_text": result.text,
        "source_language": source_lang or (detected or "auto"),
        "target_language": target_lang,
        "detected_source_language": detected or "",
    }


async def get_languages() -> list[dict[str, str]]:
    translator = _get_translator()
    langs = translator.get_target_languages()
    return [{"code": lang.code, "name": lang.name} for lang in langs]


async def get_usage() -> dict[str, int]:
    translator = _get_translator()
    usage = translator.get_usage()
    return {
        "character_count": usage.character.count,
        "character_limit": usage.character.limit,
    }
