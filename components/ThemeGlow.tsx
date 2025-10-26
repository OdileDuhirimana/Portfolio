"use client";
import { motion, useReducedMotion } from "framer-motion";

export default function ThemeGlow() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0.18, y: reduce ? 0 : -10 }}
        animate={{ opacity: 0.24, y: reduce ? 0 : 10 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="absolute left-1/2 top-[-10%] h-[50vh] w-[80vw] -translate-x-1/2 rounded-[999px] blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(212,175,55,0.35), transparent 70%)" }}
      />
      <motion.div
        initial={{ opacity: 0.12, x: reduce ? 0 : 0 }}
        animate={{ opacity: 0.18, x: reduce ? 0 : -10 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="absolute right-[-10%] bottom-[-10%] h-[40vh] w-[50vw] rounded-[999px] blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(110,86,207,0.25), transparent 70%)" }}
      />
    </div>
  );
}
