"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  TrendingUp,
  Award,
  MapPin,
  Building2,
  Calendar,
  Download,
  RefreshCw,
  ArrowLeft,
  LogOut,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Briefcase,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { getCurrentUser, getDemoUsers, signOut, getRolePermissions, type User } from "@/lib/auth"

interface AnalyticsData {
  totalEmployees: number
  averageEmployeeScore: number
  averageCompanyScore: number
  totalDepartments: number
  totalLocations: number
  averageExperience: number
  totalCertifications: number
  recentHires: number
  performanceDistribution: {
    excellent: number
    good: number
    average: number
    needsImprovement: number
  }
  departmentDistribution: Array<{ name: string; count: number; percentage: number }>
  locationDistribution: Array<{ name: string; count: number; percentage: number }>
  experienceDistribution: Array<{ level: string; count: number; percentage: number }>
  roleDistribution: Array<{ role: string; count: number; percentage: number }>
  topTechnologies: Array<{ name: string; count: number; percentage: number }>
  monthlyHiring: Array<{ month: string; hires: number }>
  allocationStats: {
    fullyAllocated: number
    partiallyAllocated: number
    unallocated: number
  }
}

export default function AnalyticsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  const processAnalyticsData = (users: User[]): AnalyticsData => {
    const totalEmployees = users.length
    const averageEmployeeScore = Math.round(users.reduce((sum, user) => sum + user.employee_score, 0) / totalEmployees)
    const averageCompanyScore = Math.round(users.reduce((sum, user) => sum + user.company_score, 0) / totalEmployees)

    // Department distribution
    const departmentCounts = users.reduce(
      (acc, user) => {
        const dept = user.department || "Unassigned"
        acc[dept] = (acc[dept] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const departmentDistribution = Object.entries(departmentCounts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalEmployees) * 100),
    }))

    // Location distribution
    const locationCounts = users.reduce(
      (acc, user) => {
        const location = user.location.split(",")[1]?.trim() || user.location
        acc[location] = (acc[location] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const locationDistribution = Object.entries(locationCounts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalEmployees) * 100),
    }))

    // Experience distribution
    const experienceDistribution = [
      {
        level: "Junior (0-2 years)",
        count: users.filter((u) => (u.years_of_experience || 0) <= 2).length,
        percentage: 0,
      },
      {
        level: "Mid (3-5 years)",
        count: users.filter((u) => (u.years_of_experience || 0) >= 3 && (u.years_of_experience || 0) <= 5).length,
        percentage: 0,
      },
      {
        level: "Senior (6-10 years)",
        count: users.filter((u) => (u.years_of_experience || 0) >= 6 && (u.years_of_experience || 0) <= 10).length,
        percentage: 0,
      },
      {
        level: "Expert (10+ years)",
        count: users.filter((u) => (u.years_of_experience || 0) > 10).length,
        percentage: 0,
      },
    ].map((item) => ({
      ...item,
      percentage: Math.round((item.count / totalEmployees) * 100),
    }))

    // Role distribution
    const roleCounts = users.reduce(
      (acc, user) => {
        const role = user.role.replace("_", " ").toUpperCase()
        acc[role] = (acc[role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const roleDistribution = Object.entries(roleCounts).map(([role, count]) => ({
      role,
      count,
      percentage: Math.round((count / totalEmployees) * 100),
    }))

    // Performance distribution
    const performanceDistribution = {
      excellent: users.filter((u) => u.employee_score >= 90).length,
      good: users.filter((u) => u.employee_score >= 80 && u.employee_score < 90).length,
      average: users.filter((u) => u.employee_score >= 70 && u.employee_score < 80).length,
      needsImprovement: users.filter((u) => u.employee_score < 70).length,
    }

    // Top technologies
    const techCounts = users.reduce(
      (acc, user) => {
        ;(user.technologies || []).forEach((tech) => {
          acc[tech] = (acc[tech] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    const topTechnologies = Object.entries(techCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalEmployees) * 100),
      }))

    // Monthly hiring (simulated data based on hire dates)
    const monthlyHiring = [
      { month: "Jan", hires: 2 },
      { month: "Feb", hires: 1 },
      { month: "Mar", hires: 3 },
      { month: "Apr", hires: 2 },
      { month: "May", hires: 1 },
      { month: "Jun", hires: 4 },
      { month: "Jul", hires: 2 },
      { month: "Aug", hires: 1 },
      { month: "Sep", hires: 3 },
      { month: "Oct", hires: 2 },
      { month: "Nov", hires: 1 },
      { month: "Dec", hires: 2 },
    ]

    // Allocation stats
    const allocationStats = {
      fullyAllocated: users.filter((u) => (u.project_allocation_percentage || 0) >= 90).length,
      partiallyAllocated: users.filter(
        (u) => (u.project_allocation_percentage || 0) > 0 && (u.project_allocation_percentage || 0) < 90,
      ).length,
      unallocated: users.filter((u) => (u.project_allocation_percentage || 0) === 0).length,
    }

    return {
      totalEmployees,
      averageEmployeeScore,
      averageCompanyScore,
      totalDepartments: Object.keys(departmentCounts).length,
      totalLocations: Object.keys(locationCounts).length,
      averageExperience: Math.round(
        users.reduce((sum, user) => sum + (user.years_of_experience || 0), 0) / totalEmployees,
      ),
      totalCertifications: users.reduce((sum, user) => sum + (user.certifications?.length || 0), 0),
      recentHires: users.filter((u) => {
        if (!u.hire_date) return false
        const hireDate = new Date(u.hire_date)
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
        return hireDate >= threeMonthsAgo
      }).length,
      performanceDistribution,
      departmentDistribution,
      locationDistribution,
      experienceDistribution,
      roleDistribution,
      topTechnologies,
      monthlyHiring,
      allocationStats,
    }
  }

  const loadAnalyticsData = async () => {
    try {
      setError(null)
      const users = getDemoUsers()
      const data = processAnalyticsData(users)
      setAnalyticsData(data)
    } catch (err) {
      console.error("Error loading analytics data:", err)
      setError("Failed to load analytics data. Please try again.")
    }
  }

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push("/")
          return
        }

        const permissions = getRolePermissions(user.role)
        if (!permissions.canViewAllProfiles) {
          router.push("/unauthorized")
          return
        }

        setCurrentUser(user)
        await loadAnalyticsData()
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [router])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAnalyticsData()
    setRefreshing(false)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const exportData = () => {
    if (!analyticsData) return

    const dataStr = JSON.stringify(analyticsData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `talentark-analytics-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentUser || !analyticsData) {
    return null
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
                <h1 className="text-2xl font-bold text-white">TalentArk Analytics</h1>
                <p className="text-sm text-gray-300">Workforce insights and metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
              <Button
                onClick={exportData}
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600">
            Comprehensive workforce analytics and insights for data-driven decision making.
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.totalEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.averageEmployeeScore}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.totalDepartments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Certifications</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.totalCertifications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Performance Distribution
                  </CardTitle>
                  <CardDescription>Employee performance score breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Excellent (90+)
                      </span>
                      <span>{analyticsData.performanceDistribution.excellent} employees</span>
                    </div>
                    <Progress
                      value={(analyticsData.performanceDistribution.excellent / analyticsData.totalEmployees) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Good (80-89)
                      </span>
                      <span>{analyticsData.performanceDistribution.good} employees</span>
                    </div>
                    <Progress
                      value={(analyticsData.performanceDistribution.good / analyticsData.totalEmployees) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        Average (70-79)
                      </span>
                      <span>{analyticsData.performanceDistribution.average} employees</span>
                    </div>
                    <Progress
                      value={(analyticsData.performanceDistribution.average / analyticsData.totalEmployees) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        Needs Improvement (&lt;70)
                      </span>
                      <span>{analyticsData.performanceDistribution.needsImprovement} employees</span>
                    </div>
                    <Progress
                      value={
                        (analyticsData.performanceDistribution.needsImprovement / analyticsData.totalEmployees) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Role Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Role Distribution
                  </CardTitle>
                  <CardDescription>Employee distribution by role</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analyticsData.roleDistribution.map((role, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{role.role}</span>
                        <span>
                          {role.count} ({role.percentage}%)
                        </span>
                      </div>
                      <Progress value={role.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Project Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Project Allocation
                  </CardTitle>
                  <CardDescription>Employee allocation status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-green-600">Fully Allocated (90%+)</span>
                      <span>{analyticsData.allocationStats.fullyAllocated} employees</span>
                    </div>
                    <Progress
                      value={(analyticsData.allocationStats.fullyAllocated / analyticsData.totalEmployees) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-yellow-600">Partially Allocated</span>
                      <span>{analyticsData.allocationStats.partiallyAllocated} employees</span>
                    </div>
                    <Progress
                      value={(analyticsData.allocationStats.partiallyAllocated / analyticsData.totalEmployees) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-red-600">Unallocated</span>
                      <span>{analyticsData.allocationStats.unallocated} employees</span>
                    </div>
                    <Progress
                      value={(analyticsData.allocationStats.unallocated / analyticsData.totalEmployees) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Experience Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Experience Levels
                  </CardTitle>
                  <CardDescription>Distribution by years of experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analyticsData.experienceDistribution.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{exp.level}</span>
                        <span>
                          {exp.count} ({exp.percentage}%)
                        </span>
                      </div>
                      <Progress value={exp.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Detailed performance analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{analyticsData.averageEmployeeScore}</p>
                        <p className="text-sm text-green-600">Average Employee Score</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{analyticsData.averageCompanyScore}</p>
                        <p className="text-sm text-blue-600">Average Company Score</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Performance Breakdown</h4>
                      {Object.entries(analyticsData.performanceDistribution).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                          <Badge variant="outline">{value} employees</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Top Performers</span>
                    <span className="font-semibold">{analyticsData.performanceDistribution.excellent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Recent Hires</span>
                    <span className="font-semibold">{analyticsData.recentHires}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Experience</span>
                    <span className="font-semibold">{analyticsData.averageExperience} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Certifications</span>
                    <span className="font-semibold">{analyticsData.totalCertifications}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Analysis</CardTitle>
                <CardDescription>Employee distribution across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analyticsData.departmentDistribution.map((dept, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{dept.name}</h4>
                        <Badge variant="outline">
                          {dept.count} ({dept.percentage}%)
                        </Badge>
                      </div>
                      <Progress value={dept.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Geographic Distribution
                </CardTitle>
                <CardDescription>Employee locations across Mexico</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analyticsData.locationDistribution.map((location, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{location.name}</h4>
                        <Badge variant="outline">
                          {location.count} ({location.percentage}%)
                        </Badge>
                      </div>
                      <Progress value={location.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
                <CardDescription>Most popular technologies in the organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analyticsData.topTechnologies.map((tech, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{tech.name}</h4>
                        <Badge variant="outline">
                          {tech.count} ({tech.percentage}%)
                        </Badge>
                      </div>
                      <Progress value={tech.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Hiring Trends
                </CardTitle>
                <CardDescription>Monthly hiring patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {analyticsData.monthlyHiring.map((month, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{month.hires}</p>
                      <p className="text-sm text-gray-600">{month.month}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Insight:</strong> Peak hiring months are March and June, with an average of{" "}
                {Math.round(
                  analyticsData.monthlyHiring.reduce((sum, month) => sum + month.hires, 0) /
                    analyticsData.monthlyHiring.length,
                )}{" "}
                hires per month. Consider resource planning around these periods.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
