"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, User, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { fetchAllUsers, isSupabaseConfigured, testConnection } from "@/lib/supabase-client"

interface DebugUser {
  id: string
  name: string
  email: string
  role: string
  position?: string
  reports_to?: string
  company_score?: number
  employee_score?: number
  status: string
  location?: string
}

export default function DebugUsersPage() {
  const [users, setUsers] = useState<DebugUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean
    message: string
    details: string
  } | null>(null)

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      // First test the connection
      const connTest = await testConnection()
      setConnectionStatus(connTest)

      if (!connTest.success) {
        setError(connTest.message)
        return
      }

      const data = await fetchAllUsers()
      console.log("Debug: Loaded users:", data)
      setUsers(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load users"
      setError(errorMessage)
      console.error("Error loading users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const findManagerName = (managerId: string) => {
    const manager = users.find(u => u.id === managerId)
    return manager ? manager.name : "Unknown Manager"
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-arkus-gray">
        <header className="bg-arkus-navy border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Image src="/images/arkus-logo.png" alt="Arkus Logo" width={40} height={40} className="mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-white">TalentArk</h1>
                  <p className="text-sm text-gray-300">Debug Users</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-arkus-navy">Database Configuration Required</CardTitle>
              <CardDescription>Please configure your Supabase database connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Missing environment variables for Supabase connection
                </AlertDescription>
              </Alert>
              <Link href="/config-supabase">
                <Button className="w-full bg-arkus-red text-white hover:bg-arkus-red-hover">
                  Configure Database
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-arkus-gray">
      <header className="bg-arkus-navy border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Image src="/images/arkus-logo.png" alt="Arkus Logo" width={40} height={40} className="mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">TalentArk</h1>
                <p className="text-sm text-gray-300">Debug Users</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {connectionStatus && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className={connectionStatus.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {connectionStatus.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={connectionStatus.success ? "text-green-800" : "text-red-800"}>
              <strong>{connectionStatus.message}</strong>
              {connectionStatus.details && <div className="text-sm mt-1">{connectionStatus.details}</div>}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-arkus-navy">Debug: All Users</h2>
            <p className="text-gray-600">View all users in the database with their relationships and scores</p>
          </div>
          <Button onClick={loadUsers} disabled={loading} className="bg-arkus-red text-white hover:bg-arkus-red-hover">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-arkus-red mx-auto mb-4" />
              <p className="text-gray-600">Loading users...</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id} className="bg-white border border-gray-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-arkus-navy">{user.name}</CardTitle>
                      <CardDescription>{user.position || user.role}</CardDescription>
                    </div>
                    <Badge variant="outline" className={user.status === "available" ? "border-green-500 text-green-700" : "border-blue-500 text-blue-700"}>
                      {user.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">ID:</span>
                      <span className="text-xs text-gray-500 ml-2 font-mono">{user.id}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="text-gray-600 ml-2">{user.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Role:</span>
                      <span className="text-gray-600 ml-2">{user.role}</span>
                    </div>
                    {user.location && (
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <span className="text-gray-600 ml-2">{user.location}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">Reports To:</span>
                      <span className="text-gray-600 ml-2">
                        {user.reports_to ? findManagerName(user.reports_to) : "None"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Company Score:</span>
                      <span className="text-gray-600 ml-2">{user.company_score || "Not set"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Employee Score:</span>
                      <span className="text-gray-600 ml-2">{user.employee_score || "Not set"}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <Link href={`/profile/${user.id}`}>
                      <Button size="sm" className="w-full bg-arkus-red text-white hover:bg-arkus-red-hover">
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 mb-4">Your database appears to be empty. You may need to run the seed data script.</p>
              <Link href="/import">
                <Button className="bg-arkus-red text-white hover:bg-arkus-red-hover">
                  Import Users
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
