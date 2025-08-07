"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Building2, Calendar, Star, Edit, Save, X, Plus, Trash2, Send, Award, GraduationCap, Globe, Code, CheckCircle, AlertCircle, Camera } from 'lucide-react'
import Link from "next/link"

interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialUrl?: string
}

interface Language {
  id: string
  name: string
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native'
}

interface Skill {
  id: string
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

interface Education {
  id: string
  degree: string
  institution: string
  graduationDate: string
  gpa?: string
}

interface PreviousProject {
  id: string
  name: string
  client: string
  description: string
  startDate: string
  endDate: string
  role: string
  technologies: string[]
  teamSize: number
  status: 'completed' | 'cancelled' | 'on-hold'
}

interface ProfileData {
  id: string
  name: string
  email: string
  phone: string
  position: string
  location: string
  about: string
  employee_score: number
  project_allocation_percentage: number
  current_project: string
  manager_name: string
  manager_email: string
  hire_date: string
  level: string
  department: string
  avatar?: string
  last_review_submission: string | null
  last_review_approval: string | null
  certifications: Certification[]
  languages: Language[]
  skills: Skill[]
  education: Education[]
  previous_projects: PreviousProject[]
}

export default function MyProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewMessage, setReviewMessage] = useState("")
  const [showAddDialog, setShowAddDialog] = useState<string | null>(null)

  // Form states for adding new items
  const [newCertification, setNewCertification] = useState<Partial<Certification>>({})
  const [newLanguage, setNewLanguage] = useState<Partial<Language>>({})
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({})
  const [newEducation, setNewEducation] = useState<Partial<Education>>({})

  useEffect(() => {
    // Mock profile data - in real app, fetch from API
    const mockProfile: ProfileData = {
      id: "current-user",
      name: "Alex Thompson",
      email: "alex.thompson@arkus.com",
      phone: "+1 (555) 123-4567",
      position: "Senior Full Stack Developer",
      location: "Austin, TX",
      about: "Passionate full-stack developer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Love mentoring junior developers and contributing to open-source projects.",
      employee_score: 94,
      project_allocation_percentage: 85,
      current_project: "E-Commerce Platform Redesign",
      manager_name: "Sarah Johnson",
      manager_email: "sarah.johnson@arkus.com",
      hire_date: "2019-03-15",
      level: "Senior",
      department: "Engineering",
      last_review_submission: "2023-12-20T14:45:00Z",
      last_review_approval: "2023-12-22T09:15:00Z",
      certifications: [
        {
          id: "cert-1",
          name: "AWS Solutions Architect Professional",
          issuer: "Amazon Web Services",
          issueDate: "2023-06-15",
          expiryDate: "2026-06-15",
          credentialUrl: "https://aws.amazon.com/verification"
        },
        {
          id: "cert-2",
          name: "Google Cloud Professional Developer",
          issuer: "Google Cloud",
          issueDate: "2023-03-20",
          expiryDate: "2025-03-20"
        }
      ],
      languages: [
        { id: "lang-1", name: "English", proficiency: "Native" },
        { id: "lang-2", name: "Spanish", proficiency: "Intermediate" },
        { id: "lang-3", name: "French", proficiency: "Beginner" }
      ],
      skills: [
        { id: "skill-1", name: "React", level: "Expert" },
        { id: "skill-2", name: "Node.js", level: "Expert" },
        { id: "skill-3", name: "TypeScript", level: "Advanced" },
        { id: "skill-4", name: "AWS", level: "Advanced" },
        { id: "skill-5", name: "Docker", level: "Intermediate" },
        { id: "skill-6", name: "Kubernetes", level: "Intermediate" }
      ],
      education: [
        {
          id: "edu-1",
          degree: "Bachelor of Science in Computer Science",
          institution: "University of Texas at Austin",
          graduationDate: "2016-05-15",
          gpa: "3.8"
        }
      ],
      previous_projects: [
        {
          id: "proj-1",
          name: "E-Commerce Platform Redesign",
          client: "TechCorp Solutions",
          description: "Complete redesign and modernization of the client's e-commerce platform using React and Node.js. Implemented new payment gateway integration and improved user experience.",
          startDate: "2023-08-01",
          endDate: "2024-01-15",
          role: "Lead Frontend Developer",
          technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
          teamSize: 6,
          status: "completed"
        },
        {
          id: "proj-2",
          name: "Banking Dashboard Modernization",
          client: "SecureBank Corp",
          description: "Modernized legacy banking dashboard with improved UX and security features. Implemented real-time transaction monitoring and enhanced reporting capabilities.",
          startDate: "2023-01-10",
          endDate: "2023-07-30",
          role: "Full Stack Developer",
          technologies: ["Vue.js", "Python", "Django", "MySQL", "Docker"],
          teamSize: 4,
          status: "completed"
        },
        {
          id: "proj-3",
          name: "Healthcare Management System",
          client: "MedTech Solutions",
          description: "Built comprehensive healthcare management system with patient portal and provider dashboard. Integrated with multiple third-party medical APIs.",
          startDate: "2022-06-15",
          endDate: "2022-12-20",
          role: "Backend Developer",
          technologies: ["Node.js", "Express", "MongoDB", "React", "Azure"],
          teamSize: 8,
          status: "completed"
        }
      ]
    }

    setTimeout(() => {
      setProfile(mockProfile)
      setLoading(false)
    }, 1000)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value })
      setHasChanges(true)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
    setEditMode(false)
    setHasChanges(false)
  }

  const handleSubmitForReview = async () => {
    setSaving(true)
    // Simulate API call to submit for manager review
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (profile) {
      // Update the last review submission timestamp
      setProfile({
        ...profile,
        last_review_submission: new Date().toISOString()
      })
    }
    
    setSaving(false)
    setShowReviewDialog(false)
    setReviewMessage("")
    setHasChanges(false)
    // Show success message
  }

  const addCertification = () => {
    if (profile && newCertification.name && newCertification.issuer && newCertification.issueDate) {
      const certification: Certification = {
        id: `cert-${Date.now()}`,
        name: newCertification.name,
        issuer: newCertification.issuer,
        issueDate: newCertification.issueDate,
        expiryDate: newCertification.expiryDate,
        credentialUrl: newCertification.credentialUrl
      }
      setProfile({
        ...profile,
        certifications: [...profile.certifications, certification]
      })
      setNewCertification({})
      setShowAddDialog(null)
      setHasChanges(true)
    }
  }

  const addLanguage = () => {
    if (profile && newLanguage.name && newLanguage.proficiency) {
      const language: Language = {
        id: `lang-${Date.now()}`,
        name: newLanguage.name,
        proficiency: newLanguage.proficiency
      }
      setProfile({
        ...profile,
        languages: [...profile.languages, language]
      })
      setNewLanguage({})
      setShowAddDialog(null)
      setHasChanges(true)
    }
  }

  const addSkill = () => {
    if (profile && newSkill.name && newSkill.level) {
      const skill: Skill = {
        id: `skill-${Date.now()}`,
        name: newSkill.name,
        level: newSkill.level
      }
      setProfile({
        ...profile,
        skills: [...profile.skills, skill]
      })
      setNewSkill({})
      setShowAddDialog(null)
      setHasChanges(true)
    }
  }

  const addEducation = () => {
    if (profile && newEducation.degree && newEducation.institution && newEducation.graduationDate) {
      const education: Education = {
        id: `edu-${Date.now()}`,
        degree: newEducation.degree,
        institution: newEducation.institution,
        graduationDate: newEducation.graduationDate,
        gpa: newEducation.gpa
      }
      setProfile({
        ...profile,
        education: [...profile.education, education]
      })
      setNewEducation({})
      setShowAddDialog(null)
      setHasChanges(true)
    }
  }

  const removeItem = (type: string, id: string) => {
    if (profile) {
      const updatedProfile = { ...profile }
      switch (type) {
        case 'certification':
          updatedProfile.certifications = profile.certifications.filter(item => item.id !== id)
          break
        case 'language':
          updatedProfile.languages = profile.languages.filter(item => item.id !== id)
          break
        case 'skill':
          updatedProfile.skills = profile.skills.filter(item => item.id !== id)
          break
        case 'education':
          updatedProfile.education = profile.education.filter(item => item.id !== id)
          break
      }
      setProfile(updatedProfile)
      setHasChanges(true)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800"
    if (score >= 80) return "bg-blue-100 text-blue-800"
    if (score >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert': return 'bg-purple-100 text-purple-800'
      case 'advanced': return 'bg-blue-100 text-blue-800'
      case 'intermediate': return 'bg-green-100 text-green-800'
      case 'beginner': return 'bg-gray-100 text-gray-800'
      case 'native': case 'fluent': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
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
                  <p className="text-sm text-gray-300">My Profile</p>
                </div>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/my-profile" className="text-white font-medium">
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
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!profile) return null

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
                <p className="text-sm text-gray-300">My Profile</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/my-profile" className="text-white font-medium">
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
        {/* Header with Actions */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your professional information</p>
          </div>
          <div className="flex gap-3">
            {hasChanges && (
              <Alert className="w-auto p-3 border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 text-sm">
                  You have unsaved changes
                </AlertDescription>
              </Alert>
            )}
            {editMode ? (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditMode(false)
                    setHasChanges(false)
                  }}
                  className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                {hasChanges && (
                  <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 text-white hover:bg-blue-700">
                        <Send className="h-4 w-4 mr-2" />
                        Submit for Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Profile for Manager Review</DialogTitle>
                        <DialogDescription>
                          Your profile changes will be sent to {profile.manager_name} for approval.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="review-message">Message to Manager (Optional)</Label>
                          <Textarea
                            id="review-message"
                            placeholder="Add a note about your changes..."
                            value={reviewMessage}
                            onChange={(e) => setReviewMessage(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSubmitForReview}
                          disabled={saving}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          {saving ? 'Submitting...' : 'Submit for Review'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                <Button 
                  onClick={() => setEditMode(true)}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatar || `/placeholder.svg?height=96&width=96&text=${getInitials(profile.name)}`} alt={profile.name} />
                      <AvatarFallback className="bg-red-600 text-white text-2xl">
                        {getInitials(profile.name)}
                      </AvatarFallback>
                    </Avatar>
                    {editMode && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-red-600 hover:bg-red-700"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!editMode}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          value={profile.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          disabled={!editMode}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!editMode}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!editMode}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!editMode}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    id="about"
                    value={profile.about}
                    onChange={(e) => handleInputChange('about', e.target.value)}
                    disabled={!editMode}
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills & Technologies */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Skills & Technologies
                  </CardTitle>
                  {editMode && (
                    <Dialog open={showAddDialog === 'skill'} onOpenChange={(open) => setShowAddDialog(open ? 'skill' : null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Skill</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="skill-name">Skill Name</Label>
                            <Input
                              id="skill-name"
                              value={newSkill.name || ''}
                              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                              placeholder="e.g., React, Python, AWS"
                            />
                          </div>
                          <div>
                            <Label htmlFor="skill-level">Proficiency Level</Label>
                            <select
                              id="skill-level"
                              value={newSkill.level || ''}
                              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as Skill['level'] })}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Select level</option>
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowAddDialog(null)}>
                            Cancel
                          </Button>
                          <Button onClick={addSkill}>Add Skill</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-1">
                      <Badge className={`${getLevelColor(skill.level)} text-sm`}>
                        {skill.name} - {skill.level}
                      </Badge>
                      {editMode && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem('skill', skill.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certifications
                  </CardTitle>
                  {editMode && (
                    <Dialog open={showAddDialog === 'certification'} onOpenChange={(open) => setShowAddDialog(open ? 'certification' : null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Certification</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cert-name">Certification Name</Label>
                            <Input
                              id="cert-name"
                              value={newCertification.name || ''}
                              onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                              placeholder="e.g., AWS Solutions Architect"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cert-issuer">Issuer</Label>
                            <Input
                              id="cert-issuer"
                              value={newCertification.issuer || ''}
                              onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                              placeholder="e.g., Amazon Web Services"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cert-issue-date">Issue Date</Label>
                              <Input
                                id="cert-issue-date"
                                type="date"
                                value={newCertification.issueDate || ''}
                                onChange={(e) => setNewCertification({ ...newCertification, issueDate: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="cert-expiry-date">Expiry Date (Optional)</Label>
                              <Input
                                id="cert-expiry-date"
                                type="date"
                                value={newCertification.expiryDate || ''}
                                onChange={(e) => setNewCertification({ ...newCertification, expiryDate: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="cert-url">Credential URL (Optional)</Label>
                            <Input
                              id="cert-url"
                              type="url"
                              value={newCertification.credentialUrl || ''}
                              onChange={(e) => setNewCertification({ ...newCertification, credentialUrl: e.target.value })}
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowAddDialog(null)}>
                            Cancel
                          </Button>
                          <Button onClick={addCertification}>Add Certification</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{cert.name}</h4>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                          {cert.expiryDate && (
                            <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                          )}
                        </div>
                        {cert.credentialUrl && (
                          <a 
                            href={cert.credentialUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block"
                          >
                            View Credential →
                          </a>
                        )}
                      </div>
                      {editMode && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem('certification', cert.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Languages
                  </CardTitle>
                  {editMode && (
                    <Dialog open={showAddDialog === 'language'} onOpenChange={(open) => setShowAddDialog(open ? 'language' : null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Language</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="lang-name">Language</Label>
                            <Input
                              id="lang-name"
                              value={newLanguage.name || ''}
                              onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                              placeholder="e.g., Spanish, French, German"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lang-proficiency">Proficiency Level</Label>
                            <select
                              id="lang-proficiency"
                              value={newLanguage.proficiency || ''}
                              onChange={(e) => setNewLanguage({ ...newLanguage, proficiency: e.target.value as Language['proficiency'] })}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Select proficiency</option>
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Fluent">Fluent</option>
                              <option value="Native">Native</option>
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowAddDialog(null)}>
                            Cancel
                          </Button>
                          <Button onClick={addLanguage}>Add Language</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((language) => (
                    <div key={language.id} className="flex items-center gap-1">
                      <Badge className={`${getLevelColor(language.proficiency)} text-sm`}>
                        {language.name} - {language.proficiency}
                      </Badge>
                      {editMode && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem('language', language.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                  {editMode && (
                    <Dialog open={showAddDialog === 'education'} onOpenChange={(open) => setShowAddDialog(open ? 'education' : null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Education</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edu-degree">Degree</Label>
                            <Input
                              id="edu-degree"
                              value={newEducation.degree || ''}
                              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                              placeholder="e.g., Bachelor of Science in Computer Science"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edu-institution">Institution</Label>
                            <Input
                              id="edu-institution"
                              value={newEducation.institution || ''}
                              onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                              placeholder="e.g., University of Texas at Austin"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edu-graduation">Graduation Date</Label>
                              <Input
                                id="edu-graduation"
                                type="date"
                                value={newEducation.graduationDate || ''}
                                onChange={(e) => setNewEducation({ ...newEducation, graduationDate: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edu-gpa">GPA (Optional)</Label>
                              <Input
                                id="edu-gpa"
                                value={newEducation.gpa || ''}
                                onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
                                placeholder="e.g., 3.8"
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowAddDialog(null)}>
                            Cancel
                          </Button>
                          <Button onClick={addEducation}>Add Education</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Graduated: {new Date(edu.graduationDate).toLocaleDateString()}</span>
                          {edu.gpa && <span>GPA: {edu.gpa}</span>}
                        </div>
                      </div>
                      {editMode && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem('education', edu.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Previous Projects */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Previous Projects
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profile.previous_projects.map((project, index) => (
                    <div key={project.id} className="relative">
                      {/* Timeline connector */}
                      {index < profile.previous_projects.length - 1 && (
                        <div className="absolute left-3 top-8 w-0.5 h-20 bg-gray-200"></div>
                      )}
                      
                      <div className="flex items-start space-x-4">
                        {/* Timeline dot */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                          project.status === 'completed' ? 'bg-green-500' : 
                          project.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}>
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        
                        {/* Project content */}
                        <div className="flex-1 min-w-0 p-4 border border-gray-200 rounded-lg hover:border-red-600 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900 text-lg">{project.name}</h3>
                              <p className="text-gray-600 text-sm">{project.client}</p>
                              <p className="text-red-600 text-sm font-medium">{project.role}</p>
                            </div>
                          </div>

                          <p className="text-gray-700 text-sm mb-4 leading-relaxed">{project.description}</p>

                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge className={`text-xs ${
                              project.status === 'completed' ? 'bg-green-100 text-green-800' :
                              project.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {project.teamSize} team members
                            </Badge>
                          </div>

                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Technologies Used:</p>
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.map((tech, techIndex) => (
                                <Badge key={techIndex} variant="outline" className="text-xs border-slate-900 text-slate-900">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>
                                {new Date(project.startDate).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short' 
                                })} - {new Date(project.endDate).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short' 
                                })}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span>Duration: {(() => {
                                const start = new Date(project.startDate)
                                const end = new Date(project.endDate)
                                const diffTime = Math.abs(end.getTime() - start.getTime())
                                const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
                                return diffMonths < 12 ? `${diffMonths} months` : `${Math.floor(diffMonths / 12)} years`
                              })()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Score */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Performance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900 mb-2">{profile.employee_score}</div>
                  <Badge className={`${getScoreBadgeColor(profile.employee_score)} text-sm mb-4`}>
                    {profile.employee_score >= 90 ? 'Excellent' : 
                     profile.employee_score >= 80 ? 'Good' : 
                     profile.employee_score >= 70 ? 'Average' : 'Needs Improvement'}
                  </Badge>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-red-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${profile.employee_score}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Project */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Current Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900">{profile.current_project}</h4>
                    <p className="text-sm text-gray-600">Project Allocation</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Allocation</span>
                      <span>{profile.project_allocation_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${profile.project_allocation_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manager Information */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Reports To
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900">{profile.manager_name}</h4>
                    <p className="text-sm text-gray-600">Manager</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <a 
                      href={`mailto:${profile.manager_email}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {profile.manager_email}
                    </a>
                  </div>
                  
                  <Separator />
                  
                  {/* Review History Section */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-slate-900 text-sm">Review History</h5>
                    
                    <div className="space-y-2">
                      {profile.last_review_submission && (
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center text-gray-600">
                            <Send className="h-3 w-3 mr-1" />
                            <span>Last Submission:</span>
                          </div>
                          <span className="font-medium text-blue-700">
                            {formatDateOnly(profile.last_review_submission)}
                          </span>
                        </div>
                      )}
                      
                      {profile.last_review_approval && (
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center text-gray-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            <span>Last Approval:</span>
                          </div>
                          <span className="font-medium text-green-700">
                            {formatDateOnly(profile.last_review_approval)}
                          </span>
                        </div>
                      )}
                      
                      {!profile.last_review_submission && (
                        <div className="text-xs text-gray-500 italic">
                          No review submissions yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Department</span>
                    <span className="text-sm font-medium text-slate-900">{profile.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Level</span>
                    <Badge variant="outline" className="text-xs">
                      {profile.level}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hire Date</span>
                    <span className="text-sm font-medium text-slate-900">
                      {new Date(profile.hire_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
