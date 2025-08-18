"use client"

import { useEffect } from "react"

import { useRouter } from "next/navigation"
import LoginForm from "@/components/auth/login-form"
import { getCurrentUser } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()

  // Check if user is already logged in
  const checkAuth = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        router.push("/dashboard")
      }
    } catch (error) {
      // User not logged in, stay on login page
    }
  }

  useEffect(() => {
    checkAuth()
  }, [router])

  return <LoginForm />
}
