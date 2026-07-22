export const WAITLIST_ROLE_VALUES = [
  "developer",
  "data-scientist",
  "product-manager",
  "student-researcher",
  "trader",
  "designer",
  "founder",
  "other",
] as const;

export type WaitlistRole = (typeof WAITLIST_ROLE_VALUES)[number];

export const WAITLIST_ROLES: ReadonlyArray<{ value: WaitlistRole; label: string }> = [
  { value: "developer", label: "Developer / Engineer" },
  { value: "data-scientist", label: "Data Scientist / AI Engineer" },
  { value: "product-manager", label: "Product Manager" },
  { value: "student-researcher", label: "Student / Researcher" },
  { value: "trader", label: "Trader / Analyst" },
  { value: "designer", label: "Designer / Creator" },
  { value: "founder", label: "Founder / Entrepreneur" },
  { value: "other", label: "Other" },
];

export const WAITLIST_TOOLS = [
  "VS Code / IDE",
  "Chrome / Browser",
  "Terminal",
  "Jupyter / Colab",
  "Notion / Docs",
  "Office / Google Workspace",
  "Zotero / Reference Manager",
  "TradingView / Trading",
  "Figma / Design Tools",
  "Slack / Teams",
  "GitHub / GitLab",
  "Other",
] as const;

export const WAITLIST_AI_FREQUENCY_VALUES = [
  "multiple-daily",
  "daily",
  "weekly",
  "rarely",
] as const;

export type WaitlistAiFrequency = (typeof WAITLIST_AI_FREQUENCY_VALUES)[number];

export const WAITLIST_AI_FREQUENCIES: ReadonlyArray<{
  value: WaitlistAiFrequency;
  label: string;
}> = [
  { value: "multiple-daily", label: "Multiple times daily" },
  { value: "daily", label: "Once daily" },
  { value: "weekly", label: "A few times a week" },
  { value: "rarely", label: "Rarely / Just exploring" },
];
