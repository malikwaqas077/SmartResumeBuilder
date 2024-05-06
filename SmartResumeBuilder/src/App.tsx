// generatepdf.ts
import { jsPDF } from "jspdf";
import icons from './icons.json'; // Assumes Base64 encoded images of icons


interface UserData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  skills: { name: string; technologies: string }[];
  education: { institution: string; degree: string; yearCompleted: string; cgpa: string }[]; // Updated for education
  honors: string;
  coursework: string;
  hobbies: string;
}

export function generatePDF(userData: UserData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  // Header with name
  doc.setFontSize(20).setFont("helvetica", 'bold');
  doc.text(userData.name, pageWidth / 2, currentY, { align: "center" }); // Centered name title
  currentY += 10;

  // Contact details in one line with icons
  let startX = 20; // Start position for icons and text
  const iconSize = 5; // Icon dimensions

  // Function to add icons and text
  function addIconWithText(icon, text, x, y) {
    doc.addImage(icon, 'PNG', x, y, iconSize, iconSize);
    doc.setFontSize(10).setFont("helvetica", 'normal');
    doc.text(text, x + iconSize + 2, y + iconSize / 2 + 1); // Adjust text position next to the icon
  }

  // Place each icon with text
  addIconWithText(icons.email, userData.email, startX, currentY);
  startX += doc.getTextWidth(userData.email) + 15;
  addIconWithText(icons.phone, userData.phone, startX, currentY);
  startX += doc.getTextWidth(userData.phone) + 15;
  addIconWithText(icons.linkedin, userData.linkedin, startX, currentY);
  startX += doc.getTextWidth(userData.linkedin) + 15;
  addIconWithText(icons.github, userData.github, startX, currentY);
  currentY += 15;

  // Calculating column widths and positions
  const leftColumnWidth = pageWidth * 0.66;
  const rightColumnWidth = pageWidth * 0.34;
  const leftColumnStartX = 10;
  const rightColumnStartX = leftColumnStartX + leftColumnWidth;
  let rightColumnY = currentY;  // Initialize right column Y to match left after icons

  // Skills Section in left column
  doc.setFontSize(12).setFont("helvetica", 'bold');
  doc.text("Skills & Technologies", leftColumnStartX, currentY);
  currentY += 6;
  userData.skills.forEach(skill => {
    doc.setFontSize(10).setFont("helvetica", 'normal');
    doc.text(`${skill.name}: ${skill.technologies.split(',').map(tech => `• ${tech.trim()}`).join(' ')}`, leftColumnStartX, currentY, { maxWidth: leftColumnWidth - 20 });
    currentY += 6;
  });

  // Education Section in right column, starting at the same Y as skills
  doc.setFontSize(12).setFont("helvetica", 'bold');
  doc.text("Education", rightColumnStartX, rightColumnY); // Updated for education
  rightColumnY += 12;

  // Loop through education entries
  userData.education.forEach(edu => {
    doc.setFontSize(14).setFont("helvetica", 'bold'); // Degree in bold and big
    doc.text(`${edu.degree}`, rightColumnStartX, rightColumnY); // Degree
    rightColumnY += 8;
    
    doc.setFontSize(10).setFont("helvetica", 'bold'); // Institution in less bold
    doc.text(`${edu.institution}`, rightColumnStartX, rightColumnY); // Institution
    rightColumnY += 6;
    
    doc.setFontSize(10).setFont("helvetica", 'normal'); // Year completed and CGPA
    doc.text(`${edu.yearCompleted} | CGPA: ${edu.cgpa}`, rightColumnStartX, rightColumnY); // Year Completed and CGPA
    rightColumnY += 10; // Increase Y position for the next entry
  });

  // Continue with other sections...

  doc.save('Resume.pdf');
}
