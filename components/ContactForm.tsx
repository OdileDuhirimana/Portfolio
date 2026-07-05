"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { contactSchema, type ContactFormValues } from "@/lib/validation/contact";

type ApiErrorBody = { ok: false; error: string; code: string };

export default function ContactForm() {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    if (data.honey) return; // spam honeypot
    setSubmitError(null);
    setSubmitMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok || !result?.ok) {
        const errorBody = result as ApiErrorBody | null;
        setSubmitError(errorBody?.error || "Could not send your message. Please try again.");
        return;
      }

      setSubmitMessage("Message sent successfully. I will get back to you soon.");
      reset();
    } catch {
      // Network failure (offline, DNS, CORS) — fetch itself rejected rather
      // than resolving with a non-ok response.
      setSubmitError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl" noValidate>
      <div className="hidden">
        <label htmlFor="contact-honey" className="sr-only">Leave this field empty</label>
        <input id="contact-honey" aria-hidden="true" tabIndex={-1} autoComplete="off" {...register("honey")} />
      </div>
      <div>
        <label htmlFor="contact-name" className="block text-sm mb-1">Name</label>
        <input
          id="contact-name"
          className="w-full rounded-xl border border-(--line) bg-(--panel) px-3 py-2 focus:outline-none focus-visible:ring-2 ring-(--focus)"
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="contact-name-error" role="alert" className="text-sm text-(--danger)">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm mb-1">Email</label>
        <input
          id="contact-email"
          type="email"
          className="w-full rounded-xl border border-(--line) bg-(--panel) px-3 py-2 focus:outline-none focus-visible:ring-2 ring-(--focus)"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="contact-email-error" role="alert" className="text-sm text-(--danger)">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm mb-1">Message</label>
        <textarea
          id="contact-message"
          rows={5}
          className="w-full rounded-xl border border-(--line) bg-(--panel) px-3 py-2 focus:outline-none focus-visible:ring-2 ring-(--focus)"
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="text-sm text-(--danger)">{errors.message.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-xl bg-(--gold) text-black px-5 py-3 font-medium disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? "Sending…" : "Send"}
      </button>
      <div aria-live="polite" className="sr-only">
        {isSubmitting ? "Sending your message" : submitMessage || submitError || ""}
      </div>
      {submitMessage ? <p className="text-sm text-(--success)">{submitMessage}</p> : null}
      {submitError ? <p role="alert" className="text-sm text-(--danger)">{submitError}</p> : null}
    </form>
  );
}
