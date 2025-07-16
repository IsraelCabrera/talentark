"use client"

import {
  ArrowLeft,
  MapPin,
  Globe,
  Mail,
  Calendar,
  Award,
  Code,
  Briefcase,
  GraduationCap,
  Languages,
  Download,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { generateProfilePDF } from "@/lib/pdf-generator"
import { useState } from "react"

// Mock data - in a real app, this would be fetched based on the ID
const getUserData = (id: string) => {
  const users = [
    {
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
        { name: "Code Review", level: "Expert" },
        { name: "Mentoring", level: "Advanced" },
        { name: "Agile Methodologies", level: "Advanced" },
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
        {
          degreeTitle: "AWS Cloud Practitioner",
          institutionName: "Amazon Web Services",
          graduationDate: "2022-08-10",
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
      profilePicture: "/images/profile-sarah.jpeg",
    },
  ]

  return users.find((user) => user.id === Number.parseInt(id)) || users[0]
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const user = getUserData(params.id)
  const [isExporting, setIsExporting] = useState(false)

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

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      // Add a small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500))
      generateProfilePDF(user)
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
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-sm text-gray-300">{user.position}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="bg-arkus-red text-white hover:bg-arkus-red-hover"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Generating PDF..." : "Export PDF"}
              </Button>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage
                      src={
                        user.profilePicture ||
                        `/placeholder.svg?height=96&width=96&text=${user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}`
                      }
                    />
                    <AvatarFallback className="bg-arkus-red text-white text-2xl">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold text-arkus-navy mb-1">{user.name}</h2>
                  <p className="text-gray-600 mb-4">{user.position}</p>

                  <div className="flex justify-center gap-2 mb-4">
                    <Badge
                      variant={user.status === "available" ? "default" : "secondary"}
                      className={`${
                        user.status === "available"
                          ? "bg-arkus-red text-white hover:bg-arkus-red-hover"
                          : "bg-gray-200 text-arkus-navy hover:bg-gray-300"
                      }`}
                    >
                      {user.status === "available" ? "Available" : "Assigned"}
                    </Badge>
                    <Badge variant="outline" className="border-arkus-navy text-arkus-navy">
                      {user.level}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </div>
                    <div className="flex items-center justify-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {user.location}
                    </div>
                    <div className="flex items-center justify-center">
                      <Globe className="h-4 w-4 mr-2" />
                      English: {user.english_level}
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
                {user.reportsTo ? (
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40&text=${user.reportsTo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}`}
                      />
                      <AvatarFallback className="bg-arkus-red text-white text-sm">
                        {user.reportsTo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-arkus-navy">{user.reportsTo.name}</p>
                      <p className="text-sm text-gray-600">{user.reportsTo.position}</p>
                      <p className="text-xs text-gray-500">{user.reportsTo.email}</p>
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
                  {getStatusBadge(user.profileReview.approvalStatus)}
                </div>

                <div>
                  <p className="text-sm font-medium text-arkus-navy mb-1">Company Score:</p>
                  {getCompanyScoreBadge(user.profileReview.companyScore)}
                </div>

                <div>
                  <p className="text-sm font-medium text-arkus-navy mb-1">Last Reviewed:</p>
                  <p className="text-sm text-gray-600">
                    {user.profileReview.lastReviewedDate
                      ? formatDate(user.profileReview.lastReviewedDate)
                      : "Never reviewed"}
                  </p>
                </div>

                {user.profileReview.reviewedBy && (
                  <div>
                    <p className="text-sm font-medium text-arkus-navy mb-1">Reviewed By:</p>
                    <p className="text-sm text-gray-600">{user.profileReview.reviewedBy}</p>
                  </div>
                )}

                {user.profileReview.reviewNotes && (
                  <div>
                    <p className="text-sm font-medium text-arkus-navy mb-1">Review Notes:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{user.profileReview.reviewNotes}</p>
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
                <p className="text-gray-700">{user.about}</p>
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
                {user.workExperience
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
                  {user.projects.map((project, index) => (
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
                  {user.technologies.map((tech, index) => (
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
                  {user.skills.map((skill, index) => (
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
                  {user.education.map((edu, index) => (
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
                  {user.languages.map((language, index) => (
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
                  {user.certifications.map((cert, index) => (
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
