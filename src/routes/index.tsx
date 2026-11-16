import { createFileRoute } from "@tanstack/react-router";
import { SITE_LOGO_URL } from "@/lib/site-content/branding";

/** Home page — rendered from the database copy of the original markup. */
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dr. Bilal Farhat Ali, MD | Internal Medicine Physician in Cincinnati" },
      { name: "description", content: "Internal Medicine physician in Cincinnati, Ohio: diabetes, blood pressure, kidney, thyroid and preventive care for adults — consultations in English and Urdu." },
      { property: "og:title", content: "Dr. Bilal Farhat Ali, MD | Internal Medicine Physician in Cincinnati" },
      { property: "og:description", content: "Internal Medicine physician in Cincinnati, Ohio: diabetes, blood pressure, kidney, thyroid and preventive care for adults — consultations in English and Urdu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "preload",
        as: "image",
        href: SITE_LOGO_URL,
        fetchPriority: "high",
      },
    ],
  }),
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { renderSitePage } = await import("@/lib/site-content/render.server");
        return renderSitePage(request, "index");
      },
    },
  },
});
