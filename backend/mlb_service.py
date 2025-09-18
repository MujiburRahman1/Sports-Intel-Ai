from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from typing import Dict, List, Optional, Tuple

import requests

from news_service import get_team_search_terms

logger = logging.getLogger(__name__)

STATS_API = "https://statsapi.mlb.com/api/v1"

_session = requests.Session()
_team_cache: List[dict] | None = None


@dataclass
class GameInfo:
    game_pk: int
    game_date: datetime
    home_team: str
    away_team: str
    is_home: bool
    opponent: str
    venue: Optional[str]
    status: str


def _load_teams() -> List[dict]:
    global _team_cache
    if _team_cache is not None:
        return _team_cache
    params = {"sportId": 1, "activeStatus": "Yes"}
    resp = _session.get(f"{STATS_API}/teams", params=params, timeout=20)
    resp.raise_for_status()
    data = resp.json() or {}
    _team_cache = data.get("teams", [])
    return _team_cache


def resolve_team_id(team_input: str) -> Tuple[int, str] | None:
    """Resolve a user-provided team string to (teamId, teamName)."""
    teams = _load_teams()
    candidates = get_team_search_terms(team_input)
    normalized = {c.lower(): c for c in candidates}

    # Direct match on teamName or teamCode / fileCode / shortName
    for t in teams:
        names = [
            t.get("name"),
            t.get("teamName"),
            t.get("shortName"),
            t.get("clubName"),
            t.get("locationName"),
            t.get("fileCode"),
            t.get("teamCode"),
        ]
        names = [n for n in names if isinstance(n, str)]
        lowered = [n.lower() for n in names]
        for c in normalized.keys():
            if any(c in n for n in lowered):
                return t.get("id"), t.get("name")

    # Fallback: contains check against combined names
    for t in teams:
        combined = " ".join(str(v) for k, v in t.items() if isinstance(v, str)).lower()
        for c in normalized.keys():
            if c in combined:
                return t.get("id"), t.get("name")

    return None


def get_schedule(team_id: int, start: date, end: date) -> List[GameInfo]:
    params = {
        "teamId": team_id,
        "sportId": 1,
        "startDate": start.isoformat(),
        "endDate": end.isoformat(),
    }
    resp = _session.get(f"{STATS_API}/schedule", params=params, timeout=20)
    resp.raise_for_status()
    data = resp.json() or {}
    games: List[GameInfo] = []

    for d in (data.get("dates") or []):
        for g in (d.get("games") or []):
            game_pk = g.get("gamePk")
            status = (g.get("status") or {}).get("detailedState") or (g.get("status") or {}).get("abstractGameState")
            game_date = g.get("gameDate")
            dt = datetime.fromisoformat(game_date.replace("Z", "+00:00")) if game_date else datetime.now(timezone.utc)
            teams = g.get("teams", {})
            home_name = (teams.get("home") or {}).get("team", {}).get("name")
            away_name = (teams.get("away") or {}).get("team", {}).get("name")
            is_home = (teams.get("home") or {}).get("team", {}).get("id") == team_id
            opponent = away_name if is_home else home_name
            venue = (g.get("venue") or {}).get("name")

            if game_pk and home_name and away_name and opponent:
                games.append(
                    GameInfo(
                        game_pk=game_pk,
                        game_date=dt,
                        home_team=home_name,
                        away_team=away_name,
                        is_home=is_home,
                        opponent=opponent,
                        venue=venue,
                        status=status or ""
                    )
                )
    return games


def find_next_game(team_id: int, from_dt: datetime | None = None, search_days: int = 14) -> Optional[GameInfo]:
    from_dt = from_dt or datetime.now(timezone.utc)
    start = from_dt.date()
    end = start + timedelta(days=search_days)
    games = get_schedule(team_id, start, end)
    games.sort(key=lambda g: g.game_date)
    for g in games:
        if g.game_date >= from_dt and g.status.lower() not in {"final", "game over"}:
            return g
    return None


def get_team_stats(team_id: int, season: int | None = None) -> dict:
    """Return aggregated team stats for hitting and pitching.

    Primary source: `GET /teams/stats` with groups [hitting, pitching]. This endpoint
    returns league-wide splits; we filter by the provided `team_id`.
    Fallbacks: `/teams/{teamId}/stats` and a hydrate call via `/teams`.
    """
    if season is None:
        season = datetime.now().year
    params_list = [
        ("group", "hitting"),
        ("group", "pitching"),
        ("stats", "season"),
        ("season", season),
        ("sportId", 1),
    ]
    out: dict = {"season": season}

    # Primary: league endpoint; filter to our team
    try:
        resp = _session.get(f"{STATS_API}/teams/stats", params=params_list, timeout=20)
        resp.raise_for_status()
        data = resp.json() or {}
        results = (data.get("stats") or [])
        for r in results:
            group = (r.get("group") or {}).get("displayName")
            if not group:
                continue
            splits = r.get("splits") or []
            # Find the split for our team
            team_stat: dict = {}
            for sp in splits:
                team_obj = (sp.get("team") or {})
                if team_obj.get("id") == team_id:
                    team_stat = (sp.get("stat") or {})
                    break
            if team_stat:
                out[group.lower()] = team_stat
        if out.get("hitting") or out.get("pitching"):
            return out
    except Exception as e:
        logger.debug("/teams/stats primary fetch failed: %s", e)

    # Fallback 1: per-team endpoint
    try:
        resp = _session.get(f"{STATS_API}/teams/{team_id}/stats", params=params_list, timeout=20)
        resp.raise_for_status()
        data = resp.json() or {}
        results = (data.get("stats") or [])
        for r in results:
            group = (r.get("group") or {}).get("displayName")
            splits = r.get("splits") or []
            totals: dict = {}
            for s in splits:
                st = (s or {}).get("stat") or {}
                if st:
                    totals = st
                    break
            if group:
                out[group.lower()] = totals
        if out.get("hitting") or out.get("pitching"):
            return out
    except Exception as e:
        logger.debug("/teams/{teamId}/stats fallback failed: %s", e)

    # Fallback 2: hydrate team stats from /teams endpoint
    try:
        hydrate = "teamStats(group=[hitting,pitching],type=[season])"
        hparams = {
            "teamId": team_id,
            "season": season,
            "sportId": 1,
            "hydrate": hydrate,
        }
        hresp = _session.get(f"{STATS_API}/teams", params=hparams, timeout=20)
        hresp.raise_for_status()
        hdata = hresp.json() or {}
        teams = hdata.get("teams") or []
        if teams:
            team0 = teams[0] or {}
            tstats = team0.get("teamStats") or []
            for ts in tstats:
                # try group on ts or inside splits
                ts_group = (ts.get("group") or {}).get("displayName")
                for sp in (ts.get("splits") or []):
                    group = ts_group or (sp.get("group") or {}).get("displayName")
                    st = (sp or {}).get("stat") or {}
                    if group and st:
                        out[group.lower()] = st
            return out
    except Exception as e:
        logger.debug("hydrate fallback failed: %s", e)
        return out

    return out


def compare_teams(team1_id: int, team2_id: int, season: int | None = None) -> dict:
    s1 = get_team_stats(team1_id, season)
    s2 = get_team_stats(team2_id, season)

    def safe_float(d: dict, key: str) -> Optional[float]:
        v = d.get(key)
        try:
            return float(v)
        except Exception:
            return None

    hitting1 = s1.get("hitting", {})
    hitting2 = s2.get("hitting", {})
    pitching1 = s1.get("pitching", {})
    pitching2 = s2.get("pitching", {})

    comparison = {
        "season": s1.get("season"),
        "hitting": {
            "avg": [safe_float(hitting1, "avg"), safe_float(hitting2, "avg")],
            "obp": [safe_float(hitting1, "obp"), safe_float(hitting2, "obp")],
            "slg": [safe_float(hitting1, "slg"), safe_float(hitting2, "slg")],
            "runs": [safe_float(hitting1, "runs"), safe_float(hitting2, "runs")],
            "homeRuns": [safe_float(hitting1, "homeRuns"), safe_float(hitting2, "homeRuns")],
        },
        "pitching": {
            "era": [safe_float(pitching1, "era"), safe_float(pitching2, "era")],
            "whip": [safe_float(pitching1, "whip"), safe_float(pitching2, "whip")],
            "strikeouts": [safe_float(pitching1, "strikeOuts"), safe_float(pitching2, "strikeOuts")],
        },
    }
    return comparison
