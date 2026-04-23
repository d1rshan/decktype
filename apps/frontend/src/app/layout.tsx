import type { ParentProps } from "solid-js";
import { Show, onCleanup, onMount } from "solid-js";

import ToastRegion from "@/components/toast-region";
import { Banner } from "@/components/ui/banner";
import Commandline from "@/features/commandline/components/commandline";
import { themeManager } from "@/features/content/themes/manager";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { isBackendDown, startBackendHealthPolling } from "@/lib/backend-status";

function Layout(props: ParentProps) {
  onMount(() => {
    themeManager.init();
    const stopHealthPolling = startBackendHealthPolling();

    onCleanup(() => {
      stopHealthPolling();
    });
  });

  return (
    <div class="relative min-h-screen bg-(--bg) font-mono text-(--text)">
      <Commandline />
      <ToastRegion />
      <div class="mx-auto flex min-h-screen w-full max-w-[1320px] flex-col px-5 py-8 sm:px-8 lg:px-10 xl:px-12">
        <Show when={isBackendDown()}>
          <Banner variant="error" class="mb-4">
            beta server is currently offline. please try again in a bit.
          </Banner>
        </Show>
        <Navbar />

        <main class="flex-1 flex flex-col justify-center py-8">
          {props.children}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Layout;
