import { describe, expect, it } from "vitest";
import { SITE_LANGS, isSiteLang, getContentSnapshot } from "./server";
import { renderPage } from "./transform";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

describe("public languages", () => {
  it("offers exactly English and Urdu", () => {
    expect(SITE_LANGS).toEqual(["en", "ur"]);
    expect(isSiteLang("ur")).toBe(true);
    expect(isSiteLang("ru")).toBe(false);
    expect(isSiteLang("he")).toBe(false);
  });

  it("bundles Urdu for every English content key", async () => {
    const snapshot = await getContentSnapshot();
    expect(Object.keys(snapshot.langs.ur).sort()).toEqual(Object.keys(snapshot.langs.en).sort());
    for (const [key, english] of Object.entries(snapshot.langs.en)) {
      if (/[a-z]/i.test(english as string) && !/^(@dr\.bilalfarhat|@BilalFarhatAliMD|breadcrumb)$/.test(english as string)) {
        expect(snapshot.langs.ur[key]).toMatch(/[\u0600-\u06FF]/);
      }
    }
  });

  it("renders Urdu and English with the same left-to-right layout", () => {
    const html = "<html><head></head><body>Home</body></html>";
    expect(renderPage(html, { texts: {}, images: {}, lang: "ur" })).toContain('lang="ur" dir="ltr"');
    expect(renderPage(html, { texts: {}, images: {}, lang: "en" })).toContain('lang="en" dir="ltr"');
  });
});

describe("default language", () => {
  it("serves English when no language is chosen", async () => {
    const { renderSitePage } = await import("./render.server");
    const res = await renderSitePage(new Request("http://x/index.html"), "index");
    expect(await res.text()).toContain('window.__SITE_LANG__="en"');
  });

  it("keeps cookie-selected pages out of shared caches", async () => {
    const { renderSitePage } = await import("./render.server");
    const res = await renderSitePage(new Request("http://x/index.html", {
      headers: { cookie: "site_lang=ur" },
    }), "index");
    expect(await res.text()).toContain('window.__SITE_LANG__="ur"');
    expect(res.headers.get("Cache-Control")).toBe("private, no-cache");
    expect(res.headers.get("Vary")).toBe("Cookie");
    const fresh = await renderSitePage(new Request("http://x/index.html"), "index");
    expect(await fresh.text()).toContain('window.__SITE_LANG__="en"');
    expect(fresh.headers.get("Cache-Control")).toBe("private, no-cache");
  });

  it("switches explicitly to Urdu even with a remembered English preference", async () => {
    const { renderSitePage } = await import("./render.server");
    const res = await renderSitePage(new Request("http://x/about.html?lang=ur", {
      headers: { cookie: "site_lang=en" },
    }), "about");
    expect(await res.text()).toContain('window.__SITE_LANG__="ur"');
    expect(res.headers.get("Cache-Control")).toContain("public");
  });

  it("renders English on an explicit switch even with an Urdu cookie", async () => {
    const { renderSitePage } = await import("./render.server");
    const res = await renderSitePage(new Request("http://x/service.html?lang=en", {
      headers: { cookie: "site_lang=ur" },
    }), "service");
    expect(await res.text()).toContain('window.__SITE_LANG__="en"');
  });

  it("sends both dropdown choices as explicit language URLs", () => {
    const dom = new JSDOM('<div class="navbar-languages"></div>', {
      url: "http://x/?lang=en", runScripts: "outside-only",
    });
    const destinations: [string, string][] = [];
    Object.assign(dom.window, {
      __SITE_LANG__: "en",
      __siteGo: (url: string, lang: string) => destinations.push([url, lang]),
    });
    dom.window.eval(readFileSync("public/js/i18n.js", "utf8"));
    dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));
    for (const lang of ["ur", "en"]) {
      const choice = dom.window.document.querySelector<HTMLAnchorElement>(`[data-lang="${lang}"]`);
      expect(choice?.getAttribute("href")).toBe(`/?lang=${lang}`);
      choice?.click();
    }
    expect(destinations).toEqual([["http://x/?lang=ur", "ur"], ["http://x/?lang=en", "en"]]);
    dom.window.close();
  });
});
