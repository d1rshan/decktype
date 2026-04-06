import { For, Show } from 'solid-js'

import { useContributorsQuery } from '@/features/contributors/api/hooks'
import { getErrorMessage } from '@/lib/api-client'

function formatSyncedAt(value: string | null) {
  if (!value) {
    return 'not synced yet'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function AboutPage() {
  const contributorsQuery = useContributorsQuery({
    limit: () => 200,
  })

  return (
    <div class="w-full min-h-[72vh] space-y-6">
      <section class="rounded-xl bg-(--sub-alt)/32 p-5 ring-1 ring-(--sub)/14">
        <h1 class="t-page-title leading-tight text-(--text)">about decktype</h1>
        <p class="t-body mt-3 max-w-3xl text-(--sub)">
          decktype is inspired by monkeytype&apos;s speed-typing experience. the project takes
          inspiration from the flow and focus of monkeytype while building its own direction.
        </p>
        <div class="t-body mt-4 flex flex-wrap gap-3">
          <a
            href="https://monkeytype.com"
            target="_blank"
            rel="noreferrer"
            class="rounded-md border border-(--sub)/35 px-3 py-1.5 text-(--sub) transition hover:text-(--text)"
          >
            monkeytype website
          </a>
          <a
            href="https://github.com/monkeytypegame/monkeytype"
            target="_blank"
            rel="noreferrer"
            class="rounded-md border border-(--sub)/35 px-3 py-1.5 text-(--sub) transition hover:text-(--text)"
          >
            monkeytype github
          </a>
        </div>
      </section>

      <section class="rounded-xl bg-(--sub-alt)/32 p-5 ring-1 ring-(--sub)/14">
        <div class="t-label font-semibold uppercase tracking-[0.16em] text-(--sub)">
          creator
        </div>
        <div class="t-title mt-2 text-(--text)">d1rshan</div>
        <div class="t-body mt-3 flex flex-wrap gap-3">
          <a
            href="https://github.com/d1rshan"
            target="_blank"
            rel="noreferrer"
            class="rounded-md border border-(--sub)/35 px-3 py-1.5 text-(--sub) transition hover:text-(--text)"
          >
            github profile
          </a>
          <a
            href="https://github.com/d1rshan/decktype"
            target="_blank"
            rel="noreferrer"
            class="rounded-md border border-(--sub)/35 px-3 py-1.5 text-(--sub) transition hover:text-(--text)"
          >
            decktype repository
          </a>
        </div>
      </section>

      <section class="rounded-xl bg-(--sub-alt)/32 p-5 ring-1 ring-(--sub)/14">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="t-label font-semibold uppercase tracking-[0.16em] text-(--sub)">
              contributors
            </div>
            <div class="t-body mt-1 text-(--sub)">
              synced: {formatSyncedAt(contributorsQuery.data?.syncedAt ?? null)}
            </div>
          </div>
          <a
            href="https://github.com/d1rshan/decktype/graphs/contributors"
            target="_blank"
            rel="noreferrer"
            class="t-body rounded-md border border-(--sub)/35 px-3 py-1.5 text-(--sub) transition hover:text-(--text)"
          >
            view on github
          </a>
        </div>

        <Show when={contributorsQuery.isPending}>
          <div class="t-body mt-4 rounded-lg bg-(--sub-alt) px-4 py-4 text-(--sub)">
            loading contributors...
          </div>
        </Show>

        <Show when={contributorsQuery.error}>
          <div class="t-body mt-4 rounded-lg bg-(--sub-alt) px-4 py-4 text-(--error)">
            {getErrorMessage(contributorsQuery.error, 'Unable to load contributors.')}
          </div>
        </Show>

        <Show when={contributorsQuery.data && contributorsQuery.data.contributors.length > 0}>
          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <For each={contributorsQuery.data?.contributors ?? []}>
              {(contributor) => (
                <a
                  href={contributor.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  class="flex items-center gap-3 rounded-lg bg-(--sub-alt)/52 px-3 py-3 transition hover:bg-(--sub-alt)/74"
                >
                  <div class="h-9 w-9 overflow-hidden rounded-full ring-1 ring-(--sub)/35">
                    <img
                      src={contributor.avatarUrl}
                      alt={`${contributor.login} avatar`}
                      class="h-full w-full object-cover opacity-90"
                      loading="lazy"
                    />
                  </div>
                  <div class="min-w-0">
                    <div class="t-body truncate text-(--text)">
                      {contributor.displayName ?? contributor.login}
                    </div>
                    <div class="t-caption truncate text-(--sub)">
                      @{contributor.login} • {contributor.contributions} contributions
                    </div>
                  </div>
                </a>
              )}
            </For>
          </div>
        </Show>

        <Show when={contributorsQuery.data && contributorsQuery.data.contributors.length === 0}>
          <div class="t-body mt-4 rounded-lg bg-(--sub-alt) px-4 py-4 text-(--sub)">
            no contributors found yet
          </div>
        </Show>
      </section>

      <div class="t-caption text-(--sub)">
        thank you to everyone who contributed code, feedback, and ideas.
      </div>
    </div>
  )
}

export default AboutPage
