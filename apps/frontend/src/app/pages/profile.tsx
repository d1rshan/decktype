import { useNavigate, useParams } from "@solidjs/router";
import { Show, createEffect, createMemo, createSignal } from "solid-js";
import { User } from "lucide-solid";

import AuthForms from "@/features/auth/components/auth-forms";
import { useAuthSession } from "@/features/auth/hooks";
import { PersonalBestsCards } from "@/features/users/pbs/components/personal-bests";
import { usePublicProfileQuery } from "@/features/users/profile/api/hooks";
import { ChangeUsernameModal } from "@/features/users/profile/components/change-username-modal";
import { ResultsTableUi } from "@/features/users/results/components/results-table";
import { QueryState } from "@/components/query-state";
import { getErrorMessage } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

function ProfilePage() {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useAuthSession();
  const [isSigningOut, setIsSigningOut] = createSignal(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = createSignal(false);
  const [statusMessage, setStatusMessage] = createSignal<string | null>(null);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const routeUsername = createMemo(() => params.username?.trim() ?? "");
  const isCanonicalProfileRoute = createMemo(() => routeUsername().length > 0);
  const isOwnProfile = createMemo(
    () =>
      auth.isAuthenticated() &&
      routeUsername().toLowerCase() === auth.username().toLowerCase(),
  );

  const publicProfileQuery = usePublicProfileQuery(routeUsername, {
    enabled: isCanonicalProfileRoute,
  });

  const canShowSelfActions = createMemo(
    () => !auth.isLoading() && isOwnProfile(),
  );

  createEffect(() => {
    if (
      !auth.isLoading() &&
      auth.isAuthenticated() &&
      !isCanonicalProfileRoute()
    ) {
      navigate(`/profile/${auth.username()}`, { replace: true });
    }
  });

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
      navigate("/profile", { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSigningOut(false);
    }
  };

  const profileHero = (profile: {
    username: string;
    image?: string | null;
    joinedAt?: string | Date;
  }) => (
    <div class="space-y-4 rounded-xl bg-(--sub-alt) p-4 sm:p-5">
      <div class="flex items-center gap-4">
        <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--sub) text-(--bg)">
          <Show
            when={profile.image}
            fallback={<User size={24} strokeWidth={2.2} />}
          >
            {(image) => (
              <img
                src={image()}
                alt={`${profile.username} avatar`}
                class="h-full w-full object-cover"
              />
            )}
          </Show>
        </div>
        <div class="min-w-0 flex-1 space-y-1">
          <h2 class="truncate text-xl leading-tight font-bold sm:text-2xl">
            {profile.username}
          </h2>
          <Show when={profile.joinedAt}>
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

  return (
    <div class="flex w-full min-h-[72vh] flex-1">
      <Show
        when={isCanonicalProfileRoute()}
        fallback={
          <Show
            when={!auth.isLoading()}
            fallback={
              <div class="flex w-full items-center justify-center py-20">
                <Spinner />
              </div>
            }
          >
            <Show
              when={auth.isAuthenticated()}
              fallback={
                <AuthForms
                  onSuccess={() => navigate("/profile", { replace: true })}
                />
              }
            >
              <div class="flex w-full items-center justify-center py-20">
                <Spinner />
              </div>
            </Show>
          </Show>
        }
      >
        <QueryState
          query={publicProfileQuery}
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
                  <div class="flex flex-wrap gap-3">
                    <Button
                      class="h-8 px-3 text-xs"
                      onClick={() => navigate("/")}
                    >
                      back home
                    </Button>
                    <Show when={canShowSelfActions()}>
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
                    </Show>
                  </div>
                </div>

                {profileHero({
                  username: data.user.username,
                  image: data.user.image,
                  joinedAt: data.user.createdAt,
                })}
              </section>

              <section class="space-y-4">
                <h2 class="text-2xl leading-tight font-bold capitalize">
                  personal bests
                </h2>
                <PersonalBestsCards pbs={data.pbs} />
              </section>

              <Show when={canShowSelfActions()}>
                <section class="space-y-4">
                  <h2 class="text-2xl leading-tight font-bold capitalize">
                    recent results
                  </h2>
                  <ResultsTableUi results={data.results} />
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
                  onSuccess={(username) =>
                    navigate(`/profile/${username}`, { replace: true })
                  }
                />
              </Show>
            </div>
          )}
        </QueryState>
      </Show>
    </div>
  );
}

export default ProfilePage;
