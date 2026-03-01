from __future__ import annotations

import stripe  # type: ignore
from app.config import settings
from app.models.schemas import Plan

stripe.api_key = settings.stripe_secret_key

PLANS: list[Plan] = [
    Plan(
        id="starter",
        name="Starter",
        price=29.0,
        currency="EUR",
        interval="month",
        features={
            "ocr_pages": 100,
            "translate_words": 50000,
            "tts_minutes": 30,
            "vault_gb": 5,
            "batch": False,
            "collaboration": False,
            "api_access": False,
        },
        stripe_price_id=settings.stripe_starter_price_id,
    ),
    Plan(
        id="professional",
        name="Professional",
        price=79.0,
        currency="EUR",
        interval="month",
        features={
            "ocr_pages": 500,
            "translate_words": 200000,
            "tts_minutes": 120,
            "vault_gb": 25,
            "batch": True,
            "collaboration": True,
            "api_access": False,
        },
        stripe_price_id=settings.stripe_pro_price_id,
    ),
    Plan(
        id="enterprise",
        name="Enterprise",
        price=199.0,
        currency="EUR",
        interval="month",
        features={
            "ocr_pages": None,
            "translate_words": 1000000,
            "tts_minutes": 500,
            "vault_gb": 100,
            "batch": True,
            "collaboration": True,
            "api_access": True,
        },
        stripe_price_id=settings.stripe_enterprise_price_id,
    ),
]


async def create_checkout_session(
    user_id: str,
    price_id: str,
    success_url: str,
    cancel_url: str,
) -> dict:
    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url + "?session_id={CHECKOUT_SESSION_ID}",
        cancel_url=cancel_url,
        metadata={"user_id": user_id},
        billing_address_collection="auto",
        customer_creation="always",
    )
    return {"url": session.url, "session_id": session.id}


async def create_portal_session(customer_id: str, return_url: str) -> dict:
    session = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url=return_url,
    )
    return {"url": session.url}


def construct_webhook_event(payload: bytes, sig_header: str) -> stripe.Event:
    return stripe.Webhook.construct_event(payload, sig_header, settings.stripe_webhook_secret)
