import React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface BlurTextProps {
  text: string
  delay?: number
  className?: string
  animateBy?: "words" | "letters"
  direction?: "top" | "bottom"
}

export function BlurText({
  text,
  delay = 50,
  className = "",
  animateBy = "words",
  direction = "top",
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("")

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-1.5", className)}>
      {elements.map((element, i) => (
        <motion.span
          key={i}
          initial={{
            filter: "blur(8px)",
            opacity: 0,
            y: direction === "top" ? -10 : 10,
          }}
          animate={{
            filter: "blur(0px)",
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: (i * delay) / 1000,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="inline-block"
        >
          {element}
        </motion.span>
      ))}
    </span>
  )
}

export default BlurText
