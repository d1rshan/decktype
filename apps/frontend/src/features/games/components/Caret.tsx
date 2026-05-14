export type CaretProps = {
  inline?: boolean;
};

export function Caret(props: CaretProps) {
  if (props.inline) {
    return (
      <span class="absolute bottom-[-2px] left-0 h-[2px] w-full bg-(--caret) animate-pulse" />
    );
  }
  return (
    <span class="ml-[1px] h-[2px] w-[0.6em] self-end bg-(--caret) animate-pulse mb-[2px]" />
  );
}
