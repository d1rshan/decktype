import { Button } from "@/components/ui/button";
import { ContributorList } from "@/features/contributors/components/contributor-list";
import { urls } from "@/lib/urls";

function AboutPage() {
  return (
    <div class="w-full min-h-[72vh]">
      <div class="flex w-full flex-col gap-10">
        <section class="space-y-8">
          <div class="space-y-3">
            <h2 class="text-2xl leading-tight font-bold capitalize">
              about decktype
            </h2>
            <p class="text-base leading-relaxed text-(--sub)">
              decktype is an open source typing playground. games, mini
              experiments, weird ideas, the stuff that felt too fun to not
              build.
            </p>
            <p class="text-base leading-relaxed text-(--sub)">
              themes are straight from monkeytype. honestly one of the best
              designed sites on the internet. decktype would not exist without
              it. not affiliated, just a massive fan.
            </p>
            <p class="text-base leading-relaxed text-(--sub)">
              that's it. go type something.
            </p>
            <div class="flex flex-wrap gap-3 pt-1">
              <Button href={urls.github} target="_blank" rel="noreferrer">
                decktype github
              </Button>
              <Button
                href="https://monkeytype.com"
                target="_blank"
                rel="noreferrer"
              >
                monkeytype website
              </Button>
              <Button
                href="https://github.com/monkeytypegame/monkeytype"
                target="_blank"
                rel="noreferrer"
              >
                monkeytype github
              </Button>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <ContributorList />
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
