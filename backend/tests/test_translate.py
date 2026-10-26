from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest


@pytest.mark.asyncio
async def test_translate_text():
    """Test DeepL translation service."""
    mock_result = MagicMock()
    mock_result.text = "Hello, World!"
    mock_result.detected_source_lang = "EL"

    mock_translator = MagicMock()
    mock_translator.translate_text.return_value = mock_result

    with patch("app.services.deepl_service.deepl") as mock_deepl:
        mock_deepl.Translator.return_value = mock_translator

        from app.services import deepl_service
        result = await deepl_service.translate_text("Γεια σου, Κόσμε!", "EN", None)

        assert result["translated_text"] == "Hello, World!"
        assert result["target_language"] == "EN"
        assert result["detected_source_language"] == "EL"


@pytest.mark.asyncio
async def test_get_languages():
    """Test that language list is returned correctly."""
    mock_lang_el = MagicMock()
    mock_lang_el.code = "EL"
    mock_lang_el.name = "Greek"

    mock_lang_en = MagicMock()
    mock_lang_en.code = "EN-GB"
    mock_lang_en.name = "English (British)"

    mock_translator = MagicMock()
    mock_translator.get_target_languages.return_value = [mock_lang_el, mock_lang_en]

    with patch("app.services.deepl_service.deepl") as mock_deepl:
        mock_deepl.Translator.return_value = mock_translator

        from app.services import deepl_service
        langs = await deepl_service.get_languages()

        assert len(langs) == 2
        assert langs[0]["code"] == "EL"
        assert langs[1]["name"] == "English (British)"


@pytest.mark.asyncio
async def test_get_usage():
    """Test DeepL API usage retrieval."""
    mock_usage = MagicMock()
    mock_usage.character.count = 12345
    mock_usage.character.limit = 500000

    mock_translator = MagicMock()
    mock_translator.get_usage.return_value = mock_usage

    with patch("app.services.deepl_service.deepl") as mock_deepl:
        mock_deepl.Translator.return_value = mock_translator

        from app.services import deepl_service
        usage = await deepl_service.get_usage()

        assert usage["character_count"] == 12345
        assert usage["character_limit"] == 500000
