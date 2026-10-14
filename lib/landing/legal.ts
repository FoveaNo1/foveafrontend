// The Privacy Policy and the Terms of Service, word for word as the site had them (components/PrivacyPageContent.tsx and
// components/TermsPageContent.tsx, Oct 13), set in the landing page's type by components/book/LegalPage.tsx.
// A link inside a paragraph is written [[text|href]]. Engineers drafted this text: a lawyer should review it.

export type LegalBlock = { k: "h2" | "h3" | "p"; t: string };
export type LegalDoc = { title: string; updated: string; blocks: LegalBlock[] };

export const Privacy: LegalDoc = {
  "title": "Privacy Policy",
  "updated": "Last updated: June 2026",
  "blocks": [
    {
      "k": "h2",
      "t": "Introduction"
    },
    {
      "k": "p",
      "t": "This Privacy Policy describes how Fovea (\"Fovea\" or \"Company\") collects, uses, and handles your personal data when you use our macOS application and related services (collectively, the \"Services\"). By using the Services, you agree to the practices described in this policy."
    },
    {
      "k": "h2",
      "t": "Information We Collect"
    },
    {
      "k": "h3",
      "t": "Customer Content You Provide"
    },
    {
      "k": "p",
      "t": "Your voice inputs, text selections, screenshots, and other contextual information are processed in real time by Fovea and/or third-party AI providers to provide the requested result, and are immediately discarded once the result is returned to your device. No voice recordings, prompt content, or screen context data are stored on our servers after processing."
    },
    {
      "k": "p",
      "t": "Your device may store a local session history and an on-device Memory — including audio, screenshots, and generated prompts — until you choose to delete it. The full Memory database and its media (your audio, screenshots, and files) stay on your device; we do not upload or retain them on our servers unless you explicitly re-submit a previous request."
    },
    {
      "k": "p",
      "t": "To organize and index your Memory so it can be searched, short text and metadata excerpts derived from it — such as your question, the answer summary, the source app, website, or title you were viewing, on-screen selections, and gaze signals — may be sent in real time to our processing relay and third-party AI providers, then immediately discarded; the resulting search index is written back to your device. This can happen automatically — for example when a memory is created or when you open the Memory view — not only when you re-submit a request. We do not retain this content on our servers. See \"On-Device Memory\" below."
    },
    {
      "k": "h3",
      "t": "Account Information"
    },
    {
      "k": "p",
      "t": "When you create an account, we collect your email address for authentication and usage tracking. We also collect usage metrics such as prompt count and quota usage to manage your subscription."
    },
    {
      "k": "h3",
      "t": "Diagnostic Information"
    },
    {
      "k": "p",
      "t": "If you voluntarily submit a diagnostic report, we collect application logs, system information, and an anonymous identifier to help resolve issues. Diagnostic data is only uploaded when you manually trigger it. It does not include your voice recordings, screenshots, prompt content, or any personally identifiable information beyond the anonymous identifier."
    },
    {
      "k": "h3",
      "t": "Usage Data"
    },
    {
      "k": "p",
      "t": "We may collect information related to how you interact with the Services, including device type, app version, and performance metrics. This data is used to improve the Services and is not linked to your prompt content."
    },
    {
      "k": "h2",
      "t": "On-Device Memory"
    },
    {
      "k": "p",
      "t": "To help your AI tools recall earlier context, Fovea can keep a Memory of your past interactions. The Memory database and its media are stored on your device and are not retained on Fovea's servers. It may include your questions, answer summaries, the source app, website URL, and title of the context you were viewing, on-screen selections, gaze signals, screenshots, automatically generated tags, and locally computed search embeddings. As described above, short text and metadata excerpts may be relayed in real time to organize and index your Memory, but are not stored on our servers."
    },
    {
      "k": "p",
      "t": "Memory is on by default, and the app explains it when you first set up Fovea. Because this data lives on your device, you control it directly: you can pause it, hide or delete individual items, block specific apps or websites, or clear all of it at any time from within the app."
    },
    {
      "k": "p",
      "t": "Memory Connector — Fovea offers an optional connector that runs locally on your Mac and lets an AI client you choose read the memories you have not hidden. If you install this connector and connect your own AI client, that client can read those memories — including their screenshots and source pages — and will send them to its own AI provider under that provider's terms. This happens only because you set it up; Fovea's servers are not involved in this transfer. The connector runs locally, exposes the memories currently visible to it (those you have not hidden or deleted), can perform local actions such as soft-deleting a memory when your AI client asks it to, and keeps a local log of its own access on your device."
    },
    {
      "k": "h2",
      "t": "Use of Data"
    },
    {
      "k": "p",
      "t": "Fovea uses the information we collect for the following purposes:"
    },
    {
      "k": "p",
      "t": "Service operation — Your voice data and contextual information are processed in real time and are not retained after delivering results to your device."
    },
    {
      "k": "p",
      "t": "Account management — Managing your subscription, authentication, and usage quotas."
    },
    {
      "k": "p",
      "t": "Communication — Responding to support requests and sending service-related notifications."
    },
    {
      "k": "p",
      "t": "Improvement — Analyzing usage patterns and diagnostic reports to improve the Services."
    },
    {
      "k": "p",
      "t": "Compliance — Meeting applicable legal obligations."
    },
    {
      "k": "h2",
      "t": "Data We Do NOT Collect"
    },
    {
      "k": "p",
      "t": "Fovea does not retain your voice recordings, screenshots, or prompt content on its servers after processing."
    },
    {
      "k": "p",
      "t": "Fovea does not use your content to train its own models."
    },
    {
      "k": "p",
      "t": "We do not collect or retain your browsing history on our servers."
    },
    {
      "k": "p",
      "t": "We do not sell your data or share it with third parties for advertising."
    },
    {
      "k": "h2",
      "t": "Sharing With Others"
    },
    {
      "k": "p",
      "t": "We may share your information with the following parties:"
    },
    {
      "k": "p",
      "t": "AI service providers — When you use Fovea's features, your prompt content may be sent to third-party AI providers to generate responses. These providers process your data under their own terms, privacy policies, and retention settings. Where provider features intended to limit data retention are available, Fovea enables them where applicable."
    },
    {
      "k": "p",
      "t": "Infrastructure providers — We use third-party services for authentication, data storage, and error tracking. These providers have access to your data only to perform tasks on our behalf and are obligated not to use it for any other purpose."
    },
    {
      "k": "p",
      "t": "Legal compliance — We may disclose information when required by law or to protect our rights."
    },
    {
      "k": "h2",
      "t": "Retention of Data"
    },
    {
      "k": "p",
      "t": "Voice and context data — Processed in real time and immediately discarded once the result is returned to your device."
    },
    {
      "k": "p",
      "t": "Local session history — Stored on your device until you choose to delete it."
    },
    {
      "k": "p",
      "t": "Account and billing information — Retained as necessary to provide Services, comply with legal obligations, and resolve disputes."
    },
    {
      "k": "p",
      "t": "Diagnostic reports — Retained only as needed to resolve the reported issue."
    },
    {
      "k": "h2",
      "t": "Permissions We Request"
    },
    {
      "k": "p",
      "t": "Microphone — Required for voice input."
    },
    {
      "k": "p",
      "t": "Accessibility — Required to read content from your active applications and deliver results to AI tools."
    },
    {
      "k": "p",
      "t": "Screen Recording — Required to capture screen context for your prompts."
    },
    {
      "k": "h2",
      "t": "Your Rights and Choices"
    },
    {
      "k": "p",
      "t": "Your Memory and controls — Your Memory is stored on your device, so you control it directly: you can pause capture, hide individual items, block specific apps or websites, and permanently delete all of it from within the app. Fovea does not hold a server-side copy of your Memory content to retrieve or delete on your behalf."
    },
    {
      "k": "p",
      "t": "Your account information — For the limited information we do hold on our servers — your email address and usage metrics — you may request access to it, request its deletion, or ask us to stop processing it, subject to legal and billing retention requirements."
    },
    {
      "k": "p",
      "t": "Depending on where you live, you may have additional rights under laws such as the GDPR (EU, EEA, and UK) or the CCPA/CPRA (California), including the right to access and delete your personal information. Fovea does not sell your personal data. To exercise any of these rights, contact us through our [[feedback page|/feedback]]."
    },
    {
      "k": "h2",
      "t": "How We Secure Your Information"
    },
    {
      "k": "p",
      "t": "We implement technical and organizational safeguards to protect the information we collect from loss, misuse, and unauthorized access. All data in transit is encrypted via HTTPS. However, no method of transmission over the internet is 100% secure."
    },
    {
      "k": "h2",
      "t": "Changes to This Privacy Policy"
    },
    {
      "k": "p",
      "t": "We may update this Privacy Policy from time to time. When we do, we will revise the \"Last updated\" date at the top of this page. We will notify you of any significant changes that reduce your rights. Changes do not apply retroactively."
    },
    {
      "k": "h2",
      "t": "Contact"
    },
    {
      "k": "p",
      "t": "If you have questions about this Privacy Policy or your data, please reach out through our [[feedback page|/feedback]]."
    }
  ]
};

export const Terms: LegalDoc = {
  "title": "Terms of Service",
  "updated": "Last updated: June 2026",
  "blocks": [
    {
      "k": "h2",
      "t": "1. Acceptance of Terms"
    },
    {
      "k": "p",
      "t": "By downloading, installing, or using Fovea for Mac (\"the Software\"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, do not use the Software."
    },
    {
      "k": "h2",
      "t": "2. Your Account"
    },
    {
      "k": "p",
      "t": "You must create an account to use Fovea. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. You must notify us immediately if you suspect unauthorized access."
    },
    {
      "k": "h2",
      "t": "3. Your Content"
    },
    {
      "k": "p",
      "t": "You retain ownership of all content you provide to the Software, including voice input, text selections, screenshots, and files. By using the Software, you grant Fovea a limited license to process this content solely for the purpose of providing the Services."
    },
    {
      "k": "p",
      "t": "AI-generated output belongs to you. Fovea makes no representations or warranties regarding the accuracy, completeness, or fitness of any AI-generated output."
    },
    {
      "k": "h2",
      "t": "4. Our Services"
    },
    {
      "k": "p",
      "t": "Fovea is a macOS application that captures context from your active workspace and assembles it into prompts for AI tools. The Software is currently in beta. Features may change, and the service may be interrupted without prior notice."
    },
    {
      "k": "p",
      "t": "Fovea can also keep a user-controlled on-device Memory of your past interactions, which is on by default and which you can disable or delete at any time. If you choose, you can let external AI tools you connect read it through an optional local connector. These features are described in our Privacy Policy."
    },
    {
      "k": "p",
      "t": "We grant you a revocable, non-exclusive, non-transferable, limited right to access and use the Services in accordance with these Terms."
    },
    {
      "k": "h2",
      "t": "5. Restrictions"
    },
    {
      "k": "p",
      "t": "You agree not to:"
    },
    {
      "k": "p",
      "t": "Reverse-engineer, decompile, or disassemble any part of the Software."
    },
    {
      "k": "p",
      "t": "Use the Software to violate any applicable laws or regulations."
    },
    {
      "k": "p",
      "t": "Attempt to circumvent usage quotas or access controls."
    },
    {
      "k": "p",
      "t": "Redistribute, sublicense, or resell the Software without authorization."
    },
    {
      "k": "p",
      "t": "Record or transcribe others' speech without their consent."
    },
    {
      "k": "p",
      "t": "Use the Software to generate content that promotes violence, hatred, or discrimination."
    },
    {
      "k": "h2",
      "t": "6. Privacy"
    },
    {
      "k": "p",
      "t": "Your use of the Services is governed by our [[Privacy Policy|/privacy]], which describes how we collect, use, and handle your personal data. By using the Software, you acknowledge that you have read and understood our Privacy Policy."
    },
    {
      "k": "h2",
      "t": "7. Third-Party Services"
    },
    {
      "k": "p",
      "t": "Fovea integrates with third-party AI providers to process your prompts. When you use these services through Fovea, your content is sent to the respective provider. When available and applicable, Fovea may use provider settings intended to limit data retention. Third-party providers may still handle your data according to their own terms, privacy policies, and account settings. Fovea is not responsible for the availability or practices of third-party services."
    },
    {
      "k": "h2",
      "t": "8. Paid Services"
    },
    {
      "k": "p",
      "t": "Free and paid plan terms are displayed within the application and on the Fovea website. Usage quotas apply based on your plan. You may cancel your subscription at any time. Fee changes take effect at the next renewal period with reasonable notice."
    },
    {
      "k": "h2",
      "t": "9. Intellectual Property"
    },
    {
      "k": "p",
      "t": "Fovea and all related trademarks, logos, and content are the property of Fovea AI. These Terms grant no rights to our intellectual property beyond the limited license to use the Software."
    },
    {
      "k": "h2",
      "t": "10. Warranty Disclaimers"
    },
    {
      "k": "p",
      "t": "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SOFTWARE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SOFTWARE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS."
    },
    {
      "k": "h2",
      "t": "11. Limitation of Liability"
    },
    {
      "k": "p",
      "t": "TO THE MAXIMUM EXTENT PERMITTED BY LAW, FOVEA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SOFTWARE, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR BUSINESS INTERRUPTION."
    },
    {
      "k": "h2",
      "t": "12. Termination"
    },
    {
      "k": "p",
      "t": "We may suspend or terminate your access to the Software at any time if you violate these Terms or create risk for Fovea. You may stop using the Software at any time by uninstalling it from your device."
    },
    {
      "k": "h2",
      "t": "13. Changes to These Terms"
    },
    {
      "k": "p",
      "t": "We may update these Terms from time to time. We will notify you of significant changes that reduce your rights. Changes do not apply retroactively. Continued use of the Software after changes constitutes acceptance of the updated terms."
    },
    {
      "k": "h2",
      "t": "14. Governing Law"
    },
    {
      "k": "p",
      "t": "These Terms are governed by the laws of the State of California, excluding conflict of law principles."
    },
    {
      "k": "h2",
      "t": "15. Contact"
    },
    {
      "k": "p",
      "t": "If you have questions about these Terms, please reach out through our [[feedback page|/feedback]]."
    }
  ]
};
