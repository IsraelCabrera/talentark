"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  Copy,
  Database,
  Settings,
  ArrowLeft,
  AlertTriangle,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ConfigSupabasePage() {
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [configGenerated, setConfigGenerated] = useState(false)
  const [copied, setCopied] = useState(false)

  const isValidUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === "https:" && url.includes("supabase")
    } catch {
      return false
    }
  }

  const isValidKey = (key: string) => {
    return key.length > 50 && key.startsWith("eyJ")
  }

  const generateConfig = () => {
    if (isValidUrl(supabaseUrl) && isValidKey(supabaseKey)) {
      setConfigGenerated(true)
    }
  }

  const copyToClipboard = async () => {
    const config = `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}`

    try {
      await navigator.clipboard.writeText(config)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
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
                <p className="text-sm text-gray-300">Database Configuration</p>
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
            <Settings className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-arkus-navy mb-2">Configure Supabase Database</h1>
          <p className="text-gray-600">Set up your database connection to get started with TalentArk</p>
        </div>

        {/* Configuration Form */}
        <Card className="mb-8 bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-arkus-navy flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Database Credentials
            </CardTitle>
            <CardDescription>
              Enter your Supabase project credentials. You can find these in your Supabase dashboard under Settings →
              API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Supabase URL */}
            <div className="space-y-2">
              <Label htmlFor="supabase-url" className="text-sm font-medium text-gray-700">
                Supabase URL
              </Label>
              <Input
                id="supabase-url"
                type="url"
                placeholder="https://your-project.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className={`h-12 text-base ${
                  supabaseUrl && !isValidUrl(supabaseUrl)
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : supabaseUrl && isValidUrl(supabaseUrl)
                      ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                      : "border-gray-300 focus:border-arkus-red focus:ring-arkus-red"
                }`}
              />
              {supabaseUrl && !isValidUrl(supabaseUrl) && (
                <p className="text-sm text-red-600">
                  Please enter a valid Supabase URL (https://your-project.supabase.co)
                </p>
              )}
              {supabaseUrl && isValidUrl(supabaseUrl) && (
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Valid Supabase URL
                </p>
              )}
            </div>

            {/* Supabase Anon Key */}
            <div className="space-y-2">
              <Label htmlFor="supabase-key" className="text-sm font-medium text-gray-700">
                Supabase Anon Key
              </Label>
              <div className="relative">
                <Input
                  id="supabase-key"
                  type={showKey ? "text" : "password"}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className={`h-12 text-base pr-10 ${
                    supabaseKey && !isValidKey(supabaseKey)
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : supabaseKey && isValidKey(supabaseKey)
                        ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                        : "border-gray-300 focus:border-arkus-red focus:ring-arkus-red"
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </Button>
              </div>
              {supabaseKey && !isValidKey(supabaseKey) && (
                <p className="text-sm text-red-600">Please enter a valid Supabase anon key (should start with eyJ)</p>
              )}
              {supabaseKey && isValidKey(supabaseKey) && (
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Valid Supabase key
                </p>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateConfig}
              disabled={!isValidUrl(supabaseUrl) || !isValidKey(supabaseKey)}
              className="w-full bg-arkus-red text-white hover:bg-arkus-red-hover disabled:opacity-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Generate Configuration
            </Button>
          </CardContent>
        </Card>

        {/* Generated Configuration */}
        {configGenerated && (
          <Card className="mb-8 bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-arkus-navy flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Configuration Generated
              </CardTitle>
              <CardDescription>Copy this configuration to your .env.local file in your project root</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  readOnly
                  value={`NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}`}
                  className="font-mono text-sm bg-gray-50 border-gray-300 min-h-[100px]"
                />
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  className="absolute top-2 right-2 bg-arkus-red text-white hover:bg-arkus-red-hover"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Important:</strong> After copying this configuration to your .env.local file, restart your
                  development server for the changes to take effect.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Setup Instructions */}
        <Card className="mb-8 bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-arkus-navy">Setup Instructions</CardTitle>
            <CardDescription>Follow these steps to complete your database setup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Get Your Supabase Credentials</h4>
              <p className="text-sm text-gray-600 mb-2">
                If you don't have a Supabase project yet, create one at{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-arkus-red hover:underline inline-flex items-center"
                >
                  supabase.com
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-4">
                <li>Go to your Supabase dashboard</li>
                <li>Navigate to Settings → API</li>
                <li>Copy your Project URL and anon/public key</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Create Database Tables</h4>
              <p className="text-sm text-gray-600 mb-2">Run the SQL scripts to create the necessary database tables:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-4">
                <li>Go to your Supabase SQL Editor</li>
                <li>Run the table creation script (supabase-tables.sql)</li>
                <li>Optionally, run the sample data script for testing</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. Configure Environment Variables</h4>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-4">
                <li>Create a .env.local file in your project root</li>
                <li>Add the generated configuration above</li>
                <li>Restart your development server</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">4. Test Your Connection</h4>
              <p className="text-sm text-gray-600">
                Use the{" "}
                <Link href="/test-connection" className="text-arkus-red hover:underline">
                  Connection Test page
                </Link>{" "}
                to verify everything is working correctly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/test-connection" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-arkus-navy text-arkus-navy hover:bg-arkus-navy hover:text-white bg-transparent"
            >
              <Database className="h-4 w-4 mr-2" />
              Test Connection
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
