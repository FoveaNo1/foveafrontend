type FeedbackType = "bug" | "feature" | "general";

const siteCopy = {
  en: {
    common: {
      privacyLinkLabel: "Privacy Policy",
      pricingLinkLabel: "Pricing",
      feedbackLinkLabel: "Feedback",
      termsLinkLabel: "Terms of Service",
    },
    metadata: {
      home: {
        title: "Fovea - Speak. Capture. Deliver. All in one.",
        description:
          "Fovea is a cross-app multimodal interaction system for the AI era: speak, capture text and image materials, and deliver once to the AI tools you already use.",
      },
      download: {
        title: "Fovea - Beta Downloads",
        description:
          "Preview the Fovea beta download entry point for macOS and the optional browser extension.",
      },
      feedback: {
        title: "Fovea - Send Feedback",
        description:
          "Report bugs, request features, and share feedback for the Fovea beta.",
      },
      pricing: {
        title: "Fovea - Pricing",
        description:
          "Choose a Fovea plan for multimodal capture: voice, text, and images in one structured input flow.",
      },
      privacy: {
        title: "Fovea - Privacy Policy",
        description:
          "Read how Fovea handles microphone audio, selected text, screenshots, and account information.",
      },
    },
    nav: {
      backHome: "Back to Home",
    },
    home: {
      hero: {
        badge: "BETA FOR MACOS",
        titleLine1: "Speak. Capture. Deliver.",
        titleHighlight: "All in one.",
        subtitle: "Fovea is a cross-app multimodal interaction system for the AI era: press a hotkey, speak your intent, capture text and image materials, then deliver once to the AI tools you use.",
        subtitleStrong: "Voice, text, and images in one input.",
        navProduct: "Product",
        navWorkflow: "Workflow",
        navPricing: "Pricing",
        navFeedback: "Feedback",
        approvedLink: "Download for macOS",
        downloadShort: "Download",
        demoCta: "See workflow",
        heroStats: [
          { value: "1 step", label: "Hotkey, speak, capture, deliver" },
          { value: "Multimodal", label: "Voice, text, and images together" },
          { value: "Cross-app", label: "ChatGPT, Claude, Cursor, Codex" },
        ],
        captureLabel: "Parallel capture",
        captureBadge: "All at once",
        voiceSectionLabel: "Voice · live",
        voiceTranscript: "Explain this error, fold in my notes, draft a fix.",
        selectionsSectionLabel: "Selections · multiple",
        selections: [
          { label: "code", text: "async (req) => { throw new TypeError(" },
          { label: "log", text: "Error: token refresh failed after callback returns." },
        ],
        screenshotsSectionLabel: "Screenshots · multiple",
        screenshots: ["Screenshot 01", "Code view 02"],
        deliverLabel: "Deliver · structured",
        deliverSubtitle: "One structured payload for any tool.",
        tidiedLabel: "Tidied",
        transcriptLabel: "Voice transcript",
        deliverSelectionsLabel: "Selections · 2",
        deliverScreenshotsLabel: "Screenshots · 2",
        targetsLabel: "Targets",
        deliverTargets: ["ChatGPT", "Claude", "Cursor"],
        oneActionTitle: "One capture action",
        oneActionBody: "Intent + screen materials, sent together",
      },
      featureIntro: {
        eyebrow: "Cross-app multimodal interaction",
        title: "Voice, text, and images in one input, delivered across tools.",
        subtitle:
          "Fovea does not replace your AI apps. It captures the materials you choose from the apps where work is happening, packages them with your spoken intent, and delivers them to the target tool.",
        chips: ["Voice task flow", "Quick Q&A", "Prompt builder", "Materials-only mode", "Browser bridge"],
      },
      featureGrid: [
        {
          title: "Voice task flow",
          description:
            "Press a hotkey and speak while selecting text or screenshots. Fovea turns intent plus materials into one structured task package.",
        },
        {
          title: "Quick Q&A",
          description:
            "Ask a lightweight question about the current screen, selected text, or captured area without switching windows.",
        },
        {
          title: "Prompt builder",
          description:
            "Combine voice, materials, OCR, and current work context into an editable instruction before cross-tool delivery.",
        },
        {
          title: "Materials-only mode",
          description:
            "When speaking is not convenient, send selected text and screenshots through the same orchestration path.",
        },
      ],
      about: {
        beforeAfter: {
          eyebrow: "What changes",
          title: "From six manual steps to one AI task handoff.",
          subtitle:
            "The bottleneck is not one slow prompt. It is repeating screenshots, copying, switching windows, pasting, explaining, and submitting for every AI task.",
          beforeTitle: "Before Fovea",
          beforeItems: [
            "Screenshot",
            "Copy selected text",
            "Switch windows",
            "Paste, describe, submit",
          ],
          afterTitle: "With Fovea",
          afterItems: [
            "Press the hotkey",
            "Speak while capturing materials",
            "Fovea assembles the task package",
            "Deliver to the target AI",
          ],
        },
        useCases: {
          eyebrow: "Early users",
          title: "For people who hand work to AI many times a day.",
          items: [
            {
              title: "AI-heavy knowledge workers",
              description:
                "Research, excerpt, summarize, and rewrite without repeatedly rebuilding the same task materials.",
            },
            {
              title: "AI programming users",
              description:
                "Debug, inspect docs, and explain errors across terminals, browsers, editors, and AI tools.",
            },
            {
              title: "Cross-tool creators",
              description:
                "Move ideas, references, screenshots, and instructions across apps without losing the thread.",
            },
          ],
        },
        trust: {
          eyebrow: "How Fovea handles input",
          title: "You choose the materials. Fovea organizes and delivers them.",
          body:
            "Fovea works from the voice, text, and images you add during a task. It turns those materials into one clear structured input, then sends it to the tool you choose.",
          items: [
            "One input can include voice, multiple text selections, and multiple images.",
            "Fovea organizes the materials into a clear task package in the background.",
            "Deliver to ChatGPT, Claude, Gemini, Cursor, Codex, or compatible workflows.",
            "Less copying, pasting, switching windows, and re-explaining the same task.",
          ],
        },
      },
      guide: {
        eyebrow: "How it works",
        title: "Speak and Capture happen together. Deliver finishes it once.",
        description:
          "Fovea is not a step-by-step form. After the hotkey starts a session, voice, selected text, and screenshots can enter the same input in parallel, then Fovea delivers the assembled result once.",
        capture: {
          eyebrow: "Parallel capture",
          title: "Speak, select text, and add images in the same task",
          badge: "Live together",
        },
        speak: {
          title: "Say what you need",
          body: "Use voice to express the request, instruction, or question while you keep working with the material on screen.",
        },
        captureText: {
          title: "Select multiple text items",
          body: "Add more than one piece of text from the current task. Fovea treats them as part of the same input session.",
          items: ["code snippet", "paragraph", "note", "copied text"],
        },
        captureImages: {
          title: "Add multiple images",
          body: "Capture screenshots or visible details as many times as the task needs, without leaving the same flow.",
          items: ["screen area", "UI state", "document view"],
        },
        deliver: {
          eyebrow: "One deliver action",
          title: "Deliver the structured input",
          body: "After speaking and capture are done, the complete package is sent to ChatGPT, Claude, Gemini, Cursor, Codex, or another target.",
          invisibleTitle: "Assembly happens in the background",
          invisibleBody:
            "Speech transcription, material organization, and instruction assembly are handled by Fovea, so there is no extra manual composition step.",
          previewTitle: "Deliver output",
          readyLabel: "Ready",
          transcriptLabel: "Voice transcript",
          transcript:
            "Explain this error, combine the selected notes, and draft the next action plan.",
          selectionsLabel: "Selected text",
          selections: [
            "Error: token refresh failed after the callback returns.",
            "User feedback: the app loses context after switching tools.",
          ],
          imagesLabel: "Images",
          images: ["Screenshot 01", "UI state 02"],
          destinationsLabel: "Send to",
          destinations: ["ChatGPT", "Claude", "Cursor"],
        },
        caption: "Current beta: voice, text, and images in one input.",
        note: "",
      },
    },
    pricing: {
      badge: "Pricing preview",
      title: "Simple pricing for a new input layer.",
      intro:
        "Fovea is in beta. These plans frame how the product will be packaged as billing moves into Stripe checkout.",
      billingToggle: {
        monthly: "Monthly",
        annual: "Annual",
        save: "Save 40%",
      },
      plans: [
        {
          name: "Beta",
          price: "$0",
          period: "during beta",
          description: "For early users testing the macOS capture flow.",
          cta: "Download beta",
          href: "/download",
          featured: false,
          features: [
            "Voice, text, and image capture",
            "Structured output preview",
            "macOS beta updates",
            "Feedback channel access",
          ],
        },
        {
          name: "Pro",
          price: "$9",
          period: "per month, billed yearly",
          description: "For daily workflows that depend on fast multimodal input.",
          cta: "Start with beta",
          href: "/download",
          featured: true,
          features: [
            "Higher capture limits",
            "Browser companion workflow",
            "Priority model routing",
            "Early access to delivery improvements",
          ],
        },
        {
          name: "Team",
          price: "Custom",
          period: "for teams",
          description: "For teams that want shared onboarding, support, and admin controls.",
          cta: "Contact us",
          href: "/feedback",
          featured: false,
          features: [
            "Team onboarding",
            "Usage and billing support",
            "Privacy and deployment review",
            "Roadmap input for team workflows",
          ],
        },
      ],
      note:
        "Plan names and prices may change before public billing launches. Existing beta users will receive notice before any paid transition.",
      faqTitle: "Pricing FAQ",
      faqs: [
        {
          question: "Is Fovea free during beta?",
          answer:
            "Yes. The current macOS beta can be downloaded from the download page. Paid plans will be introduced with advance notice.",
        },
        {
          question: "Will Stripe handle billing?",
          answer:
            "Yes. The pricing page is structured so Stripe Checkout can replace the current beta CTAs when billing is enabled.",
        },
        {
          question: "What counts as a capture?",
          answer:
            "A capture is one user-triggered input flow that can include voice, selected text, screenshots, and visible screen details.",
        },
      ],
    },
    download: {
      badge: "BETA DOWNLOADS",
      title: "Download Fovea for macOS",
      intro:
        "Get started with Fovea. Download the macOS app, sign in, and you're ready to go. Existing users receive automatic updates inside the app.",
      macLabel: "macOS APP",
      macTitle: "Primary beta download",
      macButton: "Download for macOS",
      macVersion: "v0.2.0-beta.7",
      macRequirements: "macOS 13+",
      macAutoUpdate: "Auto-updates built in",
      packageTitle: "Latest macOS package",
      installSteps: [
        {
          title: "Download",
          body: "Get the latest signed macOS package.",
        },
        {
          title: "Install",
          body: "Open the DMG and move Fovea into Applications.",
        },
        {
          title: "Sign in",
          body: "Launch Fovea, sign in, and grant the permissions needed for capture.",
        },
      ],
      highlights: [
        "Speak while capturing multiple text selections and images.",
        "Deliver once after Fovea packages the input in the background.",
        "Keep your existing tools and workflows.",
      ],
      extTitle: "Fovea Companion Extension",
      extBody:
        "Optional Chrome extension for sending structured output to browser-based AI tools such as ChatGPT, Claude, Gemini, and DeepSeek.",
      extButton: "Download Extension",
      extInstallNote:
        "After downloading, move the extension folder to a permanent location (e.g. your Documents folder). Open chrome://extensions, enable \"Developer mode\", click \"Load unpacked\" and select the folder. Do not move or delete this folder after loading — Chrome will remove the extension on restart if the source files are missing.",
      requirementsTitle: "System Requirements",
      requirements: [
        "macOS 13 Ventura or later",
        "Apple Silicon Mac (M1 or later)",
        "Microphone & screen recording permissions",
      ],
      expectationsTitle: "What to expect in beta",
      expectations: [
        "Fovea is evolving quickly. UI details and delivery flows may shift between beta releases.",
        "Automatic updates are built into the macOS app, so you'll stay current without manual re-downloads.",
      ],
      waitlistPrompt: "Need access but not approved yet?",
      waitlistLink: "Join the beta waitlist",
    },
    feedback: {
      title: "Send Feedback",
      intro:
        "Report bugs, request features, or share your thoughts. Your feedback helps us improve Fovea.",
      successTitle: "Thank you!",
      successBody: "Your feedback has been submitted. We'll review it shortly.",
      submitAnother: "Submit another",
      typeLabel: "Type",
      titleLabel: "Title",
      descriptionLabel: "Description",
      contactLabel: "Contact",
      optionalLabel: "(optional)",
      titlePlaceholder: "Brief summary of your feedback",
      descriptionPlaceholders: {
        bug: "What happened? What did you expect? Steps to reproduce...",
        feature: "Describe the feature you would like to see...",
        general: "Share your thoughts...",
      },
      contactPlaceholder: "Email or other way to reach you",
      submitIdle: "Submit Feedback",
      submitLoading: "Submitting...",
      errorFallback: "Submission failed",
      typeOptions: [
        { value: "bug" as FeedbackType, label: "Bug Report", emoji: "!" },
        { value: "feature" as FeedbackType, label: "Feature Request", emoji: "+" },
        { value: "general" as FeedbackType, label: "General Feedback", emoji: "..." },
      ],
    },
  },
} as const;

export type SiteCopy = (typeof siteCopy)["en"];

export function getSiteCopy(): SiteCopy {
  return siteCopy.en;
}
