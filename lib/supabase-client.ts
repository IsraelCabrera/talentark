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
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })

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
      supabase
        .from("arkus_projects")
        .select("*")
        .eq("user_id", id)
        .order("start_date", { ascending: false }),
      supabase
        .from("previous_projects")
        .select("*")
        .eq("user_id", id)
        .order("start_date", { ascending: false }),
      supabase
        .from("certifications")
        .select("*")
        .eq("user_id", id)
        .order("issue_date", { ascending: false }),
      supabase
        .from("languages")
        .select("*")
        .eq("user_id", id),
      supabase
        .from("user_technologies")
        .select(`
          level,
          technologies (
            name
          )
        `)
        .eq("user_id", id),
      supabase
        .from("skills")
        .select("*")
        .eq("user_id", id)
        .order("level", { ascending: false }),
      supabase
        .from("education")
        .select("*")
        .eq("user_id", id)
        .order("graduation_date", { ascending: false }),
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
    // Fetch users count
    const { count: totalUsers, error: usersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    if (usersError) throw usersError

    // Fetch all users to calculate analytics
    const { data: allUsers, error: usersDataError } = await supabase
      .from("users")
      .select("role, location, position, department")

    if (usersDataError) throw usersDataError

    // Process role distribution (using role as department equivalent)
    const roleCounts: Record<string, number> = {}
    const locationCounts: Record<string, number> = {}
    const departmentCounts: Record<string, number> = {}

    allUsers?.forEach((user) => {
      // Count by role
      const role = user.role || "Unknown"
      roleCounts[role] = (roleCounts[role] || 0) + 1

      // Count by location
      const location = user.location || "Unknown"
      locationCounts[location] = (locationCounts[location] || 0) + 1

      // Count by department
      const department = user.department || "Unknown"
      departmentCounts[department] = (departmentCounts[department] || 0) + 1
    })

    const roleDistribution = Object.entries(roleCounts).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
    }))

    const departmentDistribution = Object.entries(departmentCounts).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
    }))

    return {
      totalUsers: totalUsers || 0,
      totalDepartments: Object.keys(departmentCounts).length,
      totalLocations: Object.keys(locationCounts).length,
      departmentDistribution,
      roleDistribution,
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
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name")
      .limit(5)

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
        updated_at: new Date().toISOString()
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
        updated_at: now
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
        approval_status: 'pending_review',
        submission_message: message,
        submitted_at: now
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
