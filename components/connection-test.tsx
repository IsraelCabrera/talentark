"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Key, Globe, Play } from "lucide-react"
import { testConnection, getConfigurationStatus, createTables } from "@/lib/supabase"

interface ConnectionResult {
  success: boolean
  error?: string
  errorType?: string
  originalError?: string
  message?: string
  count?: any
}

export function ConnectionTest() {
  const [result, setResult] = useState<ConnectionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [creatingTables, setCreatingTables] = useState(false)
  const [configStatus, setConfigStatus] = useState<any>(null)

  // Get configuration status on component mount
  useEffect(() => {
    setConfigStatus(getConfigurationStatus())
  }, [])

  const handleTest = async () => {
    setLoading(true)
    setResult(null)

    try {
      const testResult = await testConnection()
      setResult(testResult)
    } catch (error: any) {
      setResult({
        success: false,
        error: `Unexpected error: ${error.message}`,
        errorType: "unexpected_error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTables = async () => {
    setCreatingTables(true)
    try {
      const createResult = await createTables()
      if (createResult.success) {
        setResult({
          success: true,
          message: "Tables created successfully! Testing connection again...",
        })
        // Test connection again after creating tables
        setTimeout(() => {
          handleTest()
        }, 1000)
      } else {
        setResult({
          success: false,
          error: createResult.error || "Failed to create tables",
          errorType: "table_creation_failed",
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: `Failed to create tables: ${error.message}`,
        errorType: "table_creation_error",
      })
    } finally {
      setCreatingTables(false)
    }
  }

  // Auto-test on component mount if configured
  useEffect(() => {
    if (configStatus?.isConfigured) {
      handleTest()
    }
  }, [configStatus])

  const getStatusIcon = (success: boolean) => {
    if (success) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    }
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  const getErrorTypeColor = (errorType: string) => {
    switch (errorType) {
      case "missing_url":
      case "missing_key":
        return "destructive"
      case "placeholder_url":
      case "placeholder_key":
        return "secondary"
      case "invalid_url":
      case "invalid_key":
        return "destructive"
      case "table_missing":
        return "default"
      default:
        return "destructive"
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configuration Status
          </CardTitle>
          <CardDescription>Current Supabase environment variables status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {configStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">Supabase URL</span>
                  <Badge variant={configStatus.hasUrl && configStatus.isValidUrl ? "default" : "destructive"}>
                    {configStatus.hasUrl && configStatus.isValidUrl ? "Valid" : "Invalid"}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 ml-6">{configStatus.urlValue}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <span className="text-sm font-medium">Anon Key</span>
                  <Badge variant={configStatus.hasKey && configStatus.isValidKey ? "default" : "destructive"}>
                    {configStatus.hasKey && configStatus.isValidKey ? "Valid" : "Invalid"}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 ml-6">{configStatus.keyValue}</p>
              </div>
            </div>
          )}

          {configStatus && !configStatus.isConfigured && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Supabase is not properly configured. Please check your environment variables in the v0 integrations
                panel or update your .env.local file.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Database Connection Test
          </CardTitle>
          <CardDescription>Test the connection to your Supabase database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={handleTest} disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Test Connection
                </>
              )}
            </Button>

            {result && result.errorType === "table_missing" && (
              <Button
                onClick={handleCreateTables}
                disabled={creatingTables}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
              >
                {creatingTables ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Tables...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Create Tables
                  </>
                )}
              </Button>
            )}
          </div>

          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-start gap-3">
                {getStatusIcon(result.success)}
                <div className="flex-1">
                  <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                    {result.success ? (
                      <div>
                        <strong>✅ Connection Successful!</strong>
                        <p className="mt-1">{result.message}</p>
                        {result.count !== undefined && <p className="text-sm mt-2">Database is ready to use.</p>}
                      </div>
                    ) : (
                      <div>
                        <strong>❌ Connection Failed</strong>
                        <p className="mt-1 whitespace-pre-line">{result.error}</p>
                        {result.errorType && (
                          <Badge variant={getErrorTypeColor(result.errorType)} className="mt-2">
                            {result.errorType.replace("_", " ")}
                          </Badge>
                        )}
                        {result.originalError && (
                          <details className="mt-2">
                            <summary className="text-sm cursor-pointer">Technical Details</summary>
                            <p className="text-xs mt-1 font-mono bg-gray-100 p-2 rounded">{result.originalError}</p>
                          </details>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <div className="space-y-2">
                <p className="text-green-800">🎉 Great! Your database connection is working.</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>
                    Go back to the{" "}
                    <a href="/" className="text-blue-600 hover:underline">
                      main dashboard
                    </a>{" "}
                    to see your data
                  </li>
                  <li>
                    Check the{" "}
                    <a href="/analytics" className="text-blue-600 hover:underline">
                      analytics page
                    </a>{" "}
                    for insights
                  </li>
                  <li>
                    View individual{" "}
                    <a href="/profile" className="text-blue-600 hover:underline">
                      user profiles
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-800">🔧 Here's how to fix the connection:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {result.errorType === "missing_url" || result.errorType === "missing_key" ? (
                    <li>Add the Supabase integration in your v0 project settings</li>
                  ) : result.errorType === "table_missing" ? (
                    <>
                      <li>Your connection works, but tables are missing</li>
                      <li>Click the "Create Tables" button above to automatically create them</li>
                      <li>Or run the SQL scripts manually in your Supabase dashboard</li>
                    </>
                  ) : (
                    <>
                      <li>Check your Supabase project URL and anon key</li>
                      <li>Verify your project exists and is active</li>
                      <li>Check your internet connection</li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
