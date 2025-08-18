"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, LogIn, Shield, Users, UserCheck, User } from "lucide-react"
import { signIn, getCurrentUser, getDemoUsers } from "@/lib/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()

  const demoUsers = getDemoUsers()

  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          router.push("/directory")
          return
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setCheckingAuth(false)
      }
    }

    checkExistingAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn(email, password)
      if (result.success && result.user) {
        router.push("/directory")
      } else {
        setError(result.error || "Login failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (userEmail: string) => {
    setLoading(true)
    setError("")

    try {
      const result = await signIn(userEmail, "demo")
      if (result.success && result.user) {
        router.push("/directory")
      } else {
        setError(result.error || "Demo login failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_user":
        return <Shield className="h-4 w-4" />
      case "hr":
        return <Users className="h-4 w-4" />
      case "manager":
        return <UserCheck className="h-4 w-4" />
      case "collaborator":
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_user":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "hr":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "manager":
        return "bg-green-100 text-green-800 border-green-200"
      case "collaborator":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      super_user: "Super User",
      hr: "HR Manager",
      manager: "Team Manager",
      collaborator: "Employee",
    }
    return roleMap[role] || role
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome to TalentArk</h2>
          <p className="mt-2 text-gray-600">Sign in to access your employee directory</p>
        </div>

        {/* Demo Accounts */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Demo Accounts</CardTitle>
            <CardDescription>Click any account below for instant access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoUsers.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="w-full justify-start h-auto p-4 border-gray-200 hover:border-red-600 hover:bg-red-50 bg-transparent"
                onClick={() => handleDemoLogin(user.email)}
                disabled={loading}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="flex-shrink-0">{getRoleIcon(user.role)}</div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-slate-900">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                  <Badge className={`${getRoleBadgeColor(user.role)} text-xs`} variant="outline">
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Manual Login Form */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Manual Login</CardTitle>
            <CardDescription>Or sign in with your credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 border-gray-300 focus:border-red-600 focus:ring-red-600"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-300 focus:border-red-600 focus:ring-red-600 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>This is a demo application showcasing TalentArk's capabilities.</p>
          <p className="mt-1">Use the demo accounts above for instant access.</p>
        </div>
      </div>
    </div>
  )
}
