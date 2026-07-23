"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const DEMO_EMBED_URL =
  "https://www.youtube-nocookie.com/embed/QvE4tXuuko4?autoplay=1&rel=0&cc_load_policy=0&enablejsapi=1";
const DEMO_PLAYER_ID = "fovea-demo-player";
const YOUTUBE_EMBED_ORIGIN = "https://www.youtube-nocookie.com";

type YouTubePlayerMessage = {
  event?: string;
  info?: {
    captions?: unknown;
  };
};

type DemoModalProps = {
  ctaLabel?: string;
  onCtaClick?: () => void;
  onRequestClose: () => void;
  open: boolean;
};

export default function DemoModal({
  ctaLabel,
  onCtaClick,
  onRequestClose,
  open,
}: DemoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
    closeButtonRef.current?.focus();

    return () => {
      document.documentElement.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    let captionsDisabled = false;

    function handlePlayerMessage(event: MessageEvent) {
      if (
        captionsDisabled ||
        event.origin !== YOUTUBE_EMBED_ORIGIN ||
        event.source !== iframeRef.current?.contentWindow ||
        typeof event.data !== "string"
      ) {
        return;
      }

      let message: YouTubePlayerMessage;
      try {
        message = JSON.parse(event.data) as YouTubePlayerMessage;
      } catch {
        return;
      }

      if (message.event !== "apiInfoDelivery" || !message.info?.captions) return;

      captionsDisabled = true;
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "setOption",
          args: ["captions", "track", {}],
        }),
        YOUTUBE_EMBED_ORIGIN,
      );
    }

    window.addEventListener("message", handlePlayerMessage);
    return () => window.removeEventListener("message", handlePlayerMessage);
  }, [open]);

  if (!open) return null;

  const embedUrl = `${DEMO_EMBED_URL}&origin=${encodeURIComponent(window.location.origin)}`;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Fovea demo"
      onCancel={(event) => {
        event.preventDefault();
        onRequestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onRequestClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;

        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusableElements = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), iframe, [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements.at(-1);
        if (!firstElement || !lastElement) return;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(1000px,calc(100vw-2rem))] overflow-y-auto rounded-[24px] border border-white/20 bg-[#F7F8F4] p-0 text-[#111315] shadow-[0_36px_100px_rgba(0,0,0,0.42)] backdrop:bg-black/75 backdrop:backdrop-blur-sm sm:rounded-[30px]"
    >
      <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-7 sm:py-5">
        <p className="py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0D7A5C]">
          Fovea demo · 1:40
        </p>
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close demo"
          onClick={onRequestClose}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#5E6861] transition hover:bg-[#E7ECE8] hover:text-[#111315] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D7A5C]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex w-full justify-center bg-black">
        <div className="aspect-video w-full [@media(max-height:500px)]:h-[calc(100dvh-8rem)] [@media(max-height:500px)]:w-auto [@media(max-height:500px)]:max-w-full">
          <iframe
            ref={iframeRef}
            id={DEMO_PLAYER_ID}
            src={embedUrl}
            title="Fovea demo video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onLoad={(event) => {
              event.currentTarget.contentWindow?.postMessage(
                JSON.stringify({ event: "listening", id: DEMO_PLAYER_ID }),
                YOUTUBE_EMBED_ORIGIN,
              );
            }}
            className="h-full w-full border-0"
          />
        </div>
      </div>

      {ctaLabel && onCtaClick && (
        <div className="flex justify-end px-5 py-5 sm:px-7 sm:py-6">
          <button
            type="button"
            onClick={onCtaClick}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#111315] px-6 text-sm font-semibold text-white transition hover:bg-[#253029] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D7A5C] focus-visible:ring-offset-2"
          >
            {ctaLabel}
          </button>
        </div>
      )}
    </dialog>
  );
}
