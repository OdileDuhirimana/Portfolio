"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  honey: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (data.honey) return; // spam honeypot
    setSubmitError(null);
    setSubmitMessage(null);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok || !result.ok) {
      setSubmitError(result.error || "Could not send your message. Please try again.");
      return;
    }

    setSubmitMessage("Message sent successfully. I will get back to you soon.");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div className="hidden">
        <input aria-hidden="true" tabIndex={-1} {...register("honey")} />
      </div>
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input className="w-full rounded-xl border border-(--line) bg-(--panel) px-3 py-2" {...register("name")} />
        {errors.name && <p className="text-sm text-(--danger)">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input type="email" className="w-full rounded-xl border border-(--line) bg-(--panel) px-3 py-2" {...register("email")} />
        {errors.email && <p className="text-sm text-(--danger)">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Message</label>
        <textarea rows={5} className="w-full rounded-xl border border-(--line) bg-(--panel) px-3 py-2" {...register("message")} />
        {errors.message && <p className="text-sm text-(--danger)">{errors.message.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="rounded-xl bg-(--gold) text-black px-5 py-3 font-medium disabled:opacity-70">Send</button>
      {submitMessage ? <p className="text-sm text-(--success)">{submitMessage}</p> : null}
      {submitError ? <p className="text-sm text-(--danger)">{submitError}</p> : null}
    </form>
  );
}
