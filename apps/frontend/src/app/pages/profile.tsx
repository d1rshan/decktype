import { useNavigate, useParams } from "@solidjs/router";
import { Show, createEffect, createMemo } from "solid-js";

import AuthForms from "@/features/auth/components";
import { useAuthSession } from "@/features/auth/hooks";
import { usePublicProfileQuery } from "@/features/users/profile/api/hooks";
import { ProfileView } from "@/features/users/profile/components/profile-view";
import { QueryState } from "@/components/query-state";
import { getErrorMessage } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

function ProfilePage() {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useAuthSession();

  const routeUsername = createMemo(() => params.username?.trim() ?? "");
  const isCanonicalProfileRoute = createMemo(() => routeUsername().length > 0);

  const publicProfileQuery = usePublicProfileQuery(routeUsername, {
    enabled: isCanonicalProfileRoute,
  });

  createEffect(() => {
    if (
      !auth.isLoading() &&
      auth.isAuthenticated() &&
      !isCanonicalProfileRoute()
    ) {
      navigate(`/profile/${auth.username()}`, { replace: true });
    }
  });

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
            <Show when={auth.isAuthenticated()} fallback={<AuthForms />}>
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
          {(data) => <ProfileView data={data} />}
        </QueryState>
      </Show>
    </div>
  );
}

export default ProfilePage;
