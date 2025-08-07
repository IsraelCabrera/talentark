"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { User, Mail, MapPin, Building2, Calendar, ArrowLeft, Users, Star, Clock, Target, Phone, ExternalLink } from 'lucide-react'
import Link from "next/link"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  position: string
  location: string
  status: string
  level: string
  employee_score: number
  allocation_percentage: number
  join_date: string
  phone?: string
  avatar?: string
}

interface ProjectDetails {
  id: string
  project_name: string
  client_name: string
  description: string
  start_date: string
  end_date: string | null
  status: string
  team_size: number
  budget?: string
  project_manager: string
}

// Mock project data
const mockProjectData: ProjectDetails = {
  id: "project-ecommerce-2024",
  project_name: "E-Commerce Platform Redesign",
  client_name: "TechCorp Solutions",
  description: "Complete redesign and modernization of the client's e-commerce platform using React and Node.js. This project involves creating a scalable, user-friendly interface with improved performance and modern design patterns.",
  start_date: "2024-01-15",
  end_date: null,
  status: "active",
  team_size: 6,
  budget: "$450,000",
  project_manager: "Michael Chen"
}

// Mock team data
const mockTeamData: TeamMember[] = [
  {
    id: "dca37910-61d0-474f-a7b5-6323aad275fa",
    name: "Sarah Johnson",
    email: "sarah.johnson@arkus.com",
    role: "employee",
    position: "Senior Frontend Developer",
    location: "Austin, TX",
    status: "available",
    level: "Senior",
    employee_score: 92,
    allocation_percentage: 80,
    join_date: "2024-01-15",
    phone: "+1 (555) 123-4567"
  },
  {
    id: "team-member-2",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@arkus.com",
    role: "employee",
    position: "Backend Developer",
    location: "San Francisco, CA",
    status: "busy",
    level: "Senior",
    employee_score: 88,
    allocation_percentage: 90,
    join_date: "2024-01-15",
    phone: "+1 (555) 234-5678"
  },
  {
    id: "team-member-3",
    name: "Emily Chen",
    email: "emily.chen@arkus.com",
    role: "employee",
    position: "UX/UI Designer",
    location: "New York, NY",
    status: "available",
    level: "Mid",
    employee_score: 85,
    allocation_percentage: 70,
    join_date: "2024-01-20",
    phone: "+1 (555) 345-6789"
  },
  {
    id: "team-member-4",
    name: "David Kim",
    email: "david.kim@arkus.com",
    role: "employee",
    position: "DevOps Engineer",
    location: "Seattle, WA",
    status: "available",
    level: "Senior",
    employee_score: 90,
    allocation_percentage: 75,
    join_date: "2024-01-18",
    phone: "+1 (555) 456-7890"
  },
  {
    id: "team-member-5",
    name: "Lisa Thompson",
    email: "lisa.thompson@arkus.com",
    role: "employee",
    position: "QA Engineer",
    location: "Chicago, IL",
    status: "available",
    level: "Mid",
    employee_score: 87,
    allocation_percentage: 60,
    join_date: "2024-01-22",
    phone: "+1 (555) 567-8901"
  },
  {
    id: "team-member-6",
    name: "Michael Chen",
    email: "michael.chen@arkus.com",
    role: "pm",
    position: "Project Manager",
    location: "San Francisco, CA",
    status: "busy",
    level: "Lead",
    employee_score: 94,
    allocation_percentage: 95,
    join_date: "2024-01-15",
    phone: "+1 (555) 678-9012"
  }
]

export default function ProjectTeamPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setProject(mockProjectData)
      setTeamMembers(mockTeamData)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

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

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800"
    if (score >= 80) return "bg-blue-100 text-blue-800"
    if (score >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const averageAllocation = teamMembers.length > 0 
    ? Math.round(teamMembers.reduce((sum, member) => sum + member.allocation_percentage, 0) / teamMembers.length)
    : 0

  const averageScore = teamMembers.length > 0
    ? Math.round(teamMembers.reduce((sum, member) => sum + member.employee_score, 0) / teamMembers.length)
    : 0

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
                <p className="text-sm text-gray-300">Project Team</p>
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
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Project Overview */}
            {project && (
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-slate-900 flex items-center">
                        <Target className="h-6 w-6 mr-3" />
                        {project.project_name}
                      </CardTitle>
                      <CardDescription className="text-lg mt-2">
                        {project.client_name}
                      </CardDescription>
                    </div>
                    <Badge className={`${getProjectStatusColor(project.status)} text-sm px-3 py-1`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{project.team_size}</div>
                      <div className="text-sm text-gray-600">Team Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{averageAllocation}%</div>
                      <div className="text-sm text-gray-600">Avg Allocation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{averageScore}/100</div>
                      <div className="text-sm text-gray-600">Avg Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">
                        {project.end_date ? 'Fixed' : 'Ongoing'}
                      </div>
                      <div className="text-sm text-gray-600">Timeline</div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">
                          Started: {formatDate(project.start_date)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">
                          PM: {project.project_manager}
                        </span>
                      </div>
                      {project.budget && (
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">
                            Budget: {project.budget}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team Members Grid */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Members ({teamMembers.length})
                </CardTitle>
                <CardDescription>
                  All team members assigned to this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member) => (
                    <Link key={member.id} href={`/profile/${member.id}`}>
                      <Card className="bg-gray-50 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage 
                                src={member.avatar || `/placeholder.svg?height=48&width=48&text=${getInitials(member.name)}`} 
                                alt={member.name} 
                              />
                              <AvatarFallback className="bg-red-600 text-white">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-slate-900 truncate">{member.name}</h3>
                              <p className="text-sm text-gray-600 truncate">{member.position}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{member.email}</span>
                            </div>
                            {member.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>{member.location}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>Joined: {formatDate(member.join_date)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <Badge className={`${getStatusBadgeColor(member.status)} text-xs`}>
                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {member.level}
                              </Badge>
                            </div>
                            <Badge className={`${getScoreBadgeColor(member.employee_score)} text-xs`}>
                              {member.employee_score}/100
                            </Badge>
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-600 mb-2">
                              <span>Project Allocation</span>
                              <span>{member.allocation_percentage}%</span>
                            </div>
                            <Progress value={member.allocation_percentage} className="h-2" />
                          </div>

                          <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            <span>Click to view full profile</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
