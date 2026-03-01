from __future__ import annotations

import resend  # type: ignore
from app.config import settings

resend.api_key = settings.resend_api_key


async def send_welcome_email(to_email: str, name: str = "") -> None:
    resend.Emails.send({
        "from": settings.from_email,
        "to": [to_email],
        "subject": "Καλώς ήρθατε στο ORANGE!",
        "html": f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1714; color: #e8e0d4; padding: 40px; border-radius: 12px;">
            <h1 style="color: #bf913a; font-size: 32px; margin-bottom: 16px;">Καλώς ήρθατε στο ORANGE</h1>
            <p style="color: #a09888; font-size: 16px; line-height: 1.6;">{"Αγαπητέ " + name + "," if name else "Αγαπητέ χρήστη,"}</p>
            <p style="color: #a09888; font-size: 16px; line-height: 1.6;">
                Ο λογαριασμός σας δημιουργήθηκε επιτυχώς. Μπορείτε τώρα να χρησιμοποιήσετε όλες τις υπηρεσίες ORANGE.
            </p>
            <a href="https://orange.digital" style="display: inline-block; background: #bf913a; color: #1a1714; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 24px;">
                Ξεκινήστε Τώρα
            </a>
        </div>
        """,
    })


async def send_invoice_email(to_email: str, amount: float, plan_name: str) -> None:
    resend.Emails.send({
        "from": settings.from_email,
        "to": [to_email],
        "subject": f"Τιμολόγιο ORANGE — {plan_name}",
        "html": f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1714; color: #e8e0d4; padding: 40px; border-radius: 12px;">
            <h1 style="color: #bf913a;">Τιμολόγιο ORANGE</h1>
            <p style="color: #a09888;">Πλάνο: {plan_name}</p>
            <p style="color: #a09888;">Ποσό: €{amount:.2f}</p>
            <p style="color: #a09888;">Ευχαριστούμε για την εμπιστοσύνη σας!</p>
        </div>
        """,
    })


async def send_usage_warning_email(to_email: str, service: str, pct_used: float) -> None:
    resend.Emails.send({
        "from": settings.from_email,
        "to": [to_email],
        "subject": "ORANGE — Προειδοποίηση Χρήσης",
        "html": f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1714; color: #e8e0d4; padding: 40px; border-radius: 12px;">
            <h1 style="color: #bf913a;">Προειδοποίηση Χρήσης</h1>
            <p style="color: #a09888;">Έχετε χρησιμοποιήσει <strong style="color: #e8e0d4;">{pct_used:.0f}%</strong> της υπηρεσίας <strong style="color: #e8e0d4;">{service}</strong>.</p>
            <p style="color: #a09888;">Εξετάστε την αναβάθμιση του πλάνου σας.</p>
            <a href="https://orange.digital/pricing" style="display: inline-block; background: #bf913a; color: #1a1714; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 24px;">
                Αναβαθμίστε Τώρα
            </a>
        </div>
        """,
    })
