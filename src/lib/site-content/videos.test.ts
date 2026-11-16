import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { PAGE_SOURCE } from "./pages.server";

const VIDEOS = ["e1iBls7go_g", "eKUjpGy2k8w", "YHyLtDk559Y"];
const SHORTS = ["mcPbpa5c2j8", "wfb5wOHhyW0", "g8ML0QAc38k", "9llfqtglLPI", "a7gaObEn3Q4", "ZdgJUiZwmNw"];

describe("Videos page", () => {
  const html = PAGE_SOURCE["videos"] ?? "";

  it("is a published page", () => {
    expect(html).toBeTruthy();
  });

  it("shows Dr. Bilal's YouTube videos and shorts with self-hosted covers", () => {
    for (const id of [...VIDEOS, ...SHORTS]) {
      expect(html).toContain(`data-yt="${id}"`);
      expect(existsSync(resolve("public/media/youtube", `yt-${id}.webp`))).toBe(true);
    }
    expect(html.match(/data-yt="/g)).toHaveLength(9);
    expect(html).toContain("https://www.youtube.com/@BilalFarhatAliMD");
  });

  it("is linked from the menu of every page", () => {
    for (const [slug, page] of Object.entries(PAGE_SOURCE)) {
      expect(page, slug).toMatch(/<a href="videos\.html" class="nav-item nav-link[^"]*">Videos<\/a>/);
    }
  });
});
