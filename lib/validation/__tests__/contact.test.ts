import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation/contact";

describe("contactSchema", () => {
  it("accepts a valid submission", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello, I would like to get in touch about a role.",
    });
    expect(result.success).toBe(true);
  });

  it("trims whitespace from all fields", () => {
    const result = contactSchema.safeParse({
      name: "  Jane Doe  ",
      email: "  jane@example.com  ",
      message: "  Hello there, this is a padded message.  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Jane Doe");
      expect(result.data.email).toBe("jane@example.com");
    }
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = contactSchema.safeParse({
      name: "J",
      email: "jane@example.com",
      message: "Hello there, this is a valid length message.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "not-an-email",
      message: "Hello there, this is a valid length message.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a message shorter than 10 characters", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "too short",
    });
    expect(result.success).toBe(false);
  });

  it("allows the honeypot field to be omitted", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello there, this is a valid length message.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a completely empty payload", () => {
    const result = contactSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects non-string field types", () => {
    const result = contactSchema.safeParse({
      name: 12345,
      email: "jane@example.com",
      message: "Hello there, this is a valid length message.",
    });
    expect(result.success).toBe(false);
  });
});
