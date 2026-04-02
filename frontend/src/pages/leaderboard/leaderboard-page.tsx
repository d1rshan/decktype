const leaderboardRows = [
  { rank: 1, player: 'voidline', mode: 'falling words', score: 219, accuracy: '98.5%', date: '30 Mar 2026' },
  { rank: 2, player: 'keystorm', mode: 'falling words', score: 201, accuracy: '97.2%', date: '29 Mar 2026' },
  { rank: 3, player: 'nightgrid', mode: 'falling words', score: 188, accuracy: '99.1%', date: '28 Mar 2026' },
  { rank: 4, player: 'd1rsh', mode: 'falling words', score: 156, accuracy: '95.0%', date: '27 Mar 2026' },
]

function LeaderboardPage() {
  return (
    <div class="flex flex-col gap-12">
      <div class="flex items-end justify-between">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-bold tracking-tight text-[var(--text)]">
            all-time leaderboard
          </h1>
          <p class="text-xs tracking-widest text-[var(--sub)] uppercase opacity-60">
            top typing performances across all modes
          </p>
        </div>

        <div class="flex items-center gap-2 rounded-lg bg-[var(--sub-alt)] p-1 text-[10px] font-bold uppercase tracking-widest">
          <button class="rounded-md bg-[var(--bg)] px-3 py-1.5 text-[var(--main)] shadow-sm">all-time</button>
          <button class="rounded-md px-3 py-1.5 text-[var(--sub)] hover:text-[var(--text)]">daily</button>
          <button class="rounded-md px-3 py-1.5 text-[var(--sub)] hover:text-[var(--text)]">weekly</button>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl bg-[var(--sub-alt)]/20">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] font-bold uppercase tracking-widest text-[var(--sub)] opacity-50 border-b border-[var(--sub)]/10">
              <th class="px-8 py-6 font-bold">#</th>
              <th class="px-8 py-6 font-bold">name</th>
              <th class="px-8 py-6 font-bold text-center">mode</th>
              <th class="px-8 py-6 font-bold text-right">accuracy</th>
              <th class="px-8 py-6 font-bold text-right">score</th>
              <th class="px-8 py-6 font-bold text-right">date</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            {leaderboardRows.map((row) => (
              <tr class="group border-b border-[var(--sub)]/5 transition hover:bg-[var(--sub-alt)]/30 last:border-0">
                <td class="px-8 py-6 text-[var(--sub)] font-bold group-hover:text-[var(--main)]">{row.rank}</td>
                <td class="px-8 py-6 font-bold text-[var(--text)]">{row.player}</td>
                <td class="px-8 py-6 text-center text-[var(--sub)]">{row.mode}</td>
                <td class="px-8 py-6 text-right text-[var(--sub)]">{row.accuracy}</td>
                <td class="px-8 py-6 text-right font-bold text-[var(--main)]">{row.score}</td>
                <td class="px-8 py-6 text-right text-[var(--sub)] text-xs">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LeaderboardPage
