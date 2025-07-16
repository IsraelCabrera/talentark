"use client"

import { ArrowLeft, Users, UserCheck, UserX, TrendingUp, BarChart3, PieChart, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

// Mock analytics data
const analyticsData = {
  totalEmployees: 156,
  availableEmployees: 42,
  assignedEmployees: 114,
  locationDistribution: [
    { location: "Tijuana, MX", count: 45, percentage: 28.8 },
    { location: "Guadalajara, MX", count: 38, percentage: 24.4 },
    { location: "CDMX, MX", count: 32, percentage: 20.5 },
    { location: "Medellín, COL", count: 25, percentage: 16.0 },
    { location: "Bogotá, COL", count: 16, percentage: 10.3 },
  ],
  levelDistribution: [
    { level: "T1", count: 28, percentage: 17.9 },
    { level: "T2", count: 45, percentage: 28.8 },
    { level: "T3", count: 52, percentage: 33.3 },
    { level: "T4", count: 31, percentage: 19.9 },
  ],
  technologyTrends: [
    { technology: "React", count: 89, trend: "+12%" },
    { technology: "Node.js", count: 76, trend: "+8%" },
    { technology: "Python", count: 64, trend: "+15%" },
    { technology: "AWS", count: 58, trend: "+22%" },
    { technology: "TypeScript", count: 52, trend: "+18%" },
  ],
  monthlyGrowth: [
    { month: "Jan", employees: 142 },
    { month: "Feb", employees: 145 },
    { month: "Mar", employees: 148 },
    { month: "Apr", employees: 151 },
    { month: "May", employees: 154 },
    { month: "Jun", employees: 156 },
  ],
  profileCompleteness: {
    complete: 134,
    incomplete: 22,
    averageScore: 8.7,
  },
}

export default function AnalyticsPage() {
  const searchParams = useSearchParams()
  const scrollTo = searchParams.get("scrollTo")

  useEffect(() => {
    if (scrollTo === "technologies") {
      // Wait for the component to render, then scroll to the technologies section
      setTimeout(() => {
        const element = document.getElementById("top-technologies-section")
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })

          // Add highlight animation
          element.classList.add("animate-pulse", "ring-2", "ring-arkus-red", "ring-opacity-50")

          // Remove highlight after 3 seconds
          setTimeout(() => {
            element.classList.remove("animate-pulse", "ring-2", "ring-arkus-red", "ring-opacity-50")
          }, 3000)
        }
      }, 100)
    }
  }, [scrollTo])

  return (
    <div className="min-h-screen bg-arkus-gray">
      {/* Header */}
      <header className="bg-arkus-navy border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Image src="/images/arkus-logo.png" alt="Arkus Logo" width={40} height={40} className="mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-sm text-gray-300">Talent insights and metrics</p>
              </div>
            </div>
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
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-arkus-red" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-arkus-navy">{analyticsData.totalEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-arkus-navy">{analyticsData.availableEmployees}</p>
                  <p className="text-xs text-gray-500">
                    {((analyticsData.availableEmployees / analyticsData.totalEmployees) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserX className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Assigned</p>
                  <p className="text-2xl font-bold text-arkus-navy">{analyticsData.assignedEmployees}</p>
                  <p className="text-xs text-gray-500">
                    {((analyticsData.assignedEmployees / analyticsData.totalEmployees) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Profile Score</p>
                  <p className="text-2xl font-bold text-arkus-navy">{analyticsData.profileCompleteness.averageScore}</p>
                  <p className="text-xs text-gray-500">out of 10</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Location Distribution */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-arkus-navy flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Location Distribution
              </CardTitle>
              <CardDescription>Employee distribution across locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.locationDistribution.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-arkus-red rounded-full" />
                      <span className="text-sm font-medium text-arkus-navy">{location.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{location.count}</span>
                      <Badge variant="outline" className="border-arkus-navy text-arkus-navy">
                        {location.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Level Distribution */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-arkus-navy flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Level Distribution
              </CardTitle>
              <CardDescription>Employee seniority levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.levelDistribution.map((level, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-arkus-red rounded-full" />
                      <span className="text-sm font-medium text-arkus-navy">Level {level.level}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{level.count}</span>
                      <Badge variant="outline" className="border-arkus-navy text-arkus-navy">
                        {level.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technology Trends */}
          <Card id="top-technologies-section" className="border-gray-200 transition-all duration-300 rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg text-arkus-navy flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Top Technologies
              </CardTitle>
              <CardDescription>Most popular technologies and growth trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.technologyTrends.map((tech, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-arkus-red rounded-full" />
                      <span className="text-sm font-medium text-arkus-navy">{tech.technology}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{tech.count} employees</span>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{tech.trend}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Growth */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-arkus-navy flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Monthly Growth
              </CardTitle>
              <CardDescription>Employee count over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.monthlyGrowth.map((month, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-arkus-red rounded-full" />
                      <span className="text-sm font-medium text-arkus-navy">{month.month} 2024</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{month.employees} employees</span>
                      {index > 0 && (
                        <Badge
                          className={`${
                            month.employees > analyticsData.monthlyGrowth[index - 1].employees
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }`}
                        >
                          {month.employees > analyticsData.monthlyGrowth[index - 1].employees ? "↗" : "→"}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completeness Summary */}
        <Card className="border-gray-200 mt-8">
          <CardHeader>
            <CardTitle className="text-lg text-arkus-navy">Profile Completeness Overview</CardTitle>
            <CardDescription>Summary of employee profile status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analyticsData.profileCompleteness.complete}
                </div>
                <p className="text-sm text-gray-600">Complete Profiles</p>
                <p className="text-xs text-gray-500">
                  {((analyticsData.profileCompleteness.complete / analyticsData.totalEmployees) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {analyticsData.profileCompleteness.incomplete}
                </div>
                <p className="text-sm text-gray-600">Incomplete Profiles</p>
                <p className="text-xs text-gray-500">
                  {((analyticsData.profileCompleteness.incomplete / analyticsData.totalEmployees) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-arkus-red mb-2">
                  {analyticsData.profileCompleteness.averageScore}
                </div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-xs text-gray-500">out of 10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
