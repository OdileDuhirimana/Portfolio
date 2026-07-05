import ContactPageClient from "@/components/ContactPageClient";
import { pageTitle } from "@/lib/seo";

export const metadata = {
  title: pageTitle("Contact"),
  description: "Send a message, connect on GitHub/LinkedIn, or scan QR to open on mobile.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
