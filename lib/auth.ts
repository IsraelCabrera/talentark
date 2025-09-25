export interface User {
  id: string
  profile_id: string
  name: string
  email: string
  role: "super_user" | "hr" | "manager" | "collaborator"
  position: string
  location: string
  employee_score: number
  company_score: number
  profile_image?: string
  department?: string
  hire_date?: string
  phone?: string
  project_assignment?: string
  project_allocation_percentage?: number
  years_of_experience?: number
  salary_range?: string
  manager?: string
  skills?: string[]
  technologies?: string[]
  notes?: string
  last_review_date?: string
  about?: string
  previous_projects?: Array<{
    name: string
    client: string
    role: string
    duration: string
    description: string
  }>
  certifications?: Array<{
    name: string
    issuer: string
    date: string
    expiryDate?: string
  }>
  languages?: Array<{
    name: string
    proficiency: string
  }>
  education?: Array<{
    degree: string
    institution: string
    year: string
    field: string
  }>
}

export interface RolePermissions {
  canViewAllProfiles: boolean
  canEditAllProfiles: boolean
  canViewScores: boolean
  canEditScores: boolean
  canEditCompanyScores: boolean
  canUploadUsers: boolean
  canApproveProfiles: boolean
  canManageSystem: boolean
  canEditProjectAssignments: boolean
  canEditAllProfileData: boolean
}

// Demo users with proper UUID format and enhanced profile data
const DEMO_USERS: User[] = [
  {
    id: "a04e4af2-7acd-43ce-a799-39cf6fd571f0",
    profile_id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Admin User",
    email: "admin@arkus.com",
    role: "super_user",
    position: "System Administrator",
    location: "Mexico City, Mexico",
    employee_score: 98,
    company_score: 10,
    profile_image: "/placeholder.svg?height=100&width=100",
    department: "IT",
    hire_date: "2020-01-15",
    phone: "+52 55 1234 5678",
    project_assignment: "System Infrastructure Management",
    project_allocation_percentage: 95,
    years_of_experience: 12,
    salary_range: "$150,000 - $180,000",
    manager: "CEO",
    skills: ["System Administration", "Cloud Architecture", "Security", "Leadership"],
    technologies: ["Linux", "Docker", "Kubernetes", "AWS", "Python", "Bash", "Terraform", "Jenkins"],
    notes: "Exceptional system administrator with comprehensive technical knowledge and leadership skills.",
    last_review_date: "2024-01-15",
    about:
      "Experienced system administrator with over 10 years in enterprise software management. Passionate about building scalable systems and leading technical teams.",
    previous_projects: [
      {
        name: "Enterprise Migration Project",
        client: "TechCorp Solutions",
        role: "Lead System Administrator",
        duration: "Jan 2022 - Dec 2022",
        description:
          "Led the migration of legacy systems to cloud infrastructure, reducing operational costs by 40% and improving system reliability.",
      },
      {
        name: "Security Compliance Initiative",
        client: "SecureBank Corp",
        role: "Security Administrator",
        duration: "Jun 2021 - Dec 2021",
        description:
          "Implemented comprehensive security protocols and compliance measures, achieving SOC 2 Type II certification.",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Solutions Architect - Professional",
        issuer: "Amazon Web Services",
        date: "March 2023",
        expiryDate: "March 2026",
      },
      {
        name: "Certified Information Systems Security Professional (CISSP)",
        issuer: "ISC2",
        date: "January 2022",
        expiryDate: "January 2025",
      },
    ],
    languages: [
      { name: "English", proficiency: "Native" },
      { name: "Spanish", proficiency: "Professional" },
      { name: "Mandarin", proficiency: "Conversational" },
    ],
    education: [
      {
        degree: "Master of Science",
        institution: "Stanford University",
        year: "2012",
        field: "Computer Science",
      },
      {
        degree: "Bachelor of Science",
        institution: "UC Berkeley",
        year: "2010",
        field: "Information Technology",
      },
    ],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    profile_id: "550e8400-e29b-41d4-a716-446655440002",
    name: "HR Manager",
    email: "hr@arkus.com",
    role: "hr",
    position: "Human Resources Manager",
    location: "Guadalajara, Mexico",
    employee_score: 92,
    company_score: 9,
    profile_image: "/placeholder.svg?height=100&width=100",
    department: "Human Resources",
    hire_date: "2020-03-20",
    phone: "+52 33 2345 6789",
    project_assignment: "Employee Development Program",
    project_allocation_percentage: 85,
    years_of_experience: 8,
    salary_range: "$120,000 - $140,000",
    manager: "Admin User",
    skills: ["HR Management", "Recruitment", "Employee Relations", "Training"],
    technologies: ["HRIS Systems", "Workday", "BambooHR", "Slack", "Microsoft Office", "Zoom"],
    notes: "Excellent HR manager with strong interpersonal skills and strategic thinking.",
    last_review_date: "2024-01-10",
    about:
      "Dedicated HR professional with expertise in talent acquisition, employee development, and organizational culture. Committed to creating inclusive and productive work environments.",
    previous_projects: [
      {
        name: "Diversity & Inclusion Program",
        client: "Arkus",
        role: "Program Lead",
        duration: "Sep 2022 - Mar 2023",
        description:
          "Developed and implemented comprehensive D&I program, increasing diverse hiring by 35% and improving employee satisfaction scores.",
      },
    ],
    certifications: [
      {
        name: "Professional in Human Resources (PHR)",
        issuer: "HR Certification Institute",
        date: "June 2021",
        expiryDate: "June 2024",
      },
      {
        name: "Certified Compensation Professional (CCP)",
        issuer: "WorldatWork",
        date: "September 2022",
        expiryDate: "September 2025",
      },
    ],
    languages: [
      { name: "English", proficiency: "Professional" },
      { name: "Spanish", proficiency: "Native" },
      { name: "French", proficiency: "Conversational" },
    ],
    education: [
      {
        degree: "Master of Business Administration",
        institution: "ITESM",
        year: "2016",
        field: "Human Resources Management",
      },
      {
        degree: "Bachelor of Arts",
        institution: "Universidad de Guadalajara",
        year: "2014",
        field: "Psychology",
      },
    ],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    profile_id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Team Manager",
    email: "manager@arkus.com",
    role: "manager",
    position: "Development Team Lead",
    location: "Monterrey, Mexico",
    employee_score: 89,
    company_score: 8,
    profile_image: "/placeholder.svg?height=100&width=100",
    department: "Engineering",
    hire_date: "2021-06-10",
    phone: "+52 81 3456 7890",
    project_assignment: "E-Commerce Platform Development",
    project_allocation_percentage: 90,
    years_of_experience: 6,
    salary_range: "$110,000 - $130,000",
    manager: "Admin User",
    skills: ["Team Leadership", "React", "Node.js", "Project Management"],
    technologies: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "MongoDB"],
    notes: "Strong technical leader with excellent team management capabilities.",
    last_review_date: "2024-01-08",
    about:
      "Experienced engineering manager with a strong background in full-stack development and team leadership. Passionate about building scalable products and mentoring developers.",
    previous_projects: [
      {
        name: "Microservices Migration",
        client: "TechCorp Solutions",
        role: "Senior Software Engineer",
        duration: "Jan 2021 - Aug 2021",
        description:
          "Led the migration from monolithic architecture to microservices, improving system scalability and reducing deployment time by 60%.",
      },
      {
        name: "Real-time Analytics Dashboard",
        client: "DataFlow Inc",
        role: "Full Stack Developer",
        duration: "Mar 2020 - Dec 2020",
        description:
          "Built comprehensive analytics dashboard with real-time data processing, serving over 10,000 daily active users.",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "April 2022",
        expiryDate: "April 2025",
      },
      {
        name: "Certified Scrum Master",
        issuer: "Scrum Alliance",
        date: "February 2021",
        expiryDate: "February 2023",
      },
    ],
    languages: [
      { name: "English", proficiency: "Professional" },
      { name: "Spanish", proficiency: "Native" },
      { name: "Japanese", proficiency: "Conversational" },
    ],
    education: [
      {
        degree: "Master of Science",
        institution: "Tecnológico de Monterrey",
        year: "2018",
        field: "Computer Science",
      },
      {
        degree: "Bachelor of Engineering",
        institution: "UANL",
        year: "2016",
        field: "Software Engineering",
      },
    ],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    profile_id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Employee User",
    email: "employee@arkus.com",
    role: "collaborator",
    position: "Software Developer",
    location: "Mexico City, Mexico",
    employee_score: 85,
    company_score: 7,
    profile_image: "/placeholder.svg?height=100&width=100",
    department: "Engineering",
    hire_date: "2022-09-05",
    phone: "+52 55 4567 8901",
    project_assignment: "Mobile App Development",
    project_allocation_percentage: 80,
    years_of_experience: 3,
    salary_range: "$80,000 - $100,000",
    manager: "Team Manager",
    skills: ["JavaScript", "React Native", "Python", "API Development"],
    technologies: ["React", "TypeScript", "CSS", "HTML", "Figma", "Jest", "Webpack", "Git"],
    notes: "Talented developer with strong technical skills and growth potential.",
    last_review_date: "2024-01-05",
    about:
      "Creative frontend developer with a passion for user experience and modern web technologies. Enjoys creating intuitive and accessible user interfaces.",
    previous_projects: [
      {
        name: "Customer Portal Redesign",
        client: "RetailMax Corp",
        role: "Frontend Developer",
        duration: "Jun 2022 - Feb 2023",
        description:
          "Redesigned customer portal interface, improving user satisfaction scores by 45% and reducing support tickets by 30%.",
      },
      {
        name: "Progressive Web App Development",
        client: "MobileFirst Solutions",
        role: "Frontend Developer",
        duration: "Jan 2022 - May 2022",
        description:
          "Developed PWA with offline capabilities and push notifications, achieving 95% performance score on Lighthouse.",
      },
    ],
    certifications: [
      {
        name: "Google UX Design Certificate",
        issuer: "Google",
        date: "August 2022",
        expiryDate: "August 2025",
      },
      {
        name: "React Developer Certification",
        issuer: "Meta",
        date: "January 2023",
      },
    ],
    languages: [
      { name: "English", proficiency: "Professional" },
      { name: "Spanish", proficiency: "Native" },
      { name: "Portuguese", proficiency: "Conversational" },
    ],
    education: [
      {
        degree: "Bachelor of Science",
        institution: "UNAM",
        year: "2020",
        field: "Computer Science",
      },
      {
        degree: "Associate of Arts",
        institution: "Colegio de Bachilleres",
        year: "2018",
        field: "Graphic Design",
      },
    ],
  },
]

export function getRolePermissions(role: string): RolePermissions {
  switch (role) {
    case "super_user":
      return {
        canViewAllProfiles: true,
        canEditAllProfiles: true,
        canViewScores: true,
        canEditScores: true,
        canEditCompanyScores: true,
        canUploadUsers: true,
        canApproveProfiles: true,
        canManageSystem: true,
        canEditProjectAssignments: true,
        canEditAllProfileData: true,
      }
    case "hr":
      return {
        canViewAllProfiles: true,
        canEditAllProfiles: true,
        canViewScores: true,
        canEditScores: false,
        canEditCompanyScores: false,
        canUploadUsers: true,
        canApproveProfiles: true,
        canManageSystem: false,
        canEditProjectAssignments: false,
        canEditAllProfileData: false,
      }
    case "manager":
      return {
        canViewAllProfiles: true,
        canEditAllProfiles: false,
        canViewScores: true,
        canEditScores: false,
        canEditCompanyScores: false,
        canUploadUsers: false,
        canApproveProfiles: true,
        canManageSystem: false,
        canEditProjectAssignments: false,
        canEditAllProfileData: false,
      }
    case "collaborator":
      return {
        canViewAllProfiles: true,
        canEditAllProfiles: false,
        canViewScores: false,
        canEditScores: false,
        canEditCompanyScores: false,
        canUploadUsers: false,
        canApproveProfiles: false,
        canManageSystem: false,
        canEditProjectAssignments: false,
        canEditAllProfileData: false,
      }
    default:
      return {
        canViewAllProfiles: false,
        canEditAllProfiles: false,
        canViewScores: false,
        canEditScores: false,
        canEditCompanyScores: false,
        canUploadUsers: false,
        canApproveProfiles: false,
        canManageSystem: false,
        canEditProjectAssignments: false,
        canEditAllProfileData: false,
      }
  }
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Demo authentication - find user by email
  const user = DEMO_USERS.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  // Store demo session
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "demo_session",
      JSON.stringify({
        user,
        timestamp: Date.now(),
      }),
    )
  }

  return { success: true, user }
}

export async function signOut(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("demo_session")
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const session = localStorage.getItem("demo_session")
    if (!session) {
      return null
    }

    const { user, timestamp } = JSON.parse(session)

    // Check if session is still valid (24 hours)
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem("demo_session")
      return null
    }

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export function getDemoUsers(): User[] {
  return DEMO_USERS
}

export function getDemoUserByAuthId(authId: string): User | null {
  return DEMO_USERS.find((user) => user.id === authId) || null
}

export function getDemoUserByProfileId(profileId: string): User | null {
  return DEMO_USERS.find((user) => user.profile_id === profileId) || null
}

export function getDemoUserByEmail(email: string): User | null {
  return DEMO_USERS.find((user) => user.email === email) || null
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
  if (typeof window === "undefined") {
    return null
  }

  try {
    // Get current session
    const session = localStorage.getItem("demo_session")
    if (!session) {
      return null
    }

    const sessionData = JSON.parse(session)

    // Update the user in the DEMO_USERS array
    const userIndex = DEMO_USERS.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      return null
    }

    // Apply updates
    DEMO_USERS[userIndex] = { ...DEMO_USERS[userIndex], ...updates }
    const updatedUser = DEMO_USERS[userIndex]

    // If updating current user, update session
    if (sessionData.user.id === userId) {
      sessionData.user = updatedUser
      localStorage.setItem("demo_session", JSON.stringify(sessionData))
    }

    return updatedUser
  } catch (error) {
    console.error("Error updating user profile:", error)
    return null
  }
}

export async function getAllUsers(): Promise<User[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return DEMO_USERS
}

export async function getUserById(id: string): Promise<User | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return DEMO_USERS.find((user) => user.id === id) || null
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const userIndex = DEMO_USERS.findIndex((user) => user.id === id)
  if (userIndex !== -1) {
    DEMO_USERS[userIndex] = { ...DEMO_USERS[userIndex], ...updates }

    // Update session if it's the current user
    const session = localStorage.getItem("demo_session")
    if (session) {
      try {
        const sessionData = JSON.parse(session)
        if (sessionData.user.id === id) {
          sessionData.user = DEMO_USERS[userIndex]
          localStorage.setItem("demo_session", JSON.stringify(sessionData))
        }
      } catch (error) {
        console.error("Error updating session:", error)
      }
    }

    return DEMO_USERS[userIndex]
  }
  return null
}

export function isDemoMode(): boolean {
  return true // Always in demo mode for this implementation
}
