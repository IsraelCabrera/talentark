"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, signOut as authSignOut, getCurrentUser, type User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password)
      if (result.success && result.user) {
        setUser(result.user)
        router.push("/directory")
        return { success: true }
      } else {
        return { success: false, error: result.error || "Login failed" }
      }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const handleSignOut = async () => {
    try {
      await authSignOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
