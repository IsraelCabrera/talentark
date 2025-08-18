"use client"

import { useAuth } from "@/components/auth/auth-provider"
import ProtectedRoute from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { isDemoMode } from "@/lib/auth"
import {
  Shield,
  Users,
  Settings,
  Database,
  ArrowLeft,
  LogOut,
  Loader2,
  UserCheck,
  FileText,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

function AdminSettingsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setSigningOut(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
                <p className="text-sm text-gray-300">System administration panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user.name}</p>
                <Badge className="bg-purple-100 text-purple-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Super User
                </Badge>
              </div>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button
                onClick={handleSignOut}
                disabled={signingOut}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
              >
                {signingOut ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LogOut className="h-4 w-4 mr-2" />}
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isDemoMode() && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-blue-800">
              🎯 <strong>Demo Mode:</strong> You're viewing the admin panel in demo mode. All administrative features
              are simulated.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">System Administration</h2>
          <p className="text-gray-600">Manage users, configure system settings, and oversee TalentArk operations.</p>
        </div>

        {/* Admin Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  View All Users
                </Button>
              </Link>
              <Link href="/import">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Database className="h-4 w-4 mr-2" />
                  Import Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Analytics & Reports */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics & Reports
              </CardTitle>
              <CardDescription>View system analytics and generate reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/analytics">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/admin/activity-log">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Activity Log
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Profile Reviews */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Profile Reviews
              </CardTitle>
              <CardDescription>Review and approve profile changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/reviews">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Pending Reviews
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Review Settings
              </Button>
            </CardContent>
          </Card>

          {/* System Configuration */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>Configure system settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/test-connection">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Database className="h-4 w-4 mr-2" />
                  Test Database
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </CardContent>
          </Card>

          {/* Database Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Management
              </CardTitle>
              <CardDescription>Manage database operations and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/config-supabase">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Database className="h-4 w-4 mr-2" />
                  Configure Database
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Backup & Restore
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="hover:shadow-lg transition-shadow border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Quick Stats
              </CardTitle>
              <CardDescription>System overview and key metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">4</p>
                  <p className="text-xs text-blue-600">Demo Users</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">100%</p>
                  <p className="text-xs text-green-600">System Health</p>
                </div>
              </div>
              {isDemoMode() && (
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-purple-50 text-purple-700 border-purple-200"
                >
                  Demo Mode Active
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Authentication</p>
                  <p className="text-sm text-gray-600">{isDemoMode() ? "Demo Mode" : "Supabase Connected"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-gray-600">{isDemoMode() ? "Demo Data" : "Connected"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">User Roles</p>
                  <p className="text-sm text-gray-600">4 Roles Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AdminSettingsPageWithAuth() {
  return (
    <ProtectedRoute requiredRole="super_user">
      <AdminSettingsPage />
    </ProtectedRoute>
  )
}
