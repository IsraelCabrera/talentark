"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

// Mock current user - in a real app, this would come from authentication
const currentUser = {
  id: 1,
  role: "hr", // This user has permission to set scores
}

// Mock data for profile reviews
const profileReviews = [
  {
    id: 1,
    user: {
      id: 1,
      name: "Sarah Johnson",
      position: "Senior Full Stack Developer",
      email: "sarah.johnson@arkus.com",
    },
    lastReviewedDate: "2024-01-15",
    approvalStatus: "approved" as const,
    reviewedBy: "Carlos Ruiz",
    reviewNotes: "Profile is complete and up to date. All certifications verified.",
    companyScore: 9,
  },
  {
    id: 2,
    user: {
      id: 2,
      name: "Miguel Rodriguez",
      position: "DevOps Engineer",
      email: "miguel.rodriguez@arkus.com",
    },
    lastReviewedDate: "2024-01-10",
    approvalStatus: "needs_changes" as const,
    reviewedBy: "Sofia Gonzalez",
    reviewNotes: "Please update your current project information and add recent AWS certification.",
    companyScore: 6,
  },
  {
    id: 3,
    user: {
      id: 3,
      name: "Emily Chen",
      position: "UX/UI Designer",
      email: "emily.chen@arkus.com",
    },
    lastReviewedDate: null,
    approvalStatus: "pending_review" as const,
    reviewedBy: null,
    reviewNotes: null,
    companyScore: null,
  },
  {
    id: 4,
    user: {
      id: 4,
      name: "James Wilson",
      position: "Data Scientist",
      email: "james.wilson@arkus.com",
    },
    lastReviewedDate: "2024-01-12",
    approvalStatus: "approved" as const,
    reviewedBy: "Carlos Ruiz",
    reviewNotes: "Excellent profile with comprehensive project history.",
    companyScore: 8,
  },
]

export default function AdminReviewsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [reviewNotes, setReviewNotes] = useState<{ [key: number]: string }>({})
  const [companyScores, setCompanyScores] = useState<{ [key: number]: string }>({})

  const filteredReviews = profileReviews.filter(
    (review) => selectedStatus === "all" || review.approvalStatus === selectedStatus,
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "needs_changes":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "pending_review":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
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

  const canEditScore = () => {
    return ["hr", "pm", "admin"].includes(currentUser.role)
  }

  const handleStatusUpdate = (reviewId: number, newStatus: string) => {
    // In a real app, this would make an API call to update the status
    console.log(`Updating review ${reviewId} to status: ${newStatus}`)
  }

  const handleNotesUpdate = (reviewId: number, notes: string) => {
    setReviewNotes((prev) => ({ ...prev, [reviewId]: notes }))
  }

  const handleScoreUpdate = (reviewId: number, score: string) => {
    setCompanyScores((prev) => ({ ...prev, [reviewId]: score }))
  }

  const handleSaveReview = (reviewId: number) => {
    // In a real app, this would save both notes and score
    console.log(`Saving review ${reviewId}:`, {
      notes: reviewNotes[reviewId],
      score: companyScores[reviewId],
    })
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
                <h1 className="text-2xl font-bold text-white">Profile Reviews</h1>
                <p className="text-sm text-gray-300">Manage employee profile approvals</p>
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
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-arkus-navy">Filter by status:</span>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px] border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="needs_changes">Needs Changes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-arkus-navy">
                    {profileReviews.filter((r) => r.approvalStatus === "pending_review").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-arkus-navy">
                    {profileReviews.filter((r) => r.approvalStatus === "approved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Needs Changes</p>
                  <p className="text-2xl font-bold text-arkus-navy">
                    {profileReviews.filter((r) => r.approvalStatus === "needs_changes").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-arkus-red" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Profiles</p>
                  <p className="text-2xl font-bold text-arkus-navy">{profileReviews.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`/placeholder.svg?height=48&width=48&text=${review.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}`}
                      />
                      <AvatarFallback className="bg-arkus-red text-white">
                        {review.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg text-arkus-navy">{review.user.name}</CardTitle>
                      <CardDescription className="text-gray-600">{review.user.position}</CardDescription>
                      <p className="text-sm text-gray-500">{review.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(review.approvalStatus)}
                    {getCompanyScoreBadge(review.companyScore)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-arkus-navy mb-1">Last Reviewed Date:</p>
                      <p className="text-sm text-gray-600">{review.lastReviewedDate || "Never reviewed"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-arkus-navy mb-1">Reviewed By:</p>
                      <p className="text-sm text-gray-600">{review.reviewedBy || "Not assigned"}</p>
                    </div>
                  </div>

                  {review.reviewNotes && (
                    <div>
                      <p className="text-sm font-medium text-arkus-navy mb-1">Review Notes:</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{review.reviewNotes}</p>
                    </div>
                  )}

                  {/* Admin Actions */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-arkus-navy mb-2 block">Update Status:</label>
                        <Select
                          value={review.approvalStatus}
                          onValueChange={(value) => handleStatusUpdate(review.id, value)}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-arkus-red focus:ring-arkus-red">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending_review">⏳ Pending Review</SelectItem>
                            <SelectItem value="approved">✅ Approved</SelectItem>
                            <SelectItem value="needs_changes">❗ Needs Changes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {canEditScore() && (
                        <div>
                          <Label
                            htmlFor={`score-${review.id}`}
                            className="text-sm font-medium text-arkus-navy mb-2 block"
                          >
                            Company Score (0-10):
                          </Label>
                          <Input
                            id={`score-${review.id}`}
                            type="number"
                            min="0"
                            max="10"
                            placeholder={review.companyScore?.toString() || "Enter score"}
                            value={companyScores[review.id] || review.companyScore?.toString() || ""}
                            onChange={(e) => handleScoreUpdate(review.id, e.target.value)}
                            className="border-gray-300 focus:border-arkus-red focus:ring-arkus-red"
                          />
                        </div>
                      )}

                      <div className="flex items-end">
                        <Link href={`/profile/${review.user.id}`} className="w-full">
                          <Button
                            variant="outline"
                            className="w-full border-arkus-red text-arkus-red hover:bg-arkus-red hover:text-white bg-transparent"
                          >
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium text-arkus-navy mb-2 block">Review Notes:</label>
                      <Textarea
                        placeholder="Add review notes or feedback..."
                        value={reviewNotes[review.id] || review.reviewNotes || ""}
                        onChange={(e) => handleNotesUpdate(review.id, e.target.value)}
                        className="border-gray-300 focus:border-arkus-red focus:ring-arkus-red"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          className="bg-arkus-red text-white hover:bg-arkus-red-hover"
                          onClick={() => handleSaveReview(review.id)}
                        >
                          Save Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <Card className="border-gray-200">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No profile reviews found for the selected status.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
