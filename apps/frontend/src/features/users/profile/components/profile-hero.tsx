import { Show } from "solid-js";
import { User } from "lucide-solid";

import { formatDateTime } from "@/lib/utils";

type ProfileHeroProps = {
  username: string;
  image?: string | null;
  joinedAt?: string | Date;
};

export function ProfileHero(props: ProfileHeroProps) {
  return (
    <div class="space-y-4 rounded-xl bg-(--sub-alt) p-4 sm:p-5">
      <div class="flex items-center gap-4">
        <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--sub) text-(--bg)">
          <Show
            when={props.image}
            fallback={<User size={24} strokeWidth={2.2} />}
          >
            {(image) => (
              <img
                src={image()}
                alt={`${props.username} avatar`}
                class="h-full w-full object-cover"
              />
            )}
          </Show>
        </div>
        <div class="min-w-0 flex-1 space-y-1">
          <h2 class="truncate text-xl leading-tight font-bold sm:text-2xl">
            {props.username}
          </h2>
          <Show when={props.joinedAt}>
            {(value) => (
              <p class="text-sm leading-normal text-(--sub) sm:text-base">
                joined {formatDateTime(value())}
              </p>
            )}
          </Show>
        </div>
      </div>
    </div>
  );
}
