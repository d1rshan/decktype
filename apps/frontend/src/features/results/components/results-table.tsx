import { Table, type TableColumn } from "@/components/table";
import { useAuthSession } from "@/features/auth/hooks";
import { useMyResultsQuery } from "@/features/results/api";
import type { Result } from "@/features/results/types";
import { getGameName } from "@/features/games/utils";
import { QueryState } from "@/components/query-state";

function formatResultsDateTime(value: string | Date) {
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

const columns: TableColumn<Result>[] = [
  {
    id: "game",
    label: "game",
    align: "left",
    value: (result) => getGameName(result.gameId),
  },
  {
    id: "score",
    label: "score",
    align: "left",
    value: (result) => result.score,
  },
  {
    id: "difficulty",
    label: "difficulty",
    align: "left",
    value: (result) => result.difficulty,
  },
  {
    id: "date",
    label: "date",
    align: "left",
    value: (result) => formatResultsDateTime(result.createdAt),
  },
];

function ResultsTable() {
  const auth = useAuthSession();
  const resultsQuery = useMyResultsQuery({
    enabled: auth.isAuthenticated,
    limit: () => 12,
  });

  return (
    <QueryState query={resultsQuery} emptyMessage="no results yet">
      {(results) => (
        <Table
          columns={columns}
          rows={results}
          templateColumns="minmax(9rem, 1fr) 5rem 6.5rem 8.5rem"
          minTableWidth={520}
          mobileTemplateColumns="minmax(5rem, 1fr) 2.5rem 3.5rem 5rem"
        />
      )}
    </QueryState>
  );
}

export default ResultsTable;
