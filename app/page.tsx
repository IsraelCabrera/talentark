"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Search, Users, MapPin, Globe, Grid3X3, List, ChevronUp, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationsMap } from "@/components/locations-map"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Update the mock data to include status and level
const employees = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@arkus.com",
    role: "employee",
    location: "New York, NY",
    english_level: "Native",
    status: "assigned",
    level: "T4",
    position: "Senior Full Stack Developer",
    company: "Arkus",
    profilePicture: null,
    technologies: [
      { name: "React", level: "Expert" },
      { name: "Node.js", level: "Expert" },
      { name: "PostgreSQL", level: "Advanced" },
      { name: "TypeScript", level: "Expert" },
    ],
    projects: ["E-commerce Platform", "CRM System"],
    certifications: [
      {
        title: "AWS Solutions Architect",
        issuer: "Amazon Web Services",
        issueDate: "2023-03-15",
        expirationDate: "2026-03-15",
      },
      { title: "React Professional", issuer: "Meta", issueDate: "2022-11-20", expirationDate: null },
    ],
    skills: [
      { name: "Team Leadership", level: "Advanced" },
      { name: "System Architecture", level: "Advanced" },
      { name: "Code Review", level: "Expert" },
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
    ],
  },
  {
    id: 2,
    name: "Miguel Rodriguez",
    email: "miguel.rodriguez@arkus.com",
    role: "employee",
    location: "Tijuana, MX",
    english_level: "Advanced",
    status: "available",
    level: "T3",
    position: "DevOps Engineer",
    company: "Arkus",
    profilePicture: null,
    technologies: [
      { name: "Docker", level: "Expert" },
      { name: "Kubernetes", level: "Advanced" },
      { name: "AWS", level: "Expert" },
      { name: "Python", level: "Advanced" },
    ],
    projects: ["Infrastructure Automation", "CI/CD Pipeline"],
    certifications: [
      {
        title: "AWS DevOps Professional",
        issuer: "Amazon Web Services",
        issueDate: "2023-01-10",
        expirationDate: "2026-01-10",
      },
      { title: "Kubernetes Administrator", issuer: "CNCF", issueDate: "2022-09-15", expirationDate: "2025-09-15" },
    ],
    skills: [
      { name: "Infrastructure Management", level: "Expert" },
      { name: "Automation", level: "Advanced" },
      { name: "Monitoring", level: "Advanced" },
    ],
    education: [
      {
        degreeTitle: "Bachelor of Systems Engineering",
        institutionName: "Universidad de Guadalajara",
        graduationDate: "2019-12-10",
      },
    ],
    languages: [
      { name: "Spanish", proficiency: "Native" },
      { name: "English", proficiency: "Fluent" },
    ],
  },
  {
    id: 3,
    name: "Emily Chen",
    email: "emily.chen@arkus.com",
    role: "employee",
    location: "Guadalajara, MX",
    english_level: "Native",
    status: "assigned",
    level: "T3",
    position: "UX/UI Designer",
    company: "Arkus",
    profilePicture: null,
    technologies: [
      { name: "Figma", level: "Expert" },
      { name: "Adobe Creative Suite", level: "Advanced" },
      { name: "HTML/CSS", level: "Advanced" },
      { name: "JavaScript", level: "Intermediate" },
    ],
    projects: ["Mobile App Redesign", "Design System"],
    certifications: [
      { title: "Google UX Design", issuer: "Google", issueDate: "2022-07-20", expirationDate: null },
      { title: "Adobe Certified Expert", issuer: "Adobe", issueDate: "2021-11-05", expirationDate: "2024-11-05" },
    ],
    skills: [
      { name: "User Research", level: "Advanced" },
      { name: "Prototyping", level: "Expert" },
      { name: "Design Systems", level: "Advanced" },
    ],
    education: [
      {
        degreeTitle: "Bachelor of Design",
        institutionName: "Universidad de Guadalajara",
        graduationDate: "2020-06-20",
      },
    ],
    languages: [
      { name: "Spanish", proficiency: "Native" },
      { name: "English", proficiency: "Native" },
      { name: "Mandarin", proficiency: "Fluent" },
    ],
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.wilson@arkus.com",
    role: "employee",
    location: "Medellín, COL",
    english_level: "Native",
    status: "available",
    level: "T4",
    position: "Data Scientist",
    company: "Arkus",
    profilePicture: null,
    technologies: [
      { name: "Python", level: "Expert" },
      { name: "Machine Learning", level: "Advanced" },
      { name: "SQL", level: "Expert" },
      { name: "TensorFlow", level: "Advanced" },
    ],
    projects: ["Predictive Analytics", "Customer Segmentation"],
    certifications: [
      {
        title: "Google Cloud ML Engineer",
        issuer: "Google Cloud",
        issueDate: "2023-02-28",
        expirationDate: "2025-02-28",
      },
      {
        title: "Microsoft Azure Data Scientist",
        issuer: "Microsoft",
        issueDate: "2022-10-15",
        expirationDate: "2024-10-15",
      },
    ],
    skills: [
      { name: "Statistical Analysis", level: "Expert" },
      { name: "Data Visualization", level: "Advanced" },
      { name: "Machine Learning", level: "Expert" },
    ],
    education: [
      {
        degreeTitle: "Master of Data Science",
        institutionName: "Universidad Nacional de Colombia",
        graduationDate: "2021-08-30",
      },
    ],
    languages: [
      { name: "Spanish", proficiency: "Native" },
      { name: "English", proficiency: "Native" },
    ],
  },
  {
    id: 5,
    name: "Ana Silva",
    email: "ana.silva@arkus.com",
    role: "employee",
    location: "Bogotá, COL",
    english_level: "Intermediate",
    status: "assigned",
    level: "T2",
    position: "Backend Developer",
    company: "Arkus",
    profilePicture: null,
    technologies: [
      { name: "Java", level: "Expert" },
      { name: "Spring Boot", level: "Advanced" },
      { name: "MongoDB", level: "Advanced" },
      { name: "Redis", level: "Intermediate" },
    ],
    projects: ["Microservices Architecture", "Payment Gateway"],
    certifications: [
      { title: "Oracle Java Professional", issuer: "Oracle", issueDate: "2022-12-05", expirationDate: null },
      { title: "MongoDB Developer", issuer: "MongoDB", issueDate: "2023-04-18", expirationDate: "2026-04-18" },
    ],
    skills: [
      { name: "API Development", level: "Advanced" },
      { name: "Database Design", level: "Advanced" },
      { name: "Microservices", level: "Intermediate" },
    ],
    education: [
      {
        degreeTitle: "Bachelor of Software Engineering",
        institutionName: "Universidad Nacional de Colombia",
        graduationDate: "2021-11-25",
      },
    ],
    languages: [
      { name: "Spanish", proficiency: "Native" },
      { name: "English", proficiency: "Intermediate" },
    ],
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.kim@arkus.com",
    role: "employee",
    location: "Cali, COL",
    english_level: "Advanced",
    status: "available",
    level: "T2",
    position: "Mobile Developer",
    company: "Arkus",
    profilePicture: null,
    technologies: [
      { name: "React Native", level: "Expert" },
      { name: "Swift", level: "Advanced" },
      { name: "Kotlin", level: "Advanced" },
      { name: "Firebase", level: "Advanced" },
    ],
    projects: ["Cross-platform Mobile App", "iOS Banking App"],
    certifications: [
      { title: "Google Associate Android Developer", issuer: "Google", issueDate: "2022-08-12", expirationDate: null },
      { title: "Apple iOS Developer", issuer: "Apple", issueDate: "2023-01-20", expirationDate: null },
    ],
    skills: [
      { name: "Mobile UI/UX", level: "Advanced" },
      { name: "App Store Optimization", level: "Intermediate" },
      { name: "Cross-platform Development", level: "Expert" },
    ],
    education: [
      {
        degreeTitle: "Bachelor of Computer Engineering",
        institutionName: "Universidad Nacional de Colombia",
        graduationDate: "2020-12-15",
      },
    ],
    languages: [
      { name: "Spanish", proficiency: "Native" },
      { name: "English", proficiency: "Fluent" },
      { name: "Korean", proficiency: "Native" },
    ],
  },
]

type ViewMode = "grid" | "list"
type SortField = "name" | "location" | "level" | "status" | "technologies"
type SortOrder = "asc" | "desc"

// Local storage keys for persistence
const STORAGE_KEYS = {
  VIEW_MODE: "talentark_view_mode",
  SORT_FIELD: "talentark_sort_field",
  SORT_ORDER: "talentark_sort_order",
  SEARCH_QUERY: "talentark_search_query",
}

export default function TalentDirectory() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [showLocationsMap, setShowLocationsMap] = useState(false)
  const router = useRouter()

  // Load preferences from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as ViewMode
      const savedSortField = localStorage.getItem(STORAGE_KEYS.SORT_FIELD) as SortField
      const savedSortOrder = localStorage.getItem(STORAGE_KEYS.SORT_ORDER) as SortOrder
      const savedSearchQuery = localStorage.getItem(STORAGE_KEYS.SEARCH_QUERY) || ""

      if (savedViewMode) setViewMode(savedViewMode)
      if (savedSortField) setSortField(savedSortField)
      if (savedSortOrder) setSortOrder(savedSortOrder)
      if (savedSearchQuery) setSearchQuery(savedSearchQuery)
    }
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode)
    }
  }, [viewMode])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SORT_FIELD, sortField)
    }
  }, [sortField])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SORT_ORDER, sortOrder)
    }
  }, [sortOrder])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SEARCH_QUERY, searchQuery)
    }
  }, [searchQuery])

  // Filter employees based on search query
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) {
      return employees
    }

    const query = searchQuery.toLowerCase().trim()

    return employees.filter((employee) => {
      // Search in name
      if (employee.name.toLowerCase().includes(query)) return true

      // Search in position/role
      if (employee.position.toLowerCase().includes(query)) return true

      // Search in email
      if (employee.email.toLowerCase().includes(query)) return true

      // Search in location
      if (employee.location.toLowerCase().includes(query)) return true

      // Search in technologies
      if (employee.technologies.some((tech) => tech.name.toLowerCase().includes(query))) return true

      // Search in projects
      if (employee.projects.some((project) => project.toLowerCase().includes(query))) return true

      // Search in certifications
      if (employee.certifications.some((cert) => cert.title.toLowerCase().includes(query))) return true

      // Search in status
      if (employee.status.toLowerCase().includes(query)) return true

      // Search in level
      if (employee.level.toLowerCase().includes(query)) return true

      return false
    })
  }, [searchQuery])

  // Sort filtered employees based on current sort settings
  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "location":
          aValue = a.location.toLowerCase()
          bValue = b.location.toLowerCase()
          break
        case "level":
          aValue = Number.parseInt(a.level.replace("T", ""))
          bValue = Number.parseInt(b.level.replace("T", ""))
          break
        case "status":
          aValue = a.status.toLowerCase()
          bValue = b.status.toLowerCase()
          break
        case "technologies":
          // Sort by the first technology name
          aValue = a.technologies[0]?.name.toLowerCase() || ""
          bValue = b.technologies[0]?.name.toLowerCase() || ""
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }, [filteredEmployees, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const handleTechnologiesClick = () => {
    router.push("/analytics?scrollTo=technologies")
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-sm font-medium text-arkus-navy hover:text-arkus-red transition-colors"
    >
      <span>{children}</span>
      {sortField === field && (
        <span className="ml-1">
          {sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </span>
      )}
    </button>
  )

  return (
    <div className="min-h-screen bg-arkus-gray">
      {/* Header */}
      <header className="bg-arkus-navy border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Image src="/images/arkus-logo.png" alt="Arkus Logo" width={40} height={40} className="mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">TalentArk</h1>
                <p className="text-sm text-gray-300">Arkus Internal Talent Directory</p>
              </div>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-arkus-red font-medium hover:text-red-300 transition-colors">
                Directory
              </Link>
              <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
                My Profile
              </Link>
              <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">
                Analytics
              </Link>
              <Link href="/import" className="text-gray-300 hover:text-white transition-colors">
                Import
              </Link>
              <Link href="/admin/activity-log" className="text-gray-300 hover:text-white transition-colors">
                Activity Log
              </Link>
              <Link href="/test-connection" className="text-gray-300 hover:text-white transition-colors">
                Test DB
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, role, or technology..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-10 border-gray-300 focus:border-arkus-red focus:ring-arkus-red"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[180px] border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="tijuana-mx">Tijuana, MX</SelectItem>
                  <SelectItem value="culiacan-mx">Culiacán, MX</SelectItem>
                  <SelectItem value="guadalajara-mx">Guadalajara, MX</SelectItem>
                  <SelectItem value="colima-mx">Colima, MX</SelectItem>
                  <SelectItem value="aguascalientes-mx">Aguascalientes, MX</SelectItem>
                  <SelectItem value="cdmx-mx">CDMX, MX</SelectItem>
                  <SelectItem value="medellin-col">Medellín, COL</SelectItem>
                  <SelectItem value="cali-col">Cali, COL</SelectItem>
                  <SelectItem value="bogota-col">Bogotá, COL</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px] border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                  <SelectValue placeholder="Technology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technologies</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="nodejs">Node.js</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="aws">AWS</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px] border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px] border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="T1">T1</SelectItem>
                  <SelectItem value="T2">T2</SelectItem>
                  <SelectItem value="T3">T3</SelectItem>
                  <SelectItem value="T4">T4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-arkus-navy font-medium">View:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleViewModeChange("list")}
                  className={`px-3 py-2 text-sm flex items-center space-x-1 transition-colors ${
                    viewMode === "list" ? "bg-arkus-red text-white" : "bg-white text-arkus-navy hover:bg-gray-50"
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span>List</span>
                </button>
                <button
                  onClick={() => handleViewModeChange("grid")}
                  className={`px-3 py-2 text-sm flex items-center space-x-1 transition-colors ${
                    viewMode === "grid" ? "bg-arkus-red text-white" : "bg-white text-arkus-navy hover:bg-gray-50"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span>Cards</span>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {searchQuery && (
                <div className="text-sm text-gray-500">
                  Showing {sortedEmployees.length} of {employees.length} employees
                </div>
              )}
              {viewMode === "list" && (
                <div className="text-sm text-gray-500">
                  Click column headers to sort • Currently sorted by{" "}
                  <span className="font-medium text-arkus-navy">
                    {sortField.charAt(0).toUpperCase() + sortField.slice(1)}
                  </span>{" "}
                  ({sortOrder === "asc" ? "A-Z" : "Z-A"})
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-arkus-red" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{searchQuery ? "Filtered" : "Total"} Employees</p>
                  <p className="text-2xl font-bold text-arkus-navy">{sortedEmployees.length}</p>
                  {searchQuery && <p className="text-xs text-gray-500">of {employees.length} total</p>}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setShowLocationsMap(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-arkus-red" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Locations</p>
                  <p className="text-2xl font-bold text-arkus-navy">
                    {new Set(sortedEmployees.map((emp) => emp.location)).size}
                  </p>
                  <p className="text-xs text-arkus-red hover:text-arkus-red-hover">Click to view map</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleTechnologiesClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-arkus-red" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Technologies</p>
                  <p className="text-2xl font-bold text-arkus-navy">
                    {new Set(sortedEmployees.flatMap((emp) => emp.technologies.map((tech) => tech.name))).size}+
                  </p>
                  <p className="text-xs text-arkus-red hover:text-arkus-red-hover">Click to view analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Badge className="h-8 w-8 text-arkus-red" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Certifications</p>
                  <p className="text-2xl font-bold text-arkus-navy">
                    {sortedEmployees.reduce((total, emp) => total + emp.certifications.length, 0)}+
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* No Results Message */}
        {searchQuery && sortedEmployees.length === 0 && (
          <Card className="border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-arkus-navy mb-2">No employees found</h3>
                <p className="text-sm mb-4">
                  No employees match your search for "{searchQuery}". Try adjusting your search terms.
                </p>
                <Button
                  onClick={clearSearch}
                  variant="outline"
                  className="border-arkus-red text-arkus-red hover:bg-arkus-red hover:text-white bg-transparent"
                >
                  Clear Search
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Employee Grid/List */}
        {sortedEmployees.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedEmployees.map((employee) => (
                  <Card key={employee.id} className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              employee.profilePicture ||
                              `/placeholder.svg?height=48&width=48&text=${
                                employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("") || "/placeholder.svg"
                              }`
                            }
                          />
                          <AvatarFallback className="bg-arkus-red text-white">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-arkus-navy">{employee.name}</CardTitle>
                          <CardDescription className="text-gray-600">{employee.position}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {employee.location}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Globe className="h-4 w-4 mr-2" />
                            English: {employee.english_level}
                          </div>
                          <div className="flex gap-1">
                            <Badge
                              variant={employee.status === "available" ? "default" : "secondary"}
                              className={`text-xs ${
                                employee.status === "available"
                                  ? "bg-arkus-red text-white hover:bg-arkus-red-hover"
                                  : "bg-gray-200 text-arkus-navy hover:bg-gray-300"
                              }`}
                            >
                              {employee.status === "available" ? "Available" : "Assigned"}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-arkus-navy text-arkus-navy">
                              {employee.level}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-arkus-navy mb-2">Top Technologies:</p>
                          <div className="flex flex-wrap gap-1">
                            {employee.technologies.slice(0, 3).map((tech, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-gray-200 text-arkus-navy hover:bg-gray-300"
                              >
                                {tech.name}
                              </Badge>
                            ))}
                            {employee.technologies.length > 3 && (
                              <Badge variant="outline" className="text-xs border-gray-400 text-gray-600">
                                +{employee.technologies.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-arkus-navy mb-2">Recent Projects:</p>
                          <div className="space-y-1">
                            {employee.projects.slice(0, 2).map((project, index) => (
                              <p key={index} className="text-xs text-gray-600">
                                • {project}
                              </p>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <Link href={`/profile/${employee.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-arkus-red text-arkus-red hover:bg-arkus-red hover:text-white bg-transparent"
                              >
                                View Profile
                              </Button>
                            </Link>
                            <Button size="sm" className="bg-arkus-red text-white hover:bg-arkus-red-hover">
                              Export PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* List Header */}
                <div className="bg-arkus-gray px-6 py-3 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-arkus-navy">
                    <div className="col-span-3">
                      <SortButton field="name">Name & Role</SortButton>
                    </div>
                    <div className="col-span-2">
                      <SortButton field="location">Location</SortButton>
                    </div>
                    <div className="col-span-1">
                      <SortButton field="status">Status</SortButton>
                    </div>
                    <div className="col-span-1">
                      <SortButton field="level">Level</SortButton>
                    </div>
                    <div className="col-span-3">
                      <SortButton field="technologies">Top Technologies</SortButton>
                    </div>
                    <div className="col-span-2">
                      <span>Actions</span>
                    </div>
                  </div>
                </div>

                {/* List Items */}
                <div className="divide-y divide-gray-200">
                  {sortedEmployees.map((employee) => (
                    <div key={employee.id} className="px-6 py-4 hover:bg-arkus-gray transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Name & Role */}
                        <div className="col-span-3 flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                employee.profilePicture ||
                                `/placeholder.svg?height=40&width=40&text=${
                                  employee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("") || "/placeholder.svg"
                                }`
                              }
                            />
                            <AvatarFallback className="bg-arkus-red text-white">
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-arkus-navy">{employee.name}</p>
                            <p className="text-sm text-gray-600">{employee.position}</p>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="col-span-2">
                          <p className="text-sm text-arkus-navy">{employee.location}</p>
                        </div>

                        {/* Status */}
                        <div className="col-span-1">
                          <Badge
                            variant={employee.status === "available" ? "default" : "secondary"}
                            className={`text-xs ${
                              employee.status === "available"
                                ? "bg-arkus-red text-white hover:bg-arkus-red-hover"
                                : "bg-gray-200 text-arkus-navy hover:bg-gray-300"
                            }`}
                          >
                            {employee.status === "available" ? "Available" : "Assigned"}
                          </Badge>
                        </div>

                        {/* Level */}
                        <div className="col-span-1">
                          <Badge variant="outline" className="text-xs border-arkus-navy text-arkus-navy">
                            {employee.level}
                          </Badge>
                        </div>

                        {/* Technologies */}
                        <div className="col-span-3">
                          <p className="text-sm text-arkus-navy">
                            {employee.technologies
                              .slice(0, 3)
                              .map((tech) => tech.name)
                              .join(", ")}
                            {employee.technologies.length > 3 && ` +${employee.technologies.length - 3} more`}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex space-x-2">
                          <Link href={`/profile/${employee.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-arkus-red text-arkus-red hover:bg-arkus-red hover:text-white bg-transparent"
                            >
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Locations Map Modal */}
      {showLocationsMap && <LocationsMap employees={sortedEmployees} onClose={() => setShowLocationsMap(false)} />}
    </div>
  )
}
