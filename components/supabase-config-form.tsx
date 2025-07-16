"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react"

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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-arkus-navy">Supabase Configuration</CardTitle>
          <CardDescription>Enter your Supabase project credentials to generate the configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project URL Input */}
          <div className="space-y-2">
            <Label htmlFor="project-url" className="text-sm font-medium text-arkus-navy">
              Project URL
            </Label>
            <div className="relative">
              <Input
                id="project-url"
                type="url"
                placeholder="https://your-project-id.supabase.co"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className={`border-gray-300 focus:border-arkus-red focus:ring-arkus-red ${
                  projectUrl && !validateUrl(projectUrl) ? "border-red-300 bg-red-50" : ""
                }`}
              />
              {projectUrl && validateUrl(projectUrl) && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
              {projectUrl && !validateUrl(projectUrl) && (
                <AlertTriangle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-gray-600">Find this in your Supabase dashboard: Settings → API → Project URL</p>
            {projectUrl && !validateUrl(projectUrl) && (
              <p className="text-xs text-red-600">
                Please enter a valid Supabase URL (should start with https:// and contain supabase.co)
              </p>
            )}
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-sm font-medium text-arkus-navy">
              Anon/Public API Key
            </Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={`pr-20 border-gray-300 focus:border-arkus-red focus:ring-arkus-red ${
                  apiKey && !validateApiKey(apiKey) ? "border-red-300 bg-red-50" : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {apiKey && validateApiKey(apiKey) && <CheckCircle className="h-4 w-4 text-green-500" />}
                {apiKey && !validateApiKey(apiKey) && <AlertTriangle className="h-4 w-4 text-red-500" />}
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Find this in your Supabase dashboard: Settings → API → anon public key
            </p>
            {apiKey && !validateApiKey(apiKey) && (
              <p className="text-xs text-red-600">
                Please enter a valid API key (should start with "eyJ" and be very long)
              </p>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateConfig}
            disabled={!isFormValid}
            className="w-full bg-arkus-red text-white hover:bg-arkus-red-hover disabled:bg-gray-300"
          >
            Generate Configuration
          </Button>

          {/* Generated Configuration */}
          {configGenerated && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Configuration generated successfully!</strong> Copy the content below and replace everything
                  in your <code className="bg-green-100 px-1 rounded">.env.local</code> file.
                </AlertDescription>
              </Alert>

              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">
                  {generatedConfig}
                </pre>
                <Button
                  onClick={() => copyToClipboard(generatedConfig)}
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Next steps:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                    <li>Copy the configuration above</li>
                    <li>
                      Open your <code className="bg-blue-100 px-1 rounded">.env.local</code> file
                    </li>
                    <li>Replace all content with the copied configuration</li>
                    <li>Save the file</li>
                    <li>Restart your development server (Ctrl+C, then npm run dev)</li>
                    <li>
                      Go to <code className="bg-blue-100 px-1 rounded">/test-connection</code> to verify
                    </li>
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
          <CardTitle className="text-arkus-navy">How to Find Your Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-arkus-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <div>
                <p className="font-medium">Go to your Supabase project dashboard</p>
                <p className="text-gray-600">Visit supabase.com and sign in to your account</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-arkus-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <div>
                <p className="font-medium">Navigate to Settings → API</p>
                <p className="text-gray-600">In the left sidebar, click Settings, then click API</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-arkus-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              <div>
                <p className="font-medium">Copy your credentials</p>
                <p className="text-gray-600">
                  Copy the <strong>Project URL</strong> and the <strong>anon public</strong> key
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-arkus-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </span>
              <div>
                <p className="font-medium">Paste them in the form above</p>
                <p className="text-gray-600">Enter both values and click "Generate Configuration"</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
