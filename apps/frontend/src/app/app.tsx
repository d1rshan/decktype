import { createEffect, createMemo } from "solid-js";
import { Router, Route, useNavigate, useSearchParams } from "@solidjs/router";
import { games } from "@/features/games/core/registry";
import { getHomeGamePath } from "@/features/games/core/utils";
import type { GameId } from "@/features/games/core/types";
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
