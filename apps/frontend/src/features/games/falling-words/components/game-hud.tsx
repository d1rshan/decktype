import { Stat } from "@/features/games/components/stat";
import { GameHud } from "@/features/games/components/game-hud";

type GameHudProps = {
  score: number;
  typedValue: string;
};

function Hud(props: GameHudProps) {
  return (
    <GameHud>
      <Stat label="score" value={props.score} highlight />
      <Stat label="input" value={props.typedValue || "..."} />
    </GameHud>
  );
}

export default Hud;
