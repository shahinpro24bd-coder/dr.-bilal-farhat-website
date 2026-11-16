import { describe, expect, it } from "vitest";
import indexHtml from "../../site/index.html?raw";
import reelsScript from "../../../public/js/reels.js?raw";

const REELS = ["DYx4k11Nce3", "Db64M_UIfyh", "DW5BFfVjTBf", "DW-cp7VDVKz", "DWcOjvdDq5F", "DXVJ41XDZ7Z"];

describe("home Reel gallery", () => {
  it("ships six of Dr. Bilal's Instagram Reels as click-to-load posters", () => {
    for (const reel of REELS) {
      expect(indexHtml).toContain(`data-reel-play="${reel}"`);
      expect(indexHtml).toContain(`https://www.instagram.com/reel/${reel}/`);
    }
    expect(indexHtml.match(/data-reel-play=/g)).toHaveLength(6);
  });

  it("plays every Reel directly from a self-hosted video without an Instagram player", () => {
    for (const reel of REELS) {
      const button = indexHtml.match(new RegExp(`<button[^>]+data-reel-play="${reel}"[^>]*>`))?.[0];
      expect(button).toContain(`data-reel-src="/media/reels/reel-${reel}.mp4"`);
    }
    expect(indexHtml).not.toMatch(/<iframe[^>]+instagram\.com/i);
    expect(reelsScript).toContain('document.createElement("video")');
    expect(reelsScript).not.toContain('document.createElement("iframe")');
    expect(indexHtml).toContain('src="js/reels.js"');
  });
});
