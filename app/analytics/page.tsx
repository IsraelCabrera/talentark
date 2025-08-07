"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Users, Building2, MapPin, TrendingUp, AlertTriangle, RefreshCw, CheckCircle, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { fetchAnalyticsData, isSupabaseConfigured, testConnection } from "@/lib/supabase-client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface AnalyticsData {
  totalUsers: number
  totalDepartments: number
  totalLocations: number
  departmentDistribution: { name: string; count: number }[]
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean
    message: string
    details: string
  } | null>(null)
  const [retrying, setRetrying] = useState(false)

  const loadAnalytics = async () => {
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

      const data = await fetchAnalyticsData()
      setAnalytics(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load analytics"
      setError(errorMessage)
      console.error("Error loading analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = async () => {
    setRetrying(true)
    await loadAnalytics()
    setRetrying(false)
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  // Show configuration needed state
  if (!isSupabaseConfigured()) {
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
                  <p className="text-sm text-gray-300">Analytics Dashboard</p>
                </div>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/analytics" className="text-white hover:text-arkus-red transition-colors">
                  Analytics
                </Link>
                <Link href="/org-chart" className="text-gray-300 hover:text-white transition-colors">
                  Org Chart
                </Link>
                <Link href="/import" className="text-gray-300 hover:text-white transition-colors">
                  Import
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Configuration Required */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className="text-arkus-navy">Database Configuration Required</CardTitle>
              <CardDescription>Please configure your Supabase database connection to view analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Missing Environment Variables:</strong>
                  <br />• NEXT_PUBLIC_SUPABASE_URL
                  <br />• NEXT_PUBLIC_SUPABASE_ANON_KEY
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/config-supabase" className="flex-1">
                  <Button className="w-full bg-arkus-red text-white hover:bg-arkus-red-hover">
                    Configure Database
                  </Button>
                </Link>
                <Link href="/test-connection" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-arkus-navy text-arkus-navy hover:bg-arkus-navy hover:text-white bg-transparent"
                  >
                    Test Connection
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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
                <p className="text-sm text-gray-300">Analytics Dashboard</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/analytics" className="text-white hover:text-arkus-red transition-colors">
                Analytics
              </Link>
              <Link href="/org-chart" className="text-gray-300 hover:text-white transition-colors">
                Org Chart
              </Link>
              <Link href="/import" className="text-gray-300 hover:text-white transition-colors">
                Import
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Connection Status */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <h3 className="text-red-800 font-medium">Analytics Error</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/config-supabase">
                    <Button size="sm" className="bg-arkus-red text-white hover:bg-arkus-red-hover">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRetry}
                    disabled={retrying}
                    className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${retrying ? "animate-spin" : ""}`} />
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-arkus-red mx-auto mb-4" />
              <p className="text-gray-600">Loading analytics data...</p>
            </CardContent>
          </Card>
        )}

        {/* Analytics Content */}
        {!loading && !error && analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-arkus-red" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Employees</p>
                      <p className="text-2xl font-bold text-arkus-navy">{analytics.totalUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-arkus-red" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Roles</p>
                      <p className="text-2xl font-bold text-arkus-navy">{analytics.totalDepartments}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MapPin className="h-8 w-8 text-arkus-red" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Locations</p>
                      <p className="text-2xl font-bold text-arkus-navy">{analytics.totalLocations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-arkus-red" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                      <p className="text-2xl font-bold text-arkus-navy">+12%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Role Distribution Chart */}
            <Card className="mb-8 bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-arkus-navy">Employee Distribution by Role</CardTitle>
                <CardDescription>Overview of employees across different roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.departmentDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#DC2626" name="Employees" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Role Breakdown Table */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-arkus-navy">Detailed Role Breakdown</CardTitle>
                <CardDescription>Employee count and percentage by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Count</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.departmentDistribution.map((dept, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-arkus-navy">{dept.name}</td>
                          <td className="py-3 px-4 text-gray-600">{dept.count}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {((dept.count / analytics.totalUsers) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* No Data State */}
        {!loading && !error && analytics && analytics.totalUsers === 0 && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
              <p className="text-gray-600 mb-4">Import employee data to see analytics and insights.</p>
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
