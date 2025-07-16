"use client"

import { useState } from "react"
import { ArrowLeft, Activity, User, Filter, Search, Download, Upload, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

// Mock activity log data
const activityLog = [
  {
    id: 1,
    action: "bulk_import",
    description: "Imported 25 employee records from employees_batch_1.xlsx",
    user: "Carlos Ruiz",
    userRole: "hr",
    timestamp: "2024-01-15T10:30:00Z",
    details: {
      fileName: "employees_batch_1.xlsx",
      recordsProcessed: 25,
      recordsSuccess: 23,
      recordsErrors: 2,
    },
    ipAddress: "192.168.1.100",
  },
  {
    id: 2,
    action: "profile_update",
    description: "Updated profile for Sarah Johnson",
    user: "Sarah Johnson",
    userRole: "employee",
    timestamp: "2024-01-15T09:15:00Z",
    details: {
      profileId: 1,
      fieldsUpdated: ["position", "skills", "certifications"],
    },
    ipAddress: "192.168.1.105",
  },
  {
    id: 3,
    action: "profile_review",
    description: "Approved profile review for Miguel Rodriguez",
    user: "Sofia Gonzalez",
    userRole: "admin",
    timestamp: "2024-01-14T16:45:00Z",
    details: {
      profileId: 2,
      reviewStatus: "approved",
      reviewNotes: "Profile complete and verified",
    },
    ipAddress: "192.168.1.102",
  },
  {
    id: 4,
    action: "bulk_import",
    description: "Imported 12 employee records from new_hires_q1.csv",
    user: "Sofia Gonzalez",
    userRole: "admin",
    timestamp: "2024-01-10T14:15:00Z",
    details: {
      fileName: "new_hires_q1.csv",
      recordsProcessed: 12,
      recordsSuccess: 12,
      recordsErrors: 0,
    },
    ipAddress: "192.168.1.102",
  },
  {
    id: 5,
    action: "profile_create",
    description: "Created new profile for David Kim",
    user: "Maria HR",
    userRole: "hr",
    timestamp: "2024-01-08T11:30:00Z",
    details: {
      profileId: 6,
      profileName: "David Kim",
    },
    ipAddress: "192.168.1.103",
  },
  {
    id: 6,
    action: "profile_delete",
    description: "Deleted profile for Former Employee",
    user: "Carlos Ruiz",
    userRole: "hr",
    timestamp: "2024-01-05T13:20:00Z",
    details: {
      profileId: 99,
      profileName: "Former Employee",
      reason: "Employee termination",
    },
    ipAddress: "192.168.1.100",
  },
  {
    id: 7,
    action: "bulk_export",
    description: "Exported employee directory to PDF",
    user: "Laura Martinez",
    userRole: "pm",
    timestamp: "2024-01-03T10:00:00Z",
    details: {
      exportType: "pdf",
      recordCount: 60,
    },
    ipAddress: "192.168.1.110",
  },
  {
    id: 8,
    action: "profile_update",
    description: "Updated profile for Emily Chen",
    user: "Emily Chen",
    userRole: "employee",
    timestamp: "2024-01-02T15:30:00Z",
    details: {
      profileId: 3,
      fieldsUpdated: ["about", "technologies"],
    },
    ipAddress: "192.168.1.108",
  },
]

export default function ActivityLogPage() {
  const [selectedAction, setSelectedAction] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<string>("all")

  const filteredActivities = activityLog.filter((activity) => {
    const matchesAction = selectedAction === "all" || activity.action === selectedAction
    const matchesUser = selectedUser === "all" || activity.user === selectedUser
    const matchesSearch =
      searchQuery === "" ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesAction && matchesUser && matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "bulk_import":
        return <Upload className="h-4 w-4 text-blue-500" />
      case "bulk_export":
        return <Download className="h-4 w-4 text-green-500" />
      case "profile_update":
        return <Edit className="h-4 w-4 text-yellow-500" />
      case "profile_create":
        return <User className="h-4 w-4 text-green-500" />
      case "profile_delete":
        return <Trash2 className="h-4 w-4 text-red-500" />
      case "profile_review":
        return <Activity className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case "bulk_import":
        return <Badge className="bg-blue-100 text-blue-800">Import</Badge>
      case "bulk_export":
        return <Badge className="bg-green-100 text-green-800">Export</Badge>
      case "profile_update":
        return <Badge className="bg-yellow-100 text-yellow-800">Update</Badge>
      case "profile_create":
        return <Badge className="bg-green-100 text-green-800">Create</Badge>
      case "profile_delete":
        return <Badge className="bg-red-100 text-red-800">Delete</Badge>
      case "profile_review":
        return <Badge className="bg-purple-100 text-purple-800">Review</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-arkus-red text-white">Admin</Badge>
      case "hr":
        return <Badge className="bg-blue-100 text-blue-800">HR</Badge>
      case "pm":
        return <Badge className="bg-green-100 text-green-800">PM</Badge>
      case "employee":
        return <Badge variant="outline">Employee</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const uniqueUsers = Array.from(new Set(activityLog.map((activity) => activity.user)))

  return (
    <div className="min-h-screen bg-arkus-gray">
      {/* Header */}
      <header className="bg-arkus-navy border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Image src="/images/arkus-logo.png" alt="Arkus Logo" width={40} height={40} className="mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">Activity Log</h1>
                <p className="text-sm text-gray-300">Track all system activities and changes</p>
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
        {/* Filters */}
        <Card className="border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-arkus-navy flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-arkus-navy mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-arkus-red focus:ring-arkus-red"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-arkus-navy mb-2 block">Action Type</label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger className="border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="bulk_import">Bulk Import</SelectItem>
                    <SelectItem value="bulk_export">Bulk Export</SelectItem>
                    <SelectItem value="profile_update">Profile Update</SelectItem>
                    <SelectItem value="profile_create">Profile Create</SelectItem>
                    <SelectItem value="profile_delete">Profile Delete</SelectItem>
                    <SelectItem value="profile_review">Profile Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-arkus-navy mb-2 block">User</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {uniqueUsers.map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-arkus-navy mb-2 block">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-arkus-red" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold text-arkus-navy">{filteredActivities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Upload className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Imports</p>
                  <p className="text-2xl font-bold text-arkus-navy">
                    {filteredActivities.filter((a) => a.action === "bulk_import").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Edit className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Profile Updates</p>
                  <p className="text-2xl font-bold text-arkus-navy">
                    {filteredActivities.filter((a) => a.action === "profile_update").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-arkus-navy">{uniqueUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity List */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-arkus-navy">Recent Activities</CardTitle>
            <CardDescription>
              Showing {filteredActivities.length} of {activityLog.length} activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">{getActionIcon(activity.action)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getActionBadge(activity.action)}
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{formatDate(activity.timestamp)}</span>
                        </div>
                        <p className="text-sm font-medium text-arkus-navy mb-2">{activity.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={`/placeholder.svg?height=24&width=24&text=${activity.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}`}
                              />
                              <AvatarFallback className="bg-arkus-red text-white text-xs">
                                {activity.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{activity.user}</span>
                            {getRoleBadge(activity.userRole)}
                          </div>
                          <span>IP: {activity.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Details */}
                  {activity.details && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600 space-y-1">
                        {activity.action === "bulk_import" && activity.details.fileName && (
                          <>
                            <div className="flex justify-between">
                              <span>File:</span>
                              <span className="font-medium">{activity.details.fileName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Records Processed:</span>
                              <span className="font-medium">{activity.details.recordsProcessed}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Success:</span>
                              <span className="font-medium text-green-600">{activity.details.recordsSuccess}</span>
                            </div>
                            {activity.details.recordsErrors > 0 && (
                              <div className="flex justify-between">
                                <span>Errors:</span>
                                <span className="font-medium text-red-600">{activity.details.recordsErrors}</span>
                              </div>
                            )}
                          </>
                        )}
                        {activity.action === "profile_update" && activity.details.fieldsUpdated && (
                          <div className="flex justify-between">
                            <span>Fields Updated:</span>
                            <span className="font-medium">{activity.details.fieldsUpdated.join(", ")}</span>
                          </div>
                        )}
                        {activity.action === "profile_review" && activity.details.reviewStatus && (
                          <>
                            <div className="flex justify-between">
                              <span>Review Status:</span>
                              <span className="font-medium capitalize">{activity.details.reviewStatus}</span>
                            </div>
                            {activity.details.reviewNotes && (
                              <div>
                                <span>Notes:</span>
                                <p className="font-medium mt-1">{activity.details.reviewNotes}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No activities found matching your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
