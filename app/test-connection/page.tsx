"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Database,
  Settings,
  ArrowLeft,
  Wifi,
  Server,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { testConnection, isSupabaseConfigured } from "@/lib/supabase-client"

interface ConnectionTest {
  success: boolean
  message: string
  details: string
}

export default function TestConnectionPage() {
  const [connectionResult, setConnectionResult] = useState<ConnectionTest | null>(null)
  const [testing, setTesting] = useState(false)
  const [envStatus, setEnvStatus] = useState({
    url: false,
    key: false,
  })

  const checkEnvironmentVariables = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setEnvStatus({
      url: !!(url && url !== ""),
      key: !!(key && key !== ""),
    })
  }

  const runConnectionTest = async () => {
    setTesting(true)
    try {
      const result = await testConnection()
      setConnectionResult(result)
    } catch (error) {
      setConnectionResult({
        success: false,
        message: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setTesting(false)
    }
  }

  useEffect(() => {
    checkEnvironmentVariables()
    // Auto-run test if configured
    if (isSupabaseConfigured()) {
      runConnectionTest()
    }
  }, [])

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />
  }

  const getStatusText = (status: boolean) => {
    return status ? "Configured" : "Missing"
  }

  const getStatusColor = (status: boolean) => {
    return status ? "text-green-800" : "text-red-800"
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
                <p className="text-sm text-gray-300">Connection Test</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="border-arkus-navy text-arkus-navy hover:bg-arkus-navy hover:text-white bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Database className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-arkus-navy mb-2">Database Connection Test</h1>
          <p className="text-gray-600">Verify your Supabase database connection and troubleshoot issues</p>
        </div>

        {/* Environment Variables Status */}
        <Card className="mb-8 bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-arkus-navy flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Environment Variables
            </CardTitle>
            <CardDescription>Check if your Supabase credentials are properly configured</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Server className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">NEXT_PUBLIC_SUPABASE_URL</p>
                  <p className="text-sm text-gray-600">Your Supabase project URL</p>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusIcon(envStatus.url)}
                <span className={`ml-2 font-medium ${getStatusColor(envStatus.url)}`}>
                  {getStatusText(envStatus.url)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Wifi className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
                  <p className="text-sm text-gray-600">Your Supabase anonymous key</p>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusIcon(envStatus.key)}
                <span className={`ml-2 font-medium ${getStatusColor(envStatus.key)}`}>
                  {getStatusText(envStatus.key)}
                </span>
              </div>
            </div>

            {(!envStatus.url || !envStatus.key) && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Configuration Required:</strong> Please set up your environment variables before testing the
                  connection.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Connection Test */}
        <Card className="mb-8 bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-arkus-navy flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Database Connection Test
            </CardTitle>
            <CardDescription>Test the connection to your Supabase database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button
                onClick={runConnectionTest}
                disabled={testing || !envStatus.url || !envStatus.key}
                className="bg-arkus-red text-white hover:bg-arkus-red-hover disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
            </div>

            {connectionResult && (
              <Alert className={connectionResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {connectionResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={connectionResult.success ? "text-green-800" : "text-red-800"}>
                  <div className="font-medium mb-1">{connectionResult.message}</div>
                  <div className="text-sm">{connectionResult.details}</div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Troubleshooting Guide */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-arkus-navy">Troubleshooting Guide</CardTitle>
            <CardDescription>Common issues and solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">❌ Missing Environment Variables</h4>
              <p className="text-sm text-gray-600 mb-2">
                If your environment variables are missing, you need to configure them:
              </p>
              <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1 ml-4">
                <li>
                  Go to the{" "}
                  <Link href="/config-supabase" className="text-arkus-red hover:underline">
                    Configuration Page
                  </Link>
                </li>
                <li>Enter your Supabase URL and API key</li>
                <li>Copy the generated configuration to your .env.local file</li>
                <li>Restart your development server</li>
              </ol>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">❌ Connection Failed</h4>
              <p className="text-sm text-gray-600 mb-2">If the connection test fails, check the following:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-4">
                <li>Verify your Supabase URL is correct (should start with https://)</li>
                <li>Ensure your API key is the anon/public key, not the service role key</li>
                <li>Check if your Supabase project is active and not paused</li>
                <li>Verify your database tables exist (run the SQL scripts if needed)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">✅ Connection Successful</h4>
              <p className="text-sm text-gray-600">Great! Your database is properly configured. You can now:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-4">
                <li>
                  Return to the{" "}
                  <Link href="/" className="text-arkus-red hover:underline">
                    Dashboard
                  </Link>{" "}
                  to view employees
                </li>
                <li>
                  Import employee data using the{" "}
                  <Link href="/import" className="text-arkus-red hover:underline">
                    Import feature
                  </Link>
                </li>
                <li>View analytics and reports</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/config-supabase" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-arkus-navy text-arkus-navy hover:bg-arkus-navy hover:text-white bg-transparent"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure Database
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full bg-arkus-red text-white hover:bg-arkus-red-hover">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
