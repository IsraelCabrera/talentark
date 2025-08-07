"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Download, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { isSupabaseConfigured } from "@/lib/supabase-client"

export default function ImportPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)

  const downloadTemplate = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Define the CSV headers based on the actual database schema
    const headers = [
      "name",
      "email",
      "role",
      "position",
      "company",
      "location",
      "english_level",
      "level",
      "status",
      "about",
      "reports_to",
    ]

    // Create sample data to show the expected format
    const sampleData = [
      [
        "John Doe",
        "john.doe@company.com",
        "Software Engineer",
        "Senior Developer",
        "Arkus Inc",
        "Mexico City",
        "Advanced",
        "Senior",
        "Active",
        "Experienced full-stack developer with expertise in React and Node.js",
        "jane.smith@company.com",
      ],
      [
        "Jane Smith",
        "jane.smith@company.com",
        "Engineering Manager",
        "Team Lead",
        "Arkus Inc",
        "Guadalajara",
        "Native",
        "Lead",
        "Active",
        "Technical leader with 8+ years of experience managing development teams",
        "",
      ],
    ]

    // Combine headers and sample data
    const csvContent = [headers, ...sampleData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "talentark_import_template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadProgress(0)
    setUploadResult(null)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setUploadProgress(100)
      setUploadResult({
        success: true,
        message: "File uploaded successfully!",
        details: `Processed ${file.name} - Ready for import`,
      })
    } catch (error) {
      setUploadResult({
        success: false,
        message: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setUploading(false)
      clearInterval(progressInterval)
    }
  }

  const handleDropZoneClick = () => {
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-arkus-gray">
        <header className="bg-arkus-navy border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <Image src="/images/arkus-logo.png" alt="Arkus Logo" width={40} height={40} className="mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-white">TalentArk</h1>
                  <p className="text-sm text-gray-300">Data Import</p>
                </div>
              </Link>
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
              <strong>Configuration Required:</strong> Please configure your Supabase database connection before
              importing data.
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
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image src="/images/arkus-logo.png" alt="Arkus Logo" width={40} height={40} className="mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">TalentArk</h1>
                <p className="text-sm text-gray-300">Data Import</p>
              </div>
            </Link>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-arkus-navy mb-2">Import Employee Data</h2>
          <p className="text-gray-600">Upload CSV or Excel files to add employees to your database</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-arkus-navy">
                <Upload className="h-5 w-5" />
                Upload File
              </CardTitle>
              <CardDescription>Select a CSV or Excel file containing employee data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-arkus-red transition-colors cursor-pointer"
                onClick={handleDropZoneClick}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-600">CSV, XLSX files up to 10MB</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uploading...</span>
                    <span className="text-gray-600">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {/* Upload Result */}
              {uploadResult && (
                <Alert className={uploadResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  {uploadResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={uploadResult.success ? "text-green-800" : "text-red-800"}>
                    <strong>{uploadResult.message}</strong>
                    {uploadResult.details && <div className="text-sm mt-1">{uploadResult.details}</div>}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Template Section */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-arkus-navy">
                <FileText className="h-5 w-5" />
                Download Template
              </CardTitle>
              <CardDescription>Get the correct format for your employee data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Download our template to ensure your data is formatted correctly for import.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-arkus-navy mb-2">Required Fields:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Name (required)</li>
                    <li>• Email (required)</li>
                    <li>• Role (e.g., Software Engineer, Manager)</li>
                    <li>• Position (job title)</li>
                    <li>• Company</li>
                    <li>• Location (city/office)</li>
                    <li>• English Level (Beginner, Intermediate, Advanced, Native)</li>
                    <li>• Level (Junior, Mid, Senior, Lead)</li>
                    <li>• Status (Active, Inactive)</li>
                    <li>• About (brief description)</li>
                    <li>• Reports To (manager's email, optional)</li>
                  </ul>
                </div>

                <Button onClick={downloadTemplate} className="w-full bg-arkus-red text-white hover:bg-arkus-red-hover">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6 bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-arkus-navy">Import Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-arkus-navy">Before You Import:</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Download and use our template for best results</li>
                  <li>Ensure all required fields are filled</li>
                  <li>Check for duplicate email addresses</li>
                  <li>Verify department and location names</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-arkus-navy">Supported Formats:</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>CSV files (.csv)</li>
                  <li>Excel files (.xlsx, .xls)</li>
                  <li>Maximum file size: 10MB</li>
                  <li>Maximum rows: 1,000 employees</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
