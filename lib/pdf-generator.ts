import jsPDF from "jspdf"

interface UserData {
  id: number
  name: string
  email: string
  role: string
  location: string
  english_level: string
  status: string
  level: string
  position: string
  company: string
  about: string
  reportsTo?: {
    name: string
    position: string
    email: string
  } | null
  workExperience: Array<{
    position: string
    company: string
    startDate: string
    endDate: string | null
    description: string
    isCurrent: boolean
  }>
  projects: Array<{
    name: string
    client: string
    description: string
    startDate: string
    endDate: string
  }>
  technologies: Array<{
    name: string
    level: string
  }>
  skills: Array<{
    name: string
    level: string
  }>
  certifications: Array<{
    title: string
    issuer: string
    issueDate: string
    expirationDate: string | null
    credentialUrl: string
  }>
  education: Array<{
    degreeTitle: string
    institutionName: string
    graduationDate: string
  }>
  languages: Array<{
    name: string
    proficiency: string
  }>
  profileReview: {
    lastReviewedDate: string | null
    approvalStatus: string
    reviewedBy: string | null
    reviewNotes: string
    companyScore: number | null
  }
}

export function generateProfilePDF(userData: UserData) {
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

  // Header with Arkus branding
  doc.setFillColor(41, 55, 77) // Arkus navy color
  doc.rect(0, 0, pageWidth, 30, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("ARKUS", margin, 20)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Talent Directory", margin + 50, 20)

  yPosition = 45

  // Profile Header
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(userData.name, margin, yPosition)

  yPosition += 8
  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text(userData.position, margin, yPosition)

  yPosition += 15

  // Basic Information
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Contact Information", margin, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Email: ${userData.email}`, margin, yPosition)
  yPosition += 5
  doc.text(`Location: ${userData.location}`, margin, yPosition)
  yPosition += 5
  doc.text(`English Level: ${userData.english_level}`, margin, yPosition)
  yPosition += 5
  doc.text(`Status: ${userData.status === "available" ? "Available" : "Assigned"}`, margin, yPosition)
  yPosition += 5
  doc.text(`Level: ${userData.level}`, margin, yPosition)
  yPosition += 5

  // Reports To Section
  if (userData.reportsTo) {
    doc.text(`Reports To: ${userData.reportsTo.name} (${userData.reportsTo.position})`, margin, yPosition)
    yPosition += 5
  }

  yPosition += 10

  // About Section
  if (userData.about) {
    checkPageBreak(30)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("About", margin, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    yPosition = addWrappedText(userData.about, margin, yPosition, contentWidth)
    yPosition += 10
  }

  // Current Assignment
  const currentAssignment = userData.workExperience.find((exp) => exp.isCurrent)
  if (currentAssignment) {
    checkPageBreak(40)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Current Assignment", margin, yPosition)
    yPosition += 8

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(currentAssignment.position, margin, yPosition)
    yPosition += 6

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(
      `${currentAssignment.company} | ${new Date(currentAssignment.startDate).toLocaleDateString()} - Present`,
      margin,
      yPosition,
    )
    yPosition += 6

    yPosition = addWrappedText(currentAssignment.description, margin, yPosition, contentWidth)
    yPosition += 10
  }

  // Work Experience (Projects)
  if (userData.projects.length > 0) {
    checkPageBreak(50)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Work Experience", margin, yPosition)
    yPosition += 8

    userData.projects.forEach((project) => {
      checkPageBreak(30)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(project.name, margin, yPosition)
      yPosition += 6

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const startDate = new Date(project.startDate).toLocaleDateString()
      const endDate = new Date(project.endDate).toLocaleDateString()
      doc.text(`${project.client} | ${startDate} - ${endDate}`, margin, yPosition)
      yPosition += 6

      yPosition = addWrappedText(project.description, margin, yPosition, contentWidth)
      yPosition += 8
    })
    yPosition += 5
  }

  // Technologies
  if (userData.technologies.length > 0) {
    checkPageBreak(40)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Technologies", margin, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    let xPosition = margin
    const rowHeight = 6

    userData.technologies.forEach((tech, index) => {
      const techText = `${tech.name} (${tech.level})`
      const textWidth = doc.getTextWidth(techText)

      if (xPosition + textWidth > pageWidth - margin) {
        xPosition = margin
        yPosition += rowHeight
        checkPageBreak(rowHeight)
      }

      doc.text(techText, xPosition, yPosition)
      xPosition += textWidth + 15
    })
    yPosition += 15
  }

  // Skills
  if (userData.skills.length > 0) {
    checkPageBreak(40)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Skills", margin, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    let xPosition = margin
    const rowHeight = 6

    userData.skills.forEach((skill) => {
      const skillText = `${skill.name} (${skill.level})`
      const textWidth = doc.getTextWidth(skillText)

      if (xPosition + textWidth > pageWidth - margin) {
        xPosition = margin
        yPosition += rowHeight
        checkPageBreak(rowHeight)
      }

      doc.text(skillText, xPosition, yPosition)
      xPosition += textWidth + 15
    })
    yPosition += 15
  }

  // Education
  if (userData.education.length > 0) {
    checkPageBreak(40)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Education", margin, yPosition)
    yPosition += 8

    userData.education.forEach((edu) => {
      checkPageBreak(20)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(edu.degreeTitle, margin, yPosition)
      yPosition += 6

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const gradDate = new Date(edu.graduationDate).toLocaleDateString()
      doc.text(`${edu.institutionName} | ${gradDate}`, margin, yPosition)
      yPosition += 10
    })
  }

  // Languages
  if (userData.languages.length > 0) {
    checkPageBreak(40)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Languages", margin, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    let xPosition = margin
    const rowHeight = 6

    userData.languages.forEach((language) => {
      const langText = `${language.name} (${language.proficiency})`
      const textWidth = doc.getTextWidth(langText)

      if (xPosition + textWidth > pageWidth - margin) {
        xPosition = margin
        yPosition += rowHeight
        checkPageBreak(rowHeight)
      }

      doc.text(langText, xPosition, yPosition)
      xPosition += textWidth + 15
    })
    yPosition += 15
  }

  // Certifications
  if (userData.certifications.length > 0) {
    checkPageBreak(50)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Certifications", margin, yPosition)
    yPosition += 8

    userData.certifications.forEach((cert) => {
      checkPageBreak(25)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(cert.title, margin, yPosition)
      yPosition += 6

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const issueDate = new Date(cert.issueDate).toLocaleDateString()
      let certInfo = `${cert.issuer} | Issued: ${issueDate}`

      if (cert.expirationDate) {
        const expDate = new Date(cert.expirationDate).toLocaleDateString()
        certInfo += ` | Expires: ${expDate}`
      }

      doc.text(certInfo, margin, yPosition)
      yPosition += 6

      if (cert.credentialUrl) {
        doc.setTextColor(0, 0, 255)
        doc.text("View Credential", margin, yPosition)
        doc.setTextColor(0, 0, 0)
        yPosition += 8
      } else {
        yPosition += 4
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
      `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
      margin,
      doc.internal.pageSize.height - 10,
    )
  }

  // Save the PDF
  const fileName = `${userData.name.replace(/\s+/g, "_")}_Profile.pdf`
  doc.save(fileName)
}
