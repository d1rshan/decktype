import { A } from "@solidjs/router";
import { User } from "lucide-solid";
import { useAuthSession } from "@/features/auth/hooks";

const routes = [
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "About", path: "/about" },
];

export function Navbar() {
  const auth = useAuthSession();

  return (
    <header class="mb-8 flex items-center justify-between">
      <div class="flex items-baseline gap-4 sm:gap-10">
        <A href="/" class="flex items-center group">
          <h2 class="text-xl leading-tight font-bold sm:text-2xl">decktype</h2>
        </A>

        <nav class="flex items-center gap-3 sm:gap-8">
          {routes.map((route) => {
            return (
              <A
                href={route.path}
                activeClass="text-(--main)"
                inactiveClass="text-(--sub) hover:text-(--text)"
                class="transition"
              >
                <p class="text-sm leading-normal sm:text-base">
                  {route.label.toLowerCase()}
                </p>
              </A>
            );
          })}
        </nav>
      </div>

      <div class="flex items-center text-(--sub)">
        <A
          href="/profile"
          activeClass="text-(--text)"
          inactiveClass="hover:text-(--text)"
          class="flex items-center gap-1 sm:gap-2 transition"
          aria-label={`Profile: ${auth.displayName().toLowerCase()}`}
        >
          <User size={18} strokeWidth={2} />
          <div class="hidden max-w-32 truncate sm:block">
            <p class="text-sm leading-normal sm:text-base">
              {auth.displayName().toLowerCase()}
            </p>
          </div>
        </A>
      </div>
    </header>
  );
}
