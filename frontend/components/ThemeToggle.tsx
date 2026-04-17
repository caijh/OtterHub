"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  // resolvedTheme 在 SSR 时为 undefined，作为 hydration 保护信号
  if (!resolvedTheme) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-foreground/60 hover:text-foreground hover:bg-secondary/50"
      />
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="h-9 w-9 text-foreground/60 hover:text-foreground hover:bg-secondary/50"
            suppressHydrationWarning
          >
            {resolvedTheme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{resolvedTheme === "dark" ? "切换到浅色模式" : "切换到深色模式"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

