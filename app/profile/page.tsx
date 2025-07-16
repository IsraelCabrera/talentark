"use client"

import type React from "react"

import {
  ArrowLeft,
  Edit,
  MapPin,
  Globe,
  Mail,
  Calendar,
  Award,
  Code,
  Briefcase,
  GraduationCap,
  Languages,
  Save,
  X,
  Clock,
  Download,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { generateProfilePDF } from "@/lib/pdf-generator"

// Mock supervisors/managers data - in a real app, this would come from the API
const availableSupervisors = [
  { id: 2, name: "Carlos Ruiz", position: "Engineering Manager", email: "carlos.ruiz@arkus.com" },
  { id: 3, name: "Sofia Gonzalez", position: "Technical Lead", email: "sofia.gonzalez@arkus.com" },
  { id: 4, name: "Miguel Torres", position: "Project Manager", email: "miguel.torres@arkus.com" },
  { id: 5, name: "Ana Martinez", position: "Senior Developer", email: "ana.martinez@arkus.com" },
]

// Mock user data - in a real app, this would come from authentication
const initialUserData = {
  id: 1,
  name: "Sarah Johnson",
  email: "sarah.johnson@arkus.com",
  role: "employee",
  location: "Tijuana, MX",
  english_level: "Native",
  status: "assigned",
  level: "T4",
  position: "Senior Full Stack Developer",
  company: "Arkus",
  profilePicture: null, // Add this field
  about:
    "Experienced full-stack developer with expertise in React and Node.js. Passionate about creating scalable web applications and mentoring junior developers.",
  reportsTo: {
    id: 2,
    name: "Carlos Ruiz",
    position: "Engineering Manager",
    email: "carlos.ruiz@arkus.com",
  },
  workExperience: [
    {
      position: "Senior Full Stack Developer",
      company: "Arkus",
      startDate: "2023-01-15",
      endDate: null,
      description:
        "Leading development of e-commerce platform using React and Node.js. Managing a team of 3 developers and collaborating with design and product teams.",
      isCurrent: true,
    },
    {
      position: "Full Stack Developer",
      company: "TechCorp",
      startDate: "2021-06-01",
      endDate: "2022-12-31",
      description:
        "Developed and maintained web applications using React, Node.js, and PostgreSQL. Implemented CI/CD pipelines and improved application performance by 40%.",
      isCurrent: false,
    },
  ],
  projects: [
    {
      name: "E-commerce Platform",
      client: "RetailCorp",
      description:
        "Built a comprehensive e-commerce solution with React frontend and Node.js backend, handling 10k+ daily transactions.",
      startDate: "2023-02-01",
      endDate: "2023-08-15",
    },
    {
      name: "CRM System",
      client: "SalesTech",
      description:
        "Developed a customer relationship management system with advanced analytics and reporting features.",
      startDate: "2022-09-01",
      endDate: "2023-01-30",
    },
  ],
  technologies: [
    { name: "React", level: "Expert" },
    { name: "Node.js", level: "Expert" },
    { name: "PostgreSQL", level: "Advanced" },
    { name: "TypeScript", level: "Expert" },
    { name: "AWS", level: "Advanced" },
    { name: "Docker", level: "Intermediate" },
  ],
  skills: [
    { name: "Team Leadership", level: "Advanced" },
    { name: "Project Management", level: "Intermediate" },
    { name: "System Architecture", level: "Advanced" },
  ],
  certifications: [
    {
      title: "AWS Solutions Architect",
      issuer: "Amazon Web Services",
      issueDate: "2023-03-15",
      expirationDate: "2026-03-15",
      credentialUrl: "https://aws.amazon.com/certification/",
    },
    {
      title: "React Professional",
      issuer: "Meta",
      issueDate: "2022-11-20",
      expirationDate: null,
      credentialUrl: "https://developers.facebook.com/certification/",
    },
  ],
  education: [
    {
      degreeTitle: "Bachelor of Computer Science",
      institutionName: "Universidad de Guadalajara",
      graduationDate: "2020-05-15",
    },
  ],
  languages: [
    { name: "Spanish", proficiency: "Native" },
    { name: "English", proficiency: "Native" },
    { name: "Portuguese", proficiency: "Intermediate" },
  ],
  profileReview: {
    lastReviewedDate: "2024-01-15",
    approvalStatus: "approved",
    reviewedBy: "Carlos Ruiz",
    reviewNotes: "Profile is complete and up to date. All certifications verified.",
    companyScore: 9,
  },
  profilePicture: null,
}

export default function MyProfilePage() {
  const [currentUser, setCurrentUser] = useState(initialUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    position: currentUser.position,
    location: currentUser.location,
    english_level: currentUser.english_level,
    status: currentUser.status,
    level: currentUser.level,
    about: currentUser.about,
    reportsToId: currentUser.reportsTo?.id?.toString() || "0", // Updated default value to "0"
  })
  const [showPendingAlert, setShowPendingAlert] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✅ Approved</Badge>
      case "needs_changes":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">❗ Needs Changes</Badge>
      case "pending_review":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">⏳ Pending Review</Badge>
      default:
        return null
    }
  }

  const getCompanyScoreBadge = (score: number | null | undefined) => {
    if (score === null || score === undefined) {
      return (
        <Badge variant="outline" className="border-gray-400 text-gray-600">
          Not Scored
        </Badge>
      )
    }

    if (score >= 8) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">⭐ {score}/10</Badge>
    } else if (score >= 5) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">⭐ {score}/10</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">⭐ {score}/10</Badge>
    }
  }

  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStartEdit = () => {
    setIsEditing(true)
    setShowPendingAlert(false)
    // Reset form data to current values
    setEditFormData({
      name: currentUser.name,
      email: currentUser.email,
      position: currentUser.position,
      location: currentUser.location,
      english_level: currentUser.english_level,
      status: currentUser.status,
      level: currentUser.level,
      about: currentUser.about,
      reportsToId: currentUser.reportsTo?.id?.toString() || "0", // Updated default value to "0"
    })
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfilePictureFile(file)
      // Create a preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    // Find the selected supervisor
    const selectedSupervisor = availableSupervisors.find(
      (supervisor) => supervisor.id.toString() === editFormData.reportsToId,
    )

    // Update the user data with form data
    const updatedUser = {
      ...currentUser,
      ...editFormData,
      reportsTo: selectedSupervisor || null,
      profilePicture: profilePicture || currentUser.profilePicture, // Add profile picture
      profileReview: {
        lastReviewedDate: null, // Reset to null when changes are made
        approvalStatus: "pending_review", // Set to pending review
        reviewedBy: null,
        reviewNotes: "Profile updated by user. Awaiting supervisor review.",
        companyScore: null, // Reset score when profile is updated
      },
    }

    setCurrentUser(updatedUser)
    setIsEditing(false)
    setShowPendingAlert(true)

    // In a real app, this would make an API call to update the profile including uploading the image
    console.log("Saving profile:", editFormData)
    console.log("Profile picture file:", profilePictureFile)
    console.log("Updated user:", updatedUser)

    // Hide the alert after 5 seconds
    setTimeout(() => {
      setShowPendingAlert(false)
    }, 5000)
  }

  const handleCancelEdit = () => {
    // Reset form data to original values
    setEditFormData({
      name: currentUser.name,
      email: currentUser.email,
      position: currentUser.position,
      location: currentUser.location,
      english_level: currentUser.english_level,
      status: currentUser.status,
      level: currentUser.level,
      about: currentUser.about,
      reportsToId: currentUser.reportsTo?.id?.toString() || "0",
    })
    setProfilePicture(null)
    setProfilePictureFile(null)
    setIsEditing(false)
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      // Add a small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500))
      generateProfilePDF(currentUser)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-arkus-gray">
      {/* Header */}
      <header className="bg-arkus-navy border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Image src="/images/arkus-logo.png" alt="Arkus Logo" width={40} height={40} className="mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
                <p className="text-sm text-gray-300">Manage your professional information</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleExportPDF}
                disabled={isExporting}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-arkus-navy bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Generating PDF..." : "Export PDF"}
              </Button>
              {!isEditing ? (
                <Button
                  onClick={handleStartEdit}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-arkus-navy bg-transparent"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleSaveProfile} className="bg-arkus-red text-white hover:bg-arkus-red-hover">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-arkus-navy bg-transparent"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-arkus-navy bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Directory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pending Review Alert */}
        {showPendingAlert && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Profile Updated!</strong> Your changes have been submitted for supervisor review. Your profile
              status is now "Pending Review" until approved.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4 relative group">
                    <AvatarImage
                      src={
                        profilePicture ||
                        currentUser.profilePicture ||
                        `/placeholder.svg?height=96&width=96&text=${currentUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}`
                      }
                    />
                    <AvatarFallback className="bg-arkus-red text-white text-2xl">
                      {currentUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>

                    {isEditing && (
                      <>
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Edit className="h-6 w-6 text-white" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                          title="Click to change profile picture"
                        />
                      </>
                    )}
                  </Avatar>

                  {isEditing && <p className="text-xs text-gray-500 mb-2">Click on your photo to change it</p>}

                  {/* Editable Name */}
                  {isEditing ? (
                    <div className="mb-2">
                      <Input
                        value={editFormData.name}
                        onChange={(e) => handleEditFormChange("name", e.target.value)}
                        className="text-center text-xl font-bold border-gray-300 focus:border-arkus-red focus:ring-arkus-red"
                      />
                    </div>
                  ) : (
                    <h2 className="text-2xl font-bold text-arkus-navy mb-1">{currentUser.name}</h2>
                  )}

                  {/* Editable Position */}
                  {isEditing ? (
                    <div className="mb-4">
                      <Input
                        value={editFormData.position}
                        onChange={(e) => handleEditFormChange("position", e.target.value)}
                        className="text-center border-gray-300 focus:border-arkus-red focus:ring-arkus-red"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-600 mb-4">{currentUser.position}</p>
                  )}

                  <div className="flex justify-center gap-2 mb-4">
                    {/* Editable Status */}
                    {isEditing ? (
                      <Select
                        value={editFormData.status}
                        onValueChange={(value) => handleEditFormChange("status", value)}
                      >
                        <SelectTrigger className="w-32 border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="assigned">Assigned</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant={currentUser.status === "available" ? "default" : "secondary"}
                        className={`${
                          currentUser.status === "available"
                            ? "bg-arkus-red text-white hover:bg-arkus-red-hover"
                            : "bg-gray-200 text-arkus-navy hover:bg-gray-300"
                        }`}
                      >
                        {currentUser.status === "available" ? "Available" : "Assigned"}
                      </Badge>
                    )}

                    {/* Editable Level */}
                    {isEditing ? (
                      <Select
                        value={editFormData.level}
                        onValueChange={(value) => handleEditFormChange("level", value)}
                      >
                        <SelectTrigger className="w-20 border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="T1">T1</SelectItem>
                          <SelectItem value="T2">T2</SelectItem>
                          <SelectItem value="T3">T3</SelectItem>
                          <SelectItem value="T4">T4</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className="border-arkus-navy text-arkus-navy">
                        {currentUser.level}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {/* Editable Email */}
                    <div className="flex items-center justify-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => handleEditFormChange("email", e.target.value)}
                          className="text-sm h-6 border-gray-300 focus:border-arkus-red focus:ring-arkus-red"
                        />
                      ) : (
                        currentUser.email
                      )}
                    </div>

                    {/* Editable Location */}
                    <div className="flex items-center justify-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {isEditing ? (
                        <Select
                          value={editFormData.location}
                          onValueChange={(value) => handleEditFormChange("location", value)}
                        >
                          <SelectTrigger className="w-40 h-6 text-sm border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tijuana, MX">Tijuana, MX</SelectItem>
                            <SelectItem value="Culiacán, MX">Culiacán, MX</SelectItem>
                            <SelectItem value="Guadalajara, MX">Guadalajara, MX</SelectItem>
                            <SelectItem value="Colima, MX">Colima, MX</SelectItem>
                            <SelectItem value="Aguascalientes, MX">Aguascalientes, MX</SelectItem>
                            <SelectItem value="CDMX, MX">CDMX, MX</SelectItem>
                            <SelectItem value="Medellín, COL">Medellín, COL</SelectItem>
                            <SelectItem value="Cali, COL">Cali, COL</SelectItem>
                            <SelectItem value="Bogotá, COL">Bogotá, COL</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        currentUser.location
                      )}
                    </div>

                    {/* Editable English Level */}
                    <div className="flex items-center justify-center">
                      <Globe className="h-4 w-4 mr-2" />
                      English:{" "}
                      {isEditing ? (
                        <Select
                          value={editFormData.english_level}
                          onValueChange={(value) => handleEditFormChange("english_level", value)}
                        >
                          <SelectTrigger className="w-32 h-6 text-sm ml-1 border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Native">Native</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        currentUser.english_level
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports To Card */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-arkus-navy flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Reports To
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    <Select
                      value={editFormData.reportsToId}
                      onValueChange={(value) => handleEditFormChange("reportsToId", value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                        <SelectValue placeholder="Select supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No supervisor</SelectItem>
                        {availableSupervisors.map((supervisor) => (
                          <SelectItem key={supervisor.id} value={supervisor.id.toString()}>
                            {supervisor.name} - {supervisor.position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : currentUser.reportsTo ? (
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40&text=${currentUser.reportsTo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}`}
                      />
                      <AvatarFallback className="bg-arkus-red text-white text-sm">
                        {currentUser.reportsTo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-arkus-navy">{currentUser.reportsTo.name}</p>
                      <p className="text-sm text-gray-600">{currentUser.reportsTo.position}</p>
                      <p className="text-xs text-gray-500">{currentUser.reportsTo.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No supervisor assigned</p>
                )}
              </CardContent>
            </Card>

            {/* Profile Review Status */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-arkus-navy flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Profile Review Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-arkus-navy mb-1">Status:</p>
                  {getStatusBadge(currentUser.profileReview.approvalStatus)}
                </div>

                <div>
                  <p className="text-sm font-medium text-arkus-navy mb-1">Company Score:</p>
                  {getCompanyScoreBadge(currentUser.profileReview.companyScore)}
                </div>

                <div>
                  <p className="text-sm font-medium text-arkus-navy mb-1">Last Reviewed:</p>
                  <p className="text-sm text-gray-600">
                    {currentUser.profileReview.lastReviewedDate
                      ? formatDate(currentUser.profileReview.lastReviewedDate)
                      : "Never reviewed"}
                  </p>
                </div>

                {currentUser.profileReview.reviewedBy && (
                  <div>
                    <p className="text-sm font-medium text-arkus-navy mb-1">Reviewed By:</p>
                    <p className="text-sm text-gray-600">{currentUser.profileReview.reviewedBy}</p>
                  </div>
                )}

                {currentUser.profileReview.reviewNotes && (
                  <div>
                    <p className="text-sm font-medium text-arkus-navy mb-1">Review Notes:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {currentUser.profileReview.reviewNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-arkus-navy">About</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div>
                    <Textarea
                      value={editFormData.about}
                      onChange={(e) => handleEditFormChange("about", e.target.value)}
                      placeholder="Write a short summary about yourself (max 500 characters)"
                      maxLength={500}
                      rows={4}
                      className="border-gray-300 focus:border-arkus-red focus:ring-arkus-red"
                    />
                    <p className="text-xs text-gray-500 mt-1">{editFormData.about.length}/500 characters</p>
                  </div>
                ) : (
                  <p className="text-gray-700">{currentUser.about}</p>
                )}
              </CardContent>
            </Card>

            {/* Current Assignment */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-arkus-navy flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Current Assignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentUser.workExperience
                  .filter((exp) => exp.isCurrent)
                  .map((experience, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-arkus-navy">{experience.position}</h3>
                          <p className="text-gray-600">{experience.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(experience.startDate)} - Present
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{experience.description}</p>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-arkus-navy flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentUser.projects.map((project, index) => (
                    <div key={index} className="border-l-2 border-arkus-red pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-arkus-navy">{project.name}</h3>
                          <p className="text-gray-600">{project.client}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{project.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-arkus-navy flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.technologies.map((tech, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-arkus-navy">{tech.name}</span>
                      <Badge variant="outline" className="border-arkus-navy text-arkus-navy">
                        {tech.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-arkus-navy flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.skills.map((skill, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-arkus-navy">{skill.name}</span>
                      <Badge variant="outline" className="border-arkus-navy text-arkus-navy">
                        {skill.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-arkus-navy flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentUser.education.map((edu, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-arkus-navy">{edu.degreeTitle}</h3>
                        <p className="text-gray-600">{edu.institutionName}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(edu.graduationDate)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-arkus-navy flex items-center">
                  <Languages className="h-5 w-5 mr-2" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.languages.map((language, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-arkus-navy">{language.name}</span>
                      <Badge variant="outline" className="border-arkus-navy text-arkus-navy">
                        {language.proficiency}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-arkus-navy flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentUser.certifications.map((cert, index) => (
                    <div key={index} className="border-l-2 border-arkus-red pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-arkus-navy">{cert.title}</h3>
                          <p className="text-gray-600">{cert.issuer}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center mb-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            Issued: {formatDate(cert.issueDate)}
                          </div>
                          {cert.expirationDate && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Expires: {formatDate(cert.expirationDate)}
                            </div>
                          )}
                        </div>
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-arkus-red hover:text-arkus-red-hover text-sm"
                        >
                          View Credential →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
