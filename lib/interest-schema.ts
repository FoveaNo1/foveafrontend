import { z } from "zod";

import { EmailSchema } from "./subscribe-schema";

// "Hear about it first", under the landing page's Next section: an email and what it's for. One row
// per (email, interest), so someone already on the waitlist can ask about what's next too.
// `company` is a honeypot: people never see it, so it must stay empty.
export const InterestSchema = z
  .object({
    email: EmailSchema,
    interest: z.literal("next"),
    company: z.string().max(0).optional(),
  })
  .strict();

export type Interest = z.infer<typeof InterestSchema>;
