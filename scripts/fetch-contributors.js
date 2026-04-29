import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const REPO = "d1rshan/decktype";
const API_URL = `https://api.github.com/repos/${REPO}/contributors`;
const OUTPUT_PATH = join(
  process.cwd(),
  "apps/frontend/src/features/contributors/data/contributors.json",
);

async function fetchContributors() {
  console.log(`Fetching contributors for ${REPO}...`);

  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "decktype-fetch-script",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contributors: ${response.statusText}`);
    }

    const data = await response.json();

    const contributors = data.map((c) => ({
      login: c.login,
      avatar_url: c.avatar_url,
      html_url: c.html_url,
    }));

    await mkdir(dirname(OUTPUT_PATH), { recursive: true });

    await writeFile(OUTPUT_PATH, JSON.stringify(contributors, null, 2));

    console.log(
      `Successfully synced ${contributors.length} contributors to ${OUTPUT_PATH}`,
    );
  } catch (error) {
    console.error("Error fetching contributors:", error);
    process.exit(1);
  }
}

fetchContributors();
