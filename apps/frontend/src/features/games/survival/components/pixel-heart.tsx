import type { Component } from "solid-js";
import { For } from "solid-js";

export type PixelHeartProps = {
  state: "full" | "half" | "empty";
  class?: string;
};

// Extracted from the user's custom Inkscape SVG
const PIXEL_SIZE = 6;

type Pixel = { x: number; y: number };

const outlines: Pixel[] = [
  { x: 18, y: 6 },
  { x: 12, y: 6 },
  { x: 24, y: 12 },
  { x: 30, y: 12 },
  { x: 36, y: 6 },
  { x: 42, y: 6 },
  { x: 48, y: 6 },
  { x: 54, y: 12 },
  { x: 54, y: 18 },
  { x: 6, y: 6 },
  { x: 0, y: 12 },
  { x: 0, y: 18 },
  { x: 0, y: 24 },
  { x: 54, y: 24 },
  { x: 6, y: 30 },
  { x: 12, y: 36 },
  { x: 18, y: 42 },
  { x: 24, y: 48 },
  { x: 30, y: 48 },
  { x: 36, y: 42 },
  { x: 42, y: 36 },
  { x: 48, y: 30 },
];

// Highlight white pixel
const highlights: Pixel[] = [{ x: 12, y: 18 }];

const shadowFills: Pixel[] = [
  { x: 6, y: 12 },
  { x: 6, y: 18 },
  { x: 6, y: 24 },
  { x: 12, y: 30 },
  { x: 18, y: 36 },
  { x: 24, y: 42 },
];

const normalFills: Pixel[] = [
  { x: 12, y: 12 },
  { x: 18, y: 12 },
  { x: 18, y: 18 },
  { x: 12, y: 24 },
  { x: 18, y: 24 },
  { x: 18, y: 30 },
  { x: 24, y: 36 },
  { x: 30, y: 42 },
  { x: 30, y: 36 },
  { x: 24, y: 30 },
  { x: 30, y: 30 },
  { x: 30, y: 24 },
  { x: 24, y: 24 },
  { x: 24, y: 18 },
  { x: 30, y: 18 },
  { x: 36, y: 24 },
  { x: 42, y: 30 },
  { x: 36, y: 30 },
  { x: 36, y: 36 },
  { x: 42, y: 24 },
  { x: 36, y: 18 },
  { x: 42, y: 18 },
];

const lightFills: Pixel[] = [
  { x: 48, y: 24 },
  { x: 48, y: 18 },
  { x: 48, y: 12 },
  { x: 42, y: 12 },
  { x: 36, y: 12 },
];

export const PixelHeart: Component<PixelHeartProps> = (props) => {
  const getFillColor = (x: number, originalColor: string) => {
    if (props.state === "full") return originalColor;
    if (props.state === "empty") return "#333333";

    // For half state, right side (x >= 30) is empty
    return x < 30 ? originalColor : "#333333";
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      class={`drop-shadow-sm ${props.class || ""}`}
      style={{
        "image-rendering": "pixelated",
        "shape-rendering": "crispEdges",
      }}
    >
      <For each={outlines}>
        {(p) => (
          <rect
            x={p.x}
            y={p.y}
            width={PIXEL_SIZE}
            height={PIXEL_SIZE}
            fill="#000000"
          />
        )}
      </For>

      <For each={highlights}>
        {(p) => (
          <rect
            x={p.x}
            y={p.y}
            width={PIXEL_SIZE}
            height={PIXEL_SIZE}
            fill={getFillColor(p.x, "#ffffff")}
          />
        )}
      </For>

      <For each={shadowFills}>
        {(p) => (
          <rect
            x={p.x}
            y={p.y}
            width={PIXEL_SIZE}
            height={PIXEL_SIZE}
            fill={getFillColor(p.x, "#9d0000")}
          />
        )}
      </For>

      <For each={normalFills}>
        {(p) => (
          <rect
            x={p.x}
            y={p.y}
            width={PIXEL_SIZE}
            height={PIXEL_SIZE}
            fill={getFillColor(p.x, "#ff0000")}
          />
        )}
      </For>

      <For each={lightFills}>
        {(p) => (
          <rect
            x={p.x}
            y={p.y}
            width={PIXEL_SIZE}
            height={PIXEL_SIZE}
            fill={getFillColor(p.x, "#ff5757")}
          />
        )}
      </For>
    </svg>
  );
};
