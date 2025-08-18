"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, AlertTriangle, RefreshCw, ArrowLeft, ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { fetchAllUsers, isSupabaseConfigured } from "@/lib/supabase-client"

interface User {
  id: string
  name: string
  email: string
  position: string
  avatar_url?: string
  departments?: { name: string }
  locations?: { name: string; city: string; country: string }
}

export default function OrgChartPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set())

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!isSupabaseConfigured()) {
        setError("Supabase not configured. Please set your environment variables.")
        return
      }

      const data = await fetchAllUsers()
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const toggleDepartment = (deptName: string) => {
    const newExpanded = new Set(expandedDepts)
    if (newExpanded.has(deptName)) {
      newExpanded.delete(deptName)
    } else {
      newExpanded.add(deptName)
    }
    setExpandedDepts(newExpanded)
  }

  // Group users by department
  const usersByDepartment = users.reduce(
    (acc, user) => {
      const deptName = user.departments?.name || "Unassigned"
      if (!acc[deptName]) {
        acc[deptName] = []
      }
      acc[deptName].push(user)
      return acc
    },
    {} as Record<string, User[]>,
  )

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
                  <p className="text-sm text-gray-300">Organization Chart</p>
                </div>
              </div>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-arkus-navy bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Configuration Required:</strong> Please configure your Supabase database connection to view the
              organization chart.
              <div className="mt-2">
                <Link href="/config-supabase">
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    Configure Database
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-arkus-gray">
      {/* Header */}
      <header className="bg-arkus-navy border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Image src="/images/arkus-logo.png" alt="Arkus Logo" width={40} height={40} className="mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">TalentArk</h1>
                <p className="text-sm text-gray-300">Organization Chart</p>
              </div>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-arkus-navy bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-arkus-navy mb-2">Organization Chart</h2>
          <p className="text-gray-600">Visual representation of your team structure</p>
        </div>

        {/* Error State */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error:</strong> {error}
              <div className="mt-2">
                <Button onClick={loadUsers} size="sm" className="bg-arkus-red text-white hover:bg-arkus-red-hover">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-arkus-red mx-auto mb-4" />
              <p className="text-gray-600">Loading organization chart...</p>
            </CardContent>
          </Card>
        )}

        {/* Organization Chart */}
        {!loading && !error && (
          <div className="space-y-6">
            {Object.entries(usersByDepartment).map(([deptName, deptUsers]) => (
              <Card key={deptName} className="bg-white border border-gray-200">
                <CardHeader>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleDepartment(deptName)}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="h-6 w-6 text-arkus-red" />
                      <div>
                        <CardTitle className="text-arkus-navy">{deptName}</CardTitle>
                        <CardDescription>{deptUsers.length} employees</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {expandedDepts.has(deptName) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>

                {expandedDepts.has(deptName) && (
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {deptUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback className="bg-arkus-red text-white text-sm">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-arkus-navy truncate">{user.name}</p>
                            <p className="text-xs text-gray-600 truncate">{user.position}</p>
                            {user.locations && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {user.locations.city}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && users.length === 0 && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-600 mb-4">Add employees to see the organization chart.</p>
              <Link href="/import">
                <Button className="bg-arkus-red text-white hover:bg-arkus-red-hover">Import Employees</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
