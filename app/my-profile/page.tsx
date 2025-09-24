"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { User, Mail, MapPin, Building2, Calendar, Globe, AlertTriangle, RefreshCw, ArrowLeft, Settings, CheckCircle, Award, Code, GraduationCap, Languages, Briefcase, Users, Star, Target, TrendingUp, ExternalLink, Clock, History, ChevronRight, UserCheck, FileText, Loader2, Edit } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
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
  status?: string
  team_size?: number
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
  current_project_id?: string
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

// Fixed Pie Chart Component with proper validation
const PieChart = ({ percentage, size = 120 }: { percentage: number; size?: number }) => {
  // Validate and sanitize inputs
  const validPercentage = typeof percentage === 'number' && !isNaN(percentage) ? Math.max(0, Math.min(100, percentage)) : 0
  const validSize = typeof size === 'number' && !isNaN(size) ? Math.max(60, size) : 120
  
  const radius = (validSize - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: validSize, height: validSize }}>
      <svg width={validSize} height={validSize} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={validSize / 2}
          cy={validSize / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={validSize / 2}
          cy={validSize / 2}
          r={radius}
          stroke="#dc2626"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{validPercentage}%</div>
          <div className="text-xs text-gray-500">Allocated</div>
        </div>
      </div>
    </div>
  )
}

// Mock data for demonstration
const mockUserData: UserProfile = {
  id: "dca37910-61d0-474f-a7b5-6323aad275fa",
  name: "Sarah Johnson",
  email: "sarah.johnson@arkus.com",
  role: "employee",
  location: "Austin, TX",
  english_level: "Native",
  status: "available",
  level: "Senior",
  position: "Senior Frontend Developer",
  company: "Arkus",
  about: "Experienced frontend developer with 8+ years in React, TypeScript, and modern web technologies. Passionate about creating intuitive user experiences and mentoring junior developers. Led multiple successful project deliveries and contributed to the company's design system.",
  reports_to: "manager-123",
  employee_score: 92,
  company_score: 8.5,
  current_project_assignment: "E-Commerce Platform Redesign",
  current_project_id: "project-ecommerce-2024",
  project_allocation_percentage: 80,
  created_at: "2022-03-15T00:00:00Z",
  updated_at: "2024-01-15T00:00:00Z",
  manager: {
    id: "manager-123",
    name: "Michael Chen",
    email: "michael.chen@arkus.com",
    position: "Engineering Manager"
  },
  arkus_projects: [
    {
      id: "project-ecommerce-2024",
      project_name: "E-Commerce Platform Redesign",
      client_name: "TechCorp Solutions",
      description: "Complete redesign and modernization of the client's e-commerce platform using React and Node.js",
      start_date: "2024-01-15",
      end_date: null,
      allocation_percentage: 80,
      is_current: true,
      status: "active",
      team_size: 6
    },
    {
      id: "project-banking-2023",
      project_name: "Banking Dashboard Modernization",
      client_name: "SecureBank Corp",
      description: "Modernized legacy banking dashboard with improved UX and security features",
      start_date: "2023-06-01",
      end_date: "2023-12-31",
      allocation_percentage: 90,
      is_current: false,
      status: "completed",
      team_size: 4
    },
    {
      id: "project-healthcare-2023",
      project_name: "Healthcare Management System",
      client_name: "MedTech Solutions",
      description: "Built comprehensive healthcare management system with patient portal and provider dashboard",
      start_date: "2023-01-10",
      end_date: "2023-05-30",
      allocation_percentage: 75,
      is_current: false,
      status: "completed",
      team_size: 8
    }
  ],
  certifications: [
    {
      id: "cert-1",
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      issue_date: "2023-08-15",
      expiration_date: "2026-08-15",
      credential_url: "https://aws.amazon.com/certification/"
    },
    {
      id: "cert-2",
      title: "React Professional Developer",
      issuer: "Meta",
      issue_date: "2023-03-20",
      expiration_date: null,
      credential_url: "https://developers.facebook.com/certification/"
    }
  ],
  languages: [
    {
      id: "lang-1",
      language_name: "English",
      proficiency_level: "Native"
    },
    {
      id: "lang-2",
      language_name: "Spanish",
      proficiency_level: "Intermediate"
    },
    {
      id: "lang-3",
      language_name: "French",
      proficiency_level: "Beginner"
    }
  ],
  technologies: [
    {
      level: "Expert",
      technologies: { name: "React" }
    },
    {
      level: "Expert",
      technologies: { name: "TypeScript" }
    },
    {
      level: "Advanced",
      technologies: { name: "Node.js" }
    },
    {
      level: "Advanced",
      technologies: { name: "Next.js" }
    },
    {
      level: "Intermediate",
      technologies: { name: "Python" }
    }
  ],
  skills: [
    {
      id: "skill-1",
      skill_name: "Frontend Development",
      level: "Expert"
    },
    {
      id: "skill-2",
      skill_name: "UI/UX Design",
      level: "Advanced"
    },
    {
      id: "skill-3",
      skill_name: "Team Leadership",
      level: "Advanced"
    },
    {
      id: "skill-4",
      skill_name: "Project Management",
      level: "Intermediate"
    }
  ],
  education: [
    {
      id: "edu-1",
      degree_title: "Bachelor of Science in Computer Science",
      institution_name: "University of Texas at Austin",
      graduation_date: "2016-05-15"
    }
  ]
}

export default function MyProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  // Estados de edición
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [aboutDraft, setAboutDraft] = useState("")
  const [isEditingLanguages, setIsEditingLanguages] = useState(false)
  const [languagesDraft, setLanguagesDraft] = useState<Language[]>([])
  const [isEditingTechnologies, setIsEditingTechnologies] = useState(false)
  const [technologiesDraft, setTechnologiesDraft] = useState<Technology[]>([])
  const [isEditingSkills, setIsEditingSkills] = useState(false)
  const [skillsDraft, setSkillsDraft] = useState<Skill[]>([])
  const [isEditingEducation, setIsEditingEducation] = useState(false)
  const [educationDraft, setEducationDraft] = useState<Education[]>([])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setUser(mockUserData)
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [params.id])

  // Sincronizar drafts al entrar en modo edición
  useEffect(() => {
    if (user) {
      setAboutDraft(user.about || "")
      setLanguagesDraft(user.languages)
      setTechnologiesDraft(user.technologies)
      setSkillsDraft(user.skills)
      setEducationDraft(user.education)
    }
  }, [user])

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

  const getProjectStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'in progress':
        return "bg-green-100 text-green-800"
      case 'completed':
        return "bg-blue-100 text-blue-800"
      case 'on hold':
        return "bg-yellow-100 text-yellow-800"
      case 'cancelled':
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800"
    if (score >= 80) return "bg-blue-100 text-blue-800"
    if (score >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  const getProficiencyColor = (level: string) => {
    const levelLower = level.toLowerCase()
    if (levelLower.includes('native') || levelLower.includes('fluent')) return "bg-green-100 text-green-800"
    if (levelLower.includes('advanced') || levelLower.includes('proficient')) return "bg-blue-100 text-blue-800"
    if (levelLower.includes('intermediate')) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  const calculateProjectDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffMonths = Math.floor(diffDays / 30)
    
    if (diffMonths < 1) return `${diffDays} days`
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`
    const years = Math.floor(diffMonths / 12)
    const remainingMonths = diffMonths % 12
    return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">TalentArk</h1>
                <p className="text-sm text-gray-300">Employee Profile</p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/">
            <Button
              variant="outline"
              className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          {user && (
            <div className="flex space-x-4 justify-end">
              <Button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                variant="outline"
                className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white bg-transparent"
              >
                {isExportingPDF ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {loading && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading employee profile...</p>
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
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src="/placeholder.svg?height=96&width=96&text=SJ" alt={user.name} />
                      <AvatarFallback className="bg-red-600 text-white text-xl">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{user.name}</h2>
                    <p className="text-gray-600 mb-4">{user.position || getRoleDisplayName(user.role)}</p>
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
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Building2 className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-gray-600">{getRoleDisplayName(user.role)}</span>
                    </div>
                    {user.location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                        <span className="text-gray-600">{user.location}</span>
                      </div>
                    )}
                    {user.english_level && (
                      <div className="flex items-center text-sm">
                        <Globe className="h-4 w-4 mr-3 text-gray-400" />
                        <span className="text-gray-600">English: {user.english_level}</span>
                      </div>
                    )}
                    
                    {/* Reports To Section */}
                    {user.manager ? (
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-3 text-gray-400" />
                        <span className="text-gray-600">
                          Reports to: 
                          <Link href={`/profile/${user.manager.id}`} className="text-red-600 hover:text-red-700 ml-1 font-medium">
                            {user.manager.name}
                          </Link>
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-3 text-gray-400" />
                        <span className="text-gray-600">Reports to: None</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-gray-600">Joined {formatDate(user.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Assignment Pie Chart Card */}
              {user.project_allocation_percentage && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-900 flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Project Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <PieChart percentage={user.project_allocation_percentage || 0} />
                      <div className="mt-4 text-center">
                        <Badge variant="outline" className="border-slate-900 text-slate-900">
                          Current Allocation
                        </Badge>
                        <p className="text-xs text-gray-500 mt-2">Time allocated to current projects</p>
                        <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
                          <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                          <span>Allocated ({user.project_allocation_percentage || 0}%)</span>
                          <div className="w-3 h-3 bg-gray-200 rounded-full ml-4 mr-2"></div>
                          <span>Available ({100 - (user.project_allocation_percentage || 0)}%)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* About editable */}
              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-slate-900">About</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditingAbout(!isEditingAbout)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditingAbout ? (
                    <form
                      onSubmit={e => {
                        e.preventDefault()
                        setUser(u => u ? { ...u, about: aboutDraft } : u)
                        setIsEditingAbout(false)
                      }}
                      className="space-y-2"
                    >
                      <textarea
                        className="w-full border rounded p-2 text-gray-700"
                        rows={4}
                        value={aboutDraft}
                        onChange={e => setAboutDraft(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">Guardar</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setIsEditingAbout(false)}>Cancelar</Button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{user.about}</p>
                  )}
                </CardContent>
              </Card>

              {/* Current Arkus Project Assignment - Enhanced Clickable Version */}
              {user.current_project_assignment && (
                <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Current Project Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link 
                      href={`/projects/${user.current_project_id || 'current'}/team`}
                      className="block hover:bg-gray-50 p-4 rounded-lg transition-colors border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 text-lg hover:text-red-600 transition-colors">
                              {user.current_project_assignment}
                            </h3>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                            {user.project_allocation_percentage && (
                              <Badge variant="outline" className="border-slate-900 text-slate-900">
                                {user.project_allocation_percentage}% Allocation
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <UserCheck className="h-4 w-4 mr-2" />
                        <span>Click to view team members assigned to this project</span>
                      </div>

                      {user.project_allocation_percentage && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Project Allocation</span>
                            <span className="text-slate-900 font-medium">{user.project_allocation_percentage}%</span>
                          </div>
                          <Progress value={user.project_allocation_percentage} className="h-2" />
                        </div>
                      )}
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Previous Projects - Enhanced History */}
              {user.arkus_projects && user.arkus_projects.length > 0 && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center">
                      <History className="h-5 w-5 mr-2" />
                      Previous Projects History
                    </CardTitle>
                    <CardDescription>
                      Complete history of Arkus projects and assignments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {user.arkus_projects
                        .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
                        .map((project, index) => (
                        <div key={index} className="relative">
                          {/* Timeline connector */}
                          {index < user.arkus_projects.length - 1 && (
                            <div className="absolute left-3 top-8 w-0.5 h-16 bg-gray-200"></div>
                          )}
                          
                          <div className="flex items-start space-x-4">
                            {/* Timeline dot */}
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                              project.is_current ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            
                            {/* Project content */}
                            <div className="flex-1 min-w-0">
                              <Link 
                                href={`/projects/${project.id}/team`}
                                className="block hover:bg-gray-50 p-4 rounded-lg transition-colors border border-gray-100 hover:border-red-600"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h3 className="font-semibold text-slate-900 hover:text-red-600 transition-colors">
                                        {project.project_name}
                                      </h3>
                                      <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 text-sm">{project.client_name}</p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  {project.is_current && (
                                    <Badge className="bg-green-100 text-green-800 text-xs">Current</Badge>
                                  )}
                                  <Badge className={`text-xs ${getProjectStatusColor(project.status || 'completed')}`}>
                                    {project.status || 'Completed'}
                                  </Badge>
                                  <Badge variant="outline" className="border-slate-900 text-slate-900 text-xs">
                                    {project.allocation_percentage}% Allocation
                                  </Badge>
                                  {project.team_size && (
                                    <Badge variant="outline" className="text-xs">
                                      {project.team_size} team members
                                    </Badge>
                                  )}
                                </div>

                                <p className="text-gray-700 text-sm mb-3">{project.description}</p>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>
                                      {formatDateShort(project.start_date)} - {" "}
                                      {project.end_date ? formatDateShort(project.end_date) : "Present"}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>Duration: {calculateProjectDuration(project.start_date, project.end_date)}</span>
                                  </div>
                                </div>

                                <div className="flex items-center text-xs text-gray-600 mt-2">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  <span>Click to view project team</span>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Certifications */}
              {user.certifications && user.certifications.length > 0 && (
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Professional Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.certifications.map((cert, index) => (
                        <div key={index} className="border-l-2 border-red-600 pl-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-slate-900">{cert.title}</h3>
                              <p className="text-gray-600">{cert.issuer}</p>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              <div className="flex items-center mb-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                Issued: {formatDateShort(cert.issue_date)}
                              </div>
                              {cert.expiration_date && (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Expires: {formatDateShort(cert.expiration_date)}
                                </div>
                              )}
                            </div>
                          </div>
                          {cert.credential_url && (
                            <a
                              href={cert.credential_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-700 text-sm flex items-center"
                            >
                              View Credential <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Languages editable */}
              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-slate-900 flex items-center">
                    <Languages className="h-5 w-5 mr-2" />
                    Languages & Proficiency
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditingLanguages(!isEditingLanguages)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditingLanguages ? (
                    <form
                      onSubmit={e => {
                        e.preventDefault()
                        setUser(u => u ? { ...u, languages: languagesDraft } : u)
                        setIsEditingLanguages(false)
                      }}
                      className="space-y-2"
                    >
                      {languagesDraft.map((lang, idx) => (
                        <div key={lang.id} className="flex gap-2 items-center mb-2">
                          <input
                            className="border rounded p-1 flex-1"
                            value={lang.language_name}
                            onChange={e => {
                              const arr = [...languagesDraft]
                              arr[idx] = { ...arr[idx], language_name: e.target.value }
                              setLanguagesDraft(arr)
                            }}
                          />
                          <input
                            className="border rounded p-1 w-32"
                            value={lang.proficiency_level}
                            onChange={e => {
                              const arr = [...languagesDraft]
                              arr[idx] = { ...arr[idx], proficiency_level: e.target.value }
                              setLanguagesDraft(arr)
                            }}
                          />
                          <Button type="button" size="icon" variant="outline" onClick={() => {
                            setLanguagesDraft(languagesDraft.filter((_, i) => i !== idx))
                          }}>🗑️</Button>
                        </div>
                      ))}
                      <Button type="button" size="sm" onClick={() => setLanguagesDraft([...languagesDraft, { id: `lang-${Date.now()}`, language_name: "", proficiency_level: "" }])}>Agregar idioma</Button>
                      <div className="flex gap-2 mt-2">
                        <Button type="submit" size="sm">Guardar</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setIsEditingLanguages(false)}>Cancelar</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.languages.map((language, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-slate-900">{language.language_name}</span>
                          <Badge className={`${getProficiencyColor(language.proficiency_level)}`}>{language.proficiency_level}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Technologies editable */}
              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-slate-900 flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    Technologies
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditingTechnologies(!isEditingTechnologies)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditingTechnologies ? (
                    <form
                      onSubmit={e => {
                        e.preventDefault()
                        setUser(u => u ? { ...u, technologies: technologiesDraft } : u)
                        setIsEditingTechnologies(false)
                      }}
                      className="space-y-2"
                    >
                      {technologiesDraft.map((tech, idx) => (
                        <div key={idx} className="flex gap-2 items-center mb-2">
                          <input
                            className="border rounded p-1 flex-1"
                            value={tech.technologies.name}
                            onChange={e => {
                              const arr = [...technologiesDraft]
                              arr[idx] = { ...arr[idx], technologies: { name: e.target.value } }
                              setTechnologiesDraft(arr)
                            }}
                          />
                          <input
                            className="border rounded p-1 w-32"
                            value={tech.level}
                            onChange={e => {
                              const arr = [...technologiesDraft]
                              arr[idx] = { ...arr[idx], level: e.target.value }
                              setTechnologiesDraft(arr)
                            }}
                          />
                          <Button type="button" size="icon" variant="outline" onClick={() => {
                            setTechnologiesDraft(technologiesDraft.filter((_, i) => i !== idx))
                          }}>🗑️</Button>
                        </div>
                      ))}
                      <Button type="button" size="sm" onClick={() => setTechnologiesDraft([...technologiesDraft, { level: "", technologies: { name: "" } }])}>Agregar tecnología</Button>
                      <div className="flex gap-2 mt-2">
                        <Button type="submit" size="sm">Guardar</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setIsEditingTechnologies(false)}>Cancelar</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.technologies.map((tech, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-slate-900">{tech.technologies.name}</span>
                          <Badge variant="outline" className="border-slate-900 text-slate-900">{tech.level}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills editable */}
              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-slate-900 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Skills
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditingSkills(!isEditingSkills)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditingSkills ? (
                    <form
                      onSubmit={e => {
                        e.preventDefault()
                        setUser(u => u ? { ...u, skills: skillsDraft } : u)
                        setIsEditingSkills(false)
                      }}
                      className="space-y-2"
                    >
                      {skillsDraft.map((skill, idx) => (
                        <div key={skill.id || idx} className="flex gap-2 items-center mb-2">
                          <input
                            className="border rounded p-1 flex-1"
                            value={skill.skill_name}
                            onChange={e => {
                              const arr = [...skillsDraft]
                              arr[idx] = { ...arr[idx], skill_name: e.target.value }
                              setSkillsDraft(arr)
                            }}
                          />
                          <input
                            className="border rounded p-1 w-32"
                            value={skill.level}
                            onChange={e => {
                              const arr = [...skillsDraft]
                              arr[idx] = { ...arr[idx], level: e.target.value }
                              setSkillsDraft(arr)
                            }}
                          />
                          <Button type="button" size="icon" variant="outline" onClick={() => {
                            setSkillsDraft(skillsDraft.filter((_, i) => i !== idx))
                          }}>🗑️</Button>
                        </div>
                      ))}
                      <Button type="button" size="sm" onClick={() => setSkillsDraft([...skillsDraft, { id: `skill-${Date.now()}`, skill_name: "", level: "" }])}>Agregar skill</Button>
                      <div className="flex gap-2 mt-2">
                        <Button type="submit" size="sm">Guardar</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setIsEditingSkills(false)}>Cancelar</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.skills.map((skill, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-slate-900">{skill.skill_name}</span>
                          <Badge variant="outline" className="border-slate-900 text-slate-900">{skill.level}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Education editable */}
              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-slate-900 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Education
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditingEducation(!isEditingEducation)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditingEducation ? (
                    <form
                      onSubmit={e => {
                        e.preventDefault()
                        setUser(u => u ? { ...u, education: educationDraft } : u)
                        setIsEditingEducation(false)
                      }}
                      className="space-y-2"
                    >
                      {educationDraft.map((edu, idx) => (
                        <div key={edu.id || idx} className="flex gap-2 items-center mb-2">
                          <input
                            className="border rounded p-1 flex-1"
                            value={edu.degree_title}
                            onChange={e => {
                              const arr = [...educationDraft]
                              arr[idx] = { ...arr[idx], degree_title: e.target.value }
                              setEducationDraft(arr)
                            }}
                          />
                          <input
                            className="border rounded p-1 flex-1"
                            value={edu.institution_name}
                            onChange={e => {
                              const arr = [...educationDraft]
                              arr[idx] = { ...arr[idx], institution_name: e.target.value }
                              setEducationDraft(arr)
                            }}
                          />
                          <input
                            className="border rounded p-1 w-32"
                            type="date"
                            value={edu.graduation_date.slice(0,10)}
                            onChange={e => {
                              const arr = [...educationDraft]
                              arr[idx] = { ...arr[idx], graduation_date: e.target.value }
                              setEducationDraft(arr)
                            }}
                          />
                          <Button type="button" size="icon" variant="outline" onClick={() => {
                            setEducationDraft(educationDraft.filter((_, i) => i !== idx))
                          }}>🗑️</Button>
                        </div>
                      ))}
                      <Button type="button" size="sm" onClick={() => setEducationDraft([...educationDraft, { id: `edu-${Date.now()}`, degree_title: "", institution_name: "", graduation_date: new Date().toISOString().slice(0,10) }])}>Agregar educación</Button>
                      <div className="flex gap-2 mt-2">
                        <Button type="submit" size="sm">Guardar</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setIsEditingEducation(false)}>Cancelar</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      {user.education.map((edu, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-slate-900">{edu.degree_title}</h3>
                            <p className="text-gray-600">{edu.institution_name}</p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(edu.graduation_date)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!loading && !error && !user && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Employee not found</h3>
              <p className="text-gray-600 mb-4">The requested employee profile could not be found.</p>
              <Link href="/">
                <Button className="bg-red-600 text-white hover:bg-red-700">Back to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>

      <div>
        <img src="/path/to/image.jpg" alt="Description of image" />
        <p>shop</p>
      </div>
    </div>
  )
}
