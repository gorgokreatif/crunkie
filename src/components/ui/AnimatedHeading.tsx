"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn, EASE_PREMIUM } from "@/lib/utils";

interface AnimatedHeadingProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export function AnimatedHeading({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.07,
  once = true,
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, margin: "-5% 0px" });

  const words = children.split(" ");

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const word = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: EASE_PREMIUM },
    },
  };

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="overflow-hidden"
    >
      <Tag className={className}>
        {words.map((w, i) => (
          <motion.span
            key={i}
            variants={word}
            className="inline-block"
            style={{ marginRight: "0.3em" }}
          >
            {w}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  );
}
