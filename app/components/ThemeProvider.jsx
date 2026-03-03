"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({})

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children }) {
  // Siempre iniciar con 'dark' para evitar mismatch de hidratación
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark"
    setTheme(saved)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nuevo = theme === "dark" ? "light" : "dark"
    setTheme(nuevo)
    localStorage.setItem("theme", nuevo)
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(nuevo)
    document.documentElement.style.colorScheme = nuevo
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}