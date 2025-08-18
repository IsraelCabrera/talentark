"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, MapPin, Building2, Calendar, Globe, AlertTriangle, RefreshCw, ArrowLeft, Settings, CheckCircle, Save, Upload, Download, Eye, Edit3, X, FileText, Loader2 } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { fetchUserById, isSupabaseConfigured, testConnection } from "@/lib/supabase-client"
import { generatePDF, downloadPDF } from "@/lib/pdf-generator"

interface Manager {
  id: string
  name: string
  email: string
  position: string
}

interface ArkusProject {
  id: string
  project_name: string
  client_name: string
  description: string
  start_date: string
  end_date: string | null
  allocation_percentage: number
  is_current: boolean
}

interface Certification {
  id: string
  title: string
  issuer: string
  issue_date: string
  expiration_date: string | null
  credential_url: string | null
}

interface Language {
  id: string
  language_name: string
  proficiency_level: string
}

interface Technology {
  level: string
  technologies: { name: string }
}

interface Skill {
  id: string
  skill_name: string
  level: string
}

interface Education {
  id: string
  degree_title: string
  institution_name: string
  graduation_date: string
}

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  location?: string
  english_level?: string
  status: string
  level: string
  position?: string
  company?: string
  about?: string
  reports_to?: string
  employee_score?: number
  company_score?: number
  current_project_assignment?: string
  project_allocation_percentage?: number
  created_at: string
  updated_at: string
  manager?: Manager
  arkus_projects: ArkusProject[]
  certifications: Certification[]
  languages: Language[]
  technologies: Technology[]
  skills: Skill[]
  education: Education[]
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<Partial<UserProfile>>({})
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean
    message: string
    details: string
  } | null>(null)

  // Mock user ID for demo - in real app this would come from auth/params
  const userId = "dca37910-61d0-474f-a7b5-6323aad275fa"

  const loadUser = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log("Loading user profile for ID:", userId)

      // First test the connection
      const connTest = await testConnection()
      setConnectionStatus(connTest)

      if (!connTest.success) {
        setError(connTest.message)
        return
      }

      const data = await fetchUserById(userId)
      console.log("User data loaded:", data)
      setUser(data)
      setEditedUser(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load user profile"
      setError(errorMessage)
      console.error("Error loading user:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const handleSave = async () => {
    // In a real app, this would save to the database
    console.log("Saving user data:", editedUser)
    setUser({ ...user!, ...editedUser })
    setIsEditing(false)
    // Show success message
  }

  const handleCancel = () => {
    setEditedUser(user || {})
    setIsEditing(false)
  }

  const handleExportPDF = async () => {
    if (!user) return
    
    try {
      setIsExportingPDF(true)
      console.log("Starting PDF export for user:", user.name)
      
      const pdfBlob = await generatePDF(user)
      const fileName = `${user.name.replace(/\s+/g, '_')}_Profile_${new Date().toISOString().split('T')[0]}.pdf`
      
      downloadPDF(pdfBlob, fileName)
      
      console.log("PDF export completed successfully")
    } catch (error) {
      console.error('Error generating PDF:', error)
      // In a real app, you might want to show a toast notification here
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsExportingPDF(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      employee: "Employee",
      pm: "Project Manager",
      hr: "Human Resources",
      admin: "Administrator",
    }
    return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1)
  }

  const getStatusBadgeColor = (status: string) => {
    return status === "available" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Show configuration needed state
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-arkus-gray">
        <header className="bg-arkus-navy border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Image src="/images/arkus-logo.png" alt="Arkus Logo" width={40} height={40} className="mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-white">TalentArk</h1>
                  <p className="text-sm text-gray-300">My Profile</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className="text-arkus-navy">Database Configuration Required</CardTitle>
              <CardDescription>Please configure your Supabase database connection to view your profile</CardDescription>
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
      <header className="bg-arkus-navy border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Image src="/images/arkus-logo.png" alt="Arkus Logo" width={40} height={40} className="mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">TalentArk</h1>
                <p className="text-sm text-gray-300">My Profile</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/">
            <Button
              variant="outline"
              className="border-arkus-navy text-arkus-navy hover:bg-arkus-navy hover:text-white bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          {user && (
            <div className="flex gap-2">
              <Button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                variant="outline"
                className="border-arkus-navy text-arkus-navy hover:bg-arkus-navy hover:text-white bg-transparent"
              >
                {isExportingPDF ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </>
                )}
              </Button>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-arkus-red text-white hover:bg-arkus-red-hover"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <h3 className="text-red-800 font-medium">Profile Error</h3>
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
                    onClick={loadUser}
                    className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-arkus-red mx-auto mb-4" />
              <p className="text-gray-600">Loading your profile...</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Overview */}
            <div className="lg:col-span-1 space-y-6">
              {/* Basic Profile Card */}
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarImage src="/placeholder.svg" alt={user.name} />
                        <AvatarFallback className="bg-arkus-red text-white text-xl">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 bg-arkus-red text-white hover:bg-arkus-red-hover"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={editedUser.name || user.name}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          className="text-center text-xl font-bold"
                        />
                        <Input
                          value={editedUser.position || user.position || getRoleDisplayName(user.role)}
                          onChange={(e) => setEditedUser({ ...editedUser, position: e.target.value })}
                          className="text-center"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-arkus-navy mb-2">{user.name}</h2>
                        <p className="text-gray-600 mb-4">{user.position || getRoleDisplayName(user.role)}</p>
                      </>
                    )}
                    
                    <div className="flex justify-center gap-2 mb-4">
                      <Badge className={`${getStatusBadgeColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">{user.level}</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-3 text-gray-400" />
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedUser.email || user.email}
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                          className="text-sm"
                        />
                      ) : (
                        <span className="text-gray-600">{user.email}</span>
                      )}
                    </div>
                    <div className="flex items-center text-sm">
                      <Building2 className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-gray-600">{getRoleDisplayName(user.role)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                      {isEditing ? (
                        <Input
                          value={editedUser.location || user.location || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                          placeholder="Location"
                          className="text-sm"
                        />
                      ) : (
                        <span className="text-gray-600">{user.location || "Not specified"}</span>
                      )}
                    </div>
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-3 text-gray-400" />
                      {isEditing ? (
                        <Input
                          value={editedUser.english_level || user.english_level || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, english_level: e.target.value })}
                          placeholder="English level"
                          className="text-sm"
                        />
                      ) : (
                        <span className="text-gray-600">English: {user.english_level || "Not specified"}</span>
                      )}
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-gray-600">Joined {formatDate(user.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-arkus-navy">About</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editedUser.about || user.about || ""}
                      onChange={(e) => setEditedUser({ ...editedUser, about: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {user.about || "No description provided."}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Technologies */}
              {user.technologies && user.technologies.length > 0 && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-arkus-navy flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Technologies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.technologies.map((tech, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-arkus-navy">{tech.technologies.name}</span>
                          <Badge variant="outline" className="border-arkus-navy text-arkus-navy">
                            {tech.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-arkus-navy flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.skills.map((skill, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-arkus-navy">{skill.skill_name}</span>
                          <Badge variant="outline" className="border-arkus-navy text-arkus-navy">
                            {skill.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {!loading && !error && !user && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
              <p className="text-gray-600 mb-4">Your profile could not be loaded.</p>
              <Button onClick={loadUser} className="bg-arkus-red text-white hover:bg-arkus-red-hover">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
