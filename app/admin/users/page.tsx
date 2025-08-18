"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Edit,
  Save,
  X,
  Star,
  Phone,
  ExternalLink,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCurrentUser, getDemoUsers, updateUserProfile, getRolePermissions, type User as AuthUser } from "@/lib/auth"

// Available projects for assignment
const availableProjects = [
  {
    id: "project-ecommerce-2024",
    name: "E-Commerce Platform Redesign",
    client: "TechCorp Solutions",
    status: "active",
    team_size: 6,
    description: "Complete redesign and modernization of the client's e-commerce platform",
  },
  {
    id: "project-banking-2024",
    name: "Banking Dashboard Modernization",
    client: "SecureBank Corp",
    status: "active",
    team_size: 4,
    description: "Modernized legacy banking dashboard with improved UX and security features",
  },
  {
    id: "project-healthcare-2024",
    name: "Healthcare Management System",
    client: "MedTech Solutions",
    status: "active",
    team_size: 8,
    description: "Comprehensive healthcare management system with patient portal",
  },
  {
    id: "project-fintech-2024",
    name: "FinTech Mobile App Development",
    client: "InnovateFinance",
    status: "active",
    team_size: 5,
    description: "Next-generation mobile banking application with AI features",
  },
  {
    id: "project-retail-2024",
    name: "Retail Analytics Platform",
    client: "RetailMax Corp",
    status: "active",
    team_size: 7,
    description: "Advanced analytics platform for retail inventory and sales optimization",
  },
  {
    id: "project-education-2024",
    name: "Educational Learning Management System",
    client: "EduTech Solutions",
    status: "active",
    team_size: 6,
    description: "Modern LMS with interactive learning tools and progress tracking",
  },
  {
    id: "project-logistics-2024",
    name: "Supply Chain Optimization Tool",
    client: "LogiFlow Inc",
    status: "active",
    team_size: 4,
    description: "AI-powered supply chain management and optimization platform",
  },
  {
    id: "project-insurance-2024",
    name: "Insurance Claims Processing System",
    client: "SafeGuard Insurance",
    status: "active",
    team_size: 5,
    description: "Automated claims processing system with fraud detection capabilities",
  },
]

export default function AdminUsersPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [employees, setEmployees] = useState<AuthUser[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<AuthUser | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
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

        const permissions = getRolePermissions(user.role)
        if (!permissions.canViewAllProfiles) {
          router.push("/directory")
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

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment

    return matchesSearch && matchesDepartment
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

  const getProjectById = (projectId: string) => {
    return availableProjects.find((project) => project.id === projectId || project.name === projectId)
  }

  const handleEditEmployee = (employee: AuthUser) => {
    // Find the current project to get its ID
    const currentProject = availableProjects.find(
      (project) => project.name === employee.project_assignment || project.id === employee.project_assignment,
    )

    setEditingEmployee({
      ...employee,
      newEmployeeScore: employee.employee_score.toString(),
      newCompanyScore: employee.company_score.toString(),
      newAllocation: employee.project_allocation_percentage?.toString() || "0",
      newProjectAssignment: currentProject?.id || employee.project_assignment || "none",
      newName: employee.name,
      newEmail: employee.email,
      newPhone: employee.phone || "",
      newPosition: employee.position,
      newLocation: employee.location,
      newDepartment: employee.department || "",
      newSalaryRange: employee.salary_range || "",
      newManager: employee.manager || "",
      newYearsExperience: employee.years_of_experience?.toString() || "0",
      newSkills: employee.skills?.join(", ") || "",
      newNotes: employee.notes || "",
    })
  }

  const handleSaveEmployee = async () => {
    if (!editingEmployee || !currentUser) return

    const permissions = getRolePermissions(currentUser.role)

    const updates: Partial<AuthUser> = {}

    // Super User can edit everything
    if (permissions.canEditAllProfileData) {
      updates.name = editingEmployee.newName
      updates.email = editingEmployee.newEmail
      updates.phone = editingEmployee.newPhone
      updates.position = editingEmployee.newPosition
      updates.location = editingEmployee.newLocation
      updates.department = editingEmployee.newDepartment
      updates.salary_range = editingEmployee.newSalaryRange
      updates.manager = editingEmployee.newManager
      updates.years_of_experience = Number.parseInt(editingEmployee.newYearsExperience) || 0
      updates.skills = editingEmployee.newSkills
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
      updates.notes = editingEmployee.newNotes

      // Convert project ID back to project name for storage
      const selectedProject = availableProjects.find((project) => project.id === editingEmployee.newProjectAssignment)
      updates.project_assignment = selectedProject ? selectedProject.name : editingEmployee.newProjectAssignment
    }

    if (permissions.canEditScores) {
      updates.employee_score = Number.parseInt(editingEmployee.newEmployeeScore) || editingEmployee.employee_score
    }

    if (permissions.canEditCompanyScores) {
      updates.company_score = Number.parseFloat(editingEmployee.newCompanyScore) || editingEmployee.company_score
    }

    if (permissions.canEditProjectAssignments) {
      updates.project_allocation_percentage =
        Number.parseInt(editingEmployee.newAllocation) || editingEmployee.project_allocation_percentage
    }

    try {
      const updatedUser = await updateUserProfile(editingEmployee.id, updates)
      if (updatedUser) {
        // Update local state
        setEmployees((prev) => prev.map((emp) => (emp.id === editingEmployee.id ? updatedUser : emp)))

        // Update selected employee if it's the same one
        if (selectedEmployee && selectedEmployee.id === editingEmployee.id) {
          setSelectedEmployee(updatedUser)
        }
      }
    } catch (error) {
      console.error("Error updating employee:", error)
    }

    setEditingEmployee(null)
  }

  const handleCancelEdit = () => {
    setEditingEmployee(null)
  }

  const departments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading admin panel...</p>
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
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <p className="text-sm text-gray-300">Manage employee profiles and assignments</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-purple-100 text-purple-800 border-purple-200" variant="outline">
                Super User Access
              </Badge>
              <Button
                variant="outline"
                onClick={() => router.push("/directory")}
                className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Directory
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Super User Alert */}
        <Alert className="mb-6 border-purple-200 bg-purple-50">
          <Star className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>Super User Access:</strong> You can edit all profiles, company scores, project assignments, and
            general profile information across the organization.
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search employees by name, email, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-300 focus:border-red-600 focus:ring-red-600"
              />
            </div>
            <div className="flex gap-4">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[150px] border-gray-300 focus:border-red-600 focus:ring-red-600">
                  <SelectValue />
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
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-slate-900">{employees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-slate-900">{availableProjects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Employee Score</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {Math.round(employees.reduce((sum, emp) => sum + emp.employee_score, 0) / employees.length)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Company Score</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {Math.round((employees.reduce((sum, emp) => sum + emp.company_score, 0) / employees.length) * 10) /
                      10}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        employee.profile_image ||
                        `/placeholder.svg?height=48&width=48&text=${getInitials(employee.name) || "/placeholder.svg"}`
                      }
                      alt={employee.name}
                    />
                    <AvatarFallback className="bg-red-600 text-white">{getInitials(employee.name)}</AvatarFallback>
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

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Details
                  </Button>

                  <Button
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleEditEmployee(employee)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <Card className="border-gray-200">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No employees found matching your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* View Details Dialog */}
      {selectedEmployee && (
        <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={
                      selectedEmployee.profile_image ||
                      `/placeholder.svg?height=40&width=40&text=${getInitials(selectedEmployee.name) || "/placeholder.svg"}`
                    }
                    alt={selectedEmployee.name}
                  />
                  <AvatarFallback className="bg-red-600 text-white">
                    {getInitials(selectedEmployee.name)}
                  </AvatarFallback>
                </Avatar>
                {selectedEmployee.name}
              </DialogTitle>
              <DialogDescription>
                {selectedEmployee.position} • {selectedEmployee.department}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{selectedEmployee.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{selectedEmployee.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{selectedEmployee.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>
                      Hired: {selectedEmployee.hire_date ? formatDate(selectedEmployee.hire_date) : "Not available"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{selectedEmployee.employee_score}</div>
                    <div className="text-sm text-gray-600">Employee Score</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{selectedEmployee.company_score}</div>
                    <div className="text-sm text-gray-600">Company Score</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">
                      {selectedEmployee.project_allocation_percentage || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Project Allocation</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{selectedEmployee.years_of_experience || 0}</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                </div>
              </div>

              {/* Current Assignment */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Current Assignment</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{selectedEmployee.project_assignment || "No current assignment"}</p>
                  <p className="text-sm text-gray-600 mt-1">Manager: {selectedEmployee.manager || "Not assigned"}</p>
                  <p className="text-sm text-gray-600">
                    Salary Range: {selectedEmployee.salary_range || "Not specified"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Last Review:{" "}
                    {selectedEmployee.last_review_date ? formatDate(selectedEmployee.last_review_date) : "No reviews"}
                  </p>
                </div>
              </div>

              {/* Skills */}
              {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedEmployee.notes && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedEmployee.notes}</p>
                </div>
              )}

              {/* Admin Actions */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-slate-900">Super User Actions</h4>
                  <Button
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => {
                      handleEditEmployee(selectedEmployee)
                      setSelectedEmployee(null)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Employee
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Employee Dialog */}
      {editingEmployee && (
        <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Employee - Super User Access</DialogTitle>
              <DialogDescription>
                Update {editingEmployee.name}'s complete profile information, scores, and project assignments
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editingEmployee.newName}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, newName: e.target.value })}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editingEmployee.newEmail}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, newEmail: e.target.value })}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={editingEmployee.newPhone}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, newPhone: e.target.value })}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={editingEmployee.newPosition}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, newPosition: e.target.value })}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editingEmployee.newLocation}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, newLocation: e.target.value })}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={editingEmployee.newDepartment}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, newDepartment: e.target.value })}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Employment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manager">Manager</Label>
                    <Input
                      id="manager"
                      value={editingEmployee.newManager}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, newManager: e.target.value })}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input
                      id="salary"
                      value={editingEmployee.newSalaryRange}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, newSalaryRange: e.target.value })}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      max="50"
                      value={editingEmployee.newYearsExperience}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, newYearsExperience: e.target.value })}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Performance Scores */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Performance Scores</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employeeScore">Employee Score (0-100)</Label>
                    <Input
                      id="employeeScore"
                      type="number"
                      min="0"
                      max="100"
                      value={editingEmployee.newEmployeeScore}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, newEmployeeScore: e.target.value })}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyScore">Company Score (0-10)</Label>
                    <Input
                      id="companyScore"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={editingEmployee.newCompanyScore}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, newCompanyScore: e.target.value })}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Project Assignment */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Project Assignment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectAssignment">Current Project</Label>
                    <Select
                      value={editingEmployee.newProjectAssignment}
                      onValueChange={(value) => setEditingEmployee({ ...editingEmployee, newProjectAssignment: value })}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-red-600 focus:ring-red-600">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Project Assignment</SelectItem>
                        {availableProjects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{project.name}</span>
                              <span className="text-xs text-gray-500">
                                {project.client} • {project.team_size} members
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {editingEmployee.newProjectAssignment && editingEmployee.newProjectAssignment !== "none" && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                        {(() => {
                          const project = availableProjects.find((p) => p.id === editingEmployee.newProjectAssignment)
                          return project ? (
                            <div>
                              <div className="font-medium">{project.name}</div>
                              <div>Client: {project.client}</div>
                              <div>Team Size: {project.team_size} members</div>
                              <div>Status: {project.status}</div>
                            </div>
                          ) : null
                        })()}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="allocation">Project Allocation (%)</Label>
                    <Input
                      id="allocation"
                      type="number"
                      min="0"
                      max="100"
                      value={editingEmployee.newAllocation}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, newAllocation: e.target.value })}
                      className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Skills</h4>
                <div>
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={editingEmployee.newSkills}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, newSkills: e.target.value })}
                    className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    placeholder="React, Node.js, TypeScript, AWS"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Administrative Notes</h4>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editingEmployee.newNotes}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, newNotes: e.target.value })}
                    className="border-gray-300 focus:border-red-600 focus:ring-red-600"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1 bg-red-600 text-white hover:bg-red-700" onClick={handleSaveEmployee}>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Changes
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
