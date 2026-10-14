import { track as vercelTrack } from "@vercel/analytics";

// Analytics events for the landing page, with no personal data: which scenario, which mode, where
// a download was clicked. Vercel Web Analytics is cookieless, so there is no banner to accept.
// (Custom events need a plan that includes them; page views are counted either way.)
//
//   demo_started{scenario}            the live demo began to play
//   demo_takeover{scenario, phase}    a visitor took it over
//   demo_request / demo_sent / demo_completed{scenario, mode}
//   download_clicked{location}        top, hero or closing
//   next_signup                       "Hear about it first"
//   share_link                        "Try it on your Mac", on a phone

type Props = Record<string, string | number | boolean>;

export function track(name: string, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    vercelTrack(name, props);
  } catch {
    // Analytics never breaks the page.
  }
  if (process.env.NODE_ENV === "development") console.debug("[track]", name, props ?? {});
}
