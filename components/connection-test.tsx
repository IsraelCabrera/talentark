"use client"

import { useState, useEffect } from "react"
import { testConnection, getConfigurationStatus, getDemoData } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, AlertTriangle, ExternalLink, Copy, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean
    error?: string
    errorType?: string
    originalError?: string
    count?: number
    message?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [configStatus, setConfigStatus] = useState<any>(null)
  const [showDemoMode, setShowDemoMode] = useState(false)
  const [showEnvDetails, setShowEnvDetails] = useState(false)

  const handleTestConnection = async () => {
    setIsLoading(true)
    setShowDemoMode(false)
    const result = await testConnection()
    const config = getConfigurationStatus()
    setConnectionStatus(result)
    setConfigStatus(config)
    setIsLoading(false)
  }

  const handleDemoMode = () => {
    const demoData = getDemoData()
    setConnectionStatus({
      success: true,
      message: demoData.message,
      count: demoData.users.length,
    })
    setShowDemoMode(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  useEffect(() => {
    // Test connection on component mount
    handleTestConnection()
  }, [])

  const getErrorSolution = (errorType?: string) => {
    switch (errorType) {
      case "missing_url":
      case "missing_key":
        return "Add the missing environment variables to your .env.local file"
      case "placeholder_url":
      case "placeholder_key":
        return "Replace placeholder values with your actual Supabase credentials"
      case "invalid_url":
        return "Use the correct Supabase URL format: https://your-project-id.supabase.co"
      case "invalid_key":
        return "Use your actual Supabase anon key (it should be a long JWT token)"
      case "network_error":
      case "fetch_error":
        return "Check your Supabase project URL and ensure your project exists and is active"
      case "auth_error":
        return "Verify your Supabase anon key is correct"
      case "table_missing":
        return "Run the SQL scripts to create the database tables"
      case "timeout_error":
        return "Check your internet connection and Supabase project status"
      default:
        return "Follow the setup instructions below"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Supabase Connection Test
            {connectionStatus?.success && <CheckCircle className="h-5 w-5 text-green-500" />}
            {connectionStatus?.success === false && <XCircle className="h-5 w-5 text-red-500" />}
          </CardTitle>
          <CardDescription>Verify your Supabase database connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Testing connection...
            </div>
          )}

          {connectionStatus && !isLoading && (
            <div className="space-y-4">
              {connectionStatus.success ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    ✅ {connectionStatus.message || "Connection successful!"}
                    {showDemoMode && (
                      <div className="mt-2 text-sm">
                        <strong>Demo Mode:</strong> This is sample data. Configure Supabase to see real data.
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Connection failed:</strong>
                    <div className="mt-2 whitespace-pre-line">{connectionStatus.error}</div>
                    {connectionStatus.errorType && (
                      <div className="mt-3 p-2 bg-red-100 rounded text-sm">
                        <strong>Solution:</strong> {getErrorSolution(connectionStatus.errorType)}
                      </div>
                    )}
                    {connectionStatus.originalError && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm font-medium">Technical Details</summary>
                        <div className="mt-1 text-xs font-mono bg-red-100 p-2 rounded">
                          {connectionStatus.originalError}
                        </div>
                      </details>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {configStatus && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-arkus-navy">Configuration Status:</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEnvDetails(!showEnvDetails)}
                  className="text-xs"
                >
                  {showEnvDetails ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {showEnvDetails ? "Hide" : "Show"} Details
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>Supabase URL:</span>
                  <div className="flex items-center gap-2">
                    {configStatus.isValidUrl ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-600">
                      {configStatus.urlPlaceholder ? "Using placeholder" : configStatus.urlValue}
                    </span>
                    {showEnvDetails && configStatus.hasUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(configStatus.urlValue)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>Anon Key:</span>
                  <div className="flex items-center gap-2">
                    {configStatus.isValidKey ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-600">
                      {configStatus.keyPlaceholder ? "Using placeholder" : configStatus.keyValue}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleTestConnection} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Connection Again"
              )}
            </Button>
            <Button
              onClick={handleDemoMode}
              variant="outline"
              className="border-arkus-red text-arkus-red hover:bg-arkus-red hover:text-white bg-transparent"
            >
              Try Demo Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-arkus-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <div>
                <p className="font-medium">Create a Supabase account</p>
                <p className="text-gray-600">
                  Go to{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-arkus-red hover:underline inline-flex items-center gap-1"
                  >
                    supabase.com <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  and create a new account
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-arkus-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <div>
                <p className="font-medium">Create a new project</p>
                <p className="text-gray-600">Click "New Project" and follow the setup wizard</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-arkus-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              <div>
                <p className="font-medium">Get your API credentials</p>
                <p className="text-gray-600">Go to Settings → API in your project dashboard</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-arkus-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </span>
              <div>
                <p className="font-medium">Update your .env.local file</p>
                <p className="text-gray-600">Replace the placeholder values with your actual credentials:</p>
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                  <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co</div>
                  <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...</div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-arkus-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                5
              </span>
              <div>
                <p className="font-medium">Run the SQL scripts</p>
                <p className="text-gray-600">
                  Execute the SQL in <code className="bg-gray-100 px-1 rounded">supabase-tables.sql</code> and{" "}
                  <code className="bg-gray-100 px-1 rounded">supabase-seed-data.sql</code> in your Supabase SQL editor
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-arkus-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                6
              </span>
              <div>
                <p className="font-medium">Restart your development server</p>
                <p className="text-gray-600">
                  Stop your dev server (Ctrl+C) and run <code className="bg-gray-100 px-1 rounded">npm run dev</code>{" "}
                  again
                </p>
              </div>
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Need help?</strong> Check the{" "}
              <a
                href="https://supabase.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Supabase documentation <ExternalLink className="h-3 w-3" />
              </a>{" "}
              or try the Demo Mode button above to see how the app works with sample data.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
