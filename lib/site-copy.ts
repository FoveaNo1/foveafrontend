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
        title: "Fovea · Talk to your agents from the notch. Just for now.",
        description:
          "Fovea is the way in for every agent: your voice and, soon, your eyes. It starts in your workspace.",
      },
      download: {
        title: "Fovea - Beta Downloads",
        description:
          "Preview the Fovea beta download entry point for macOS and the optional browser extension.",
      },
      feedback: {
        title: "Send feedback · Fovea",
        description:
          "Report bugs, request features, and share feedback for the Fovea beta.",
      },
      pricing: {
        title: "Fovea - Pricing",
        description:
          "Choose a Fovea plan for multimodal capture: voice, text, and images in one structured input flow.",
      },
      privacy: {
        title: "Privacy Policy · Fovea",
        description:
          "Read how Fovea handles microphone audio, selected text, screenshots, and account information.",
      },
    },
    nav: {
      backHome: "Back to Home",
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
