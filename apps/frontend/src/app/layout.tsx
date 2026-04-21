import type { ParentProps } from 'solid-js'
import { onCleanup, onMount } from 'solid-js'

import BackendStatusBanner from '@/components/backend-status-banner'
import ToastRegion from '@/components/toast-region'
import Commandline from '@/features/commandline/components/commandline'
import { themeManager } from '@/features/content/themes/manager'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { startBackendHealthPolling } from '@/lib/backend-status'

function Layout(props: ParentProps) {
  onMount(() => {
    themeManager.init()
    const stopHealthPolling = startBackendHealthPolling()

    onCleanup(() => {
      stopHealthPolling()
    })
  })

  return (
    <div class="relative min-h-screen bg-(--bg) font-mono text-(--text)">
      <Commandline />
      <ToastRegion />
      <div class="mx-auto flex min-h-screen w-full max-w-[1320px] flex-col px-5 py-8 sm:px-8 lg:px-10 xl:px-12">
        <BackendStatusBanner />
        <Navbar />

        <main class="flex-1 flex flex-col justify-center py-8">
          {props.children}
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default Layout
