import { Search } from 'lucide-solid'

type CommandlineInputProps = {
  value: string
  placeholder: string
  inputRef: (element: HTMLInputElement) => void
  onInput: (value: string) => void
}

function CommandlineInput(props: CommandlineInputProps) {
  return (
    <div class="flex items-center gap-3 px-4 py-2">
      <Search class="h-4 w-4 opacity-50" />
      <input
        ref={props.inputRef}
        value={props.value}
        class="w-full bg-transparent text-sm leading-normal text-(--text) outline-none placeholder:text-(--sub)"
        placeholder={props.placeholder}
        onInput={(event) => props.onInput(event.currentTarget.value)}
      />
    </div>
  )
}

export default CommandlineInput
