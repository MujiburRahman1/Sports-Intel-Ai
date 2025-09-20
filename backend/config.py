from __future__ import annotations

import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()  # Re-enabled for API keys

@dataclass
class Settings:
    """Lightweight settings loader.
    Reads from environment variables. python-dotenv will load a .env if called by the app.
    """

    NEWS_API_KEY: str | None = os.getenv("NEWS_API_KEY")
    YOUTUBE_API_KEY: str | None = os.getenv("YOUTUBE_API_KEY")
    ELEVEN_AGENT_ID: str | None = os.getenv("ELEVEN_AGENT_ID")
    TOOL_TOKEN: str | None = os.getenv("TOOL_TOKEN")

    # Provide both UPPER and lower-case convenience attributes
    @property
    def news_api_key(self) -> str | None:
        return self.NEWS_API_KEY

    @property
    def youtube_api_key(self) -> str | None:
        return self.YOUTUBE_API_KEY


settings = Settings()
