import { Table, type TableColumn } from "@/components/table";
import type { Accessor } from "solid-js";

import { useLeaderboardQuery } from "@/features/leaderboard/api";
import type {
  LeaderboardDifficulty,
  LeaderboardEntry,
} from "@/features/leaderboard/types";
import { QueryState } from "@/components/query-state";

function formatLeaderboardDateTime(value: string | Date) {
  const date = new Date(value);
  const month = date.toLocaleString(undefined, { month: "short" });
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return (
    <>
      <span class="block">
        {date.getDate()} {month} {date.getFullYear()}
      </span>
      <span class="block">
        {hours}:{minutes}
      </span>
    </>
  );
}

const columns: TableColumn<LeaderboardEntry>[] = [
  {
    id: "rank",
    label: "#",
    align: "left",
    value: (entry) => entry.rank,
  },
  {
    id: "player",
    label: "player",
    align: "left",
    value: (entry) => entry.displayName,
  },
  {
    id: "score",
    label: "score",
    align: "left",
    value: (entry) => entry.bestScore,
  },
  {
    id: "difficulty",
    label: "difficulty",
    align: "left",
    value: (entry) => entry.difficulty,
  },
  {
    id: "date",
    label: "date",
    align: "left",
    value: (entry) => formatLeaderboardDateTime(entry.createdAt),
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
      {(entries) => (
        <Table
          columns={columns}
          rows={entries}
          templateColumns="2.75rem minmax(7rem,1fr) 5rem 6.5rem 8.5rem"
          minTableWidth={540}
          mobileTemplateColumns="1rem minmax(2.5rem,1fr) 2.25rem 3.4rem 4.5rem"
        />
      )}
    </QueryState>
  );
}
