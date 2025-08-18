"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import ProtectedRoute from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase-client"
import {
  Upload,
  Download,
  FileSpreadsheet,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  FileText,
  Info,
} from "lucide-react"
import Link from "next/link"
import * as XLSX from "xlsx"

interface ImportResult {
  success: number
  errors: Array<{ row: number; error: string; data?: any }>
  warnings: Array<{ row: number; warning: string; data?: any }>
}

interface UserData {
  name: string
  email: string
  position: string
  location: string
  phone?: string
  department?: string
  hire_date?: string
  employee_score?: number
  company_score?: number
}

function ImportPage() {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [previewData, setPreviewData] = useState<UserData[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setResult(null)
    setShowPreview(false)

    // Preview the file
    try {
      const data = await readExcelFile(selectedFile)
      setPreviewData(data.slice(0, 5)) // Show first 5 rows
      setShowPreview(true)
    } catch (error) {
      console.error("Error reading file:", error)
    }
  }

  const readExcelFile = (file: File): Promise<UserData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

          if (jsonData.length < 2) {
            reject(new Error("File must contain at least a header row and one data row"))
            return
          }

          const headers = jsonData[0].map((h: string) => h?.toLowerCase().trim())
          const users: UserData[] = []

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i]
            if (!row || row.every((cell) => !cell)) continue // Skip empty rows

            const user: UserData = {
              name: "",
              email: "",
              position: "",
              location: "",
            }

            headers.forEach((header: string, index: number) => {
              const value = row[index]?.toString().trim()
              if (!value) return

              switch (header) {
                case "name":
                case "full name":
                case "employee name":
                  user.name = value
                  break
                case "email":
                case "email address":
                  user.email = value.toLowerCase()
                  break
                case "position":
                case "job title":
                case "title":
                  user.position = value
                  break
                case "location":
                case "office":
                case "city":
                  user.location = value
                  break
                case "phone":
                case "phone number":
                  user.phone = value
                  break
                case "department":
                case "dept":
                  user.department = value
                  break
                case "hire date":
                case "start date":
                  user.hire_date = value
                  break
                case "employee score":
                case "score":
                  user.employee_score = Number.parseInt(value) || 0
                  break
                case "company score":
                case "rating":
                  user.company_score = Number.parseInt(value) || 0
                  break
              }
            })

            users.push(user)
          }

          resolve(users)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsArrayBuffer(file)
    })
  }

  const validateUserData = (user: UserData, rowIndex: number): string[] => {
    const errors: string[] = []

    if (!user.name) errors.push("Name is required")
    if (!user.email) errors.push("Email is required")
    if (!user.position) errors.push("Position is required")
    if (!user.location) errors.push("Location is required")

    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      errors.push("Invalid email format")
    }

    if (user.employee_score && (user.employee_score < 0 || user.employee_score > 100)) {
      errors.push("Employee score must be between 0 and 100")
    }

    if (user.company_score && (user.company_score < 0 || user.company_score > 10)) {
      errors.push("Company score must be between 0 and 10")
    }

    return errors
  }

  const handleImport = async () => {
    if (!file || !supabase) return

    setImporting(true)
    setProgress(0)
    setResult(null)

    try {
      const users = await readExcelFile(file)
      const result: ImportResult = {
        success: 0,
        errors: [],
        warnings: [],
      }

      for (let i = 0; i < users.length; i++) {
        const user = users[i]
        const rowNumber = i + 2 // +2 because Excel rows start at 1 and we skip header

        // Validate data
        const validationErrors = validateUserData(user, i)
        if (validationErrors.length > 0) {
          result.errors.push({
            row: rowNumber,
            error: validationErrors.join(", "),
            data: user,
          })
          setProgress(((i + 1) / users.length) * 100)
          continue
        }

        try {
          // Check if user already exists
          const { data: existingUser } = await supabase.from("users").select("id").eq("email", user.email).single()

          if (existingUser) {
            result.warnings.push({
              row: rowNumber,
              warning: "User with this email already exists, skipping",
              data: user,
            })
            setProgress(((i + 1) / users.length) * 100)
            continue
          }

          // Insert user
          const { error: insertError } = await supabase.from("users").insert({
            name: user.name,
            email: user.email,
            position: user.position,
            location: user.location,
            phone: user.phone,
            department: user.department,
            hire_date: user.hire_date,
            employee_score: user.employee_score || 0,
            company_score: user.company_score || 0,
            role: "employee", // Default role
          })

          if (insertError) {
            result.errors.push({
              row: rowNumber,
              error: insertError.message,
              data: user,
            })
          } else {
            result.success++
          }
        } catch (error: any) {
          result.errors.push({
            row: rowNumber,
            error: error.message || "Unknown error occurred",
            data: user,
          })
        }

        setProgress(((i + 1) / users.length) * 100)
      }

      setResult(result)
    } catch (error: any) {
      console.error("Import error:", error)
      setResult({
        success: 0,
        errors: [{ row: 0, error: error.message || "Failed to process file" }],
        warnings: [],
      })
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const template = [
      ["Name", "Email", "Position", "Location", "Phone", "Department", "Hire Date", "Employee Score", "Company Score"],
      [
        "John Doe",
        "john.doe@company.com",
        "Software Developer",
        "Austin, TX",
        "+1-555-0123",
        "Engineering",
        "2023-01-15",
        "85",
        "8",
      ],
      [
        "Jane Smith",
        "jane.smith@company.com",
        "Product Manager",
        "San Francisco, CA",
        "+1-555-0124",
        "Product",
        "2022-11-20",
        "92",
        "9",
      ],
    ]

    const ws = XLSX.utils.aoa_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Employee Template")
    XLSX.writeFile(wb, "talentark_import_template.xlsx")
  }

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      super_user: "Super User",
      hr: "Human Resources",
      manager: "Manager",
      collaborator: "Collaborator",
    }
    return roleMap[role] || role
  }

  const getRoleBadgeColor = (role: string) => {
    const colorMap: Record<string, string> = {
      super_user: "bg-purple-100 text-purple-800",
      hr: "bg-blue-100 text-blue-800",
      manager: "bg-green-100 text-green-800",
      collaborator: "bg-gray-100 text-gray-800",
    }
    return colorMap[role] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Import Employees</h1>
                <p className="text-sm text-gray-300">Upload employee data from Excel files</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-right">
                  <p className="text-white font-medium">{user.name}</p>
                  <Badge className={getRoleBadgeColor(user.role)}>{getRoleDisplayName(user.role)}</Badge>
                </div>
              )}
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Import Instructions
            </CardTitle>
            <CardDescription>Follow these steps to successfully import employee data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Step 1: Download Template</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Download our Excel template with the correct column headers and sample data.
                </p>
                <Button onClick={downloadTemplate} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Step 2: Prepare Your Data</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Fill in the template with your employee data. Required fields: Name, Email, Position, Location.
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Supported Columns</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                <span>• Name (required)</span>
                <span>• Email (required)</span>
                <span>• Position (required)</span>
                <span>• Location (required)</span>
                <span>• Phone</span>
                <span>• Department</span>
                <span>• Hire Date</span>
                <span>• Employee Score (0-100)</span>
                <span>• Company Score (0-10)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Employee Data</CardTitle>
            <CardDescription>Select an Excel file (.xlsx, .xls) containing employee information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">Choose a file to upload</p>
                <p className="text-sm text-gray-500">Excel files (.xlsx, .xls) up to 10MB</p>
              </div>
              <div className="mt-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                </Button>
              </div>
            </div>

            {file && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">{file.name}</p>
                    <p className="text-sm text-blue-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button
                    onClick={handleImport}
                    disabled={importing}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {importing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Import Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        {showPreview && previewData.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
              <CardDescription>First 5 rows from your file (review before importing)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((user, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email || "—"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.position || "—"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.location || "—"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.employee_score || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Import Results</CardTitle>
              <CardDescription>Summary of the import operation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">Successful</p>
                      <p className="text-2xl font-bold text-green-900">{result.success}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-800">Warnings</p>
                      <p className="text-2xl font-bold text-yellow-900">{result.warnings.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <XCircle className="h-8 w-8 text-red-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">Errors</p>
                      <p className="text-2xl font-bold text-red-900">{result.errors.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {result.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-900 mb-3">Errors ({result.errors.length})</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {result.errors.map((error, index) => (
                      <Alert key={index} className="border-red-200 bg-red-50">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-800">
                          <strong>Row {error.row}:</strong> {error.error}
                          {error.data && (
                            <div className="mt-1 text-sm">
                              {error.data.name && <span>Name: {error.data.name} | </span>}
                              {error.data.email && <span>Email: {error.data.email}</span>}
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-900 mb-3">Warnings ({result.warnings.length})</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {result.warnings.map((warning, index) => (
                      <Alert key={index} className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-yellow-800">
                          <strong>Row {warning.row}:</strong> {warning.warning}
                          {warning.data && (
                            <div className="mt-1 text-sm">
                              {warning.data.name && <span>Name: {warning.data.name} | </span>}
                              {warning.data.email && <span>Email: {warning.data.email}</span>}
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {result.success > 0 && (
                <div className="flex justify-center">
                  <Link href="/">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Users className="h-4 w-4 mr-2" />
                      View Imported Employees
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default function ImportPageWithAuth() {
  return (
    <ProtectedRoute requiredPermission="canUploadUsers">
      <ImportPage />
    </ProtectedRoute>
  )
}
