import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if environment variables are properly configured
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false
  if (url.includes("your-supabase-project-url") || url.includes("placeholder") || url.includes("your-project-id"))
    return false
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === "https:" && urlObj.hostname.includes("supabase.co")
  } catch {
    return false
  }
}

const isValidKey = (key: string | undefined): boolean => {
  if (!key) return false
  if (
    key.includes("your-supabase-anon-key") ||
    key.includes("placeholder") ||
    key.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
  )
    return false
  return key.length > 100 && key.startsWith("eyJ") // JWT tokens start with eyJ and are much longer
}

// Only create client if both variables are present and valid
let supabase: any = null

if (isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey)) {
  try {
    supabase = createClient(supabaseUrl!, supabaseAnonKey!)
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    supabase = null
  }
}

export { supabase }

// Test connection function
export async function testConnection() {
  try {
    // Check if environment variables exist
    if (!supabaseUrl) {
      return {
        success: false,
        error: "NEXT_PUBLIC_SUPABASE_URL environment variable is missing. Please add it to your .env.local file.",
        errorType: "missing_url",
      }
    }

    if (!supabaseAnonKey) {
      return {
        success: false,
        error: "NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is missing. Please add it to your .env.local file.",
        errorType: "missing_key",
      }
    }

    // Check if they contain placeholder values
    if (
      supabaseUrl.includes("your-supabase-project-url") ||
      supabaseUrl.includes("your-project-id") ||
      supabaseUrl.includes("placeholder")
    ) {
      return {
        success: false,
        error: "Please replace the placeholder URL with your actual Supabase project URL in .env.local",
        errorType: "placeholder_url",
        currentValue: supabaseUrl,
      }
    }

    if (
      supabaseAnonKey.includes("your-supabase-anon-key") ||
      supabaseAnonKey.includes("placeholder") ||
      supabaseAnonKey.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    ) {
      return {
        success: false,
        error: "Please replace the placeholder key with your actual Supabase anon key in .env.local",
        errorType: "placeholder_key",
      }
    }

    // Check URL format
    if (!isValidUrl(supabaseUrl)) {
      return {
        success: false,
        error: `Invalid Supabase URL format. Expected format: https://your-project-id.supabase.co`,
        errorType: "invalid_url",
        currentValue: supabaseUrl,
      }
    }

    // Check key format
    if (!isValidKey(supabaseAnonKey)) {
      return {
        success: false,
        error: "Invalid Supabase anon key format. The key should be a long JWT token starting with 'eyJ'",
        errorType: "invalid_key",
      }
    }

    // Check if client was created successfully
    if (!supabase) {
      return {
        success: false,
        error: "Failed to initialize Supabase client. Please check your environment variables.",
        errorType: "client_init_failed",
      }
    }

    // Test the connection by making a simple query with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Connection timeout after 10 seconds")), 10000)
    })

    const queryPromise = supabase.from("users").select("count", { count: "exact", head: true })

    const { data, error } = await Promise.race([queryPromise, timeoutPromise])

    if (error) {
      console.error("Supabase connection error:", error)

      // Handle specific error types
      if (error.message.includes("Failed to fetch")) {
        return {
          success: false,
          error:
            "Network error: Unable to reach Supabase. This could be due to:\n• Invalid project URL\n• Project doesn't exist\n• Network connectivity issues\n• CORS configuration problems",
          errorType: "network_error",
          originalError: error.message,
        }
      }

      if (error.message.includes("Invalid API key")) {
        return {
          success: false,
          error: "Authentication error: Invalid API key. Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY.",
          errorType: "auth_error",
          originalError: error.message,
        }
      }

      if (error.message.includes('relation "users" does not exist')) {
        return {
          success: false,
          error:
            "Database error: The 'users' table doesn't exist. Please run the SQL scripts to create the database tables.",
          errorType: "table_missing",
          originalError: error.message,
        }
      }

      return {
        success: false,
        error: `Database error: ${error.message}`,
        errorType: "database_error",
        originalError: error.message,
      }
    }

    return {
      success: true,
      count: data,
      message: "Successfully connected to Supabase database!",
    }
  } catch (err: any) {
    console.error("Connection test failed:", err)

    if (err.message.includes("timeout")) {
      return {
        success: false,
        error:
          "Connection timeout: Unable to connect to Supabase within 10 seconds. Please check your internet connection and Supabase project status.",
        errorType: "timeout_error",
      }
    }

    if (err.message.includes("Failed to fetch")) {
      return {
        success: false,
        error:
          "Network error: Unable to reach Supabase. Please verify:\n• Your Supabase project URL is correct\n• Your project exists and is active\n• Your internet connection is working",
        errorType: "fetch_error",
      }
    }

    return {
      success: false,
      error: err.message || "Unknown error occurred while testing connection",
      errorType: "unknown_error",
    }
  }
}

// Helper function to check if Supabase is configured
export function isSupabaseConfigured() {
  return !!(isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey) && supabase)
}

// Get configuration status
export function getConfigurationStatus() {
  return {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isValidUrl: isValidUrl(supabaseUrl),
    isValidKey: isValidKey(supabaseAnonKey),
    isConfigured: isSupabaseConfigured(),
    urlValue: supabaseUrl ? (supabaseUrl.length > 30 ? supabaseUrl.substring(0, 30) + "..." : supabaseUrl) : "Not set",
    keyValue: supabaseAnonKey
      ? supabaseAnonKey.startsWith("eyJ")
        ? "eyJ..." + supabaseAnonKey.slice(-10)
        : "Invalid format"
      : "Not set",
    urlPlaceholder: supabaseUrl?.includes("your-") || supabaseUrl?.includes("placeholder") || false,
    keyPlaceholder:
      supabaseAnonKey?.includes("your-") ||
      supabaseAnonKey?.includes("placeholder") ||
      supabaseAnonKey?.includes("...") ||
      false,
  }
}

// Demo mode for when Supabase is not configured
export function getDemoData() {
  return {
    users: [
      { id: 1, name: "Demo User 1", email: "demo1@example.com" },
      { id: 2, name: "Demo User 2", email: "demo2@example.com" },
    ],
    message: "This is demo data. Configure Supabase to see real data.",
  }
}
