"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Edit3,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Star,
  Award,
  Briefcase,
  GraduationCap,
  Globe,
  Code,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { getCurrentUser, updateUserProfile } from "@/lib/auth"
import type { User as AuthUser } from "@/lib/auth"

const availableProjects = [
  { id: "proj_001", name: "System Infrastructure Management", client: "Internal", status: "Active" },
  { id: "proj_002", name: "Employee Development Program", client: "HR Department", status: "Active" },
  { id: "proj_003", name: "E-Commerce Platform Development", client: "RetailCorp", status: "Active" },
  { id: "proj_004", name: "Mobile App Development", client: "TechStart Inc", status: "Active" },
  { id: "proj_005", name: "Data Analytics Dashboard", client: "FinanceFlow", status: "Active" },
  { id: "proj_006", name: "Cloud Migration Project", client: "LegacySoft", status: "Planning" },
  { id: "proj_007", name: "Security Audit & Compliance", client: "SecureBank", status: "Planning" },
  { id: "proj_008", name: "AI Integration Platform", client: "InnovateTech", status: "Planning" },
]

const proficiencyLevels = ["Native", "Professional", "Conversational", "Basic"]

export default function MyProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editedUser, setEditedUser] = useState<AuthUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/")
          return
        }
        setUser(currentUser)
        setEditedUser(currentUser)
      } catch (error) {
        console.error("Error loading user:", error)
        setError("Failed to load user profile")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  const handleSave = async () => {
    if (!editedUser || !user) return

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const updatedUser = await updateUserProfile(user.id, editedUser)
      if (updatedUser) {
        setUser(updatedUser)
        setEditedUser(updatedUser)
        setIsEditing(false)
        setSuccess("Profile updated successfully!")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("An error occurred while updating your profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedUser(user)
    setIsEditing(false)
    setError("")
    setSuccess("")
  }

  const updateField = (field: keyof AuthUser, value: any) => {
    if (!editedUser) return
    setEditedUser({ ...editedUser, [field]: value })
  }

  const addPreviousProject = () => {
    if (!editedUser) return
    const newProject = {
      name: "",
      client: "",
      role: "",
      duration: "",
      description: "",
    }
    updateField("previous_projects", [...(editedUser.previous_projects || []), newProject])
  }

  const updatePreviousProject = (index: number, field: string, value: string) => {
    if (!editedUser || !editedUser.previous_projects) return
    const updated = [...editedUser.previous_projects]
    updated[index] = { ...updated[index], [field]: value }
    updateField("previous_projects", updated)
  }

  const removePreviousProject = (index: number) => {
    if (!editedUser || !editedUser.previous_projects) return
    const updated = editedUser.previous_projects.filter((_, i) => i !== index)
    updateField("previous_projects", updated)
  }

  const addCertification = () => {
    if (!editedUser) return
    const newCertification = {
      name: "",
      issuer: "",
      date: "",
      expiryDate: "",
    }
    updateField("certifications", [...(editedUser.certifications || []), newCertification])
  }

  const updateCertification = (index: number, field: string, value: string) => {
    if (!editedUser || !editedUser.certifications) return
    const updated = [...editedUser.certifications]
    updated[index] = { ...updated[index], [field]: value }
    updateField("certifications", updated)
  }

  const removeCertification = (index: number) => {
    if (!editedUser || !editedUser.certifications) return
    const updated = editedUser.certifications.filter((_, i) => i !== index)
    updateField("certifications", updated)
  }

  const addLanguage = () => {
    if (!editedUser) return
    const newLanguage = {
      name: "",
      proficiency: "Basic",
    }
    updateField("languages", [...(editedUser.languages || []), newLanguage])
  }

  const updateLanguage = (index: number, field: string, value: string) => {
    if (!editedUser || !editedUser.languages) return
    const updated = [...editedUser.languages]
    updated[index] = { ...updated[index], [field]: value }
    updateField("languages", updated)
  }

  const removeLanguage = (index: number) => {
    if (!editedUser || !editedUser.languages) return
    const updated = editedUser.languages.filter((_, i) => i !== index)
    updateField("languages", updated)
  }

  const addEducation = () => {
    if (!editedUser) return
    const newEducation = {
      degree: "",
      institution: "",
      year: "",
      field: "",
    }
    updateField("education", [...(editedUser.education || []), newEducation])
  }

  const updateEducation = (index: number, field: string, value: string) => {
    if (!editedUser || !editedUser.education) return
    const updated = [...editedUser.education]
    updated[index] = { ...updated[index], [field]: value }
    updateField("education", updated)
  }

  const removeEducation = (index: number) => {
    if (!editedUser || !editedUser.education) return
    const updated = editedUser.education.filter((_, i) => i !== index)
    updateField("education", updated)
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

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      super_user: "Super User",
      hr: "HR Manager",
      manager: "Team Manager",
      collaborator: "Employee",
    }
    return roleMap[role] || role
  }

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "Native":
        return "bg-green-100 text-green-800 border-green-200"
      case "Professional":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Conversational":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Basic":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !editedUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal information and professional details</p>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-red-600 hover:bg-red-700">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleCancel} variant="outline" disabled={saving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving} className="bg-red-600 hover:bg-red-700">
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="professional">Professional Details</TabsTrigger>
            <TabsTrigger value="additional">Additional Information</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>Your basic personal and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-start space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={editedUser.profile_image || "/placeholder.svg"} alt={editedUser.name} />
                    <AvatarFallback className="text-lg">
                      {editedUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={editedUser.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                        )}
                      </div>
                      <div>
                        <Label>Role</Label>
                        <div className="mt-1">
                          <Badge className={`${getRoleBadgeColor(user.role)}`} variant="outline">
                            {getRoleDisplayName(user.role)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editedUser.phone || ""}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user.phone || "Not provided"}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="location" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Location
                    </Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={editedUser.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user.location}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="department" className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Department
                    </Label>
                    {isEditing ? (
                      <Input
                        id="department"
                        value={editedUser.department || ""}
                        onChange={(e) => updateField("department", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user.department || "Not specified"}</p>
                    )}
                  </div>
                </div>

                {/* About Section */}
                <div>
                  <Label htmlFor="about">About</Label>
                  {isEditing ? (
                    <Textarea
                      id="about"
                      value={editedUser.about || ""}
                      onChange={(e) => updateField("about", e.target.value)}
                      className="mt-1"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{user.about || "No description provided"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Details Tab */}
          <TabsContent value="professional" className="space-y-6">
            {/* Work Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Work Information
                </CardTitle>
                <CardDescription>Your current role and work details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="position">Position</Label>
                    {isEditing ? (
                      <Input
                        id="position"
                        value={editedUser.position}
                        onChange={(e) => updateField("position", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user.position}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="hire_date" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Hire Date
                    </Label>
                    {isEditing ? (
                      <Input
                        id="hire_date"
                        type="date"
                        value={editedUser.hire_date || ""}
                        onChange={(e) => updateField("hire_date", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {user.hire_date ? new Date(user.hire_date).toLocaleDateString() : "Not specified"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="manager">Manager</Label>
                    {isEditing ? (
                      <Input
                        id="manager"
                        value={editedUser.manager || ""}
                        onChange={(e) => updateField("manager", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user.manager || "Not specified"}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="years_of_experience">Years of Experience</Label>
                    {isEditing ? (
                      <Input
                        id="years_of_experience"
                        type="number"
                        value={editedUser.years_of_experience || ""}
                        onChange={(e) => updateField("years_of_experience", Number.parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user.years_of_experience || "Not specified"} years</p>
                    )}
                  </div>
                </div>

                {/* Current Project Assignment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="project_assignment">Current Project</Label>
                    {isEditing ? (
                      <Select
                        value={editedUser.project_assignment || ""}
                        onValueChange={(value) => updateField("project_assignment", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProjects.map((project) => (
                            <SelectItem key={project.id} value={project.name}>
                              <div className="flex items-center justify-between w-full">
                                <span>{project.name}</span>
                                <Badge
                                  variant="outline"
                                  className={`ml-2 ${
                                    project.status === "Active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {project.status}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user.project_assignment || "Not assigned"}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="project_allocation_percentage">Project Allocation (%)</Label>
                    {isEditing ? (
                      <Input
                        id="project_allocation_percentage"
                        type="number"
                        min="0"
                        max="100"
                        value={editedUser.project_allocation_percentage || ""}
                        onChange={(e) =>
                          updateField("project_allocation_percentage", Number.parseInt(e.target.value) || 0)
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user.project_allocation_percentage || 0}%</p>
                    )}
                  </div>
                </div>

                {/* Performance Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Employee Score
                    </Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: `${user.employee_score}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{user.employee_score}/100</span>
                    </div>
                  </div>
                  <div>
                    <Label className="flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Company Score
                    </Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${user.company_score * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{user.company_score}/10</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <Label htmlFor="skills">Skills</Label>
                  {isEditing ? (
                    <Textarea
                      id="skills"
                      value={editedUser.skills?.join(", ") || ""}
                      onChange={(e) =>
                        updateField(
                          "skills",
                          e.target.value.split(",").map((s) => s.trim()),
                        )
                      }
                      className="mt-1"
                      placeholder="Enter skills separated by commas"
                    />
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {user.skills?.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Technologies */}
                <div>
                  <Label htmlFor="technologies" className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    Technologies
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="technologies"
                      value={editedUser.technologies?.join(", ") || ""}
                      onChange={(e) =>
                        updateField(
                          "technologies",
                          e.target.value.split(",").map((s) => s.trim()),
                        )
                      }
                      className="mt-1"
                      placeholder="Enter technologies separated by commas"
                    />
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {user.technologies?.map((tech, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Previous Projects */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Previous Projects
                    </CardTitle>
                    <CardDescription>Your project history and achievements</CardDescription>
                  </div>
                  {isEditing && (
                    <Button onClick={addPreviousProject} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editedUser.previous_projects?.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    {isEditing && (
                      <div className="flex justify-end">
                        <Button
                          onClick={() => removePreviousProject(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Project Name</Label>
                        {isEditing ? (
                          <Input
                            value={project.name}
                            onChange={(e) => updatePreviousProject(index, "name", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm font-medium text-gray-900">{project.name}</p>
                        )}
                      </div>
                      <div>
                        <Label>Client</Label>
                        {isEditing ? (
                          <Input
                            value={project.client}
                            onChange={(e) => updatePreviousProject(index, "client", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{project.client}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Role</Label>
                        {isEditing ? (
                          <Input
                            value={project.role}
                            onChange={(e) => updatePreviousProject(index, "role", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{project.role}</p>
                        )}
                      </div>
                      <div>
                        <Label>Duration</Label>
                        {isEditing ? (
                          <Input
                            value={project.duration}
                            onChange={(e) => updatePreviousProject(index, "duration", e.target.value)}
                            className="mt-1"
                            placeholder="e.g., Jan 2022 - Dec 2022"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{project.duration}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      {isEditing ? (
                        <Textarea
                          value={project.description}
                          onChange={(e) => updatePreviousProject(index, "description", e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{project.description}</p>
                      )}
                    </div>
                  </div>
                )) || <p className="text-gray-500 text-center py-4">No previous projects added</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Information Tab */}
          <TabsContent value="additional" className="space-y-6">
            {/* Certifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Professional Certifications
                    </CardTitle>
                    <CardDescription>Your professional certifications and credentials</CardDescription>
                  </div>
                  {isEditing && (
                    <Button onClick={addCertification} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certification
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editedUser.certifications?.map((cert, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    {isEditing && (
                      <div className="flex justify-end">
                        <Button
                          onClick={() => removeCertification(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Certification Name</Label>
                        {isEditing ? (
                          <Input
                            value={cert.name}
                            onChange={(e) => updateCertification(index, "name", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm font-medium text-gray-900">{cert.name}</p>
                        )}
                      </div>
                      <div>
                        <Label>Issuer</Label>
                        {isEditing ? (
                          <Input
                            value={cert.issuer}
                            onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{cert.issuer}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Issue Date</Label>
                        {isEditing ? (
                          <Input
                            value={cert.date}
                            onChange={(e) => updateCertification(index, "date", e.target.value)}
                            className="mt-1"
                            placeholder="e.g., March 2023"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{cert.date}</p>
                        )}
                      </div>
                      <div>
                        <Label>Expiry Date (Optional)</Label>
                        {isEditing ? (
                          <Input
                            value={cert.expiryDate || ""}
                            onChange={(e) => updateCertification(index, "expiryDate", e.target.value)}
                            className="mt-1"
                            placeholder="e.g., March 2026"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{cert.expiryDate || "No expiry"}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )) || <p className="text-gray-500 text-center py-4">No certifications added</p>}
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Languages & Proficiency
                    </CardTitle>
                    <CardDescription>Languages you speak and your proficiency level</CardDescription>
                  </div>
                  {isEditing && (
                    <Button onClick={addLanguage} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Language
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editedUser.languages && editedUser.languages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editedUser.languages.map((lang, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        {isEditing && (
                          <div className="flex justify-end">
                            <Button
                              onClick={() => removeLanguage(index)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <div>
                          <Label>Language</Label>
                          {isEditing ? (
                            <Input
                              value={lang.name}
                              onChange={(e) => updateLanguage(index, "name", e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 text-sm font-medium text-gray-900">{lang.name}</p>
                          )}
                        </div>
                        <div>
                          <Label>Proficiency</Label>
                          {isEditing ? (
                            <Select
                              value={lang.proficiency}
                              onValueChange={(value) => updateLanguage(index, "proficiency", value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {proficiencyLevels.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="mt-1">
                              <Badge className={`${getProficiencyColor(lang.proficiency)}`} variant="outline">
                                {lang.proficiency}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No languages added</p>
                )}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Education
                    </CardTitle>
                    <CardDescription>Your educational background and qualifications</CardDescription>
                  </div>
                  {isEditing && (
                    <Button onClick={addEducation} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editedUser.education?.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    {isEditing && (
                      <div className="flex justify-end">
                        <Button
                          onClick={() => removeEducation(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Degree</Label>
                        {isEditing ? (
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm font-medium text-gray-900">{edu.degree}</p>
                        )}
                      </div>
                      <div>
                        <Label>Institution</Label>
                        {isEditing ? (
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, "institution", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{edu.institution}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Year</Label>
                        {isEditing ? (
                          <Input
                            value={edu.year}
                            onChange={(e) => updateEducation(index, "year", e.target.value)}
                            className="mt-1"
                            placeholder="e.g., 2020"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{edu.year}</p>
                        )}
                      </div>
                      <div>
                        <Label>Field of Study</Label>
                        {isEditing ? (
                          <Input
                            value={edu.field}
                            onChange={(e) => updateEducation(index, "field", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{edu.field}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )) || <p className="text-gray-500 text-center py-4">No education records added</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
