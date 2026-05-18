import { For } from "solid-js";

export type HeartProps = {
  state: "full" | "half" | "empty";
  isDamaged?: boolean;
  class?: string;
};

const S = 6;

const outlines = [
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

const highlights = [{ x: 12, y: 18 }];
const shadowFills = [
  { x: 6, y: 12 },
  { x: 6, y: 18 },
  { x: 6, y: 24 },
  { x: 12, y: 30 },
  { x: 18, y: 36 },
  { x: 24, y: 42 },
];
const normalFills = [
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
const lightFills = [
  { x: 48, y: 24 },
  { x: 48, y: 18 },
  { x: 48, y: 12 },
  { x: 42, y: 12 },
  { x: 36, y: 12 },
];

const fillGroups = [
  { pixels: highlights, color: "#ffffff" },
  { pixels: shadowFills, color: "#9d0000" },
  { pixels: normalFills, color: "#ff0000" },
  { pixels: lightFills, color: "#ff5757" },
];

export function Heart(props: HeartProps) {
  const fillColor = (x: number, color: string) => {
    if (props.state === "full") return color;
    if (props.state === "empty") return "#333333";
    return x < 30 ? color : "#333333";
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      class={props.class || ""}
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
            width={S}
            height={S}
            fill={props.isDamaged ? "#ffffff" : "#000000"}
          />
        )}
      </For>
      <For each={fillGroups}>
        {(group) => (
          <For each={group.pixels}>
            {(p) => (
              <rect
                x={p.x}
                y={p.y}
                width={S}
                height={S}
                fill={fillColor(p.x, group.color)}
              />
            )}
          </For>
        )}
      </For>
    </svg>
  );
}
