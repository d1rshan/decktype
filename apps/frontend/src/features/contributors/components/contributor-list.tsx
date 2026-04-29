import { For, Show } from "solid-js";
import { User, ArrowUpRight } from "lucide-solid";
import _data from "../data/contributors.json";
import type { Contributor } from "../types";

const contributors = _data as Contributor[];

// TODO: extract out links to lib/links.ts or smth like that
export function ContributorList() {
  return (
    <div class="space-y-6">
      <a
        href="https://github.com/d1rshan/decktype/graphs/contributors"
        target="_blank"
        rel="noreferrer"
        class="group inline-block"
      >
        <div class="flex items-center gap-1">
          <h2 class="text-2xl leading-tight font-bold capitalize">
            contributors
          </h2>
          <ArrowUpRight
            size={24}
            class="translate-x-[-4px] translate-y-[2px] text-(--sub) opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
          />
        </div>
      </a>
      <Show
        when={contributors.length > 0}
        fallback={
          <p class="text-base leading-normal text-(--sub)">
            no contributors found yet
          </p>
        }
      >
        <div class="flex flex-wrap gap-4 pt-1">
          <For each={contributors}>
            {(contributor) => (
              <a
                href={contributor.html_url}
                target="_blank"
                rel="noreferrer"
                class="group flex min-w-[200px] items-center gap-4 rounded-xl bg-(--sub-alt) px-8 py-3 text-(--text) transition-colors hover:bg-(--text) hover:text-(--sub-alt)"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--sub) text-(--bg) transition-colors group-hover:bg-(--sub-alt) group-hover:text-(--text)">
                  <Show
                    when={contributor.avatar_url}
                    fallback={<User size={20} strokeWidth={2.2} />}
                  >
                    <img
                      src={contributor.avatar_url}
                      alt={`${contributor.login} avatar`}
                      class="h-full w-full object-cover"
                    />
                  </Show>
                </div>
                <span class="text-base font-medium leading-none">
                  {contributor.login}
                </span>
              </a>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
