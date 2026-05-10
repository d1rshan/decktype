import { useNavigate } from "@solidjs/router";
import { Show, createMemo } from "solid-js";

import { useIsOwnProfile } from "../hooks";
import { OwnProfileView } from "./own-profile-view";
import { PublicProfileView } from "./public-profile-view";
import type { ProfileData } from "./types";

type ProfileViewProps = {
  data: ProfileData;
};

export function ProfileView(props: ProfileViewProps) {
  const navigate = useNavigate();
  const isOwnProfile = useIsOwnProfile(createMemo(() => props.data.user.id));

  return (
    <Show
      when={isOwnProfile()}
      fallback={
        <PublicProfileView
          data={props.data}
          onNavigateHome={() => navigate("/", { replace: true })}
        />
      }
    >
      <OwnProfileView data={props.data} />
    </Show>
  );
}
