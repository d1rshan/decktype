import { useNavigate, useParams } from "@solidjs/router";
import { Show, createEffect, createMemo, createSignal } from "solid-js";

import AuthForms from "@/features/auth/components/auth-forms";
import { useAuthSession } from "@/features/auth/hooks";
import { usePublicProfileQuery } from "@/features/users/profile/api/hooks";
import { OwnProfileView } from "@/features/users/profile/components/own-profile-view";
import { PublicProfileView } from "@/features/users/profile/components/public-profile-view";
import { QueryState } from "@/components/query-state";
import { getErrorMessage } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
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

  return (
    <div class="flex w-full flex-1">
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
            <div class="flex w-full flex-1 items-center justify-center py-20">
              <Spinner />
            </div>
          }
          errorFallback={(error) => (
            <div class="flex w-full flex-1 flex-col items-center justify-center gap-3 text-center">
              <p class="text-4xl leading-none font-bold text-(--main) lowercase sm:text-6xl">
                404
              </p>
              <p class="max-w-md text-sm leading-normal text-(--sub) sm:text-base">
                {getErrorMessage(error)}
              </p>
              <Button
                class="mt-2 h-8 px-3 text-xs"
                onClick={() => navigate("/")}
              >
                back home
              </Button>
            </div>
          )}
        >
          {(data) => (
            <Show
              when={canShowSelfActions()}
              fallback={
                <PublicProfileView
                  data={data}
                  onNavigateHome={() => navigate("/")}
                />
              }
            >
              <OwnProfileView
                data={data}
                isSigningOut={isSigningOut()}
                statusMessage={statusMessage()}
                errorMessage={errorMessage()}
                isUsernameModalOpen={isUsernameModalOpen()}
                onNavigateHome={() => navigate("/")}
                onOpenUsernameModal={() => setIsUsernameModalOpen(true)}
                onCloseUsernameModal={() => setIsUsernameModalOpen(false)}
                onSignOut={handleSignOut}
                onUsernameChangeSuccess={(username) =>
                  navigate(`/profile/${username}`, { replace: true })
                }
              />
            </Show>
          )}
        </QueryState>
      </Show>
    </div>
  );
}

export default ProfilePage;
