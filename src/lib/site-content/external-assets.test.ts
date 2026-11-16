import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import indexHtml from "../../site/index.html?raw";
import aboutHtml from "../../site/about.html?raw";
import serviceHtml from "../../site/service.html?raw";
import appoinmentHtml from "../../site/appoinment.html?raw";
import contactHtml from "../../site/contact.html?raw";
import videosHtml from "../../site/videos.html?raw";
import fallback from "./fallback.generated.json?raw";

const PAGES = { indexHtml, aboutHtml, serviceHtml, appoinmentHtml, contactHtml, videosHtml };

describe("self-hosted media", () => {
  it("serves every image, poster and video from the site itself", () => {
    for (const [name, html] of Object.entries(PAGES)) {
      expect(html, name).not.toMatch(/lovable\.app|__l5e\/assets-v1/);
      const local = html.match(/(?:src|data-reel-src)="(\/(?:img|media)\/[^"]+)"/g) || [];
      for (const attr of local) {
        const path = attr.split('"')[1]!;
        expect(existsSync(resolve("public", path.slice(1))), `${name}: ${path}`).toBe(true);
      }
    }
    expect(fallback).not.toMatch(/lovable\.app|__l5e\/assets-v1/);
  });
});

describe("previous doctor content", () => {
  it("is fully removed from every page and the text bundle", () => {
    const banned = /Dina|Svinareva|Voronezh|Belgorod|Fatema|Mirza|Biadse|Nihaia|972532815272|ophthalm|blepharoplasty/i;
    for (const [name, html] of Object.entries(PAGES)) expect(html, name).not.toMatch(banned);
    expect(fallback).not.toMatch(banned);
  });
});
