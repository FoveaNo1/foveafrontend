import { z } from "zod";

import {
  WAITLIST_AI_FREQUENCY_VALUES,
  WAITLIST_ROLE_VALUES,
  WAITLIST_TOOLS,
} from "./waitlist-options";

export const EmailSchema = z
  .string()
  .min(1, { message: "Email is required" })
  .trim()
  .toLowerCase()
  .email({ message: "Please enter a complete email (e.g., .com, .net)" })
  .max(254);

export const ToolsSchema = z
  .array(z.enum(WAITLIST_TOOLS))
  .max(WAITLIST_TOOLS.length)
  .transform((tools) => [...new Set(tools)]);

// Landing Get Early Access posts { email, agents? }. `agents` is a first-class
// optional field so Zod `.strict()` does not 400 it as an unrecognized key.
// It is not role / tools / ai_frequency.
export const SubscribeSchema = z
  .object({
    email: EmailSchema,
    role: z.enum(WAITLIST_ROLE_VALUES).optional(),
    tools: ToolsSchema.optional(),
    ai_frequency: z.enum(WAITLIST_AI_FREQUENCY_VALUES).optional(),
    agents: z.string().trim().max(2000).optional(),
  })
  .strict();
