import React from "react"
import { cn } from "@/lib/utils"

interface ShinyTextProps {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = "",
}: ShinyTextProps) {
  return (
    <span
      className={cn(
        "inline-block relative overflow-hidden",
        !disabled &&
          "bg-[linear-gradient(110deg,#000103,45%,#60a5fa,55%,#000103)] dark:bg-[linear-gradient(110deg,#94a3b8,45%,#ffffff,55%,#94a3b8)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer",
        className
      )}
      style={{
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </span>
  )
}
