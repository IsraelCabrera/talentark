"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Grid3X3,
  List,
  MapPin,
  Building2,
  Users,
  TrendingUp,
  Award,
  Mail,
  ExternalLink,
  Settings,
  LogOut,
  User,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { getCurrentUser, getDemoUsers, signOut, getRolePermissions, type User as AuthUser } from "@/lib/auth"

export default function DirectoryPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [employees, setEmployees] = useState<AuthUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterExperience, setFilterExperience] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push("/")
          return
        }
        setCurrentUser(user)
        setEmployees(getDemoUsers())
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment

    const matchesExperience = (() => {
      if (filterExperience === "all") return true
      const experience = employee.years_of_experience || 0
      switch (filterExperience) {
        case "junior":
          return experience <= 2
        case "mid":
          return experience >= 3 && experience <= 5
        case "senior":
          return experience >= 6 && experience <= 10
        case "expert":
          return experience > 10
        default:
          return true
      }
    })()

    return matchesSearch && matchesDepartment && matchesExperience
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_user":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "hr":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "manager":
        return "bg-green-100 text-green-800 border-green-200"
      case "collaborator":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  const departments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))]

  const stats = {
    totalEmployees: employees.length,
    departments: departments.length,
    averageScore: Math.round(employees.reduce((sum, emp) => sum + emp.employee_score, 0) / employees.length),
    topPerformers: employees.filter((emp) => emp.employee_score >= 90).length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading directory...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  const permissions = getRolePermissions(currentUser.role)

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
                <h1 className="text-2xl font-bold text-white">TalentArk</h1>
                <p className="text-sm text-gray-300">Employee Directory</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                <BarChart3 className="h-5 w-5 inline mr-1" />
                Dashboard
              </Link>
              <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">
                Analytics
              </Link>
              <Link href="/org-chart" className="text-gray-300 hover:text-white transition-colors">
                Org Chart
              </Link>
              {(permissions.canViewAllProfiles || permissions.canManageSystem) && (
                <Link href="/admin/users" className="text-gray-300 hover:text-white transition-colors">
                  <Settings className="h-5 w-5 inline mr-1" />
                  Admin
                </Link>
              )}
              <Link href="/my-profile" className="text-gray-300 hover:text-white transition-colors">
                <User className="h-5 w-5 inline mr-1" />
                My Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-300 hover:text-white transition-colors flex items-center"
              >
                <LogOut className="h-5 w-5 inline mr-1" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {currentUser.name}!</h2>
          <p className="text-gray-600">
            Explore our team directory and connect with colleagues across the organization.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.departments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.averageScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Top Performers</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.topPerformers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-gray-200 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search employees by name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-600 focus:ring-red-600"
                />
              </div>
              <div className="flex gap-4 items-center">
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-[150px] border-gray-300 focus:border-red-600 focus:ring-red-600">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterExperience} onValueChange={setFilterExperience}>
                  <SelectTrigger className="w-[150px] border-gray-300 focus:border-red-600 focus:ring-red-600">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (6-10 years)</SelectItem>
                    <SelectItem value="expert">Expert (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border border-gray-300 rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-red-600 text-white" : ""}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-red-600 text-white" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Directory */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Employee Directory ({filteredEmployees.length})</span>
              <Badge variant="outline" className="border-red-600 text-red-600">
                {viewMode === "grid" ? "Grid View" : "List View"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => (
                  <Card key={employee.id} className="border-gray-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              employee.profile_image ||
                              `/placeholder.svg?height=48&width=48&text=${getInitials(employee.name)}`
                            }
                            alt={employee.name}
                          />
                          <AvatarFallback className="bg-red-600 text-white">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900 truncate">{employee.name}</h3>
                          <p className="text-sm text-gray-600 truncate">{employee.position}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{employee.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{employee.department}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <Badge className={`${getRoleBadgeColor(employee.role)} text-xs`} variant="outline">
                          {employee.role.replace("_", " ").toUpperCase()}
                        </Badge>
                        <div className="flex gap-1">
                          <Badge className={`${getScoreBadgeColor(employee.employee_score)} text-xs`}>
                            E: {employee.employee_score}
                          </Badge>
                          <Badge className={`${getScoreBadgeColor(employee.company_score * 10)} text-xs`}>
                            C: {employee.company_score}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Project Allocation</span>
                          <span>{employee.project_allocation_percentage || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${employee.project_allocation_percentage || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      <Link href={`/profile/${employee.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEmployees.map((employee) => (
                  <Card key={employee.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                employee.profile_image ||
                                `/placeholder.svg?height=40&width=40&text=${getInitials(employee.name)}`
                              }
                              alt={employee.name}
                            />
                            <AvatarFallback className="bg-red-600 text-white">
                              {getInitials(employee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-slate-900">{employee.name}</h3>
                            <p className="text-sm text-gray-600">{employee.position}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{employee.department}</p>
                            <p className="text-xs text-gray-500">{employee.location}</p>
                          </div>
                          <div className="flex gap-1">
                            <Badge className={`${getScoreBadgeColor(employee.employee_score)} text-xs`}>
                              E: {employee.employee_score}
                            </Badge>
                            <Badge className={`${getScoreBadgeColor(employee.company_score * 10)} text-xs`}>
                              C: {employee.company_score}
                            </Badge>
                          </div>
                          <Link href={`/profile/${employee.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
