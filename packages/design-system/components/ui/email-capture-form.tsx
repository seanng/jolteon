"use client"

import React from "react"
import { cn } from "@repo/design-system/lib/utils"
import { Button } from "@repo/design-system/components/ui/button"
import { Loader2, Check, AlertTriangle } from "lucide-react"

interface EmailCaptureFormProps {
  className?: string
  onSubmit: (email: string) => Promise<{ error?: string; success?: boolean; }>
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
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Email is required.")
      return
    }
    
    setLoading(true)
    setError(null)
    
    const result = await onSubmit(email)
    
    setLoading(false)
    
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="h-12 w-12 text-green-500 animate-in zoom-in-50" />
          </div>
        </div>
        <h3 className="text-2xl font-bold">Success!</h3>
        <p className="text-muted-foreground">You've been added to the waitlist.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn("max-w-[600px] mx-auto", className)}>
      <div className={cn(
        "flex gap-0 items-stretch bg-background border-[3px] border-secondary transition-all duration-300",
        isFocused && !error && "transform -translate-y-[3px] shadow-2xl border-primary",
        error && "border-red-500"
      )}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required
          disabled={loading}
          className={cn(
            "flex-1 px-8 py-5 border-none bg-transparent text-lg font-body",
            "text-secondary outline-none",
            "placeholder:text-secondary placeholder:opacity-50",
            "placeholder:uppercase placeholder:tracking-[1px]",
            "disabled:opacity-50"
          )}
        />
        <Button
          type="submit"
          variant="electric"
          size="xl"
          className="rounded-none h-auto py-5 hover:-translate-0"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <span>{buttonText}</span>
          )}
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-red-500 text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </p>
      )}
    </form>
  )
}
