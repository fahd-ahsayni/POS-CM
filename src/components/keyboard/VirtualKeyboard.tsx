import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { BackSpace, EnterButton, KeyboardClose, ShiftActive } from "@/assets/keyboard-icons"

interface Position {
  x: number
  y: number
}

export interface KeyConfig {
  label: string | React.ReactNode
  colSpan?: number
  action: string | (() => void)
  textColor?: string
  bgColor?: string
}

interface VirtualKeyboardProps {
  onClose: () => void
  onKeyPress: (key: string, cursorAdjustment: number) => void
  inputType: string | null
  customLayout?: KeyConfig[][]
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onClose, onKeyPress, inputType, customLayout }) => {
  const [isShiftActive, setIsShiftActive] = useState(false)

  // Position and dragging state
  const [position, setPosition] = useState<Position>({ x: 90, y: 150 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const headerRef = useRef<HTMLDivElement>(null)

  // Drag handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (headerRef.current && (headerRef.current === e.target || headerRef.current.contains(e.target as Node))) {
        setIsDragging(true)
        setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y })
        e.preventDefault()
      }
    },
    [position],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y })
      }
    },
    [isDragging, dragOffset],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Default layout definition
  const defaultLayout = useMemo<KeyConfig[][]>(
    () => [
      [
        { label: "1", action: "1" },
        { label: "2", action: "2" },
        { label: "3", action: "3" },
        { label: "4", action: "4" },
        { label: "5", action: "5" },
        { label: "6", action: "6" },
        { label: "7", action: "7" },
        { label: "8", action: "8" },
        { label: "9", action: "9" },
        { label: "0", action: "0" },
        { label: "-", action: "-" },
      ],
      [
        { label: "q", action: "q" },
        { label: "w", action: "w" },
        { label: "e", action: "e" },
        { label: "r", action: "r" },
        { label: "t", action: "t" },
        { label: "y", action: "y" },
        { label: "u", action: "u" },
        { label: "i", action: "i" },
        { label: "o", action: "o" },
        { label: "p", action: "p" },
        {
          label: <BackSpace className="dark:text-white text-primary-black" />,
          action: "Backspace",
          bgColor: "bg-neutral-bright-grey dark:bg-[#3F4042]",
        },
      ],
      [
        { label: "a", action: "a" },
        { label: "s", action: "s" },
        { label: "d", action: "d" },
        { label: "f", action: "f" },
        { label: "g", action: "g" },
        { label: "h", action: "h" },
        { label: "j", action: "j" },
        { label: "k", action: "k" },
        { label: "l", action: "l" },
        {
          label: <EnterButton className="text-white" />,
          colSpan: 2,
          action: "\n",
          textColor: "text-white",
          bgColor: "bg-primary-red",
        },
      ],
      [
        {
          label: <ShiftActive className="dark:text-white text-primary-black" />,
          colSpan: 2,
          action: () => setIsShiftActive((prev) => !prev),
          bgColor: "bg-neutral-bright-grey dark:bg-[#3F4042]",
        },
        { label: "z", action: "z" },
        { label: "x", action: "x" },
        { label: "c", action: "c" },
        { label: "v", action: "v" },
        { label: "b", action: "b" },
        { label: "n", action: "n" },
        { label: "m", action: "m" },
        { label: ",", action: "," },
        { label: ".", action: "." },
      ],
      [
        { label: "@", colSpan: 2, action: "@" },
        { label: "", colSpan: 7, action: " " },
        {
          label: <KeyboardClose className="dark:text-white text-primary-black size-6" />,
          colSpan: 2,
          action: onClose,
          bgColor: "bg-neutral-bright-grey dark:bg-[#3F4042]",
        },
      ],
    ],
    [onClose],
  )

  const memoizedLayout = useMemo(() => customLayout || defaultLayout, [customLayout, defaultLayout])

  // Handle key press events
  const handleKeyPressInternal = useCallback(
    (action: string) => {
      let processedAction = action;

      // Apply uppercase transformation if Shift is active and key is a letter
      if (isShiftActive && /^[a-z]$/.test(processedAction)) {
        processedAction = processedAction.toUpperCase();
        setIsShiftActive(false); // Deactivate Shift after use
      }

      // Handle special keys
      if (processedAction === "Backspace") {
        onKeyPress(processedAction, -1);
      } else if (processedAction === "\n") {
        onKeyPress(processedAction, 1);
      } else {
        onKeyPress(processedAction, 1);
      }
    },
    [onKeyPress, isShiftActive] // Track Shift state changes
  );

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        pointerEvents: "auto",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "667px",
        zIndex: 9999,
      }}
      className="fixed bg-secondary-white dark:bg-primary-black rounded-lg shadow-xl px-4 pb-4 select-none"
    >
      {/* Header for dragging */}
      <div
        ref={headerRef}
        className="flex justify-center items-center py-4 cursor-move rounded-t-lg w-full"
        onMouseDown={handleMouseDown}
      >
        <div className="w-6 h-1 rounded-lg bg-secondary-black dark:bg-secondary-white" />
      </div>

      {/* Keyboard layout */}
      <div className="space-y-1.5">
        {memoizedLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-11 gap-1.5">
            {row.map((key, keyIndex) => {
              const handleClick = () => {
                if (typeof key.action === "function") {
                  key.action()
                } else {
                  handleKeyPressInternal(key.action)
                }
              }

              return (
                <button
                  key={keyIndex}
                  onClick={handleClick}
                  className={cn(
                    "rounded-lg border border-border shadow active:shadow-none hover:scale-[0.96] duration-150 transition-all flex items-center justify-center font-medium h-12",
                    key.textColor || "text-primary-black dark:text-white",
                    key.bgColor || "bg-white dark:bg-[#646567] hover:bg-neutral-100",
                    key.colSpan ? `col-span-${key.colSpan}` : "",
                  )}
                  style={{ gridColumn: key.colSpan ? `span ${key.colSpan}` : "span 1" }}
                >
                  {isShiftActive && typeof key.label === "string" && /^[a-z]$/.test(key.label)
                    ? key.label.toUpperCase()
                    : key.label}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VirtualKeyboard

