"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      themes={["light", "dark"]}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      attribute="class"
      value={{
        light: "light",
        dark: "dark",
      }}
    >
      {children}
    </NextThemesProvider>
  )
} 