import React, { useRef, useState } from "react"
import { motion } from "framer-motion"

export interface MagneticButtonProps {
  children: React.ReactNode
  distance?: number
  strength?: number
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export function MagneticButton({
  children,
  distance,
  strength = 0.2,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const pull = distance ?? strength
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    setPosition({ x: middleX * pull, y: middleY * pull })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.5 }}
      className={`inline-block cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export default MagneticButton
