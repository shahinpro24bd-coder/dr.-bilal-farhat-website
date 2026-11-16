import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { SITE_LOGO_URL } from "./branding";
import { getContentSnapshot } from "./server";

describe("self-hosted site logo", () => {
  it("uses the bundled Dr. Bilal Farhat Ali logo rather than a hosting-specific proxy", () => {
    expect(SITE_LOGO_URL).toBe("/img/dr-bilal-logo.png");
    expect(existsSync(resolve("public", SITE_LOGO_URL.slice(1)))).toBe(true);
  });

  it("uses the same portable logo in the shared snapshot slot", async () => {
    const snapshot = await getContentSnapshot();
    expect(snapshot.images["dr-bilal-logo"]).toBe(SITE_LOGO_URL);
  });
});
