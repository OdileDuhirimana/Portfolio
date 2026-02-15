import type { Category } from "@/data/projects";
import {
  Landmark,
  GraduationCap,
  HeartPulse,
  Ticket,
  Wallet,
  Dumbbell,
  Stethoscope,
  Briefcase,
  ShoppingCart,
  Smartphone,
  Monitor,
  LayoutDashboard,
  UsersRound,
  MessageCircle,
  ShieldCheck,
  Brain,
  Server,
  LayoutGrid,
  Layers,
  LineChart,
} from "lucide-react";

const GOLD = "#D4AF37";
const SIZE = 44; // ~ h-11
const STROKE = 1.5;

const byCategoryIcon: Record<Category, React.ComponentType<any>> = {
  backend: Server,
  frontend: LayoutGrid,
  fullstack: Layers,
  ml: Brain,
};

const bySlug: Record<string, React.ComponentType<any>> = {
  "nova-bank-core": Landmark,
  "edusync-lms": GraduationCap,
  "careflow-api": HeartPulse,
  gatherly: Ticket,
  trackella: Wallet,
  "efiche-mobile": Smartphone,
  "efiche-web": Monitor,
  "efiche-dashboard": LayoutDashboard,
  fitsync: Dumbbell,
  careconnect: Stethoscope,
  skillbridge: Briefcase,
  safeshop: ShoppingCart,
  campusconnect: UsersRound,
  sentimentscope: MessageCircle,
  "fraudguard-ml": ShieldCheck,
  predictwise: Brain,
};

export default function ProjectIcon({ slug, category }: { slug: string; category: Category }) {
  const Icon = bySlug[slug] || byCategoryIcon[category] || LineChart;
  return <Icon size={SIZE} color={GOLD} strokeWidth={STROKE} />;
}
