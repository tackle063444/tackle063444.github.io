"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarItemProps {
  href: string
  icon: React.ElementType
  title: string
}

export function SidebarItem({ href, icon: Icon, title }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-slate-100 dark:hover:bg-slate-800",
        isActive && "bg-primary/10 text-primary hover:text-primary dark:bg-primary/20 dark:text-primary"
      )}
    >
      <Icon className="h-4 w-4" />
      {title}
    </Link>
  )
}
