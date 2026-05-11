import type { Component } from "solid-js";
import { Match, Switch } from "solid-js";

export type PixelHeartProps = {
  state: "full" | "half" | "empty";
  class?: string;
};

export const PixelHeart: Component<PixelHeartProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 9 9"
      class={`h-8 w-8 drop-shadow-sm ${props.class || ""}`}
      style={{
        "image-rendering": "pixelated",
        "shape-rendering": "crispEdges",
      }}
    >
      <Switch>
        <Match when={props.state === "full"}>
          {/* Outline */}
          <path
            d="M2 0h2v1h1v-1h2v1h1v2h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-2h1v-1z"
            fill="#000"
          />
          {/* Fill */}
          <path
            d="M2 1h2v1h1v-1h2v2h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-2z"
            fill="#ff0000"
          />
          <path d="M2 1h1v2h-1z" fill="#ff7f7f" />
        </Match>
        <Match when={props.state === "half"}>
          <path
            d="M2 0h2v1h1v-1h2v1h1v2h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-2h1v-1z"
            fill="#000"
          />
          {/* Empty Fill */}
          <path
            d="M5 1h2v2h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-2z"
            fill="#333"
          />
          {/* Half Red Fill */}
          <path d="M2 1h2v1h1v3h-1v-1h-1v-1h-1v-1h-1v-2z" fill="#ff0000" />
          <path d="M2 1h1v2h-1z" fill="#ff7f7f" />
        </Match>
        <Match when={props.state === "empty"}>
          <path
            d="M2 0h2v1h1v-1h2v1h1v2h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-2h1v-1z"
            fill="#000"
          />
          {/* Empty Fill */}
          <path
            d="M2 1h2v1h1v-1h2v2h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-2z"
            fill="#333"
          />
        </Match>
      </Switch>
    </svg>
  );
};
