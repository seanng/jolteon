"use client"

import React from "react"
import { cn } from "@repo/design-system/lib/utils"
import { Button } from "@repo/design-system/components/ui/button"

interface EmailCaptureFormProps {
  className?: string
  onSubmit?: (email: string) => void
  placeholder?: string
  buttonText?: string
}

export function EmailCaptureForm({ 
  className, 
  onSubmit,
  placeholder = "Enter your email",
  buttonText = "Try it out!"
}: EmailCaptureFormProps) {
  const [email, setEmail] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && onSubmit) {
      onSubmit(email)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("max-w-[600px] mx-auto", className)}>
      <div className={cn(
        "flex gap-0 items-stretch bg-background border-[3px] border-secondary transition-all duration-300",
        isFocused && "transform -translate-y-[3px] shadow-2xl border-primary"
      )}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required
          className={cn(
            "flex-1 px-8 py-5 border-none bg-transparent text-lg font-body",
            "text-secondary outline-none",
            "placeholder:text-secondary placeholder:opacity-50",
            "placeholder:uppercase placeholder:tracking-[1px]"
          )}
        />
        <Button
          type="submit"
          variant="electric"
          size="xl"
          className="rounded-none h-auto py-5 hover:-translate-0"
        >
          <span>{buttonText}</span>
        </Button>
      </div>
    </form>
  )
}
