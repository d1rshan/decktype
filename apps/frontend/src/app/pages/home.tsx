import { createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";

import { GameCards } from "@/features/games/shared/components/GameCards";
import { FeedbackFeed } from "@/features/feedback/components/feedback-feed";
import { games } from "@/features/games/shared/registry";
import type { GameId } from "@/features/games/shared/types";
import type { WordBankId } from "@/features/content/word-banks/types";

type HomeProps = {
  selectedGameId: GameId | null;
  selectedWordBankId: WordBankId | null;
  onSelectGame: (gameId: GameId) => void;
};

function HomePage(props: HomeProps) {
  const selectedGame = createMemo(() =>
    props.selectedGameId ? (games[props.selectedGameId] ?? null) : null,
  );
  const selectedGameView = createMemo(() => selectedGame()?.View ?? null);

  return (
    <div class="flex flex-1 flex-col gap-12">
      {!props.selectedGameId && (
        <>
          <GameCards
            activeGameId={props.selectedGameId}
            onSelectGame={props.onSelectGame}
          />
          <FeedbackFeed />
        </>
      )}

      {props.selectedGameId && selectedGameView() && (
        <Dynamic
          component={selectedGameView()!}
          wordBankId={props.selectedWordBankId}
        />
      )}
    </div>
  );
}

export default HomePage;
