"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Search, Calendar, Users, Clock, Target, Plus, Filter, ArrowRight, User, Mail, Phone } from 'lucide-react'
import Link from "next/link"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  email: string
  phone?: string
}

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'planning' | 'completed' | 'on-hold'
  priority: 'high' | 'medium' | 'low'
  progress: number
  startDate: string
  endDate: string
  manager: string
  client: string
  teamSize: number
  team: TeamMember[]
}

const mockProjects: Project[] = [
  {
    id: "project-ecommerce-2024",
    name: "E-commerce Platform Redesign",
    description: "Complete redesign and modernization of the client's e-commerce platform using React and Node.js",
    status: "active",
    priority: "high",
    progress: 75,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    manager: "Sarah Johnson",
    client: "TechCorp Solutions",
    teamSize: 5,
    team: [
      {
        id: "sarah-johnson",
        name: "Sarah Johnson",
        role: "Project Manager",
        email: "sarah.johnson@arkus.com",
        phone: "+1 (555) 123-4567"
      },
      {
        id: "mike-chen",
        name: "Mike Chen",
        role: "Frontend Developer",
        email: "mike.chen@arkus.com",
        phone: "+1 (555) 234-5678"
      },
      {
        id: "lisa-rodriguez",
        name: "Lisa Rodriguez",
        role: "Backend Developer",
        email: "lisa.rodriguez@arkus.com",
        phone: "+1 (555) 345-6789"
      },
      {
        id: "emma-wilson",
        name: "Emma Wilson",
        role: "UI/UX Designer",
        email: "emma.wilson@arkus.com",
        phone: "+1 (555) 456-7890"
      },
      {
        id: "david-kim",
        name: "David Kim",
        role: "DevOps Engineer",
        email: "david.kim@arkus.com",
        phone: "+1 (555) 567-8901"
      }
    ]
  },
  {
    id: "project-mobile-2024",
    name: "Mobile App Development",
    description: "Native mobile application for iOS and Android with real-time features",
    status: "active",
    priority: "medium",
    progress: 25,
    startDate: "2024-02-01",
    endDate: "2024-08-15",
    manager: "David Kim",
    client: "StartupXYZ",
    teamSize: 2,
    team: [
      {
        id: "david-kim-mobile",
        name: "David Kim",
        role: "Mobile Developer",
        email: "david.kim@arkus.com",
        phone: "+1 (555) 567-8901"
      },
      {
        id: "emma-wilson-mobile",
        name: "Emma Wilson",
        role: "UI/UX Designer",
        email: "emma.wilson@arkus.com",
        phone: "+1 (555) 456-7890"
      }
    ]
  },
  {
    id: "project-analytics-2024",
    name: "Data Analytics Dashboard",
    description: "Comprehensive analytics dashboard for business intelligence and reporting",
    status: "active",
    priority: "high",
    progress: 60,
    startDate: "2024-01-01",
    endDate: "2024-05-30",
    manager: "Alex Thompson",
    client: "DataCorp Inc",
    teamSize: 3,
    team: [
      {
        id: "alex-thompson",
        name: "Alex Thompson",
        role: "Data Analyst",
        email: "alex.thompson@arkus.com",
        phone: "+1 (555) 678-9012"
      },
      {
        id: "rachel-green",
        name: "Rachel Green",
        role: "Full Stack Developer",
        email: "rachel.green@arkus.com",
        phone: "+1 (555) 789-0123"
      },
      {
        id: "tom-brown",
        name: "Tom Brown",
        role: "DevOps",
        email: "tom.brown@arkus.com",
        phone: "+1 (555) 890-1234"
      }
    ]
  },
  {
    id: "project-crm-2023",
    name: "CRM System Upgrade",
    description: "Legacy CRM system modernization with improved user interface and performance",
    status: "completed",
    priority: "medium",
    progress: 100,
    startDate: "2023-03-01",
    endDate: "2023-11-30",
    manager: "Jennifer Martinez",
    client: "SalesForce Inc",
    teamSize: 4,
    team: [
      {
        id: "jennifer-martinez",
        name: "Jennifer Martinez",
        role: "Project Manager",
        email: "jennifer.martinez@arkus.com",
        phone: "+1 (555) 901-2345"
      },
      {
        id: "carlos-rivera",
        name: "Carlos Rivera",
        role: "Backend Developer",
        email: "carlos.rivera@arkus.com",
        phone: "+1 (555) 012-3456"
      },
      {
        id: "anna-lee",
        name: "Anna Lee",
        role: "Frontend Developer",
        email: "anna.lee@arkus.com",
        phone: "+1 (555) 123-4567"
      },
      {
        id: "mark-davis",
        name: "Mark Davis",
        role: "QA Engineer",
        email: "mark.davis@arkus.com",
        phone: "+1 (555) 234-5678"
      }
    ]
  },
  {
    id: "project-website-2024",
    name: "Corporate Website Redesign",
    description: "Complete redesign of corporate website with modern design and improved SEO",
    status: "planning",
    priority: "low",
    progress: 10,
    startDate: "2024-03-01",
    endDate: "2024-07-15",
    manager: "Lisa Rodriguez",
    client: "Corporate Inc",
    teamSize: 3,
    team: [
      {
        id: "lisa-rodriguez-web",
        name: "Lisa Rodriguez",
        role: "Project Manager",
        email: "lisa.rodriguez@arkus.com",
        phone: "+1 (555) 345-6789"
      },
      {
        id: "james-wilson",
        name: "James Wilson",
        role: "Web Developer",
        email: "james.wilson@arkus.com",
        phone: "+1 (555) 456-7890"
      },
      {
        id: "sophia-garcia",
        name: "Sophia Garcia",
        role: "Content Strategist",
        email: "sophia.garcia@arkus.com",
        phone: "+1 (555) 567-8901"
      }
    ]
  },
  {
    id: "project-api-2024",
    name: "API Integration Platform",
    description: "Microservices architecture for third-party API integrations",
    status: "on-hold",
    priority: "medium",
    progress: 35,
    startDate: "2023-12-01",
    endDate: "2024-04-30",
    manager: "Michael Chen",
    client: "TechFlow Systems",
    teamSize: 2,
    team: [
      {
        id: "michael-chen-api",
        name: "Michael Chen",
        role: "Backend Developer",
        email: "michael.chen@arkus.com",
        phone: "+1 (555) 678-9012"
      },
      {
        id: "nina-patel",
        name: "Nina Patel",
        role: "API Specialist",
        email: "nina.patel@arkus.com",
        phone: "+1 (555) 789-0123"
      }
    ]
  }
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projects] = useState<Project[]>(mockProjects)

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeProjects = projects.filter(p => p.status === 'active')
  const totalProjects = projects.length
  const completedProjects = projects.filter(p => p.status === 'completed').length

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
                <p className="text-sm text-gray-300">Projects Directory</p>
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
              {/* <Link href="/org-chart" className="text-gray-300 hover:text-white transition-colors"> */}
              <Link href="/org-chart" className="hidden">
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Projects</h2>
                <p className="text-gray-600 mt-1">Manage and track all company projects</p>
              </div>
              <Button className="bg-red-600 text-white hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Projects</p>
                      <p className="text-2xl font-bold text-slate-900">{totalProjects}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Projects</p>
                      <p className="text-2xl font-bold text-slate-900">{activeProjects.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-slate-900">{completedProjects}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link href={`/projects/${project.id}`}>
                          <CardTitle className="text-lg hover:text-red-600 transition-colors cursor-pointer">
                            {project.name}
                          </CardTitle>
                        </Link>
                        <CardDescription className="mt-1">
                          {project.description}
                        </CardDescription>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Status and Priority */}
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
                        </Badge>
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-slate-900 font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      {/* Project Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Manager</p>
                          <p className="font-medium text-slate-900">{project.manager}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Client</p>
                          <p className="font-medium text-slate-900">{project.client}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Start Date</p>
                          <p className="font-medium text-slate-900">{formatDate(project.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">End Date</p>
                          <p className="font-medium text-slate-900">{formatDate(project.endDate)}</p>
                        </div>
                      </div>

                      {/* Team Members */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-gray-600">Team ({project.teamSize} members)</p>
                          <Link href={`/projects/${project.id}`}>
                            <Button size="sm" variant="outline" className="text-xs">
                              View Team
                            </Button>
                          </Link>
                        </div>
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 4).map((member, index) => (
                            <Avatar key={index} className="h-8 w-8 border-2 border-white">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback className="bg-red-600 text-white text-xs">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {project.team.length > 4 && (
                            <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{project.team.length - 4}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Active Projects Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-8">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-slate-900 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Active Company Projects
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {activeProjects.length} Active
                    </Badge>
                  </div>
                  <CardDescription>
                    Current projects and team assignments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeProjects.map((project) => (
                    <div key={project.id} className="border-l-2 border-red-600 pl-4">
                      <Link href={`/projects/${project.id}`}>
                        <h3 className="font-semibold text-slate-900 hover:text-red-600 transition-colors cursor-pointer mb-1">
                          {project.name}
                        </h3>
                      </Link>
                      <div className="flex justify-between items-center mb-2">
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {project.progress}% Complete
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {project.team.length} members
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-1 mb-3" />
                      
                      {/* Team Members */}
                      <div className="space-y-2">
                        {project.team.slice(0, 3).map((member, index) => (
                          <div key={index} className="flex items-center text-xs">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback className="bg-red-600 text-white text-xs">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate">{member.name}</p>
                              <p className="text-gray-500 truncate">{member.role}</p>
                            </div>
                          </div>
                        ))}
                        {project.team.length > 3 && (
                          <div className="text-xs text-gray-500 pl-8">
                            +{project.team.length - 3} more team members
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Due: {formatDate(project.endDate)}</span>
                          <Link href={`/projects/${project.id}`} className="text-red-600 hover:text-red-700">
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="text-center text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Total Team Members:</span>
                      <span className="font-medium">{activeProjects.reduce((acc, p) => acc + p.teamSize, 0)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
