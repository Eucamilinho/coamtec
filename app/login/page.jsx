"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white">
            COAM<span className="text-green-400">TEC</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Panel de administración</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
          />
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <button
            onClick={handleLogin}
            disabled={cargando}
            className="bg-green-400 text-black font-black py-3 rounded-lg hover:bg-green-300 transition disabled:opacity-50"
          >
            {cargando ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  )
}