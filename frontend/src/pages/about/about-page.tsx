function AboutPage() {
  return (
    <div class="flex flex-col gap-16">
      <div class="mx-auto max-w-5xl text-center flex flex-col gap-4">
        <h1 class="text-4xl font-bold tracking-tight text-[var(--text)]">
          decktype
        </h1>
        <p class="text-[var(--sub)] leading-relaxed text-lg">
          a minimalist typing platform built for speed and focus.
        </p>
      </div>

      <div class="grid gap-12 md:grid-cols-3">
        {[
          {
            title: 'focus',
            description: 'minimalist design allows you to focus on what matters most—your typing performance.',
          },
          {
            title: 'speed',
            description: 'built with solid.js and optimized for low latency input handling.',
          },
          {
            title: 'custom',
            description: 'fully customizable themes and modes to suit your typing style.',
          },
        ].map((feature) => (
          <div class="flex flex-col gap-4">
            <h2 class="text-sm font-bold uppercase tracking-widest text-[var(--main)]">{feature.title}</h2>
            <p class="text-sm leading-7 text-[var(--sub)]">{feature.description}</p>
          </div>
        ))}
      </div>

      <div class="flex flex-col gap-8 rounded-2xl bg-[var(--sub-alt)]/20 p-10">
        <h2 class="text-xl font-bold text-[var(--text)]">mission</h2>
        <p class="text-[var(--sub)] leading-relaxed">
          decktype aims to provide a distraction-free environment for improving typing speed and accuracy. 
          originally inspired by monkeytype, it evolves as a multi-mode typing lab where new experimental 
          modes can be tested and mastered.
        </p>
        <div class="flex flex-wrap gap-4 mt-4">
          <a href="#" class="text-xs font-bold uppercase tracking-widest text-[var(--main)] hover:underline">github</a>
          <a href="#" class="text-xs font-bold uppercase tracking-widest text-[var(--main)] hover:underline">discord</a>
          <a href="#" class="text-xs font-bold uppercase tracking-widest text-[var(--main)] hover:underline">twitter</a>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <h2 class="text-sm font-bold uppercase tracking-widest text-[var(--sub)] opacity-50">credits</h2>
        <div class="grid gap-4 text-sm text-[var(--sub)]">
          <p>created by <span class="text-[var(--text)] font-bold">d1rsh</span></p>
          <p>inspired by <span class="text-[var(--text)] font-bold">monkeytype</span></p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
