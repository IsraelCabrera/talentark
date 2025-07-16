"use client"

import { Users, ChevronDown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

// Mock organizational data with reporting relationships
const orgData = {
  id: 9,
  name: "Admin User",
  email: "admin@arkus.com",
  position: "Administrator",
  level: "T4",
  directReports: [
    {
      id: 7,
      name: "John Manager",
      email: "john.manager@arkus.com",
      position: "Engineering Manager",
      level: "T4",
      directReports: [
        {
          id: 1,
          name: "Sarah Johnson",
          email: "sarah.johnson@arkus.com",
          position: "Senior Full Stack Developer",
          level: "T4",
          directReports: [],
        },
        {
          id: 3,
          name: "Emily Chen",
          email: "emily.chen@arkus.com",
          position: "UX/UI Designer",
          level: "T3",
          directReports: [],
        },
        {
          id: 4,
          name: "James Wilson",
          email: "james.wilson@arkus.com",
          position: "Data Scientist",
          level: "T4",
          directReports: [],
        },
      ],
    },
    {
      id: 8,
      name: "Maria HR",
      email: "maria.hr@arkus.com",
      position: "HR Manager",
      level: "T3",
      directReports: [
        {
          id: 2,
          name: "Miguel Rodriguez",
          email: "miguel.rodriguez@arkus.com",
          position: "DevOps Engineer",
          level: "T3",
          directReports: [],
        },
        {
          id: 5,
          name: "Ana Silva",
          email: "ana.silva@arkus.com",
          position: "Backend Developer",
          level: "T2",
          directReports: [],
        },
        {
          id: 6,
          name: "David Kim",
          email: "david.kim@arkus.com",
          position: "Mobile Developer",
          level: "T2",
          directReports: [],
        },
      ],
    },
  ],
}

interface OrgNodeProps {
  person: any
  level: number
}

function OrgNode({ person, level }: OrgNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)

  return (
    <div className="space-y-4">
      <Card className="hover:shadow-md transition-shadow border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={`/placeholder.svg?height=48&width=48&text=${person.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}`}
                />
                <AvatarFallback className="bg-arkus-red text-white">
                  {person.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link
                  href={`/profile/${person.id}`}
                  className="font-semibold text-arkus-red hover:text-arkus-red-hover"
                >
                  {person.name}
                </Link>
                <p className="text-sm text-gray-600">{person.position}</p>
                <p className="text-xs text-gray-500">{person.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-arkus-navy text-arkus-navy">
                Level {person.level}
              </Badge>
              {person.directReports && person.directReports.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="p-1 h-8 w-8">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
          {person.directReports && person.directReports.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              {person.directReports.length} direct report{person.directReports.length !== 1 ? "s" : ""}
            </div>
          )}
        </CardContent>
      </Card>

      {isExpanded && person.directReports && person.directReports.length > 0 && (
        <div className="ml-8 border-l-2 border-gray-200 pl-4 space-y-4">
          {person.directReports.map((report: any) => (
            <OrgNode key={report.id} person={report} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrgChart() {
  return (
    <div className="min-h-screen bg-arkus-gray">
      {/* Header */}
      <header className="bg-arkus-navy border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Image src="/images/arkus-logo.png" alt="Arkus Logo" width={40} height={40} className="mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">Organization Chart</h1>
                <p className="text-sm text-gray-300">Company reporting structure and hierarchy</p>
              </div>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white">
                Directory
              </Link>
              <Link href="/profile" className="text-gray-300 hover:text-white">
                My Profile
              </Link>
              <Link href="/org-chart" className="text-arkus-red font-medium">
                Org Chart
              </Link>
              <Link href="/analytics" className="text-gray-300 hover:text-white">
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-arkus-red" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-arkus-navy">9</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-arkus-red" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Managers</p>
                  <p className="text-2xl font-bold text-arkus-navy">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-arkus-red" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reporting Levels</p>
                  <p className="text-2xl font-bold text-arkus-navy">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organization Chart */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle>Company Hierarchy</CardTitle>
          </CardHeader>
          <CardContent>
            <OrgNode person={orgData} level={0} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
