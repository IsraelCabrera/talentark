import jsPDF from "jspdf"

interface UserData {
  id: string
  name: string
  email: string
  role: string
  location?: string
  english_level?: string
  status: string
  level: string
  position?: string
  company?: string
  about?: string
  phone?: string
  hire_date?: string
  department?: string
  created_at: string
  updated_at: string
  manager?: {
    id: string
    name: string
    email: string
    position: string
  } | null
  arkus_projects: Array<{
    id: string
    project_name: string
    client_name: string
    description: string
    start_date: string
    end_date: string | null
    allocation_percentage: number
    is_current: boolean
    status?: string
    team_size?: number
    role?: string
    technologies?: string[]
  }>
  certifications: Array<{
    id: string
    title: string
    issuer: string
    issue_date: string
    expiration_date: string | null
    credential_url: string | null
  }>
  languages: Array<{
    id: string
    language_name: string
    proficiency_level: string
  }>
  technologies: Array<{
    level: string
    technologies: { name: string }
  }>
  skills: Array<{
    id: string
    skill_name: string
    level: string
  }>
  education: Array<{
    id: string
    degree_title: string
    institution_name: string
    graduation_date: string
  }>
  employee_score?: number
  project_allocation_percentage?: number
  current_project_assignment?: string
}

export function generateProfilePDF(userData: UserData): Promise<Blob> {
  return new Promise((resolve) => {
    const doc = new jsPDF()
    let yPosition = 20
    const pageWidth = doc.internal.pageSize.width
    const margin = 20
    const contentWidth = pageWidth - margin * 2

    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10) => {
      doc.setFontSize(fontSize)
      const lines = doc.splitTextToSize(text, maxWidth)
      doc.text(lines, x, y)
      return y + lines.length * (fontSize * 0.4)
    }

    // Helper function to check if we need a new page
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > doc.internal.pageSize.height - 20) {
        doc.addPage()
        yPosition = 20
      }
    }

    // Header with TalentArk branding
    doc.setFillColor(15, 23, 42) // slate-900 color
    doc.rect(0, 0, pageWidth, 35, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("TalentArk", margin, 22)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Employee Profile Report", margin + 70, 22)

    yPosition = 50

    // Profile Header
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text(userData.name, margin, yPosition)

    yPosition += 8
    doc.setFontSize(14)
    doc.setFont("helvetica", "normal")
    doc.text(userData.position || userData.role, margin, yPosition)

    yPosition += 15

    // Basic Information Section
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(15, 23, 42)
    doc.text("Contact Information", margin, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    
    doc.text(`Email: ${userData.email}`, margin, yPosition)
    yPosition += 5
    
    if (userData.phone) {
      doc.text(`Phone: ${userData.phone}`, margin, yPosition)
      yPosition += 5
    }
    
    if (userData.location) {
      doc.text(`Location: ${userData.location}`, margin, yPosition)
      yPosition += 5
    }
    
    if (userData.english_level) {
      doc.text(`English Level: ${userData.english_level}`, margin, yPosition)
      yPosition += 5
    }
    
    doc.text(`Status: ${userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}`, margin, yPosition)
    yPosition += 5
    
    doc.text(`Level: ${userData.level}`, margin, yPosition)
    yPosition += 5

    if (userData.department) {
      doc.text(`Department: ${userData.department}`, margin, yPosition)
      yPosition += 5
    }

    if (userData.hire_date) {
      doc.text(`Hire Date: ${new Date(userData.hire_date).toLocaleDateString()}`, margin, yPosition)
      yPosition += 5
    }

    // Reports To Section
    if (userData.manager) {
      doc.text(`Reports To: ${userData.manager.name} (${userData.manager.position})`, margin, yPosition)
      yPosition += 5
    }

    yPosition += 10

    // Employee Score Section
    if (userData.employee_score) {
      checkPageBreak(25)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(15, 23, 42)
      doc.text("Performance Score", margin, yPosition)
      yPosition += 10

      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(0, 0, 0)
      doc.text(`Employee Score: ${userData.employee_score}/100`, margin, yPosition)
      yPosition += 15
    }

    // About Section
    if (userData.about) {
      checkPageBreak(40)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(15, 23, 42)
      doc.text("About", margin, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(0, 0, 0)
      yPosition = addWrappedText(userData.about, margin, yPosition, contentWidth)
      yPosition += 15
    }

    // Current Project Assignment
    if (userData.current_project_assignment) {
      checkPageBreak(40)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(15, 23, 42)
      doc.text("Current Assignment", margin, yPosition)
      yPosition += 10

      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(0, 0, 0)
      doc.text(userData.current_project_assignment, margin, yPosition)
      yPosition += 8

      if (userData.project_allocation_percentage) {
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(`Allocation: ${userData.project_allocation_percentage}%`, margin, yPosition)
        yPosition += 15
      }
    }

    // Project History
    if (userData.arkus_projects && userData.arkus_projects.length > 0) {
      checkPageBreak(60)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(15, 23, 42)
      doc.text("Project History", margin, yPosition)
      yPosition += 10

      userData.arkus_projects
        .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
        .forEach((project) => {
          checkPageBreak(35)
          
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          doc.setTextColor(0, 0, 0)
          doc.text(project.project_name, margin, yPosition)
          yPosition += 6

          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          const startDate = new Date(project.start_date).toLocaleDateString()
          const endDate = project.end_date ? new Date(project.end_date).toLocaleDateString() : "Present"
          doc.text(`${project.client_name} | ${startDate} - ${endDate}`, margin, yPosition)
          yPosition += 5

          if (project.role) {
            doc.text(`Role: ${project.role}`, margin, yPosition)
            yPosition += 5
          }

          doc.text(`Allocation: ${project.allocation_percentage}%`, margin, yPosition)
          yPosition += 5

          if (project.status) {
            doc.text(`Status: ${project.status.charAt(0).toUpperCase() + project.status.slice(1)}`, margin, yPosition)
            yPosition += 5
          }

          yPosition = addWrappedText(project.description, margin, yPosition, contentWidth)
          
          if (project.technologies && project.technologies.length > 0) {
            doc.text(`Technologies: ${project.technologies.join(', ')}`, margin, yPosition)
            yPosition += 5
          }
          
          yPosition += 8
        })
    }

    // Technologies
    if (userData.technologies && userData.technologies.length > 0) {
      checkPageBreak(50)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(15, 23, 42)
      doc.text("Technologies", margin, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(0, 0, 0)

      let xPosition = margin
      const rowHeight = 6

      userData.technologies.forEach((tech) => {
        const techText = `${tech.technologies.name} (${tech.level})`
        const textWidth = doc.getTextWidth(techText)

        if (xPosition + textWidth > pageWidth - margin) {
          xPosition = margin
          yPosition += rowHeight
          checkPageBreak(rowHeight)
        }

        doc.text(techText, xPosition, yPosition)
        xPosition += textWidth + 15
      })
      yPosition += 20
    }

    // Skills
    if (userData.skills && userData.skills.length > 0) {
      checkPageBreak(50)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(15, 23, 42)
      doc.text("Skills", margin, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(0, 0, 0)

      let xPosition = margin
      const rowHeight = 6

      userData.skills.forEach((skill) => {
        const skillText = `${skill.skill_name} (${skill.level})`
        const textWidth = doc.getTextWidth(skillText)

        if (xPosition + textWidth > pageWidth - margin) {
          xPosition = margin
          yPosition += rowHeight
          checkPageBreak(rowHeight)
        }

        doc.text(skillText, xPosition, yPosition)
        xPosition += textWidth + 15
      })
      yPosition += 20
    }

    // Languages
    if (userData.languages && userData.languages.length > 0) {
      checkPageBreak(50)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(15, 23, 42)
      doc.text("Languages", margin, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(0, 0, 0)

      let xPosition = margin
      const rowHeight = 6

      userData.languages.forEach((language) => {
        const langText = `${language.language_name} (${language.proficiency_level})`
        const textWidth = doc.getTextWidth(langText)

        if (xPosition + textWidth > pageWidth - margin) {
          xPosition = margin
          yPosition += rowHeight
          checkPageBreak(rowHeight)
        }

        doc.text(langText, xPosition, yPosition)
        xPosition += textWidth + 15
      })
      yPosition += 20
    }

    // Education
    if (userData.education && userData.education.length > 0) {
      checkPageBreak(50)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(15, 23, 42)
      doc.text("Education", margin, yPosition)
      yPosition += 10

      userData.education.forEach((edu) => {
        checkPageBreak(25)
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(0, 0, 0)
        doc.text(edu.degree_title, margin, yPosition)
        yPosition += 6

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        const gradDate = new Date(edu.graduation_date).toLocaleDateString()
        doc.text(`${edu.institution_name} | ${gradDate}`, margin, yPosition)
        yPosition += 12
      })
    }

    // Certifications
    if (userData.certifications && userData.certifications.length > 0) {
      checkPageBreak(60)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(15, 23, 42)
      doc.text("Professional Certifications", margin, yPosition)
      yPosition += 10

      userData.certifications.forEach((cert) => {
        checkPageBreak(30)
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(0, 0, 0)
        doc.text(cert.title, margin, yPosition)
        yPosition += 6

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        const issueDate = new Date(cert.issue_date).toLocaleDateString()
        let certInfo = `${cert.issuer} | Issued: ${issueDate}`

        if (cert.expiration_date) {
          const expDate = new Date(cert.expiration_date).toLocaleDateString()
          certInfo += ` | Expires: ${expDate}`
        }

        doc.text(certInfo, margin, yPosition)
        yPosition += 6

        if (cert.credential_url) {
          doc.setTextColor(220, 38, 38) // red-600
          doc.text("View Credential Online", margin, yPosition)
          doc.setTextColor(0, 0, 0)
          yPosition += 10
        } else {
          yPosition += 6
        }
      })
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount} | TalentArk Profile Report`,
        margin,
        doc.internal.pageSize.height - 10,
      )
    }

    // Convert to blob and resolve
    const pdfBlob = doc.output('blob')
    resolve(pdfBlob)
  })
}

// Enhanced PDF generation function that handles the export
export async function generatePDF(userData: UserData): Promise<Blob> {
  try {
    console.log("Generating PDF for user:", userData.name)
    return await generateProfilePDF(userData)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate PDF")
  }
}

// Utility function to download the PDF
export function downloadPDF(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
