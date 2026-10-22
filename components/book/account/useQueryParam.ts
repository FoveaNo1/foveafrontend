"use client";

import { useSyncExternalStore } from "react";

const still = () => () => {};

/** One parameter of the page's address, read in the browser: null on the server and while the page hydrates, so the
 *  first render matches the server's, then the real value. */
export function useQueryParam(name: string): string | null {
  return useSyncExternalStore(still, () => new URLSearchParams(location.search).get(name), () => null);
}
