import { getContactRecipientEmail } from "@/lib/config/site";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/email/sendContactEmail";
import { createRequestLogger } from "@/lib/logger";
import { createContactHandler } from "./createContactHandler";

/**
 * The one place real implementations are wired into the contact handler —
 * see `createContactHandler.ts` for why this indirection exists (a real DI
 * seam, not module-mock-based testing). Everything below is a direct,
 * untransformed reference to the real modules; there is no logic here to
 * unit-test in isolation, which is the point — this file's only job is
 * wiring, and `createContactHandler.test.ts` covers the actual behavior
 * with injected fakes.
 */
export const POST = createContactHandler({
  checkRateLimit,
  sendContactEmail,
  getContactRecipientEmail,
  createLogger: createRequestLogger,
  getEmailProviderEnv: () => ({
    resendApiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.CONTACT_FROM_EMAIL,
  }),
});
