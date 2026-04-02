function ProfilePage() {
  return (
    <div class="flex flex-col gap-12">
      <div class="flex items-center justify-between">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-bold tracking-tight text-[var(--text)]">
            guest
          </h1>
          <p class="text-xs tracking-widest text-[var(--sub)] uppercase opacity-60">
            joined 30 mar 2026
          </p>
        </div>
        
        <div class="flex items-center gap-4">
          <button class="rounded-lg bg-[var(--sub-alt)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--sub)] hover:text-[var(--text)]">
            edit profile
          </button>
          <button class="rounded-lg bg-[var(--main)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--bg)] hover:brightness-110">
            sign in
          </button>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-4">
        {[
          { label: 'tests started', value: '42' },
          { label: 'tests completed', value: '38' },
          { label: 'time typing', value: '14m' },
          { label: 'avg score', value: '184', highlight: true },
        ].map((stat) => (
          <div class="flex flex-col gap-2 rounded-2xl bg-[var(--sub-alt)]/20 p-6">
            <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--sub)] opacity-50">
              {stat.label}
            </span>
            <span class={`text-3xl font-bold ${stat.highlight ? 'text-[var(--main)]' : 'text-[var(--text)]'}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <div class="flex flex-col gap-6 rounded-2xl bg-[var(--sub-alt)]/20 p-8">
          <h2 class="text-sm font-bold uppercase tracking-widest text-[var(--sub)]">preferences</h2>
          <div class="grid gap-4">
            {[
              { label: 'Language', value: 'English' },
              { label: 'Theme', value: 'Carbon' },
              { label: 'Mode', value: 'Falling Words' },
              { label: 'Difficulty', value: 'Normal' },
            ].map((pref) => (
              <div class="flex items-center justify-between border-b border-[var(--sub)]/5 pb-4 last:border-0 last:pb-0">
                <span class="text-sm text-[var(--sub)]">{pref.label}</span>
                <span class="text-sm font-bold text-[var(--text)]">{pref.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div class="flex flex-col gap-6 rounded-2xl bg-[var(--sub-alt)]/20 p-8">
          <h2 class="text-sm font-bold uppercase tracking-widest text-[var(--sub)]">recent activity</h2>
          <div class="flex flex-col items-center justify-center flex-1 text-[var(--sub)] opacity-40 italic text-sm">
            no recent activity to show
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
