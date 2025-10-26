import type { Category } from "@/data/projects";
import {
  Building2,
  GraduationCap,
  HeartPulse,
  Ticket,
  LineChart,
  Activity,
  PhoneCall,
  Link2,
  ShoppingBag,
  MessagesSquare,
  Eye,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";

const GOLD = "#D4AF37";
const SIZE = 44; // ~ h-11

const byCategoryIcon: Record<Category, React.ComponentType<any>> = {
  backend: Building2,
  frontend: LineChart,
  fullstack: Building2,
  ml: LineChart,
};

const bySlug: Record<string, React.ComponentType<any>> = {
  "nova-bank-core": Building2,
  "edusync-lms": GraduationCap,
  "careflow-api": HeartPulse,
  gatherly: Ticket,
  trackella: LineChart,
  fitsync: Activity,
  careconnect: PhoneCall,
  skillbridge: Link2,
  safeshop: ShoppingBag,
  campusconnect: MessagesSquare,
  sentimentscope: Eye,
  "fraudguard-ml": ShieldCheck,
  predictwise: Lightbulb,
};

export default function ProjectIcon({ slug, category }: { slug: string; category: Category }) {
  const Icon = bySlug[slug] || byCategoryIcon[category] || LineChart;
  return <Icon size={SIZE} color={GOLD} strokeWidth={2.25} />;
}
