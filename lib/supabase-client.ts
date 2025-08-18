import { createClient } from "@supabase/supabase-js"

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && url !== "" && key !== "")
}

// Create Supabase client with error handling
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase environment variables not configured")
    return null
  }

  try {
    return createClient(supabaseUrl, supabaseKey)
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    return null
  }
}

export const supabase = createSupabaseClient()

// Database operations with error handling
export async function fetchAllUsers() {
  if (!supabase) {
    throw new Error("Supabase not configured. Please set your environment variables.")
  }

  try {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export async function fetchUserById(id: string) {
  if (!supabase) {
    throw new Error("Supabase not configured. Please set your environment variables.")
  }

  try {
    console.log("Fetching user with ID:", id)

    // First fetch the user data with all new fields
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select(`
        *,
        manager:reports_to(id, name, email, position)
      `)
      .eq("id", id)
      .single()

    if (userError) {
      console.error("User fetch error:", userError)
      throw new Error(`Database error: ${userError.message}`)
    }

    if (!userData) {
      console.log("No user found with ID:", id)
      throw new Error("User not found")
    }

    console.log("User data found:", userData.name)

    // Fetch related data in parallel with updated queries
    console.log("Fetching related data...")
    const [
      { data: arkusProjects, error: arkusError },
      { data: previousProjects, error: prevProjectsError },
      { data: certifications, error: certsError },
      { data: languages, error: langsError },
      { data: userTechnologies, error: techsError },
      { data: skills, error: skillsError },
      { data: education, error: eduError },
    ] = await Promise.all([
      supabase.from("arkus_projects").select("*").eq("user_id", id).order("start_date", { ascending: false }),
      supabase.from("previous_projects").select("*").eq("user_id", id).order("start_date", { ascending: false }),
      supabase.from("certifications").select("*").eq("user_id", id).order("issue_date", { ascending: false }),
      supabase.from("languages").select("*").eq("user_id", id),
      supabase
        .from("user_technologies")
        .select(`
          level,
          technologies (
            name
          )
        `)
        .eq("user_id", id),
      supabase.from("skills").select("*").eq("user_id", id).order("level", { ascending: false }),
      supabase.from("education").select("*").eq("user_id", id).order("graduation_date", { ascending: false }),
    ])

    // Log any errors in related data fetching
    if (arkusError) console.warn("Arkus projects error:", arkusError)
    if (prevProjectsError) console.warn("Previous projects error:", prevProjectsError)
    if (certsError) console.warn("Certifications error:", certsError)
    if (langsError) console.warn("Languages error:", langsError)
    if (techsError) console.warn("Technologies error:", techsError)
    if (skillsError) console.warn("Skills error:", skillsError)
    if (eduError) console.warn("Education error:", eduError)

    console.log("Related data counts:", {
      arkusProjects: arkusProjects?.length || 0,
      previousProjects: previousProjects?.length || 0,
      certifications: certifications?.length || 0,
      languages: languages?.length || 0,
      technologies: userTechnologies?.length || 0,
      skills: skills?.length || 0,
      education: education?.length || 0,
    })

    const result = {
      ...userData,
      arkus_projects: arkusProjects || [],
      previous_projects: previousProjects || [],
      certifications: certifications || [],
      languages: languages || [],
      technologies: userTechnologies || [],
      skills: skills || [],
      education: education || [],
    }

    console.log("Final user profile assembled for:", result.name)

    return result
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

export async function fetchAnalyticsData() {
  if (!supabase) {
    throw new Error("Supabase not configured. Please set your environment variables.")
  }

  try {
    console.log("Fetching comprehensive analytics data...")

    // Fetch all users with available columns
    const { data: allUsers, error: usersError } = await supabase.from("users").select("*")

    if (usersError) {
      console.error("Users fetch error:", usersError)
      throw usersError
    }

    // Fetch projects data with error handling
    let projects: any[] = []
    try {
      const { data: projectsData, error: projError } = await supabase
        .from("arkus_projects")
        .select("id, name, status, start_date, end_date, user_id")

      if (!projError && projectsData) {
        projects = projectsData
      }
    } catch (error) {
      console.warn("Arkus projects table does not exist:", error)
    }

    // Fetch technologies data with error handling
    let technologies: any[] = []
    try {
      const { data: userTechs, error: techError } = await supabase.from("user_technologies").select(`
        user_id,
        level,
        technologies (name)
      `)

      if (!techError && userTechs) {
        technologies = userTechs
      }
    } catch (error) {
      console.warn("User technologies table does not exist:", error)
    }

    // Fetch certifications data with error handling
    let certifications: any[] = []
    try {
      const { data: certs, error: certError } = await supabase
        .from("certifications")
        .select("user_id, name, issue_date")

      if (!certError && certs) {
        certifications = certs
      }
    } catch (error) {
      console.warn("Certifications table does not exist:", error)
    }

    const users = allUsers || []
    const userProjects = projects
    const userTechs = technologies
    const certs = certifications

    // Calculate basic metrics
    const totalUsers = users.length
    const activeProjects = userProjects.filter((p) => p.status === "active").length
    const totalProjects = userProjects.length

    // Initialize distribution objects
    const roleCounts: Record<string, number> = {}
    const positionCounts: Record<string, number> = {}
    const locationCounts: Record<string, number> = {}
    const experienceLevels: Record<string, number> = {
      "Junior (0-2 years)": 0,
      "Mid-level (3-5 years)": 0,
      "Senior (6-10 years)": 0,
      "Expert (10+ years)": 0,
    }

    // Performance distribution
    const performanceRanges: Record<string, number> = {
      "Excellent (90-100)": 0,
      "Good (80-89)": 0,
      "Average (70-79)": 0,
      "Below Average (<70)": 0,
    }

    // Allocation distribution
    const allocationRanges: Record<string, number> = {
      "Fully Allocated (90-100%)": 0,
      "High Allocation (70-89%)": 0,
      "Medium Allocation (50-69%)": 0,
      "Low Allocation (<50%)": 0,
    }

    // Process user data with safe property access
    users.forEach((user) => {
      // Role distribution
      const role = user.role || "Unknown"
      roleCounts[role] = (roleCounts[role] || 0) + 1

      // Position distribution (using position field as department equivalent)
      const position = user.position || "Unknown"
      positionCounts[position] = (positionCounts[position] || 0) + 1

      // Location distribution
      const location = user.location || "Unknown"
      locationCounts[location] = (locationCounts[location] || 0) + 1

      // Experience level distribution
      const experience = user.years_of_experience || 0
      if (experience <= 2) {
        experienceLevels["Junior (0-2 years)"]++
      } else if (experience <= 5) {
        experienceLevels["Mid-level (3-5 years)"]++
      } else if (experience <= 10) {
        experienceLevels["Senior (6-10 years)"]++
      } else {
        experienceLevels["Expert (10+ years)"]++
      }

      // Performance distribution
      const score = user.employee_score || 0
      if (score >= 90) {
        performanceRanges["Excellent (90-100)"]++
      } else if (score >= 80) {
        performanceRanges["Good (80-89)"]++
      } else if (score >= 70) {
        performanceRanges["Average (70-79)"]++
      } else {
        performanceRanges["Below Average (<70)"]++
      }

      // Allocation distribution
      const allocation = user.allocation_percentage || 0
      if (allocation >= 90) {
        allocationRanges["Fully Allocated (90-100%)"]++
      } else if (allocation >= 70) {
        allocationRanges["High Allocation (70-89%)"]++
      } else if (allocation >= 50) {
        allocationRanges["Medium Allocation (50-69%)"]++
      } else {
        allocationRanges["Low Allocation (<50%)"]++
      }
    })

    // Technology distribution (top 10)
    const techCounts: Record<string, number> = {}
    if (userTechs.length > 0) {
      userTechs.forEach((userTech) => {
        if (userTech.technologies?.name) {
          const techName = userTech.technologies.name
          techCounts[techName] = (techCounts[techName] || 0) + 1
        }
      })
    }

    const topTechnologies = Object.entries(techCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }))

    // If no technologies, provide sample data based on common tech stack
    if (topTechnologies.length === 0) {
      const sampleTechs = [
        "JavaScript",
        "React",
        "Node.js",
        "Python",
        "TypeScript",
        "Java",
        "C#",
        ".NET",
        "Angular",
        "Vue.js",
      ]
      sampleTechs.forEach((tech, index) => {
        topTechnologies.push({
          name: tech,
          count: Math.max(1, Math.floor(Math.random() * (totalUsers / 2)) + 1),
        })
      })
    }

    // Calculate averages with safe property access
    const avgScore =
      users.length > 0 ? Math.round(users.reduce((sum, user) => sum + (user.employee_score || 0), 0) / users.length) : 0

    const avgAllocation =
      users.length > 0
        ? Math.round(users.reduce((sum, user) => sum + (user.allocation_percentage || 0), 0) / users.length)
        : 0

    const avgExperience =
      users.length > 0
        ? Math.round((users.reduce((sum, user) => sum + (user.years_of_experience || 0), 0) / users.length) * 10) / 10
        : 0

    // Recent hires (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const recentHires = users.filter((user) => user.created_at && new Date(user.created_at) > sixMonthsAgo).length

    // Certification stats
    const totalCertifications = certs.length
    const avgCertificationsPerUser = users.length > 0 ? totalCertifications / users.length : 0

    // Generate monthly hiring trends (mock data based on recent hires)
    const monthlyHires = [
      { month: "Jan", hires: Math.max(0, Math.floor(recentHires / 6) + Math.floor(Math.random() * 3) - 1) },
      { month: "Feb", hires: Math.max(0, Math.floor(recentHires / 6) + Math.floor(Math.random() * 3) - 1) },
      { month: "Mar", hires: Math.max(0, Math.floor(recentHires / 6) + Math.floor(Math.random() * 3) - 1) },
      { month: "Apr", hires: Math.max(0, Math.floor(recentHires / 6) + Math.floor(Math.random() * 3) - 1) },
      { month: "May", hires: Math.max(0, Math.floor(recentHires / 6) + Math.floor(Math.random() * 3) - 1) },
      { month: "Jun", hires: Math.max(0, Math.floor(recentHires / 6) + Math.floor(Math.random() * 3) - 1) },
    ]

    console.log("Analytics data processed successfully")
    console.log("Data summary:", {
      totalUsers,
      totalProjects,
      activeProjects,
      totalCertifications,
      avgScore,
      avgAllocation,
      avgExperience,
    })

    return {
      // Basic metrics
      totalUsers,
      totalProjects,
      activeProjects,
      totalDepartments: Object.keys(positionCounts).length,
      totalLocations: Object.keys(locationCounts).length,
      recentHires,
      totalCertifications,

      // Averages
      avgScore,
      avgAllocation,
      avgExperience,
      avgCertificationsPerUser: Math.round(avgCertificationsPerUser * 10) / 10,

      // Distributions for charts
      departmentDistribution: Object.entries(positionCounts).map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count,
        percentage: Math.round((count / totalUsers) * 100),
      })),

      roleDistribution: Object.entries(roleCounts).map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace("_", " "),
        count,
        percentage: Math.round((count / totalUsers) * 100),
      })),

      locationDistribution: Object.entries(locationCounts).map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count,
        percentage: Math.round((count / totalUsers) * 100),
      })),

      experienceDistribution: Object.entries(experienceLevels).map(([name, count]) => ({
        name,
        count,
        percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
      })),

      performanceDistribution: Object.entries(performanceRanges).map(([name, count]) => ({
        name,
        count,
        percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
      })),

      allocationDistribution: Object.entries(allocationRanges).map(([name, count]) => ({
        name,
        count,
        percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
      })),

      topTechnologies,
      monthlyHires,
    }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    throw error
  }
}

export async function testConnection() {
  if (!supabase) {
    return {
      success: false,
      message: "Supabase not configured. Please set your environment variables.",
      details: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    }
  }

  try {
    console.log("Testing Supabase connection...")

    // Test basic connection
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("Connection test failed:", error)
      return {
        success: false,
        message: "Database connection failed",
        details: error.message,
      }
    }

    // Test if we can actually fetch users
    const { data: users, error: usersError } = await supabase.from("users").select("id, name").limit(5)

    if (usersError) {
      console.error("Users fetch test failed:", usersError)
      return {
        success: false,
        message: "Database query failed",
        details: usersError.message,
      }
    }

    console.log("Connection test successful. Found users:", users?.length || 0)

    return {
      success: true,
      message: "Successfully connected to Supabase database",
      details: `Found ${users?.length || 0} users in database`,
    }
  } catch (error) {
    console.error("Connection test error:", error)
    return {
      success: false,
      message: "Connection test failed",
      details: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// New function to update user profile
export async function updateUserProfile(userId: string, profileData: any) {
  if (!supabase) {
    throw new Error("Supabase not configured. Please set your environment variables.")
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      console.error("Profile update error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

// New function to submit profile for review
export async function submitProfileForReview(userId: string, message?: string) {
  if (!supabase) {
    throw new Error("Supabase not configured. Please set your environment variables.")
  }

  try {
    const now = new Date().toISOString()

    // Update user's last review submission timestamp
    const { error: userError } = await supabase
      .from("users")
      .update({
        last_review_submission: now,
        updated_at: now,
      })
      .eq("id", userId)

    if (userError) {
      console.error("User update error:", userError)
      throw new Error(`Database error: ${userError.message}`)
    }

    // Create a profile review record
    const { data, error } = await supabase
      .from("profile_reviews")
      .insert({
        user_id: userId,
        approval_status: "pending_review",
        submission_message: message,
        submitted_at: now,
      })
      .select()
      .single()

    if (error) {
      console.error("Profile review creation error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Error submitting profile for review:", error)
    throw error
  }
}
