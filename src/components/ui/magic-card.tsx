"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
  gradientOpacity?: number;
  onClick?: () => void;
  disabled?: boolean;
}

export function MagicCard({
  children,
  className,
  gradientColor = "#6366f1",
  gradientOpacity = 0.15,
  onClick,
  disabled = false,
}: MagicCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || disabled) return;
      const rect = ref.current.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [disabled]
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.03, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative overflow-hidden rounded-xl border transition-all duration-300",
        disabled
          ? "border-dashed border-gray-200 bg-gray-50/60"
          : "border-gray-200 bg-white shadow-sm hover:shadow-lg",
        disabled ? "cursor-default" : "cursor-pointer",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: hovered ? gradientOpacity : 0,
          background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, ${gradientColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
