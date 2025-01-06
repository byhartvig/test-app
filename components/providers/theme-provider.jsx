"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          let isDark = window.matchMedia('(prefers-color-scheme: dark)')
          let theme = localStorage.getItem('theme')
          if (theme === 'dark' || (!theme && isDark.matches)) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        `,
      }}
    />
  );
}

export function ThemeProvider({ children, ...props }) {
  return (
    <>
      <ThemeScript />
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </>
  );
}
