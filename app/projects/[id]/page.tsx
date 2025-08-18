"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { User, Mail, MapPin, Building2, Calendar, Globe, AlertTriangle, RefreshCw, ArrowLeft, Settings, CheckCircle, Award, Code, GraduationCap, Languages, Briefcase, Users, Star, Target, TrendingUp, ExternalLink, Clock, History, ChevronRight, UserCheck, Phone, Plus, Edit } from 'lucide-react'
import Link from "next/link"

interface TeamMember {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  position: string
  location?: string
  avatar?: string
  allocation: number
  score: number
  status: 'available' | 'busy' | 'away'
  skills: string[]
  joinDate: string
}

interface ProjectMilestone {
  id: string
  title: string
  dueDate: string
  completed: boolean
  description: string
}

interface ProjectDetails {
  id: string
  name: string
  description: string
  status: 'active' | 'planning' | 'completed' | 'on-hold'
  priority: 'high' | 'medium' | 'low'
  progress: number
  startDate: string
  endDate: string
  manager: TeamMember
  client: string
  tags: string[]
  team: TeamMember[]
  milestones: ProjectMilestone[]
}

// Mock project data
const mockProjectData: { [key: string]: ProjectDetails } = {
  "project-ecommerce-2024": {
    id: "project-ecommerce-2024",
    name: "E-commerce Platform Redesign",
    description: "Complete redesign and modernization of the client's e-commerce platform using React and Node.js. This project involves creating a scalable, user-friendly interface with improved performance and modern design patterns.",
    status: "active",
    priority: "high",
    progress: 75,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    client: "TechCorp Solutions",
    tags: ["React", "Node.js", "E-commerce", "UI/UX", "Performance"],
    manager: {
      id: "sarah-johnson",
      name: "Sarah Johnson",
      email: "sarah.johnson@arkus.com",
      phone: "+1 (555) 123-4567",
      role: "Project Manager",
      position: "Senior Project Manager",
      location: "Austin, TX",
      allocation: 60,
      score: 92,
      status: "available",
      skills: ["Project Management", "Agile", "Scrum", "Team Leadership"],
      joinDate: "2024-01-15"
    },
    team: [
      {
        id: "sarah-johnson",
        name: "Sarah Johnson",
        email: "sarah.johnson@arkus.com",
        phone: "+1 (555) 123-4567",
        role: "Project Manager",
        position: "Senior Project Manager",
        location: "Austin, TX",
        allocation: 60,
        score: 92,
        status: "available",
        skills: ["Project Management", "Agile", "Scrum", "Team Leadership"],
        joinDate: "2024-01-15"
      },
      {
        id: "mike-chen",
        name: "Mike Chen",
        email: "mike.chen@arkus.com",
        phone: "+1 (555) 234-5678",
        role: "Frontend Developer",
        position: "Senior Frontend Developer",
        location: "San Francisco, CA",
        allocation: 80,
        score: 88,
        status: "busy",
        skills: ["React", "TypeScript", "CSS", "JavaScript", "Redux"],
        joinDate: "2024-01-15"
      },
      {
        id: "lisa-rodriguez",
        name: "Lisa Rodriguez",
        email: "lisa.rodriguez@arkus.com",
        phone: "+1 (555) 345-6789",
        role: "Backend Developer",
        position: "Senior Backend Developer",
        location: "Denver, CO",
        allocation: 75,
        score: 90,
        status: "available",
        skills: ["Node.js", "Express", "MongoDB", "API Design", "Microservices"],
        joinDate: "2024-01-15"
      },
      {
        id: "emma-wilson",
        name: "Emma Wilson",
        email: "emma.wilson@arkus.com",
        phone: "+1 (555) 456-7890",
        role: "UI/UX Designer",
        position: "Senior UI/UX Designer",
        location: "Seattle, WA",
        allocation: 70,
        score: 94,
        status: "available",
        skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
        joinDate: "2024-01-20"
      },
      {
        id: "david-kim",
        name: "David Kim",
        email: "david.kim@arkus.com",
        phone: "+1 (555) 567-8901",
        role: "DevOps Engineer",
        position: "Senior DevOps Engineer",
        location: "Portland, OR",
        allocation: 50,
        score: 86,
        status: "away",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
        joinDate: "2024-02-01"
      }
    ],
    milestones: [
      {
        id: "milestone-1",
        title: "Project Setup & Planning",
        dueDate: "2024-02-01",
        completed: true,
        description: "Initial project setup, requirements gathering, and team onboarding"
      },
      {
        id: "milestone-2",
        title: "UI/UX Design Phase",
        dueDate: "2024-03-15",
        completed: true,
        description: "Complete design mockups and user experience flows"
      },
      {
        id: "milestone-3",
        title: "Frontend Development",
        dueDate: "2024-05-01",
        completed: false,
        description: "Implement React components and user interface"
      },
      {
        id: "milestone-4",
        title: "Backend API Development",
        dueDate: "2024-05-15",
        completed: false,
        description: "Build REST APIs and database integration"
      },
      {
        id: "milestone-5",
        title: "Testing & Deployment",
        dueDate: "2024-06-30",
        completed: false,
        description: "Quality assurance testing and production deployment"
      }
    ]
  },
  "project-mobile-2024": {
    id: "project-mobile-2024",
    name: "Mobile App Development",
    description: "Native mobile application for iOS and Android with real-time features and offline capabilities.",
    status: "active",
    priority: "medium",
    progress: 25,
    startDate: "2024-02-01",
    endDate: "2024-08-15",
    client: "StartupXYZ",
    tags: ["React Native", "Mobile", "iOS", "Android", "Real-time"],
    manager: {
      id: "david-kim-mobile",
      name: "David Kim",
      email: "david.kim@arkus.com",
      phone: "+1 (555) 567-8901",
      role: "Mobile Developer",
      position: "Senior Mobile Developer",
      location: "Portland, OR",
      allocation: 90,
      score: 86,
      status: "busy",
      skills: ["React Native", "iOS", "Android", "JavaScript", "Mobile UI"],
      joinDate: "2024-02-01"
    },
    team: [
      {
        id: "david-kim-mobile",
        name: "David Kim",
        email: "david.kim@arkus.com",
        phone: "+1 (555) 567-8901",
        role: "Mobile Developer",
        position: "Senior Mobile Developer",
        location: "Portland, OR",
        allocation: 90,
        score: 86,
        status: "busy",
        skills: ["React Native", "iOS", "Android", "JavaScript", "Mobile UI"],
        joinDate: "2024-02-01"
      },
      {
        id: "emma-wilson-mobile",
        name: "Emma Wilson",
        email: "emma.wilson@arkus.com",
        phone: "+1 (555) 456-7890",
        role: "UI/UX Designer",
        position: "Senior UI/UX Designer",
        location: "Seattle, WA",
        allocation: 60,
        score: 94,
        status: "available",
        skills: ["Mobile Design", "Figma", "User Research", "Prototyping", "iOS Guidelines"],
        joinDate: "2024-02-01"
      }
    ],
    milestones: [
      {
        id: "milestone-mobile-1",
        title: "App Architecture Planning",
        dueDate: "2024-02-15",
        completed: true,
        description: "Define app architecture and technology stack"
      },
      {
        id: "milestone-mobile-2",
        title: "UI/UX Design",
        dueDate: "2024-03-30",
        completed: false,
        description: "Complete mobile app design and user flows"
      },
      {
        id: "milestone-mobile-3",
        title: "Core Features Development",
        dueDate: "2024-06-15",
        completed: false,
        description: "Implement core app functionality"
      },
      {
        id: "milestone-mobile-4",
        title: "Testing & App Store Submission",
        dueDate: "2024-08-15",
        completed: false,
        description: "Testing, optimization, and app store submission"
      }
    ]
  }
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const projectData = mockProjectData[params.id]
      setProject(projectData || null)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800"
      case 'planning':
        return "bg-blue-100 text-blue-800"
      case 'completed':
        return "bg-gray-100 text-gray-800"
      case 'on-hold':
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return "bg-red-100 text-red-800"
      case 'medium':
        return "bg-yellow-100 text-yellow-800"
      case 'low':
        return "bg-green-100 text-green-800"
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'available':
        return "bg-green-100 text-green-800"
      case 'busy':
        return "bg-red-100 text-red-800"
      case 'away':
        return "bg-yellow-100 text-yellow-800"
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

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
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
                  <p className="text-sm text-gray-300">Project Details</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading project details...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (!project) {
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
                  <p className="text-sm text-gray-300">Project Not Found</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Project not found</h3>
              <p className="text-gray-600 mb-4">The requested project could not be found.</p>
              <Link href="/projects">
                <Button className="bg-red-600 text-white hover:bg-red-700">Back to Projects</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const completedMilestones = project.milestones.filter(m => m.completed).length
  const averageAllocation = Math.round(project.team.reduce((acc, member) => acc + member.allocation, 0) / project.team.length)

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
                <p className="text-sm text-gray-300">Project Details</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/projects" className="text-white font-medium">
                Projects
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
          <Link href="/projects">
            <Button
              variant="outline"
              className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Project Header */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-slate-900 mb-2">{project.name}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </div>
                  <Button className="bg-red-600 text-white hover:bg-red-700 ml-4">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Priority</p>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Progress</p>
                    <p className="text-lg font-semibold text-slate-900">{project.progress}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Team Size</p>
                    <p className="text-lg font-semibold text-slate-900">{project.team.length} members</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Start Date</p>
                    <p className="font-medium text-slate-900">{formatDate(project.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">End Date</p>
                    <p className="font-medium text-slate-900">{formatDate(project.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Client</p>
                    <p className="font-medium text-slate-900">{project.client}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Project Manager</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={project.manager.avatar || "/placeholder.svg"} alt={project.manager.name} />
                      <AvatarFallback className="bg-red-600 text-white">
                        {getInitials(project.manager.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/profile/${project.manager.id}`}>
                        <p className="font-medium text-slate-900 hover:text-red-600 transition-colors cursor-pointer">
                          {project.manager.name}
                        </p>
                      </Link>
                      <p className="text-sm text-gray-600">{project.manager.position}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Technologies & Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-slate-900 text-slate-900">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Overall Progress</p>
                  <Progress value={project.progress} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-slate-900 flex items-center">
                    <Users className="h-6 w-6 mr-2" />
                    Team Members ({project.team.length})
                  </CardTitle>
                  <Button size="sm" className="bg-red-600 text-white hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
                <CardDescription>
                  Project team members and their current assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.team.map((member, index) => (
                    <Card key={index} className="border border-gray-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback className="bg-red-600 text-white">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-slate-900">{member.name}</h3>
                              <p className="text-sm text-gray-600">{member.position}</p>
                              <p className="text-xs text-gray-500">{member.role}</p>
                            </div>
                          </div>
                          <Badge className={getStatusBadgeColor(member.status)}>
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            <a href={`mailto:${member.email}`} className="text-gray-600 hover:text-red-600 transition-colors">
                              {member.email}
                            </a>
                          </div>
                          {member.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              <a href={`tel:${member.phone}`} className="text-gray-600 hover:text-red-600 transition-colors">
                                {member.phone}
                              </a>
                            </div>
                          )}
                          {member.location && (
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-gray-600">{member.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Project Allocation</span>
                            <span className="font-medium text-slate-900">{member.allocation}%</span>
                          </div>
                          <Progress value={member.allocation} className="h-2" />
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Performance Score</span>
                            <Badge className={getScoreBadgeColor(member.score)}>
                              {member.score >= 90
                                ? "Excellent"
                                : member.score >= 80
                                ? "Good"
                                : member.score >= 70
                                ? "Average"
                                : "Needs Improvement"}
                            </Badge>
                          </div>
                          <p className="text-lg font-semibold text-slate-900">{member.score}/100</p>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Key Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {member.skills.slice(0, 3).map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {member.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                          <span>Joined: {formatDateShort(member.joinDate)}</span>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/profile/${member.id}`} className="flex-1">
                            <Button size="sm" variant="outline" className="w-full">
                              <User className="h-4 w-4 mr-1" />
                              View Profile
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Project Stats */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">Project Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Milestones Completed</span>
                    <span className="font-medium text-slate-900">{completedMilestones}/{project.milestones.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Allocation</span>
                    <span className="font-medium text-slate-900">{averageAllocation}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Days Remaining</span>
                    <span className="font-medium text-slate-900">
                      {Math.max(0, Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Project Milestones */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                          milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {milestone.completed && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-medium ${
                            milestone.completed ? 'text-slate-900' : 'text-gray-600'
                          }`}>
                            {milestone.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Due: {formatDateShort(milestone.dueDate)}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
