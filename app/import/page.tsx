"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowLeft, Upload, Download, FileSpreadsheet, Users, AlertTriangle, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Image from "next/image"

// Mock data for import history
const importHistory = [
  {
    id: 1,
    fileName: "employees_batch_1.xlsx",
    importedBy: "Carlos Ruiz",
    importDate: "2024-01-15T10:30:00Z",
    recordsProcessed: 25,
    recordsSuccess: 23,
    recordsErrors: 2,
    status: "completed",
  },
  {
    id: 2,
    fileName: "new_hires_q1.csv",
    importedBy: "Sofia Gonzalez",
    importDate: "2024-01-10T14:15:00Z",
    recordsProcessed: 12,
    recordsSuccess: 12,
    recordsErrors: 0,
    status: "completed",
  },
  {
    id: 3,
    fileName: "contractors_update.xlsx",
    importedBy: "Maria HR",
    importDate: "2024-01-08T09:45:00Z",
    recordsProcessed: 8,
    recordsSuccess: 6,
    recordsErrors: 2,
    status: "completed_with_errors",
  },
]

interface ImportPreviewData {
  name: string
  email: string
  position: string
  location: string
  english_level: string
  status: string
  level: string
  technologies: string
  skills: string
  certifications: string
  education: string
  languages: string
  errors: string[]
}

export default function ImportPage() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const [previewData, setPreviewData] = useState<ImportPreviewData[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [importResults, setImportResults] = useState<{
    success: number
    errors: number
    total: number
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ]

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid Excel (.xlsx) or CSV file")
      return
    }

    setSelectedFile(file)
    processFilePreview(file)
  }

  const processFilePreview = async (file: File) => {
    // Mock file processing - in a real app, this would parse the actual file
    const mockPreviewData: ImportPreviewData[] = [
      {
        name: "John Doe",
        email: "john.doe@arkus.com",
        position: "Frontend Developer",
        location: "Tijuana, MX",
        english_level: "Advanced",
        status: "available",
        level: "T2",
        technologies: "React, JavaScript, CSS",
        skills: "UI Development, Testing",
        certifications: "React Professional",
        education: "Bachelor of Computer Science",
        languages: "Spanish (Native), English (Advanced)",
        errors: [],
      },
      {
        name: "Jane Smith",
        email: "jane.smith@arkus.com",
        position: "Backend Developer",
        location: "Guadalajara, MX",
        english_level: "Fluent",
        status: "assigned",
        level: "T3",
        technologies: "Node.js, PostgreSQL, Docker",
        skills: "API Development, Database Design",
        certifications: "AWS Solutions Architect",
        education: "Master of Software Engineering",
        languages: "Spanish (Native), English (Fluent)",
        errors: [],
      },
      {
        name: "Invalid User",
        email: "invalid-email",
        position: "",
        location: "Unknown Location",
        english_level: "Invalid Level",
        status: "unknown",
        level: "T5",
        technologies: "",
        skills: "",
        certifications: "",
        education: "",
        languages: "",
        errors: [
          "Invalid email format",
          "Position is required",
          "Invalid English level",
          "Invalid status",
          "Invalid level (must be T1-T4)",
        ],
      },
    ]

    setPreviewData(mockPreviewData)
    setShowPreview(true)
  }

  const handleImport = async () => {
    if (!selectedFile || !previewData.length) return

    setIsImporting(true)
    setImportProgress(0)

    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsImporting(false)

          // Mock import results
          const validRecords = previewData.filter((record) => record.errors.length === 0)
          const errorRecords = previewData.filter((record) => record.errors.length > 0)

          setImportResults({
            success: validRecords.length,
            errors: errorRecords.length,
            total: previewData.length,
          })

          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const downloadTemplate = () => {
    // In a real app, this would generate and download an actual Excel file
    const templateData = `Name,Email,Position,Location,English Level,Status,Level,Technologies,Skills,Certifications,Education,Languages
John Doe,john.doe@arkus.com,Frontend Developer,Tijuana MX,Advanced,available,T2,"React, JavaScript, CSS","UI Development, Testing",React Professional,Bachelor of Computer Science,"Spanish (Native), English (Advanced)"
Jane Smith,jane.smith@arkus.com,Backend Developer,Guadalajara MX,Fluent,assigned,T3,"Node.js, PostgreSQL, Docker","API Development, Database Design",AWS Solutions Architect,Master of Software Engineering,"Spanish (Native), English (Fluent)"`

    const blob = new Blob([templateData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "talentark_import_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const resetImport = () => {
    setSelectedFile(null)
    setPreviewData([])
    setShowPreview(false)
    setImportResults(null)
    setImportProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">✅ Completed</Badge>
      case "completed_with_errors":
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ Completed with Errors</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">❌ Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
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
                <h1 className="text-2xl font-bold text-white">Import Employees</h1>
                <p className="text-sm text-gray-300">Bulk import employees from Excel or CSV files</p>
              </div>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-arkus-navy bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Directory
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Import Process */}
          <div className="lg:col-span-2 space-y-6">
            {/* Instructions */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-arkus-navy flex items-center">
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  Import Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-arkus-navy mb-2">Before You Start:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Download the template file to ensure proper formatting</li>
                    <li>• Supported formats: Excel (.xlsx) and CSV (.csv)</li>
                    <li>• Maximum file size: 10MB</li>
                    <li>• Maximum records per import: 1000</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={downloadTemplate}
                    variant="outline"
                    className="border-arkus-red text-arkus-red hover:bg-arkus-red hover:text-white bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            {!showPreview && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-arkus-navy">Upload File</CardTitle>
                  <CardDescription>Select or drag and drop your Excel or CSV file</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? "border-arkus-red bg-red-50"
                        : "border-gray-300 hover:border-arkus-red hover:bg-gray-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-arkus-navy mb-2">
                      {dragActive ? "Drop your file here" : "Drag and drop your file here"}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">or</p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-arkus-red text-white hover:bg-arkus-red-hover"
                    >
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />
                    {selectedFile && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-arkus-navy">{selectedFile.name}</p>
                        <p className="text-xs text-gray-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preview Data */}
            {showPreview && !importResults && (
              <Card className="border-gray-200">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg text-arkus-navy">Preview Import Data</CardTitle>
                      <CardDescription>
                        Review the data before importing. Records with errors will be skipped.
                      </CardDescription>
                    </div>
                    <Button
                      onClick={resetImport}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-arkus-navy">{previewData.length}</p>
                        <p className="text-sm text-gray-600">Total Records</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {previewData.filter((record) => record.errors.length === 0).length}
                        </p>
                        <p className="text-sm text-gray-600">Valid Records</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {previewData.filter((record) => record.errors.length > 0).length}
                        </p>
                        <p className="text-sm text-gray-600">Records with Errors</p>
                      </div>
                    </div>

                    {/* Data Preview */}
                    <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-arkus-navy">Status</th>
                            <th className="px-3 py-2 text-left font-medium text-arkus-navy">Name</th>
                            <th className="px-3 py-2 text-left font-medium text-arkus-navy">Email</th>
                            <th className="px-3 py-2 text-left font-medium text-arkus-navy">Position</th>
                            <th className="px-3 py-2 text-left font-medium text-arkus-navy">Location</th>
                            <th className="px-3 py-2 text-left font-medium text-arkus-navy">Errors</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {previewData.map((record, index) => (
                            <tr key={index} className={record.errors.length > 0 ? "bg-red-50" : "bg-white"}>
                              <td className="px-3 py-2">
                                {record.errors.length === 0 ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                )}
                              </td>
                              <td className="px-3 py-2 font-medium">{record.name}</td>
                              <td className="px-3 py-2">{record.email}</td>
                              <td className="px-3 py-2">{record.position}</td>
                              <td className="px-3 py-2">{record.location}</td>
                              <td className="px-3 py-2">
                                {record.errors.length > 0 && (
                                  <div className="space-y-1">
                                    {record.errors.map((error, errorIndex) => (
                                      <p key={errorIndex} className="text-xs text-red-600">
                                        • {error}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Import Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        {previewData.filter((record) => record.errors.length === 0).length} valid records will be
                        imported
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={resetImport}
                          variant="outline"
                          className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleImport}
                          disabled={previewData.filter((record) => record.errors.length === 0).length === 0}
                          className="bg-arkus-red text-white hover:bg-arkus-red-hover"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Import Valid Records
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Import Progress */}
            {isImporting && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-arkus-navy">Importing Data...</CardTitle>
                  <CardDescription>Please wait while we process your file</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={importProgress} className="w-full" />
                    <p className="text-sm text-gray-600 text-center">{importProgress}% Complete</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Import Results */}
            {importResults && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-arkus-navy flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    Import Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-arkus-navy">{importResults.total}</p>
                        <p className="text-sm text-gray-600">Total Processed</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">{importResults.success}</p>
                        <p className="text-sm text-gray-600">Successfully Imported</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-red-600">{importResults.errors}</p>
                        <p className="text-sm text-gray-600">Errors/Skipped</p>
                      </div>
                    </div>

                    {importResults.errors > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {importResults.errors} records were skipped due to validation errors. Please check the error
                          details above and correct the data before re-importing.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-center">
                      <Button onClick={resetImport} className="bg-arkus-red text-white hover:bg-arkus-red-hover">
                        Import Another File
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Import History */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-arkus-navy">Import History</CardTitle>
                <CardDescription>Recent bulk import activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {importHistory.map((import_) => (
                    <div key={import_.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-arkus-navy text-sm">{import_.fileName}</p>
                          <p className="text-xs text-gray-600">by {import_.importedBy}</p>
                        </div>
                        {getStatusBadge(import_.status)}
                      </div>

                      <div className="text-xs text-gray-600 space-y-1">
                        <p>{formatDate(import_.importDate)}</p>
                        <div className="flex justify-between">
                          <span>Processed:</span>
                          <span className="font-medium">{import_.recordsProcessed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Success:</span>
                          <span className="font-medium text-green-600">{import_.recordsSuccess}</span>
                        </div>
                        {import_.recordsErrors > 0 && (
                          <div className="flex justify-between">
                            <span>Errors:</span>
                            <span className="font-medium text-red-600">{import_.recordsErrors}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
