import { useNavigate, useLocation, useSearchParams } from "@solidjs/router";
import { themes } from "@/features/content/themes/registry";
import { wordBanks } from "@/features/content/word-banks/registry";
import type { WordBankId } from "@/features/content/word-banks/types";
import { gameRegistry } from "@/features/games/registry";
import { getHomeGamePath } from "@/features/games/utils";
import type { ThemeName } from "@/features/content/themes/types";
import type {
  CommandlineItem,
  CommandlineScope,
} from "@/features/commandline/types";
import type { GameId } from "@/features/games/types";
import { themeManager } from "@/features/content/themes/manager";
import { useAuthSession } from "@/features/auth/hooks";

export function createCommandlineRegistry(
  setScope: (scope: CommandlineScope) => void,
): Record<CommandlineScope, CommandlineItem[]> {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const auth = useAuthSession();

  const currentPath = () => location.pathname;
  const selectedGameId = () => searchParams.game as GameId | null;
  const selectedWordBankId = () =>
    (searchParams.wordBank || "english/core-1k") as WordBankId;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleSelectGame = (gameId: GameId | null) => {
    navigate(getHomeGamePath(gameId, selectedWordBankId()));
  };

  const handleSelectWordBank = (wordBankId: WordBankId) => {
    navigate(`/?game=${selectedGameId() || ""}&wordBank=${wordBankId}`);
  };

  return {
    root: [
      {
        id: "group-navigate",
        label: "Navigate",
        keywords: ["navigate", "pages", "routes", "view"],
        onSelect: () => setScope("navigate"),
      },
      {
        id: "group-games",
        label: "Games",
        keywords: ["games", "modes", "select game"],
        onSelect: () => setScope("games"),
      },
      {
        id: "group-word-banks",
        label: "Word Banks",
        keywords: ["word banks", "language", "words", "dictionary"],
        onSelect: () => setScope("word-banks"),
      },
      {
        id: "group-themes",
        label: "Themes",
        keywords: ["themes", "colors", "appearance", "style"],
        onSelect: () => setScope("themes"),
      },
    ],
    navigate: [
      {
        id: "route-home",
        label: "View Typing Page",
        keywords: ["home", "typing page", "main"],
        active: currentPath() === "/" && !selectedGameId(),
        onSelect: () => handleNavigate("/"),
      },
      {
        id: "route-leaderboard",
        label: "View Leaderboard Page",
        keywords: ["leaderboard", "scores", "ranking"],
        active: currentPath() === "/leaderboard",
        onSelect: () => handleNavigate("/leaderboard"),
      },
      {
        id: "route-about",
        label: "View About Page",
        keywords: ["about", "info", "mission"],
        active: currentPath() === "/about",
        onSelect: () => handleNavigate("/about"),
      },
      {
        id: "route-profile",
        label: "View Account Page",
        keywords: ["profile", "account", "user"],
        active:
          currentPath() === "/profile" || currentPath().startsWith("/profile/"),
        onSelect: () =>
          handleNavigate(
            auth.isAuthenticated() ? `/profile/${auth.username()}` : "/profile",
          ),
      },
    ],
    games: gameRegistry.map((game) => ({
      id: `game-${game.id}`,
      label: game.name,
      keywords: [game.name, game.id, game.description],
      active: selectedGameId() === game.id,
      onSelect: () => handleSelectGame(game.id),
    })),
    themes: (Object.keys(themes) as ThemeName[]).map((themeName) => ({
      id: `theme-${themeName}`,
      label: themeName.replace(/_/g, " "),
      keywords: [themeName, "theme", "color"],
      active: themeManager.current === themeName,
      onSelect: () => themeManager.select(themeName),
    })),
    "word-banks": (
      Object.entries(wordBanks) as [
        WordBankId,
        (typeof wordBanks)[WordBankId],
      ][]
    ).map(([id, wordBank]) => ({
      id: `word-bank-${id}`,
      label: wordBank.label,
      keywords: [wordBank.label, wordBank.language, wordBank.variant, id],
      active: selectedWordBankId() === id,
      onSelect: () => handleSelectWordBank(id),
    })),
  };
}
