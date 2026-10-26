from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from app.services.billing_service import PLANS


def test_plans_are_defined():
    """Test that billing plans are correctly configured."""
    assert len(PLANS) == 3
    plan_ids = [p.id for p in PLANS]
    assert "starter" in plan_ids
    assert "professional" in plan_ids
    assert "enterprise" in plan_ids


def test_starter_plan():
    """Test starter plan configuration."""
    starter = next(p for p in PLANS if p.id == "starter")
    assert starter.price == 29.0
    assert starter.currency == "EUR"
    assert starter.features["ocr_pages"] == 100
    assert starter.features["translate_words"] == 50000
    assert starter.features["tts_minutes"] == 30
    assert starter.features["vault_gb"] == 5
    assert starter.features["batch"] is False
    assert starter.features["collaboration"] is False
    assert starter.features["api_access"] is False


def test_professional_plan():
    """Test professional plan configuration."""
    pro = next(p for p in PLANS if p.id == "professional")
    assert pro.price == 79.0
    assert pro.features["ocr_pages"] == 500
    assert pro.features["batch"] is True
    assert pro.features["collaboration"] is True
    assert pro.features["api_access"] is False


def test_enterprise_plan():
    """Test enterprise plan configuration."""
    enterprise = next(p for p in PLANS if p.id == "enterprise")
    assert enterprise.price == 199.0
    assert enterprise.features["ocr_pages"] is None  # Unlimited
    assert enterprise.features["translate_words"] == 1000000
    assert enterprise.features["tts_minutes"] == 500
    assert enterprise.features["vault_gb"] == 100
    assert enterprise.features["batch"] is True
    assert enterprise.features["collaboration"] is True
    assert enterprise.features["api_access"] is True


@pytest.mark.asyncio
async def test_create_checkout_session():
    """Test Stripe checkout session creation."""
    mock_session = MagicMock()
    mock_session.url = "https://checkout.stripe.com/pay/cs_test_123"
    mock_session.id = "cs_test_123"

    with patch("app.services.billing_service.stripe") as mock_stripe:
        mock_stripe.checkout.Session.create.return_value = mock_session

        from app.services.billing_service import create_checkout_session
        result = await create_checkout_session(
            "user-123",
            "price_starter",
            "https://orange.digital/success",
            "https://orange.digital/pricing",
        )

        assert result["url"] == "https://checkout.stripe.com/pay/cs_test_123"
        assert result["session_id"] == "cs_test_123"


def test_webhook_event_construction():
    """Test Stripe webhook event construction."""
    with patch("app.services.billing_service.stripe") as mock_stripe:
        mock_event = {"type": "checkout.session.completed"}
        mock_stripe.Webhook.construct_event.return_value = mock_event

        from app.services.billing_service import construct_webhook_event
        event = construct_webhook_event(b'{"type":"checkout.session.completed"}', "sig123")
        assert event["type"] == "checkout.session.completed"
