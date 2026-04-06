type CommandlineInputProps = {
  value: string
  placeholder: string
  inputRef: (element: HTMLInputElement) => void
  onInput: (value: string) => void
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="h-4 w-4 opacity-50"
    >
      <path
        fill-rule="evenodd"
        d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
        clip-rule="evenodd"
      />
    </svg>
  )
}

function CommandlineInput(props: CommandlineInputProps) {
  return (
    <div class="flex items-center gap-3 px-4 py-2">
      <SearchIcon />
      <input
        ref={props.inputRef}
        value={props.value}
        class="t-input w-full bg-transparent text-(--text) outline-none placeholder:text-(--sub)"
        placeholder={props.placeholder}
        onInput={(event) => props.onInput(event.currentTarget.value)}
      />
    </div>
  )
}

export default CommandlineInput
