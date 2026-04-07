import { For, Show } from 'solid-js'

import { useContributorsQuery } from '@/features/contributors/api/hooks'
import { getErrorMessage } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

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
    <div class="w-full min-h-[72vh]">
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section class="space-y-5">
          <div class="space-y-3">
            <Text variant="title" class="capitalize">about decktype</Text>
            <Text variant="body" tone="sub" class="leading-[1.75]">
              decktype is a typing project built around focus, rhythm, and keeping the interface
              out of the way. it takes inspiration from the speed and clarity of monkeytype, then
              pushes that feeling toward something a little more playful, game-like, and personal.
              the goal is simple: make typing feel smooth, fast, and good enough that you want to
              stay for another round.
            </Text>
          </div>
          <div class="flex flex-wrap gap-3">
            <Button
              as="a"
              href="https://monkeytype.com"
              target="_blank"
              rel="noreferrer"
              size="sm"
            >
              monkeytype website
            </Button>
            <Button
              as="a"
              href="https://github.com/monkeytypegame/monkeytype"
              target="_blank"
              rel="noreferrer"
              size="sm"
            >
              monkeytype github
            </Button>
          </div>
        </section>

        <section class="space-y-5">
          <div class="space-y-2">
            <Text variant="title" class="capitalize">contributors</Text>
            <Text variant="body" tone="sub">
              synced: {formatSyncedAt(contributorsQuery.data?.syncedAt ?? null)}
            </Text>
            <div class="pt-1">
              <Button
                as="a"
                href="https://github.com/d1rshan/decktype/graphs/contributors"
                target="_blank"
                rel="noreferrer"
                size="sm"
              >
                view on github
              </Button>
            </div>
          </div>

          <Show when={contributorsQuery.isPending}>
            <div class="flex min-h-32 items-center justify-center">
              <div
                class="h-8 w-8 animate-spin rounded-full border-2 border-(--sub)/35 border-t-(--main)"
                aria-label="Loading contributors"
                role="status"
              />
            </div>
          </Show>

          <Show when={contributorsQuery.error}>
            <div class="text-(--error)">
              <Text variant="body">{getErrorMessage(contributorsQuery.error, 'Unable to load contributors.')}</Text>
            </div>
          </Show>

          <Show when={contributorsQuery.data && contributorsQuery.data.contributors.length > 0}>
            <div class="space-y-3">
              <For each={contributorsQuery.data?.contributors ?? []}>
                {(contributor) => (
                  <a
                    href={contributor.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    class="group flex items-center gap-4 rounded-xl bg-(--sub-alt) px-4 py-4 transition-colors hover:bg-(--sub-alt)/84"
                  >
                    <div class="h-11 w-11 overflow-hidden rounded-full ring-1 ring-(--sub)/30">
                      <img
                        src={contributor.avatarUrl}
                        alt={`${contributor.login} avatar`}
                        class="h-full w-full object-cover transition duration-200 group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="truncate">
                        <Text variant="body" class="transition-colors group-hover:text-(--main)">
                          {contributor.displayName ?? contributor.login}
                        </Text>
                      </div>
                      <div class="truncate">
                        <Text variant="caption" tone="sub">
                          @{contributor.login} • {contributor.contributions} contributions
                        </Text>
                      </div>
                    </div>
                  </a>
                )}
              </For>
            </div>
          </Show>

          <Show when={contributorsQuery.data && contributorsQuery.data.contributors.length === 0}>
            <div>
              <Text variant="body" tone="sub">no contributors found yet</Text>
            </div>
          </Show>
        </section>
      </div>
    </div>
  )
}

export default AboutPage
