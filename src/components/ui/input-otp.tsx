"use client"

import * as React from "react"
import { Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const INPUT_OTP_ROOT_CN = "flex items-center gap-2 has-[:disabled]:opacity-50"
const INPUT_OTP_GROUP_CN = "flex items-center"
const INPUT_OTP_SLOT_CN = "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md"
const INPUT_OTP_SEPARATOR_CN = "flex w-4 items-center justify-center"

type InputOTPProps = {
  maxLength: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

const InputOTPContext = React.createContext<{
  slots: Array<{ char: string; hasFakeCaret: boolean; isActive: boolean }>
  onSlotClick: (index: number) => void
} | null>(null)

function useInputOTP() {
  const context = React.useContext(InputOTPContext)
  if (!context) {
    throw new Error("useInputOTP must be used within an InputOTP")
  }
  return context
}

const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  ({ maxLength, value = "", onChange, onComplete, disabled, className, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value)
    const [focusedIndex, setFocusedIndex] = React.useState(0)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current!, [])

    const actualValue = value ?? internalValue

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value)
      }
    }, [value])

    React.useEffect(() => {
      if (actualValue.length === maxLength) {
        onComplete?.(actualValue)
      }
    }, [actualValue, maxLength, onComplete])

    const slots = Array.from({ length: maxLength }, (_, index) => {
      const char = actualValue[index] || ""
      const isActive = index === focusedIndex
      const hasFakeCaret = isActive && !char

      return { char, isActive, hasFakeCaret }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.slice(0, maxLength)
      setInternalValue(newValue)
      onChange?.(newValue)
      setFocusedIndex(Math.min(newValue.length, maxLength - 1))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && actualValue.length > 0) {
        const newValue = actualValue.slice(0, -1)
        setInternalValue(newValue)
        onChange?.(newValue)
        setFocusedIndex(Math.max(0, newValue.length))
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        setFocusedIndex(Math.max(0, focusedIndex - 1))
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setFocusedIndex(Math.min(maxLength - 1, focusedIndex + 1))
      }
    }

    const onSlotClick = (index: number) => {
      setFocusedIndex(index)
      inputRef.current?.focus()
    }

    return (
      <InputOTPContext.Provider value={{ slots, onSlotClick }}>
        <div className={cn(INPUT_OTP_ROOT_CN, className)}>
          <input
            ref={inputRef}
            value={actualValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputRef.current?.focus()}
            maxLength={maxLength}
            disabled={disabled}
            className="sr-only"
            autoComplete="one-time-code"
            {...props}
          />
          {children}
        </div>
      </InputOTPContext.Provider>
    )
  }
)
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(INPUT_OTP_GROUP_CN, className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { index: number }
>(({ index, className, ...props }, ref) => {
  const { slots, onSlotClick } = useInputOTP()
  const slot = slots[index]

  return (
    <div
      ref={ref}
      onClick={() => onSlotClick(index)}
      className={cn(
        INPUT_OTP_SLOT_CN,
        slot.isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {slot.char}
      {slot.hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} role="separator" className={cn(INPUT_OTP_SEPARATOR_CN, className)} {...props}>
    <Minus />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }