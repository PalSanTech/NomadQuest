import { motion } from "motion/react";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  disabled?: boolean;
}

export function Button({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  className = "",
  disabled = false 
}: ButtonProps) {
  const baseStyles = "px-8 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[11px]";
  
  const variants = {
    primary: "bg-[#f8f5f2] text-[#0a0908] hover:bg-white shadow-xl shadow-white/5",
    secondary: "bg-white/5 text-white/90 hover:bg-white/10 border border-white/5",
    outline: "bg-transparent text-white/70 border border-white/10 hover:border-white/20 hover:text-white"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string; key?: any }) {
  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold bg-white/5 border border-white/5 text-white/50 backdrop-blur-md ${className}`}>
      {children}
    </span>
  );
}

export function GlassCard({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`glass-surface rounded-[2rem] p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}
