export interface Contestant {
  rank: 1 | 2 | 3;
  name: string;
  score: string;
  tagline: string;
  icon: string;
  team: string;
  position: string;
}

export const contestants: Contestant[] = [
  {
    rank: 1,
    name: 'Marcus "The Flash" Dupont',
    score: "47 PTS · 12 AST · 8 REB",
    tagline: "They said guard the perimeter. Nobody said guard the sky.",
    icon: "🏀",
    team: "Neoja Flames",
    position: "Point Guard · #7",
  },
  {
    rank: 2,
    name: "Yael Shavit",
    score: "38 PTS · 6 AST · 14 REB",
    tagline: "Every rebound is a second chance. I don't need a third.",
    icon: "🔥",
    team: "Neoja Thunder",
    position: "Power Forward · #23",
  },
  {
    rank: 3,
    name: 'Diego "Crossover" Ruiz',
    score: "32 PTS · 9 AST · 5 REB",
    tagline: "The ankle breaker they warned you about? That's me.",
    icon: "⚡",
    team: "Neoja Vipers",
    position: "Shooting Guard · #11",
  },
];

export const themeConfig = {
  title: "NEOJA FINALS",
  subtitle: "Interactive Basketball Championship 2026",
  location: "Neoja Arena · Beit Shemesh · Israel",
  year: "Season VII",
  tagline: "Where legends light up the court.",
} as const;
