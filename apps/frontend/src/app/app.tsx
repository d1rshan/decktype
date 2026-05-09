import { createEffect, createMemo } from "solid-js";
import { Router, Route, useNavigate, useSearchParams } from "@solidjs/router";
import { games } from "@/features/games/registry";
import { getHomeGamePath } from "@/features/games/utils";
import AboutPage from "@/app/pages/about";
import AdminPage from "@/app/pages/admin";
import HomePage from "@/app/pages/home";
import Layout from "@/app/layout";
import LeaderboardPage from "@/app/pages/leaderboard";
import ProfilePage from "@/app/pages/profile";
import type { GameId } from "@/features/games/types";
import type { WordBankId } from "@/features/content/word-banks/types";

function App() {
  return (
    <Router root={Layout}>
      <Route
        path="/"
        component={() => {
          const navigate = useNavigate();
          const [searchParams] = useSearchParams();
          const selectedGameId = createMemo(
            () => searchParams.game as GameId | null,
          );
          const selectedWordBankId = createMemo(
            () => (searchParams.wordBank || "english/core-1k") as WordBankId,
          );

          createEffect(() => {
            const gameId = selectedGameId();
            if (gameId && !games[gameId]) {
              navigate("/", { replace: true });
            }
          });

          return (
            <HomePage
              selectedGameId={selectedGameId()}
              selectedWordBankId={selectedWordBankId()}
              onSelectGame={(gameId) =>
                navigate(getHomeGamePath(gameId, selectedWordBankId()))
              }
            />
          );
        }}
      />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/profile/:username" component={ProfilePage} />
      <Route path="/about" component={AboutPage} />
      <Route
        path="*paramName"
        component={() => {
          const navigate = useNavigate();
          navigate("/", { replace: true });
          return null;
        }}
      />
    </Router>
  );
}

export default App;
