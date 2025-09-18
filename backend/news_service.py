from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import List, Optional

from newsapi import NewsApiClient

from config import settings

logger = logging.getLogger(__name__)


@dataclass
class NewsArticle:
    title: str
    description: str
    url: str
    source: str
    published_at: datetime
    url_to_image: Optional[str] = None


class NewsService:
    """Service for fetching recent news articles about a topic or team.

    Note: This function is intentionally generic and does not inject any
    MLB-specific keywords. It can be reused across different domains.
    """

    def __init__(self) -> None:
        self.api_key = settings.NEWS_API_KEY or settings.news_api_key
        if not self.api_key:
            logger.warning("NEWS_API_KEY not found in environment variables")
            self.client = None
        else:
            self.client = NewsApiClient(api_key=self.api_key)

    def search_team_news(
        self,
        team_name: str,
        days_back: int = 7,
        max_results: int = 10,
    ) -> List[NewsArticle]:
        """
        Search for recent news articles about a specific topic or team.
        """
        if not self.client:
            logger.error("NewsAPI client not initialized - missing API key")
            return []

        try:
            to_date = datetime.now()
            from_date = to_date - timedelta(days=days_back)
            # Generic query: do not inject MLB-specific terms so this can be reused broadly
            query = team_name.strip()

            response = self.client.get_everything(
                q=query,
                from_param=from_date.strftime('%Y-%m-%d'),
                to=to_date.strftime('%Y-%m-%d'),
                language='en',
                sort_by='publishedAt',
                page_size=max_results,
            )

            articles: List[NewsArticle] = []
            if response.get('status') == 'ok':
                for article_data in response.get('articles', []):
                    try:
                        published_at = article_data.get('publishedAt')
                        dt = datetime.fromisoformat(published_at.replace('Z', '+00:00')) if published_at else datetime.now()
                        article = NewsArticle(
                            title=article_data.get('title') or '',
                            description=article_data.get('description') or '',
                            url=article_data.get('url') or '',
                            source=(article_data.get('source') or {}).get('name') or 'Unknown',
                            published_at=dt,
                            url_to_image=article_data.get('urlToImage'),
                        )
                        articles.append(article)
                    except Exception as e:  # pragma: no cover
                        logger.warning("Error parsing article: %s", e)
                        continue

            logger.info("Found %d articles for %s", len(articles), team_name)
            return articles
        except Exception as e:  # pragma: no cover
            logger.error("Error searching news for %s: %s", team_name, e)
            return []


# Common MLB team name mappings for better search results
MLB_TEAM_ALIASES = {
    'yankees': ['Yankees', 'New York Yankees', 'NY Yankees'],
    'red sox': ['Red Sox', 'Boston Red Sox'],
    'dodgers': ['Dodgers', 'Los Angeles Dodgers', 'LA Dodgers'],
    'giants': ['Giants', 'San Francisco Giants', 'SF Giants'],
    'cubs': ['Cubs', 'Chicago Cubs'],
    'mets': ['Mets', 'New York Mets', 'NY Mets'],
    'astros': ['Astros', 'Houston Astros'],
    'braves': ['Braves', 'Atlanta Braves'],
    'phillies': ['Phillies', 'Philadelphia Phillies'],
    'padres': ['Padres', 'San Diego Padres'],
    'angels': ['Angels', 'Los Angeles Angels', 'LA Angels'],
    'mariners': ['Mariners', 'Seattle Mariners'],
    'rangers': ['Rangers', 'Texas Rangers'],
    'athletics': ['Athletics', 'Oakland Athletics', "A's"],
    'blue jays': ['Blue Jays', 'Toronto Blue Jays'],
    'orioles': ['Orioles', 'Baltimore Orioles'],
    'rays': ['Rays', 'Tampa Bay Rays'],
    'white sox': ['White Sox', 'Chicago White Sox'],
    'guardians': ['Guardians', 'Cleveland Guardians'],
    'tigers': ['Tigers', 'Detroit Tigers'],
    'twins': ['Twins', 'Minnesota Twins'],
    'royals': ['Royals', 'Kansas City Royals'],
    'cardinals': ['Cardinals', 'St. Louis Cardinals'],
    'brewers': ['Brewers', 'Milwaukee Brewers'],
    'reds': ['Reds', 'Cincinnati Reds'],
    'pirates': ['Pirates', 'Pittsburgh Pirates'],
    'nationals': ['Nationals', 'Washington Nationals'],
    'marlins': ['Marlins', 'Miami Marlins'],
    'diamondbacks': ['Diamondbacks', 'Arizona Diamondbacks'],
    'rockies': ['Rockies', 'Colorado Rockies'],
}


def get_team_search_terms(team_input: str) -> List[str]:
    """Get optimized search terms for a team based on user input."""
    team_lower = team_input.lower().strip()
    for key, aliases in MLB_TEAM_ALIASES.items():
        if team_lower in key or any(team_lower in alias.lower() for alias in aliases):
            return aliases
    return [team_input.title()]
