import { Show, createMemo, createSignal } from "solid-js";
import { User } from "lucide-solid";
import { useParams } from "@solidjs/router";

import AuthForms from "@/features/auth/components/auth-forms";
import { useAuthSession } from "@/features/auth/hooks";
<<<<<<< HEAD
import PersonalBests from "@/features/users/pbs/components/personal-bests";
import ResultsTable from "@/features/users/results/components/results-table";
import { ChangeUsernameModal } from "@/features/users/components/change-username-modal";
=======
import { PersonalBestsCards } from "@/features/users/pbs/components/personal-bests";
import { ResultsTableUi } from "@/features/users/results/components/results-table";
import { usePublicProfileQuery } from "@/features/users/profile/api/hooks";
>>>>>>> f057daa (wip)
import { getErrorMessage } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { QueryState } from "@/components/query-state";

type ProfileProps = {
  onNavigate: (target: string) => void;
};

function ProfilePage(props: ProfileProps) {
  const params = useParams();
  const auth = useAuthSession();
  const [isSigningOut, setIsSigningOut] = createSignal(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = createSignal(false);
  const [statusMessage, setStatusMessage] = createSignal<string | null>(null);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const targetUsername = createMemo(() => params.username || auth.user()?.name);
  const isMe = createMemo(
    () =>
      !!auth.user() &&
      (!params.username || auth.user()?.name === params.username),
  );

  const profileQuery = usePublicProfileQuery(
    createMemo(() => targetUsername() ?? ""),
  );

  const resetMessages = () => {
    setStatusMessage(null);
    setErrorMessage(null);
  };

  const handleSignOut = async () => {
    resetMessages();
    setIsSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setErrorMessage(result.error.message ?? "Unable to sign out.");
        return;
      }

      setStatusMessage("Signed out.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div class="flex w-full min-h-[72vh] flex-1">
      <Show
        when={targetUsername() || auth.isLoading()}
        fallback={<AuthForms onSuccess={() => props.onNavigate("/")} />}
      >
        <QueryState
          query={profileQuery}
          emptyMessage="user not found"
          loadingFallback={
            <div class="flex w-full items-center justify-center py-20">
              <Spinner />
            </div>
          }
        >
          {(data) => (
            <div class="flex w-full flex-col gap-8">
              <section class="space-y-5">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <h2 class="text-2xl leading-tight font-bold capitalize">
                    profile
                  </h2>
                  <Show when={isMe()}>
                    <div class="flex flex-wrap gap-3">
                      <Button
                        class="h-8 px-3 text-xs"
                        onClick={() => props.onNavigate("/")}
                      >
                        back home
                      </Button>
                      <Button
                        class="h-8 px-3 text-xs"
                        onClick={handleSignOut}
                        disabled={isSigningOut()}
                      >
                        {isSigningOut() ? "signing out..." : "sign out"}
                      </Button>
                    </div>
                  </Show>
                </div>

                <div class="space-y-4 rounded-xl bg-(--sub-alt) p-4 sm:p-5">
                  <div class="flex items-center gap-4">
                    <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--sub) text-(--bg)">
                      <Show
                        when={data.user.image}
                        fallback={<User size={24} strokeWidth={2.2} />}
                      >
                        {(image) => (
                          <img
                            src={image()}
                            alt={`${data.user.name} avatar`}
                            class="h-full w-full object-cover"
                          />
                        )}
                      </Show>
                    </div>
                    <div class="min-w-0 flex-1 space-y-1">
                      <h2 class="truncate text-xl leading-tight font-bold sm:text-2xl">
                        {data.user.name}
                      </h2>
                      <p class="text-sm leading-normal text-(--sub) sm:text-base">
                        joined {formatDateTime(data.user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section class="space-y-4">
                <h2 class="text-2xl leading-tight font-bold capitalize">
                  personal bests
                </h2>
<<<<<<< HEAD
                <div class="flex flex-wrap gap-3">
                  <Button
                    class="h-8 px-3 text-xs"
                    onClick={() => props.onNavigate("/")}
                  >
                    back home
                  </Button>
                  <Button
                    class="h-8 px-3 text-xs"
                    onClick={() => setIsUsernameModalOpen(true)}
                  >
                    change username
                  </Button>
                  <Button
                    class="h-8 px-3 text-xs"
                    onClick={handleSignOut}
                    disabled={isSigningOut()}
                  >
                    {isSigningOut() ? "signing out..." : "sign out"}
                  </Button>
                </div>
              </div>

              <div class="space-y-4 rounded-xl bg-(--sub-alt) p-4 sm:p-5">
                <div class="flex items-center gap-4">
                  <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--sub) text-(--bg)">
                    <Show
                      when={auth.user()?.image}
                      fallback={<User size={24} strokeWidth={2.2} />}
                    >
                      {(image) => (
                        <img
                          src={image()}
                          alt={`${auth.username()} avatar`}
                          class="h-full w-full object-cover"
                        />
                      )}
                    </Show>
                  </div>
                  <div class="min-w-0 flex-1 space-y-1">
                    <h2 class="truncate text-xl leading-tight font-bold sm:text-2xl">
                      {auth.username()}
                    </h2>
                    <Show when={joinedAt()}>
                      {(value) => (
                        <p class="text-sm leading-normal text-(--sub) sm:text-base">
                          joined {formatDateTime(value())}
                        </p>
                      )}
                    </Show>
                  </div>
                </div>
              </div>
            </section>

            <section class="space-y-4">
              <h2 class="text-2xl leading-tight font-bold capitalize">
                personal bests
              </h2>
              <PersonalBests />
            </section>

            <section class="space-y-4">
              <h2 class="text-2xl leading-tight font-bold capitalize">
                recent results
              </h2>
              <ResultsTable />
            </section>

            <Show when={statusMessage()}>
              {(message) => (
                <div>
                  <p class="text-base leading-normal text-(--main)">
                    {message()}
                  </p>
                </div>
              )}
            </Show>

            <Show when={errorMessage()}>
              {(message) => (
                <div>
                  <p class="text-base leading-normal text-(--error)">
                    {message()}
                  </p>
                </div>
              )}
            </Show>

            <ChangeUsernameModal
              isOpen={isUsernameModalOpen()}
              onClose={() => setIsUsernameModalOpen(false)}
            />
          </div>
        </Show>
=======
                <PersonalBestsCards pbs={data.pbs as any} />
              </section>

              <Show when={isMe()}>
                <section class="space-y-4">
                  <h2 class="text-2xl leading-tight font-bold capitalize">
                    recent results
                  </h2>
                  <ResultsTableUi results={data.results} />
                </section>
              </Show>

              <Show when={statusMessage()}>
                {(message) => (
                  <div>
                    <p class="text-base leading-normal text-(--main)">
                      {message()}
                    </p>
                  </div>
                )}
              </Show>

              <Show when={errorMessage()}>
                {(message) => (
                  <div>
                    <p class="text-base leading-normal text-(--error)">
                      {message()}
                    </p>
                  </div>
                )}
              </Show>
            </div>
          )}
        </QueryState>
>>>>>>> f057daa (wip)
      </Show>
    </div>
  );
}

export default ProfilePage;
