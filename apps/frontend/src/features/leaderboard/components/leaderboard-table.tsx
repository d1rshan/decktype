import { Table, type TableColumn } from "@/components/table";
import type { Accessor } from "solid-js";

import {
  useLeaderboardQuery,
  type LeaderboardDifficulty,
  type LeaderboardEntry,
} from "@/features/leaderboard/api";
import { formatDateTime } from "@/lib/utils";
import { QueryState } from "@/components/query-state";

const columns: TableColumn<LeaderboardEntry>[] = [
  {
    id: "rank",
    label: "#",
    value: (entry) => entry.rank,
  },
  {
    id: "player",
    label: "player",
    value: (entry) => entry.displayName,
  },
  {
    id: "score",
    label: "score",
    value: (entry) => entry.bestScore,
  },
  {
    id: "difficulty",
    label: "difficulty",
    value: (entry) => entry.difficulty,
  },
  {
    id: "date",
    label: "date",
    value: (entry) => formatDateTime(entry.createdAt),
  },
];

type LeaderboardTableProps = {
  gameId: Accessor<string>;
  difficulty: Accessor<LeaderboardDifficulty>;
};

export function LeaderboardTable(props: LeaderboardTableProps) {
  const leaderboardQuery = useLeaderboardQuery({
    gameId: props.gameId,
    difficulty: props.difficulty,
    limit: () => 25,
  });

  return (
    <QueryState query={leaderboardQuery} emptyMessage="no scores yet">
      {(entries) => <Table columns={columns} rows={entries} />}
    </QueryState>
  );
}
