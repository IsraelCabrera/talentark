"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { signIn, getDemoUsers } from "@/lib/auth"
import { Eye, EyeOff, Loader2, User, Shield, Users, Briefcase } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const demoUsers = getDemoUsers()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signIn(email, password)
      console.log("Login successful:", result.profile)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setLoading(true)
    setError(null)

    try {
      const result = await signIn(demoEmail, demoPassword)
      console.log("Demo login successful:", result.profile)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Demo login error:", error)
      setError(error.message || "Demo login failed. Please try again.")
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
        return <Briefcase className="h-4 w-4" />
      case "collaborator":
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to TalentArk</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Access your talent management dashboard</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or try demo accounts</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                {demoUsers.map((user) => (
                  <Button
                    key={user.email}
                    variant="outline"
                    className="w-full justify-start h-auto p-3 bg-transparent"
                    onClick={() => handleDemoLogin(user.email, user.password)}
                    disabled={loading}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className={`p-1 rounded border ${getRoleColor(user.role)}`}>{getRoleIcon(user.role)}</div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                      <Badge variant="secondary" className={getRoleColor(user.role)}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Demo accounts use password: <code className="bg-gray-100 px-1 rounded">demo123</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
