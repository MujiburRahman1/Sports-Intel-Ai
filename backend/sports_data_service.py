from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional, Dict

from news_service import NewsService, NewsArticle, get_team_search_terms
from youtube_service import search_videos, VideoItem

logger = logging.getLogger(__name__)


@dataclass
class TeamIntelligence:
    """Aggregated intelligence data for an MLB team."""
    team_name: str
    news_articles: List[NewsArticle]
    youtube_videos: List[VideoItem]
    generated_at: datetime
    summary: Optional[str] = None


class SportsDataService:
    """Service for aggregating sports intelligence from multiple sources."""

    def __init__(self) -> None:
        self.news_service = NewsService()

    def get_team_intelligence(
        self,
        team_name: str,
        days_back: int = 7,
        max_news: int = 10,
        max_videos: int = 10,
    ) -> TeamIntelligence:
        logger.info("Gathering intelligence for %s", team_name)

        search_terms = get_team_search_terms(team_name)
        primary_term = search_terms[0]

        news_articles = self.news_service.search_team_news(primary_term, days_back, max_news)

        youtube_query = f"{primary_term} MLB baseball highlights analysis"
        youtube_videos = search_videos(youtube_query, max_videos)

        return TeamIntelligence(
            team_name=primary_term,
            news_articles=news_articles,
            youtube_videos=youtube_videos,
            generated_at=datetime.now(),
        )

    def get_opponent_analysis(
        self,
        team1: str,
        team2: str,
        days_back: int = 7,
    ) -> Dict[str, TeamIntelligence]:
        logger.info("Analyzing matchup: %s vs %s", team1, team2)
        return {
            team1: self.get_team_intelligence(team1, days_back),
            team2: self.get_team_intelligence(team2, days_back),
        }

    def generate_intelligence_summary(self, intelligence: TeamIntelligence) -> str:
        summary_parts: List[str] = []
        summary_parts.append(f"# Intelligence Report: {intelligence.team_name}")
        summary_parts.append(f"Generated: {intelligence.generated_at.strftime('%Y-%m-%d %H:%M')}")
        summary_parts.append("")

        summary_parts.append("## Recent News Articles")
        if intelligence.news_articles:
            for i, article in enumerate(intelligence.news_articles[:5], 1):
                summary_parts.append(f"{i}. **{article.title}**")
                summary_parts.append(f"   Source: {article.source}")
                summary_parts.append(f"   Published: {article.published_at.strftime('%Y-%m-%d')}")
                if article.description:
                    summary_parts.append(f"   Summary: {article.description[:150]}...")
                summary_parts.append(f"   Link: {article.url}")
                summary_parts.append("")
        else:
            summary_parts.append("No recent news articles found.")
            summary_parts.append("")

        summary_parts.append("## Recent YouTube Videos")
        if intelligence.youtube_videos:
            for i, video in enumerate(intelligence.youtube_videos[:5], 1):
                summary_parts.append(f"{i}. **{video.title}**")
                if video.channel:
                    summary_parts.append(f"   Channel: {video.channel}")
                if video.view_count:
                    summary_parts.append(f"   Views: {video.view_count:,}")
                summary_parts.append(f"   Link: {video.url}")
                summary_parts.append("")
        else:
            summary_parts.append("No recent videos found.")
            summary_parts.append("")

        return "\n".join(summary_parts)

    def generate_matchup_summary(self, matchup_data: Dict[str, TeamIntelligence]) -> str:
        teams = list(matchup_data.keys())
        if len(teams) != 2:
            return "Invalid matchup data - need exactly 2 teams"
        team1, team2 = teams
        intel1, intel2 = matchup_data[team1], matchup_data[team2]

        summary_parts: List[str] = []
        summary_parts.append(f"# Strategic Matchup Analysis: {team1} vs {team2}")
        summary_parts.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        summary_parts.append("")

        summary_parts.append(f"## {team1} Intelligence")
        summary_parts.append(f"- Recent news articles: {len(intel1.news_articles)}")
        summary_parts.append(f"- Recent videos: {len(intel1.youtube_videos)}")
        if intel1.news_articles:
            summary_parts.append("### Top Headlines:")
            for article in intel1.news_articles[:3]:
                summary_parts.append(f"- {article.title} ({article.source})")
        summary_parts.append("")

        summary_parts.append(f"## {team2} Intelligence")
        summary_parts.append(f"- Recent news articles: {len(intel2.news_articles)}")
        summary_parts.append(f"- Recent videos: {len(intel2.youtube_videos)}")
        if intel2.news_articles:
            summary_parts.append("### Top Headlines:")
            for article in intel2.news_articles[:3]:
                summary_parts.append(f"- {article.title} ({article.source})")
        summary_parts.append("")

        summary_parts.append("## Strategic Notes")
        summary_parts.append("- Review recent performance trends in the articles above")
        summary_parts.append("- Check video analysis for tactical insights")
        summary_parts.append("- Look for injury reports or roster changes")
        summary_parts.append("- Analyze recent game outcomes and patterns")

        return "\n".join(summary_parts)
