import { z } from "zod";

/**
 * Single source of truth for contact-form validation.
 *
 * WHY: the client (`ContactForm`) and the server (`/api/contact`) previously
 * each re-implemented these rules independently — the client with this same
 * zod schema, the server with a hand-rolled regex and length checks. The two
 * could silently drift (e.g. the server's email regex was weaker than zod's).
 * Importing this one schema from both call sites guarantees they can never
 * disagree about what a valid submission looks like.
 *
 * The server MUST still call `.safeParse` itself rather than trusting a flag
 * from the client — never trust client input — but it validates against the
 * exact same rules the user already saw client-side.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("A valid email address is required."),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
  // Honeypot field: real users never fill this in. Optional and unvalidated
  // beyond being a string, since bots may send anything here.
  honey: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
