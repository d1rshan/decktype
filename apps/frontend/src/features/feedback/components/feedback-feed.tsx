import { createSignal, For, Show } from "solid-js";
import { ArrowBigDown, ArrowBigUp, SendHorizontal } from "lucide-solid";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { QueryState } from "@/components/query-state";
import {
  useFeedbackQuery,
  useCreateFeedbackMutation,
  useUpvoteFeedbackMutation,
  useDownvoteFeedbackMutation,
} from "../api";

type VoteControlProps = {
  count: number;
  active: boolean;
  disabled: boolean;
  tone: "up" | "down";
  onClick: () => void;
};

function VoteControl(props: VoteControlProps) {
  const toneClass = () =>
    props.tone === "up"
      ? props.active
        ? "text-(--main)"
        : "text-(--sub) hover:text-(--main)"
      : props.active
        ? "text-(--error)"
        : "text-(--sub) hover:text-(--error)";

  return (
    <button
      onClick={props.onClick}
      class={`flex items-center gap-1 transition ${toneClass()}`}
      disabled={props.disabled}
    >
      <Show
        when={props.tone === "up"}
        fallback={
          <ArrowBigDown
            class={`h-4 w-4 ${props.active ? "[&_path]:fill-current" : ""}`}
            stroke-width={2}
          />
        }
      >
        <ArrowBigUp
          class={`h-4 w-4 ${props.active ? "[&_path]:fill-current" : ""}`}
          stroke-width={2}
        />
      </Show>
      <span class="text-[11px] font-mono">{props.count}</span>
    </button>
  );
}

export function FeedbackFeed() {
  const session = authClient.useSession();
  const currentUserId = () => session()?.data?.user?.id;
  const isSignedIn = () => !!currentUserId();
  const [content, setContent] = createSignal("");

  const feedbackQuery = useFeedbackQuery();

  const createMutation = useCreateFeedbackMutation();
  const upvoteMutation = useUpvoteFeedbackMutation(currentUserId);
  const downvoteMutation = useDownvoteFeedbackMutation(currentUserId);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!isSignedIn()) return;
    if (!content().trim()) return;

    createMutation.mutate(
      { content: content().trim() },
      {
        onSuccess: () => {
          setContent("");
        },
      },
    );
  };

  return (
    <section class="mt-12 w-full space-y-4 border-t border-(--sub)/10 pt-8">
      <div class="space-y-2 text-center md:text-left">
        <h2 class="text-2xl font-bold">Community Chat</h2>
        <p class="text-base text-(--sub)">
          suggest games, ideas, or just say hi. all global, all public.
        </p>
      </div>

      <div class="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-(--sub)/20">
        <QueryState
          query={feedbackQuery}
          emptyMessage="no messages yet. be the first!"
        >
          {(data) => (
            <For each={[...data].reverse()}>
              {(item) => (
                <div class="group relative flex flex-col gap-1.5 rounded-lg bg-(--sub-alt) px-3 py-2.5 transition-colors hover:bg-(--sub-alt)/80">
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2 truncate">
                      <span class="text-xs font-bold text-(--main)">
                        {item.userDisplayName}
                      </span>
                      <span class="text-[10px] text-(--sub)">
                        {new Date(item.createdAt).toLocaleTimeString(
                          undefined,
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    </div>

                    <div class="flex items-center gap-3">
                      <VoteControl
                        tone="up"
                        count={item.upvotedBy?.length ?? 0}
                        active={(item.upvotedBy ?? []).some(
                          (id) => id === (currentUserId() ?? ""),
                        )}
                        disabled={upvoteMutation.isPending || !currentUserId()}
                        onClick={() => upvoteMutation.mutate(item.id)}
                      />

                      <VoteControl
                        tone="down"
                        count={item.downvotedBy?.length ?? 0}
                        active={(item.downvotedBy ?? []).some(
                          (id) => id === (currentUserId() ?? ""),
                        )}
                        disabled={
                          downvoteMutation.isPending || !currentUserId()
                        }
                        onClick={() => downvoteMutation.mutate(item.id)}
                      />
                    </div>
                  </div>

                  <p class="whitespace-pre-wrap text-sm leading-relaxed text-(--text)">
                    {item.content}
                  </p>
                </div>
              )}
            </For>
          )}
        </QueryState>
      </div>

      <form onSubmit={handleSubmit} class="mt-6 flex flex-col gap-4">
        <div class="relative">
          <Textarea
            value={content()}
            onInput={(e) => setContent(e.currentTarget.value)}
            placeholder={
              isSignedIn()
                ? "send a message..."
                : "sign in to send a message..."
            }
            disabled={createMutation.isPending}
            required
            class="min-h-[80px] pr-12"
          />
          <button
            type="submit"
            aria-label="send message"
            class="absolute right-2.5 bottom-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--main) text-(--bg) transition disabled:cursor-not-allowed disabled:opacity-40"
            disabled={
              createMutation.isPending || !content().trim() || !isSignedIn()
            }
          >
            <SendHorizontal class="h-3.5 w-3.5" stroke-width={2.25} />
          </button>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Show when={!isSignedIn()}>
            <p class="text-center text-sm text-(--sub)">
              <a href="/profile" class="underline underline-offset-2">
                sign in
              </a>{" "}
              to send messages, join leaderboard and more
            </p>
          </Show>
        </div>
      </form>
    </section>
  );
}
