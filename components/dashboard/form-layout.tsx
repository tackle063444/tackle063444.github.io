"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface FormLayoutProps {
  title: string
  description?: string
  backUrl: string
  children: ReactNode
}

export function FormLayout({
  title,
  description,
  backUrl,
  children,
}: FormLayoutProps) {
  const router = useRouter()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(backUrl)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-lg border shadow-sm bg-card/50 backdrop-blur-sm p-6">
        {children}
      </div>
    </div>
  )
}
