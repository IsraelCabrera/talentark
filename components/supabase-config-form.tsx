"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Eye, EyeOff, CheckCircle, AlertTriangle, Database } from "lucide-react"

export function SupabaseConfigForm() {
  const [projectUrl, setProjectUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [configGenerated, setConfigGenerated] = useState(false)
  const [generatedConfig, setGeneratedConfig] = useState("")

  const validateUrl = (url: string) => {
    if (!url) return false
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === "https:" && urlObj.hostname.includes("supabase.co")
    } catch {
      return false
    }
  }

  const validateApiKey = (key: string) => {
    return key && key.length > 100 && key.startsWith("eyJ")
  }

  const generateConfig = () => {
    const config = `# Supabase Configuration - Updated ${new Date().toLocaleString()}
# Copy this content and replace everything in your .env.local file

# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=${projectUrl}

# Your Supabase anon/public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=${apiKey}

# IMPORTANT: After updating .env.local, restart your development server!
# Stop the server (Ctrl+C) and run: npm run dev`

    setGeneratedConfig(config)
    setConfigGenerated(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const isFormValid = validateUrl(projectUrl) && validateApiKey(apiKey)

  return (
    <div className="space-y-6">
      {/* Main Configuration Card */}
      <Card className="w-full max-w-2xl mx-auto border-2 border-arkus-red/20">
        <CardHeader className="bg-gradient-to-r from-arkus-navy to-arkus-red text-white">
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6" />
            <div>
              <CardTitle className="text-xl">Enter Your Supabase Credentials</CardTitle>
              <CardDescription className="text-gray-200">
                Paste your Supabase URL and API key in the boxes below
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Project URL Input */}
          <div className="space-y-3">
            <Label htmlFor="project-url" className="text-base font-semibold text-arkus-navy flex items-center gap-2">
              <span className="bg-arkus-red text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                1
              </span>
              Supabase Project URL
            </Label>
            <div className="relative">
              <Input
                id="project-url"
                type="url"
                placeholder="https://your-project-id.supabase.co"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className={`h-12 text-base border-2 focus:border-arkus-red focus:ring-arkus-red ${
                  projectUrl && !validateUrl(projectUrl) ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              {projectUrl && validateUrl(projectUrl) && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              )}
              {projectUrl && !validateUrl(projectUrl) && (
                <AlertTriangle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Where to find this:</strong> Supabase Dashboard → Settings → API → Project URL
              </p>
            </div>
            {projectUrl && !validateUrl(projectUrl) && (
              <p className="text-sm text-red-600 font-medium">
                ⚠️ Please enter a valid Supabase URL (should start with https:// and contain supabase.co)
              </p>
            )}
          </div>

          {/* API Key Input */}
          <div className="space-y-3">
            <Label htmlFor="api-key" className="text-base font-semibold text-arkus-navy flex items-center gap-2">
              <span className="bg-arkus-red text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                2
              </span>
              Supabase Anon/Public API Key
            </Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={`h-12 text-base pr-20 border-2 focus:border-arkus-red focus:ring-arkus-red ${
                  apiKey && !validateApiKey(apiKey) ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {apiKey && validateApiKey(apiKey) && <CheckCircle className="h-5 w-5 text-green-500" />}
                {apiKey && !validateApiKey(apiKey) && <AlertTriangle className="h-5 w-5 text-red-500" />}
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Where to find this:</strong> Supabase Dashboard → Settings → API → anon public key
              </p>
            </div>
            {apiKey && !validateApiKey(apiKey) && (
              <p className="text-sm text-red-600 font-medium">
                ⚠️ Please enter a valid API key (should start with "eyJ" and be very long)
              </p>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateConfig}
            disabled={!isFormValid}
            className="w-full h-12 text-base bg-arkus-red text-white hover:bg-arkus-red-hover disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isFormValid ? "✅ Generate Configuration" : "Enter Both Values Above"}
          </Button>

          {/* Generated Configuration */}
          {configGenerated && (
            <div className="space-y-4 border-t pt-6">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>🎉 Configuration generated successfully!</strong> Copy the content below and replace
                  everything in your <code className="bg-green-100 px-2 py-1 rounded font-mono">.env.local</code> file.
                </AlertDescription>
              </Alert>

              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                  {generatedConfig}
                </pre>
                <Button
                  onClick={() => copyToClipboard(generatedConfig)}
                  size="sm"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-900"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy All
                </Button>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>📋 Next steps:</strong>
                  <ol className="list-decimal list-inside mt-3 space-y-2 text-sm">
                    <li className="font-medium">Copy the configuration above (click the Copy button)</li>
                    <li>
                      Open your <code className="bg-blue-100 px-1 rounded font-mono">.env.local</code> file in your
                      project
                    </li>
                    <li className="font-medium">Replace ALL content with the copied configuration</li>
                    <li>Save the file</li>
                    <li className="font-medium">Restart your development server (Ctrl+C, then npm run dev)</li>
                    <li>Go back to the dashboard to see your data!</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-arkus-navy">📖 How to Find Your Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 bg-arkus-red text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <div>
                <p className="font-semibold text-arkus-navy">Go to your Supabase project dashboard</p>
                <p className="text-gray-600 mt-1">
                  Visit <strong>supabase.com</strong> and sign in to your account
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 bg-arkus-red text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <div>
                <p className="font-semibold text-arkus-navy">Navigate to Settings → API</p>
                <p className="text-gray-600 mt-1">
                  In the left sidebar, click <strong>Settings</strong>, then click <strong>API</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 bg-arkus-red text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <div>
                <p className="font-semibold text-arkus-navy">Copy your credentials</p>
                <p className="text-gray-600 mt-1">
                  Copy the <strong>Project URL</strong> and the <strong>anon public</strong> key (NOT the service_role
                  key)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 bg-arkus-red text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <div>
                <p className="font-semibold text-arkus-navy">Paste them in the form above</p>
                <p className="text-gray-600 mt-1">
                  Enter both values and click <strong>"Generate Configuration"</strong>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
