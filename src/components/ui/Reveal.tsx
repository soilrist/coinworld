"use client";

import { motion, type Variants } from "framer-motion";

const baseVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

type Tag = "div" | "dl" | "dt" | "dd" | "ul" | "li" | "article";

/** 스크롤 시 한 번만 부드럽게 페이드업되는 절제된 리빌 래퍼. as로 시맨틱 태그 지정 가능. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: Tag;
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={baseVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}

/** 그리드 자식들을 순차적으로(stagger) 리빌한다. as로 시맨틱 태그 지정 가능(dl 등). */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: Tag;
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ staggerChildren: stagger }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: Tag }) {
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} variants={baseVariants} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </MotionTag>
  );
}
