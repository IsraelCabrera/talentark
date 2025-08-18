import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Test connection function
export async function testSupabaseConnection() {
  if (!supabase) {
    return {
      success: false,
      error: "Supabase not configured. Please check your environment variables.",
      details: {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey,
      },
    }
  }

  try {
    // Test basic connection
    const { data, error } = await supabase.from("users").select("count(*)").limit(1)

    if (error) {
      return {
        success: false,
        error: error.message,
        details: error,
      }
    }

    return {
      success: true,
      message: "Successfully connected to Supabase",
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to connect to Supabase",
      details: error,
    }
  }
}

// Check if tables exist
export async function checkTablesExist() {
  if (!supabase) return { success: false, error: "Supabase not configured" }

  try {
    const tables = ["users", "technologies", "work_experience", "projects", "education", "languages", "certifications"]
    const results = []

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select("count(*)").limit(1)

        results.push({
          table,
          exists: !error,
          error: error?.message,
        })
      } catch (err) {
        results.push({
          table,
          exists: false,
          error: "Table check failed",
        })
      }
    }

    return {
      success: true,
      tables: results,
      allExist: results.every((r) => r.exists),
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to check tables",
      details: error,
    }
  }
}

// Fetch users with their technologies
export async function fetchUsers() {
  if (!supabase) return { success: false, error: "Supabase not configured" }

  try {
    const { data: users, error } = await supabase.from("users").select(`
        *,
        user_technologies (
          level,
          years_experience,
          technologies (
            name,
            category
          )
        )
      `)

    if (error) {
      return { success: false, error: error.message }
    }

    // Transform the data to match the expected format
    const transformedUsers =
      users?.map((user) => ({
        ...user,
        technologies:
          user.user_technologies?.map((ut: any) => ({
            name: ut.technologies.name,
            level: ut.level,
            years_experience: ut.years_experience,
            category: ut.technologies.category,
          })) || [],
      })) || []

    return {
      success: true,
      data: transformedUsers,
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch users",
      details: error,
    }
  }
}

// Fetch user by ID with all related data
export async function fetchUserById(id: string) {
  if (!supabase) return { success: false, error: "Supabase not configured" }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select(`
        *,
        user_technologies (
          level,
          years_experience,
          technologies (
            name,
            category
          )
        ),
        work_experience (*),
        projects (*),
        education (*),
        languages (*),
        certifications (*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Transform the data
    const transformedUser = {
      ...user,
      technologies:
        user.user_technologies?.map((ut: any) => ({
          name: ut.technologies.name,
          level: ut.level,
          years_experience: ut.years_experience,
          category: ut.technologies.category,
        })) || [],
    }

    return {
      success: true,
      data: transformedUser,
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch user",
      details: error,
    }
  }
}
