from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.middleware.auth import get_current_user
from app.models.schemas import CurrentUser

# Mock the auth dependency globally
def mock_current_user() -> CurrentUser:
    return CurrentUser(id="test-user-id", email="test@example.com")

@pytest.fixture
def client():
    app.dependency_overrides[get_current_user] = mock_current_user
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_extract_text_fallback():
    """Test that extract_text_from_image returns empty result when google-cloud-vision is unavailable."""
    from app.services.google_vision import extract_text_from_image
    
    with patch.dict("sys.modules", {"google.cloud": None, "google.cloud.vision": None}):
        # When google-cloud-vision is not available, function catches ImportError
        result = await extract_text_from_image(b"fake-image-bytes", ["en"])
        # In test env without google-cloud-vision, should return empty fallback
        assert "text" in result
        assert "confidence" in result
        assert "pages" in result
        assert isinstance(result["text"], str)
        assert isinstance(result["confidence"], float)
        assert result["pages"] >= 1


@pytest.mark.asyncio
async def test_extract_text_with_vision_mock():
    """Test OCR extraction with mocked Google Vision response."""
    mock_annotation = MagicMock()
    mock_annotation.text = "Extracted Greek text: Καλημέρα"
    mock_annotation.pages = [MagicMock(blocks=[MagicMock(confidence=0.95)])]
    
    mock_response = MagicMock()
    mock_response.error.message = ""
    mock_response.full_text_annotation = mock_annotation
    
    mock_client = MagicMock()
    mock_client.document_text_detection.return_value = mock_response

    with patch("google.cloud.vision.ImageAnnotatorClient", return_value=mock_client):

        from app.services import google_vision
        result = await google_vision.extract_text_from_image(b"image-bytes", ["el"])
        
        assert result["text"] == "Extracted Greek text: Καλημέρα"
        assert result["confidence"] == pytest.approx(0.95)
        assert result["pages"] == 1


@pytest.mark.asyncio
async def test_extract_text_google_vision_error():
    """Test that Google Vision API errors are properly raised."""
    mock_response = MagicMock()
    mock_response.error.message = "Resource not found"
    mock_response.full_text_annotation = None

    mock_client = MagicMock()
    mock_client.document_text_detection.return_value = mock_response

    with patch("google.cloud.vision.ImageAnnotatorClient", return_value=mock_client):

        from app.services import google_vision
        with pytest.raises(RuntimeError, match="Google Vision error"):
            await google_vision.extract_text_from_image(b"image-bytes", ["el"])
