from __future__ import annotations

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status

from app.middleware.auth import get_current_user
from app.models.schemas import (
    CheckoutRequest,
    CheckoutResponse,
    CurrentUser,
    Plan,
    PortalRequest,
    PortalResponse,
    Subscription,
    UsageSummary,
)
from app.services.billing_service import (
    PLANS,
    construct_webhook_event,
    create_checkout_session,
    create_portal_session,
)

router = APIRouter(prefix="/api/billing", tags=["billing"])


@router.get("/plans", response_model=list[Plan])
async def list_plans() -> list[Plan]:
    return PLANS


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(
    req: CheckoutRequest,
    user: CurrentUser = Depends(get_current_user),
) -> CheckoutResponse:
    result = await create_checkout_session(
        user.id, req.price_id, req.success_url, req.cancel_url
    )
    return CheckoutResponse(**result)


@router.post("/portal", response_model=PortalResponse)
async def create_portal(
    req: PortalRequest,
    user: CurrentUser = Depends(get_current_user),
) -> PortalResponse:
    # In production, look up customer_id from DB
    customer_id = f"cus_{user.id[:8]}"  # placeholder
    result = await create_portal_session(customer_id, req.return_url)
    return PortalResponse(**result)


@router.get("/subscription", response_model=Subscription | None)
async def get_subscription(
    _user: CurrentUser = Depends(get_current_user),
) -> Subscription | None:
    # In production, fetch from supabase subscriptions table
    return None


@router.get("/usage", response_model=UsageSummary)
async def get_usage(
    _user: CurrentUser = Depends(get_current_user),
) -> UsageSummary:
    # In production, fetch from supabase usage_events table
    return UsageSummary(
        ocr_pages_used=0,
        ocr_pages_limit=100,
        translate_words_used=0,
        translate_words_limit=50000,
        tts_minutes_used=0.0,
        tts_minutes_limit=30.0,
        vault_bytes_used=0,
        vault_bytes_limit=5 * 1024 * 1024 * 1024,
    )


@router.post("/webhook", status_code=200)
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(alias="stripe-signature"),
) -> dict:
    payload = await request.body()
    try:
        event = construct_webhook_event(payload, stripe_signature)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    event_type = event["type"]

    if event_type == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session.get("metadata", {}).get("user_id")
        # In production: create subscription record in DB
        _ = user_id

    elif event_type in ("customer.subscription.updated", "customer.subscription.deleted"):
        # In production: update subscription status in DB
        pass

    elif event_type == "invoice.payment_failed":
        # In production: send payment failure email
        pass

    return {"received": True}
