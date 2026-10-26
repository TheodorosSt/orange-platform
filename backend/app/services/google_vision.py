from __future__ import annotations

from typing import Any


async def extract_text_from_image(
    image_bytes: bytes,
    language_hints: list[str] | None = None,
) -> dict[str, Any]:
    """
    Use Google Cloud Vision API to extract text from an image/PDF.
    Returns dict with 'text', 'confidence', 'pages'.
    """
    try:
        from google.cloud import vision  # type: ignore

        client = vision.ImageAnnotatorClient()
        image = vision.Image(content=image_bytes)
        context = vision.ImageContext(language_hints=language_hints or ["el", "en"])
        response = client.document_text_detection(image=image, image_context=context)

        if response.error.message:
            raise RuntimeError(f"Google Vision error: {response.error.message}")

        full_text = response.full_text_annotation
        text = full_text.text if full_text else ""
        pages = len(full_text.pages) if full_text else 0

        # Average confidence across all blocks
        confidences: list[float] = []
        for page in (full_text.pages if full_text else []):
            for block in page.blocks:
                confidences.append(block.confidence)
        confidence = sum(confidences) / len(confidences) if confidences else 0.0

        return {"text": text, "confidence": confidence, "pages": max(pages, 1)}
    except ImportError:
        # Fallback for environments without google-cloud-vision
        return {"text": "", "confidence": 0.0, "pages": 1}
