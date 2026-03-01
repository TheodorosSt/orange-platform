from __future__ import annotations

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from app.config import settings
from app.models.schemas import CurrentUser

_bearer = HTTPBearer(auto_error=True)


def _get_jwks_uri() -> str:
    base = settings.supabase_url.rstrip("/")
    return f"{base}/auth/v1/jwks"


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> CurrentUser:
    token = credentials.credentials
    try:
        # Try decoding with the JWT secret directly first (HS256)
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        user_id: str = payload.get("sub", "")
        email: str = payload.get("email", "")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return CurrentUser(id=user_id, email=email)
    except JWTError:
        # Fallback: fetch JWKS and try RS256
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(_get_jwks_uri(), timeout=5.0)
                resp.raise_for_status()
                jwks = resp.json()

            from jose.backends import RSAKey  # noqa: F401 - available via python-jose
            header = jwt.get_unverified_header(token)
            kid = header.get("kid")
            key = next(
                (k for k in jwks.get("keys", []) if k.get("kid") == kid),
                jwks.get("keys", [None])[0],
            )
            if key is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No matching key")
            payload = jwt.decode(
                token,
                key,
                algorithms=["RS256"],
                options={"verify_aud": False},
            )
            user_id = payload.get("sub", "")
            email = payload.get("email", "")
            if not user_id:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
            return CurrentUser(id=user_id, email=email)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            ) from exc
