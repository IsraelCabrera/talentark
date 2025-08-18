"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { getDemoUsers } from "@/lib/auth"
import { CheckCircle, AlertCircle, Users, Database, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SetupDemoPage() {
  const [setupStatus, setSetupStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const demoUsers = getDemoUsers()

  const handleSetupDemo = async () => {
    try {
      setSetupStatus("success")
      setMessage("Demo environment is ready! All demo users are available for immediate login.")
    } catch (error: any) {
      setSetupStatus("error")
      setMessage(error.message || "Setup failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TalentArk Demo Setup</h1>
          <p className="mt-2 text-gray-600">Set up your demo environment with sample data and users</p>
        </div>

        {/* Status Alert */}
        {setupStatus !== "idle" && (
          <Alert
            className={`mb-6 ${setupStatus === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <div className="flex items-center">
              {setupStatus === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={`ml-2 ${setupStatus === "success" ? "text-green-800" : "text-red-800"}`}>
                {message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Demo Environment
              </CardTitle>
              <CardDescription>Ready-to-use demo environment with pre-configured users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Demo Ready!</span>
                </div>
                <p className="text-sm text-green-700">
                  No setup required. Demo users are pre-configured and ready to use immediately.
                </p>
              </div>

              <Button onClick={handleSetupDemo} className="w-full bg-red-600 hover:bg-red-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Demo Setup
              </Button>

              <Link href="/login">
                <Button variant="outline" className="w-full bg-transparent">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Demo Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Demo Users
              </CardTitle>
              <CardDescription>Pre-configured user accounts with different roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoUsers.map((user) => (
                  <div key={user.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center mb-1">
                        <Badge
                          className={
                            user.role === "super_user"
                              ? "bg-red-100 text-red-800"
                              : user.role === "hr"
                                ? "bg-blue-100 text-blue-800"
                                : user.role === "manager"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                          }
                        >
                          {user.role === "super_user"
                            ? "Super User"
                            : user.role === "hr"
                              ? "HR Manager"
                              : user.role === "manager"
                                ? "Team Manager"
                                : "Employee"}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Password:</p>
                      <code className="text-xs bg-white px-2 py-1 rounded border">{user.password}</code>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Click on any demo account box on the login page to auto-fill credentials and
                  login instantly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What's Included</CardTitle>
            <CardDescription>Features available in the demo environment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-medium mb-1">User Management</h3>
                <p className="text-xs text-gray-600">Role-based access control with 4 user types</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-1">Analytics</h3>
                <p className="text-xs text-gray-600">Performance metrics and reporting dashboard</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-1">Profile Management</h3>
                <p className="text-xs text-gray-600">Employee profiles with skills and scores</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ArrowRight className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-1">Import/Export</h3>
                <p className="text-xs text-gray-600">Excel import and data export capabilities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
