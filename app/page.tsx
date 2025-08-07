"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { User, Search, Users, Building2, MapPin, Mail, Star, Clock, TrendingUp, Filter, Plus, Download, Settings } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

interface Employee {
  id: string
  name: string
  email: string
  role: string
  position: string
  location: string
  status: string
  level: string
  employee_score: number
  project_allocation_percentage: number
  current_project: string
  avatar?: string
}

// Mock employee data
const mockEmployees: Employee[] = [
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
    project_allocation_percentage: 80,
    current_project: "E-Commerce Platform Redesign"
  },
  {
    id: "employee-2",
    name: "Michael Chen",
    email: "michael.chen@arkus.com",
    role: "pm",
    position: "Engineering Manager",
    location: "San Francisco, CA",
    status: "busy",
    level: "Lead",
    employee_score: 88,
    project_allocation_percentage: 95,
    current_project: "Banking Dashboard Modernization"
  },
  {
    id: "employee-3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@arkus.com",
    role: "employee",
    position: "UX Designer",
    location: "New York, NY",
    status: "available",
    level: "Mid",
    employee_score: 85,
    project_allocation_percentage: 60,
    current_project: "Healthcare Management System"
  },
  {
    id: "employee-4",
    name: "David Kim",
    email: "david.kim@arkus.com",
    role: "employee",
    position: "Backend Developer",
    location: "Seattle, WA",
    status: "available",
    level: "Senior",
    employee_score: 90,
    project_allocation_percentage: 75,
    current_project: "API Gateway Optimization"
  },
  {
    id: "employee-5",
    name: "Lisa Thompson",
    email: "lisa.thompson@arkus.com",
    role: "hr",
    position: "HR Business Partner",
    location: "Chicago, IL",
    status: "available",
    level: "Senior",
    employee_score: 87,
    project_allocation_percentage: 40,
    current_project: "Talent Acquisition Platform"
  },
  {
    id: "employee-6",
    name: "James Wilson",
    email: "james.wilson@arkus.com",
    role: "employee",
    position: "DevOps Engineer",
    location: "Denver, CO",
    status: "busy",
    level: "Mid",
    employee_score: 83,
    project_allocation_percentage: 90,
    current_project: "Infrastructure Modernization"
  }
]

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setEmployees(mockEmployees)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    totalEmployees: employees.length,
    availableEmployees: employees.filter(e => e.status === "available").length,
    averageScore: employees.length > 0 ? Math.round(employees.reduce((sum, e) => sum + e.employee_score, 0) / employees.length) : 0,
    averageAllocation: employees.length > 0 ? Math.round(employees.reduce((sum, e) => sum + e.project_allocation_percentage, 0) / employees.length) : 0
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
                <p className="text-sm text-gray-300">Employee Management Dashboard</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-white font-medium">
                Dashboard
              </Link>
              <Link href="/my-profile" className="text-gray-300 hover:text-white transition-colors">
                My Profile
              </Link>
              <Link href="/projects" className="text-gray-300 hover:text-white transition-colors">
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.availableEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.averageScore}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Allocation</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.averageAllocation}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-red-600 text-white hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Employee Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <Link key={employee.id} href={`/profile/${employee.id}`}>
                <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.avatar || `/placeholder.svg?height=48&width=48&text=${getInitials(employee.name)}`} alt={employee.name} />
                        <AvatarFallback className="bg-red-600 text-white">
                          {getInitials(employee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 truncate">{employee.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{employee.position}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{getRoleDisplayName(employee.role)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{employee.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusBadgeColor(employee.status)} text-xs`}>
                          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {employee.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getScoreBadgeColor(employee.employee_score)} text-xs`}>
                          {employee.employee_score}/100
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Project Allocation</span>
                        <span>{employee.project_allocation_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${employee.project_allocation_percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{employee.current_project}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredEmployees.length === 0 && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or add new employees.</p>
              <Button className="bg-red-600 text-white hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
