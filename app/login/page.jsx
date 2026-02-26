"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"
import { Lock, Mail, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return
    setCargando(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError("Email o contraseña incorrectos")
      setCargando(false)
    } else {
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-4 pt-20">
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 w-full max-w-md flex flex-col gap-6">

        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
            COAM<span className="text-green-400">TEC</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Panel de administración</p>
        </div>

        {/* Formulario */}
        <div className="flex flex-col gap-3">

          {/* Email */}
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type={mostrarPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg pl-10 pr-12 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition"
            />
            <button
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            >
              {mostrarPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          {/* Botón */}
          <button
            onClick={handleLogin}
            disabled={cargando}
            className="bg-green-400 text-black font-black py-3 rounded-lg hover:bg-green-300 transition disabled:opacity-50 mt-2"
          >
            {cargando ? "Entrando..." : "Entrar"}
          </button>
        </div>

        {/* Link volver */}
        <Link
          href="/"
          className="text-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-sm transition"
        >
          ← Volver a la tienda
        </Link>
      </div>
    </div>
  )
}