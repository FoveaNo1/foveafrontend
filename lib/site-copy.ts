import type { Locale } from "./site-locale";

type FeedbackType = "bug" | "feature" | "general";

const siteCopy = {
  en: {
    common: {
      localeLabel: "Language",
      english: "English",
      chinese: "中文",
      footer: "© 2026 FOVEA AI. ALL RIGHTS RESERVED.",
      privacyEnglishOnly: "Privacy Policy is currently available in English only.",
      privacyLinkLabel: "Privacy Policy",
    },
    metadata: {
      home: {
        title: "Fovea - Speak. Capture. Deliver. All in one.",
        description:
          "Stop copy-pasting context. Fovea assembles your voice, screenshots, and selections into one prompt, then delivers it to any AI.",
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
      privacy: {
        title: "Fovea - Privacy Policy",
        description:
          "Read how Fovea handles microphone audio, app context, browser context, and account information.",
      },
    },
    nav: {
      backHome: "Back to Home",
    },
    home: {
      hero: {
        badge: "BETA ACCESS NOW OPEN",
        titleLine1: "Speak. Capture. Deliver.",
        titleHighlight: "All in one.",
        subtitle:
          "Stop copy-pasting context. Fovea assembles your voice, screenshots, and selections into one prompt, then delivers it to any AI.",
        subtitleStrong: "One capture flow, one send action, no manual stitching.",
        emailPlaceholder: "Enter your email...",
        rolePlaceholder: "Which option best describes you? *",
        roleOptions: [
          { value: "developer", label: "Developer / Engineer" },
          { value: "data-scientist", label: "Data Scientist / AI Engineer" },
          { value: "product-manager", label: "Product Manager" },
          { value: "student-researcher", label: "Student / Researcher" },
          { value: "trader", label: "Trader / Analyst" },
          { value: "designer", label: "Designer / Creator" },
          { value: "founder", label: "Founder / Entrepreneur" },
          { value: "other", label: "Other" },
        ],
        toolsLabel: "Which tools do you use most often? (Optional)",
        aiFrequencyLabel: "How often do you use AI tools? (Optional)",
        aiFrequencyOptions: [
          { value: "multiple-daily", label: "Multiple times daily" },
          { value: "daily", label: "Once daily" },
          { value: "weekly", label: "Few times a week" },
          { value: "rarely", label: "Rarely / Just exploring" },
        ],
        submitIdle: "Join the Beta",
        submitLoading: "Joining...",
        successDev: "Form validation succeeded in development mode. You're on the beta list.",
        successLive: "Welcome to the beta. You're on the list.",
        errorFallback: "Submission failed",
        privacyNotePrefix: "By submitting, you agree to our",
        privacyNoteSuffix:
          "We collect your role, tools, and approximate location (country/city) to understand our user base and prioritize regional support.",
        approvedPrompt: "Already approved for beta access?",
        approvedLink: "Download for macOS",
        demoCta: "SEE DEMO",
      },
      featureGrid: [
        {
          title: "Voice + Context",
          description:
            "Speak naturally while Fovea gathers the screenshots, selections, and surrounding context your AI needs.",
        },
        {
          title: "Multi-Source Assembly",
          description:
            "Combine voice, screenshots, copied text, and app state into one structured prompt instead of stitching it together manually.",
        },
        {
          title: "Works with Any AI",
          description:
            "Deliver polished prompts into ChatGPT, Claude, Codex, Cursor, Terminal workflows, and the tools your team already uses.",
        },
        {
          title: "Cross-App Capture",
          description:
            "Capture what matters from browsers, IDEs, terminals, docs, and desktop apps without breaking your flow.",
        },
      ],
      about: {
        title1: "From Single-Channel to Multi-Channel",
        body1:
          "Traditional AI workflows still force you to translate what you see into manual copy-paste. Fovea turns voice, screenshots, and selections into a single structured prompt so you can move from intent to execution without rebuilding context by hand.",
        codeLabel: "// Prompt Assembly Pipeline",
        codeInput:
          'Input: [Voice: "Analyze this error"] + [Screenshot: terminal] + [Selection: stack trace]',
        codeOutput: "Fovea: Packaging context and sending a ready-to-run prompt...",
        title2: "Deliver to Any AI",
        body2:
          "The goal is not another closed AI workspace. Fovea helps you capture context once, then deliver it wherever you already work. ChatGPT, Claude, Codex, Cursor, browser tools, and terminal flows can all stay in the loop.",
        chips: ["ChatGPT", "Claude", "Codex", "Cursor", "Terminal", "Browser"],
      },
      video: {
        windowTitle: "Fovea v0.2.0-beta",
        caption: "See it in action - voice, capture, and delivery in one flow",
        note: "Demo shows an earlier version. Updated beta walkthrough coming soon.",
      },
    },
    download: {
      badge: "BETA DOWNLOADS",
      title: "Download Fovea for macOS",
      intro:
        "This page is the stable install entry for approved beta users. First-time installs happen here. Existing installs receive in-app updates through Sparkle.",
      statusNote:
        "Downloads are not live yet. We are keeping the page in place now so the rollout can switch on without another website update.",
      macLabel: "macOS App",
      macTitle: "Primary beta download",
      macBody:
        "The macOS beta download will appear here once rollout begins. Until then, this stays as a placeholder entry point.",
      macButton: "Download coming soon",
      macAnnouncement:
        "The macOS beta download is coming soon. Downloads will open here once the beta rollout is ready.",
      macFootnote:
        "Once downloads open, this button will point to the stable beta installer without changing the page URL.",
      extLabel: "Optional Browser Extension",
      extTitle: "Companion delivery for web tools",
      extBody:
        "The Fovea Companion extension will be offered as an optional add-on for browser-based AI workflows. The macOS app remains the primary beta entry point.",
      extButton: "Extension coming soon",
      extAnnouncement:
        "The browser extension is coming soon. Downloads will open here once the beta rollout is ready.",
      extFootnote:
        "We will turn this on when browser delivery is included in the beta rollout.",
      expectationsTitle: "What to expect in beta",
      expectations: [
        "Fovea is evolving quickly. UI details and delivery flows may shift between beta releases.",
        "Automatic updates are built into the macOS app, so most approved users can stay current without manual downloads.",
      ],
      waitlistPrompt: "Need access but are not approved yet?",
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
  zh: {
    common: {
      localeLabel: "语言",
      english: "English",
      chinese: "中文",
      footer: "© 2026 FOVEA AI. 保留所有权利。",
      privacyEnglishOnly: "Privacy Policy 当前仅提供英文版。",
      privacyLinkLabel: "Privacy Policy",
    },
    metadata: {
      home: {
        title: "Fovea - 起心动念，言取合一。",
        description:
          "不再手动复制粘贴上下文。Fovea 将你的语音、截图和选中文本组装成一个完整提示词，再投递给任意 AI。",
      },
      download: {
        title: "Fovea - Beta 下载入口",
        description:
          "查看 Fovea Beta 的 macOS 下载入口，以及可选的浏览器扩展占位入口。",
      },
      feedback: {
        title: "Fovea - 提交反馈",
        description:
          "提交 Bug、功能建议和产品反馈，帮助我们改进 Fovea Beta。",
      },
      privacy: {
        title: "Fovea - Privacy Policy",
        description:
          "Read how Fovea handles microphone audio, app context, browser context, and account information.",
      },
    },
    nav: {
      backHome: "返回首页",
    },
    home: {
      hero: {
        badge: "BETA ACCESS 现已开放",
        titleLine1: "起心动念，",
        titleHighlight: "言取合一。",
        subtitle:
          "不再手动复制粘贴上下文。Fovea 将你的语音、截图和选中文本组装成一个完整提示词，再投递给任意 AI。",
        subtitleStrong: "一次捕捉，一次发送，不再手动拼接。",
        emailPlaceholder: "输入你的邮箱...",
        rolePlaceholder: "你最符合哪一类用户？ *",
        roleOptions: [
          { value: "developer", label: "开发者 / 工程师" },
          { value: "data-scientist", label: "数据科学家 / AI 工程师" },
          { value: "product-manager", label: "产品经理" },
          { value: "student-researcher", label: "学生 / 研究者" },
          { value: "trader", label: "交易员 / 分析师" },
          { value: "designer", label: "设计师 / 创作者" },
          { value: "founder", label: "创始人 / 创业者" },
          { value: "other", label: "其他" },
        ],
        toolsLabel: "你最常使用哪些工具？（可选）",
        aiFrequencyLabel: "你使用 AI 工具的频率如何？（可选）",
        aiFrequencyOptions: [
          { value: "multiple-daily", label: "每天多次" },
          { value: "daily", label: "每天一次" },
          { value: "weekly", label: "每周几次" },
          { value: "rarely", label: "很少 / 只是试试" },
        ],
        submitIdle: "加入 Beta",
        submitLoading: "提交中...",
        successDev: "开发模式下表单校验已通过，你已进入 Beta 名单。",
        successLive: "欢迎加入 Beta，我们已经收到你的申请。",
        errorFallback: "提交失败",
        privacyNotePrefix: "提交即表示你同意我们的",
        privacyNoteSuffix:
          "。我们会收集你的角色、常用工具以及大致位置（国家/城市），以便理解用户结构并优先安排区域支持。",
        approvedPrompt: "已经获得 Beta 资格？",
        approvedLink: "查看下载入口",
        demoCta: "查看 DEMO",
      },
      featureGrid: [
        {
          title: "语音 + 上下文",
          description:
            "你自然说话时，Fovea 会同时收集截图、选中文本和周边上下文，补齐 AI 真正需要的信息。",
        },
        {
          title: "多源组装",
          description:
            "把语音、截图、复制内容和应用状态组合成一个结构化提示词，不再手动拼接。",
        },
        {
          title: "适配任意 AI",
          description:
            "把整理好的提示词投递到 ChatGPT、Claude、Codex、Cursor、Terminal 工作流，以及你团队已经在用的工具里。",
        },
        {
          title: "跨应用捕捉",
          description:
            "在浏览器、IDE、终端、文档和桌面应用之间捕捉真正重要的上下文，不打断当前流程。",
        },
      ],
      about: {
        title1: "从单通道输入到多通道协作",
        body1:
          "传统 AI 工作流仍然要求你把眼前内容手动转成复制粘贴。Fovea 将语音、截图和选中文本组织成一个结构化提示词，让你从意图直接走向执行，而不是重复重建上下文。",
        codeLabel: "// Prompt 组装流程",
        codeInput:
          '输入：[Voice: "分析这个报错"] + [Screenshot: terminal] + [Selection: stack trace]',
        codeOutput: "Fovea：正在打包上下文，并发送可直接执行的 Prompt...",
        title2: "一次捕捉，投递到任意 AI",
        body2:
          "Fovea 的目标不是再造一个封闭式 AI 工作区，而是让你只捕捉一次上下文，然后投递到你已经在用的地方。ChatGPT、Claude、Codex、Cursor、浏览器工具和终端流程都可以继续保留在你的链路里。",
        chips: ["ChatGPT", "Claude", "Codex", "Cursor", "Terminal", "Browser"],
      },
      video: {
        windowTitle: "Fovea v0.2.0-beta",
        caption: "看看完整流程：语音、捕捉和投递如何串成一条线",
        note: "当前视频展示的是较早版本，更新后的 Beta 演示即将补上。",
      },
    },
    download: {
      badge: "BETA 下载入口",
      title: "下载 Fovea macOS 版本",
      intro:
        "这里会作为已获批 Beta 用户的稳定安装入口。首次安装走这里；已经安装的用户后续会通过 Sparkle 在 App 内更新。",
      statusNote:
        "下载尚未开放。我们先把页面结构预留出来，等准备就绪后可以直接切换上线，而不需要再改官网。",
      macLabel: "macOS App",
      macTitle: "主要 Beta 安装包",
      macBody:
        "macOS Beta 安装包会在正式开放时出现在这里。在那之前，这里只是预留入口。",
      macButton: "下载即将开放",
      macAnnouncement:
        "macOS Beta 下载即将开放。准备好之后，下载会直接在这里开启。",
      macFootnote:
        "开放下载后，这个按钮会切到稳定安装包地址，页面本身不需要再改。",
      extLabel: "可选浏览器扩展",
      extTitle: "面向网页工具的投递增强",
      extBody:
        "Fovea Companion 扩展会作为可选组件提供给浏览器内的 AI 工作流。macOS App 仍然是 Beta 的主入口。",
      extButton: "扩展即将开放",
      extAnnouncement:
        "浏览器扩展即将开放。准备好之后，下载会直接在这里开启。",
      extFootnote:
        "当浏览器投递纳入 Beta 范围后，我们会再打开这里。",
      expectationsTitle: "当前 Beta 阶段说明",
      expectations: [
        "Fovea 还在快速迭代中，界面细节和投递流程可能会在不同 Beta 版本之间继续变化。",
        "macOS App 内已经内置自动更新机制，所以多数已获批用户后续不需要手动下载。",
      ],
      waitlistPrompt: "还没有获得资格？",
      waitlistLink: "加入 Beta 等候名单",
    },
    feedback: {
      title: "提交反馈",
      intro:
        "你可以在这里提交 Bug、功能建议，或者任何产品反馈。你的意见会直接帮助我们改进 Fovea。",
      successTitle: "感谢反馈！",
      successBody: "我们已经收到你的反馈，会尽快查看。",
      submitAnother: "继续提交一条",
      typeLabel: "反馈类型",
      titleLabel: "标题",
      descriptionLabel: "描述",
      contactLabel: "联系方式",
      optionalLabel: "（可选）",
      titlePlaceholder: "用一句话概括你的反馈",
      descriptionPlaceholders: {
        bug: "发生了什么？你原本预期是什么？复现步骤是什么？",
        feature: "描述一下你希望增加的功能...",
        general: "写下你的想法...",
      },
      contactPlaceholder: "邮箱或其他联系方式",
      submitIdle: "提交反馈",
      submitLoading: "提交中...",
      errorFallback: "提交失败",
      typeOptions: [
        { value: "bug" as FeedbackType, label: "Bug 反馈", emoji: "!" },
        { value: "feature" as FeedbackType, label: "功能建议", emoji: "+" },
        { value: "general" as FeedbackType, label: "一般反馈", emoji: "..." },
      ],
    },
  },
} as const;

export type SiteCopy = (typeof siteCopy)[Locale];

export function getSiteCopy(locale: Locale): SiteCopy {
  return siteCopy[locale];
}
