"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Users,
  Award,
  Building2,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Settings,
  LogOut,
  UserIcon,
} from "lucide-react"
import { getCurrentUser, signOut, getDemoUsers, getRolePermissions, type User } from "@/lib/auth"

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const employees = getDemoUsers()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push("/")
          return
        }
        setCurrentUser(user)
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  const permissions = getRolePermissions(currentUser.role)

  const stats = {
    totalEmployees: employees.length,
    departments: [...new Set(employees.map((emp) => emp.department).filter(Boolean))].length,
    locations: [...new Set(employees.map((emp) => emp.location.split(",")[1]?.trim()).filter(Boolean))].length,
    averageScore: Math.round(employees.reduce((sum, emp) => sum + emp.employee_score, 0) / employees.length),
  }

  const recentActivities = [
    { id: 1, action: "New employee onboarded", user: "Sarah Johnson", time: "2 hours ago", type: "success" },
    { id: 2, action: "Profile updated", user: "Mike Chen", time: "4 hours ago", type: "info" },
    { id: 3, action: "Performance review completed", user: "Lisa Rodriguez", time: "1 day ago", type: "success" },
    { id: 4, action: "Department transfer requested", user: "David Kim", time: "2 days ago", type: "warning" },
    { id: 5, action: "Training completed", user: "Emma Wilson", time: "3 days ago", type: "success" },
  ]

  const upcomingTasks = [
    { id: 1, task: "Review quarterly performance reports", due: "Today", priority: "high" },
    { id: 2, task: "Conduct team meeting", due: "Tomorrow", priority: "medium" },
    { id: 3, task: "Update employee handbook", due: "This week", priority: "low" },
    { id: 4, task: "Process new hire paperwork", due: "Friday", priority: "high" },
    { id: 5, task: "Schedule training sessions", due: "Next week", priority: "medium" },
  ]

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      super_user: "Super User",
      hr: "HR Manager",
      manager: "Team Manager",
      collaborator: "Employee",
    }
    return roleMap[role] || role
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "info":
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">TalentArk Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/directory")}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Directory</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/my-profile")}
                className="flex items-center space-x-2"
              >
                <UserIcon className="h-4 w-4" />
                <span>My Profile</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser.name}!</h2>
          <p className="text-gray-600">
            You're logged in as {getRoleDisplayName(currentUser.role)} • Here's your dashboard overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.departments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Locations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.locations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {permissions.canViewAllProfiles && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  onClick={() => router.push("/directory")}
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm">View Directory</span>
                </Button>
                {permissions.canUploadUsers && (
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => router.push("/import")}
                  >
                    <UserPlus className="h-6 w-6" />
                    <span className="text-sm">Add Employee</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  onClick={() => router.push("/analytics")}
                >
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">Analytics</span>
                </Button>
                {permissions.canManageSystem && (
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    onClick={() => router.push("/admin/settings")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-sm">Settings</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Employee performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>High Performers (90+)</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Good Performers (80-89)</span>
                      <span>50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Average Performers (70-79)</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Needs Improvement (&lt;70)</span>
                      <span>5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Department Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Breakdown</CardTitle>
                  <CardDescription>Employee distribution by department</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Engineering</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={40} className="w-20 h-2" />
                      <span className="text-sm text-gray-600">40%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Human Resources</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={25} className="w-20 h-2" />
                      <span className="text-sm text-gray-600">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">IT</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={25} className="w-20 h-2" />
                      <span className="text-sm text-gray-600">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Other</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={10} className="w-20 h-2" />
                      <span className="text-sm text-gray-600">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and changes in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.user}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Your pending tasks and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{task.task}</p>
                          <p className="text-xs text-gray-600">Due: {task.due}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(task.priority)} variant="outline">
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
