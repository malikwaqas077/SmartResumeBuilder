import { jsPDF } from 'jspdf';
import icons from './icons.json'; // Ensure this file contains base64-encoded images

interface UserData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  honors: string;
  coursework: string;
  hobbies: string;
  honorsAndAwards: Honor[];
  personalProjects: Project[];
}

interface Skill {
  name: string;
  technologies: string;
}

interface Education {
  institution: string;
  degree: string;
  yearCompleted: string;
  cgpa: string;
}

interface Experience {
  companyName: string;
  technologies: string;
  position: string;
  duration: string;
  city: string;
  project: string; // Updated property name
  duties: string[];
}

interface Honor {
  name: string;
  detail: string;
  year: string;
  location: string;
}

interface Project {
  projectName: string;
  description: string;
}

export async function generatePDF(userData: UserData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  // Header with name
  doc.setFontSize(24).setFont('helvetica', 'bold');
  doc.text(userData.name || '', pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;

  // Contact details with icons
  let startX = 20;
  const iconSize = 5;

  const addIconWithText = (icon: string, text: string, url: string, x: number, y: number) => {
    doc.addImage(icon, 'PNG', x, y, iconSize, iconSize);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.textWithLink(text, x + iconSize + 2, y + iconSize / 2 + 1, { url });
  };

  function getLinkedInUsername(linkedinUrl: string): string {
    const trimmedUrl = linkedinUrl.endsWith('/') ? linkedinUrl.slice(0, -1) : linkedinUrl;
    return trimmedUrl.substring(trimmedUrl.lastIndexOf('/') + 1);
  }

  const linkedinUsername = userData.linkedin ? getLinkedInUsername(userData.linkedin) : '';
  const githubUsername = userData.github ? userData.github.substring(userData.github.lastIndexOf('/') + 1) : '';

  if (userData.email) {
    addIconWithText(icons.email, userData.email, `mailto:${userData.email}`, startX, currentY);
    startX += doc.getTextWidth(userData.email) + 15;
  }
  if (userData.phone) {
    addIconWithText(icons.phone, userData.phone, `tel:${userData.phone}`, startX, currentY);
    startX += doc.getTextWidth(userData.phone) + 15;
  }
  if (userData.linkedin) {
    addIconWithText(icons.linkedin, linkedinUsername, userData.linkedin, startX, currentY);
    startX += doc.getTextWidth(linkedinUsername) + 15;
  }
  if (userData.github) {
    addIconWithText(icons.github, githubUsername, userData.github, startX, currentY);
    startX += doc.getTextWidth(githubUsername) + 15;
  }
  currentY += 8;

  doc.line(10, currentY, pageWidth - 10, currentY);
  currentY += 10;

  // Left and right columns
  const leftColumnWidth = pageWidth * 0.66;
  const rightColumnWidth = pageWidth * 0.34;
  const leftColumnStartX = 10;
  const rightColumnStartX = leftColumnStartX + leftColumnWidth;
  let rightColumnY = currentY;

  // Skills Section
  if (userData.skills && userData.skills.length > 0) {
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('Skills & Technologies', leftColumnStartX, currentY);
    currentY += 8;
    userData.skills.forEach(skill => {
      doc.setFontSize(10).setFont('helvetica', 'bold');
      doc.text(`${skill.name} | `, leftColumnStartX, currentY);
      const skillNameWidth = doc.getTextWidth(skill.name + ' | ');
      doc.setFontSize(10).setFont('helvetica', 'normal');
      const technologies = skill.technologies.split(',').map(tech => tech.trim());
      if (technologies.length > 0) {
        doc.text(technologies[0], leftColumnStartX + skillNameWidth, currentY);
        if (technologies.length > 1) {
          doc.text(
            technologies.slice(1).map(tech => `• ${tech}`).join(' '),
            leftColumnStartX + skillNameWidth + doc.getTextWidth(technologies[0] + ' '),
            currentY,
            { maxWidth: leftColumnWidth - 20 - skillNameWidth }
          );
        }
      }
      currentY += 6;
    });
    currentY += 4;
  }

  // Experience Section
  if (userData.experience && userData.experience.length > 0) {
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('Experience', leftColumnStartX, currentY);
    currentY += 6;

    userData.experience.forEach(exp => {
      doc.setFontSize(10).setFont('helvetica', 'bold');
      let positionTechPart = `${exp.position} (${exp.technologies})`;
      doc.text(positionTechPart, leftColumnStartX, currentY);
      let posTechWidth = doc.getTextWidth(positionTechPart);
      doc.line(leftColumnStartX, currentY + 2, leftColumnStartX + posTechWidth, currentY + 2);
      currentY += 6;

      doc.setFontSize(10).setFont('helvetica', 'normal');
      let companyPart = `${exp.companyName}, ${exp.duration}, ${exp.city}`;
      doc.text(companyPart, leftColumnStartX, currentY);
      currentY += 6;

      // Use exp.project instead of exp.softwareName
      if (exp.project) {
        doc.setFont('helvetica', 'bold');
        doc.text(`${exp.project}`, leftColumnStartX, currentY); // Project Name
        currentY += 6;
      }

      // Duties
      doc.setFontSize(10).setFont('helvetica', 'normal');
      exp.duties.forEach(duty => {
        const bullet = '• ';
        const dutyText = duty;
        const bulletWidth = doc.getTextWidth(bullet);
        const dutyX = leftColumnStartX + 5;
        const textX = dutyX + bulletWidth;
        const maxWidth = leftColumnWidth - textX;

        const lines = doc.splitTextToSize(dutyText, maxWidth);
        lines.forEach((line, i) => {
          if (i === 0) {
            doc.text(bullet + line, dutyX, currentY);
          } else {
            doc.text(line, textX, currentY);
          }
          currentY += 4;
        });
      });
      currentY += 10;
    });
  }

  // Education Section
  if (userData.education && userData.education.length > 0) {
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('Education', rightColumnStartX, rightColumnY);
    rightColumnY += 8;

    userData.education.forEach(edu => {
      doc.setFontSize(12).setFont('helvetica', 'bold');
      doc.text(`${edu.degree}`, rightColumnStartX, rightColumnY);
      rightColumnY += 4;

      doc.setFontSize(10).setFont('helvetica', 'bold');
      doc.text(`${edu.institution}`, rightColumnStartX, rightColumnY);
      rightColumnY += 4;

      doc.setFont('helvetica', 'normal');
      doc.text(`${edu.yearCompleted} | CGPA: ${edu.cgpa}`, rightColumnStartX, rightColumnY);
      rightColumnY += 10;
    });
  }

  // Honors and Awards Section
  if (userData.honorsAndAwards && userData.honorsAndAwards.length > 0) {
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('Honors and Awards', rightColumnStartX, rightColumnY);
    rightColumnY += 6;

    userData.honorsAndAwards.forEach(honor => {
      doc.setFontSize(10).setFont('helvetica', 'bold');
      doc.text(honor.name, rightColumnStartX, rightColumnY);
      rightColumnY += 4;

      doc.setFont('helvetica', 'normal');
      doc.text(`${honor.year} | ${honor.location}`, rightColumnStartX, rightColumnY);
      rightColumnY += 6;

      const honorDetailLines = doc.splitTextToSize(honor.detail, rightColumnWidth - 10);
      honorDetailLines.forEach(line => {
        doc.text(line, rightColumnStartX, rightColumnY);
        rightColumnY += 4;
      });
      rightColumnY += 4;
    });
  }

  // Personal Projects Section
  if (userData.personalProjects && userData.personalProjects.length > 0) {
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('Personal Projects', rightColumnStartX, rightColumnY);
    rightColumnY += 8;

    userData.personalProjects.forEach(project => {
      doc.setFontSize(10).setFont('helvetica', 'bold');
      doc.text(project.projectName, rightColumnStartX, rightColumnY);
      rightColumnY += 4;

      doc.setFontSize(10).setFont('helvetica', 'normal');
      const projectDescLines = doc.splitTextToSize(project.description, rightColumnWidth - 10);
      projectDescLines.forEach(line => {
        doc.text(line, rightColumnStartX, rightColumnY);
        rightColumnY += 4;
      });
      rightColumnY += 4;
    });
  }

  // Save the PDF
  doc.save('Resume.pdf');
}
