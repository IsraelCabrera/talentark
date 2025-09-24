// Requiere: docx, pdf-lib, file-saver
// npm install docx pdf-lib file-saver

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

const DARK_BERRY_RED = "6D071A";
const DARK_BERRY_RGB = rgb(0.427, 0.027, 0.102); // #6D071A

export async function generateDocuments(profile) {
 


  const bulletSkills = profile.skills.map((s) =>
    new Paragraph({
      text: `${s.name} (${s.level})`,
      bullet: { level: 0 },
    })
  );

  const workExperience = profile.workExperience.map((exp) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate})`,
          bold: true,
        }),
        new TextRun(`\n${exp.description}`),
      ],
    });
  });

  const docContent = [
    new Paragraph({
      text: profile.name,
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph(profile.about),
    new Paragraph({ text: "SKILLS", heading: HeadingLevel.HEADING_1 }),
    ...bulletSkills,
    new Paragraph({ text: "EXPERIENCE", heading: HeadingLevel.HEADING_1 }),
    ...workExperience,
    new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_1 }),
    ...profile.education.map((e) =>
      new Paragraph(
        `${e.degreeTitle} - ${e.institutionName} (${e.graduationDate})`
      )
    ),
  ];

   // 1. DOCX
 const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: "Montserrat",
          size: 22,
          color: DARK_BERRY_RED,
        },
      },
    },
  },
  sections: [
    {
      children: docContent,
    },
  ],
});

  // doc.addSection({ children: docContent });
  const docBlob = await Packer.toBlob(doc);
  saveAs(docBlob, `${profile.name.replace(/\s/g, "_")}.docx`);

  // 2. PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = 750;

 const wrapText = (text, size, maxWidth, font) => {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (let word of words) {
    const testLine = line + word + " ";
    const width = font.widthOfTextAtSize(testLine, size);
    if (width > maxWidth) {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  }

  if (line.trim()) lines.push(line.trim());
  return lines;
};

const drawWrappedText = (text, size = 12, offsetX = 50, color = rgb(0, 0, 0), maxWidth = 500) => {
  const lines = wrapText(text, size, maxWidth, font);
  lines.forEach((line) => {
    page.drawText(line, { x: offsetX, y, size, font, color });
    y -= size + 4;
  });
};

drawWrappedText(profile.about, 10, 50);
drawWrappedText("Skills", 14, 50, DARK_BERRY_RGB);
profile.skills.forEach((s) => drawWrappedText(`• ${s.name} (${s.level})`, 10, 60));

drawWrappedText("Experience", 14, 50, DARK_BERRY_RGB);
profile.workExperience.forEach((exp) => {
  drawWrappedText(`${exp.position} at ${exp.company}`, 11, 50, DARK_BERRY_RGB);
  drawWrappedText(`${exp.startDate} – ${exp.isCurrent ? "Present" : exp.endDate}`, 10);
  drawWrappedText(exp.description, 10);
});

drawWrappedText("Education", 14, 50, DARK_BERRY_RGB);
profile.education.forEach((e) => {
  drawWrappedText(`${e.degreeTitle} - ${e.institutionName} (${e.graduationDate})`, 10);
});


  const pdfBytes = await pdfDoc.save();
  const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
  saveAs(pdfBlob, `${profile.name.replace(/\s/g, "_")}.pdf`);
}
