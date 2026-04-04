function SettingsPage() {
  return (
    <div class="flex flex-col gap-12">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold tracking-tight text-[var(--text)]">
          settings
        </h1>
        <p class="text-xs tracking-widest text-[var(--sub)] uppercase opacity-60">
          preferences for typing, visuals, and behavior
        </p>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <div class="rounded-2xl bg-[var(--sub-alt)]/20 p-8">
          <h2 class="text-sm font-bold uppercase tracking-widest text-[var(--sub)]">
            typing
          </h2>
          <div class="mt-6 flex flex-col gap-4 text-sm text-[var(--sub)]">
            <div class="flex items-center justify-between border-b border-[var(--sub)]/5 pb-4">
              <span>default language</span>
              <span class="font-bold text-[var(--text)]">english 1k</span>
            </div>
            <div class="flex items-center justify-between border-b border-[var(--sub)]/5 pb-4">
              <span>sound</span>
              <span class="font-bold text-[var(--text)]">off</span>
            </div>
            <div class="flex items-center justify-between">
              <span>show live stats</span>
              <span class="font-bold text-[var(--text)]">on</span>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-[var(--sub-alt)]/20 p-8">
          <h2 class="text-sm font-bold uppercase tracking-widest text-[var(--sub)]">
            appearance
          </h2>
          <div class="mt-6 flex flex-col gap-4 text-sm text-[var(--sub)]">
            <div class="flex items-center justify-between border-b border-[var(--sub)]/5 pb-4">
              <span>theme</span>
              <span class="font-bold text-[var(--text)]">carbon</span>
            </div>
            <div class="flex items-center justify-between border-b border-[var(--sub)]/5 pb-4">
              <span>font size</span>
              <span class="font-bold text-[var(--text)]">medium</span>
            </div>
            <div class="flex items-center justify-between">
              <span>reduced motion</span>
              <span class="font-bold text-[var(--text)]">off</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
