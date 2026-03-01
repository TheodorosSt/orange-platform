from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    supabase_jwt_secret: str

    # Google Cloud Vision
    google_application_credentials: str = ""

    # DeepL
    deepl_api_key: str

    # ElevenLabs
    elevenlabs_api_key: str

    # Stripe
    stripe_secret_key: str
    stripe_webhook_secret: str
    stripe_starter_price_id: str
    stripe_pro_price_id: str
    stripe_enterprise_price_id: str

    # Resend
    resend_api_key: str
    from_email: str = "noreply@orange.digital"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Sentry
    sentry_dsn_backend: str = ""

    # App
    debug: bool = False
    allowed_origins: str = "http://localhost:5173"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]


settings = Settings()
