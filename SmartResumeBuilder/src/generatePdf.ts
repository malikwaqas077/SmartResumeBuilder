import { jsPDF } from "jspdf";
import icons from './icons.json'; // Assumes Base64 encoded images of icons

interface UserData {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    skills: { name: string; technologies: string }[];
    education: { institution: string; degree: string; yearCompleted: string; cgpa: string }[];
    experience: { companyName: string; technologies: string; position: string; duration: string; city: string; softwareName: string; duties: string[] }[];
    honors: string;
    coursework: string;
    hobbies: string;
    honorsAndAwards: Honor[];  // Include this for structured honors and awards
    personalProjects: Project[];  // Include this for personal projects
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
    doc.setFontSize(24).setFont("helvetica", 'bold');
    doc.text(userData.name, pageWidth / 2, currentY, { align: "center" }); // Centered name title
    currentY += 10;

    // Contact details in one line with icons
    let startX = 20; // Start position for icons and text
    const iconSize = 5; // Icon dimensions

    // Function to add icons and text with explicit types
    const addIconWithText = (icon: string, text: string, url: string, x: number, y: number) => {
        doc.addImage(icon, 'PNG', x, y, iconSize, iconSize);
        doc.setFontSize(10).setFont("helvetica", 'normal');
        doc.textWithLink(text, x + iconSize + 2, y + iconSize / 2 + 1, { url });
    };
    function getLinkedInUsername(linkedinUrl: string): string {
        // Ensure the URL doesn't end with a slash for consistent processing
        const trimmedUrl = linkedinUrl.endsWith('/') ? linkedinUrl.slice(0, -1) : linkedinUrl;
        
        // Extract the username using the last '/' as a reference
        return trimmedUrl.substring(trimmedUrl.lastIndexOf('/') + 1);
    }
      
    // Extracting the user names from the URLs
    // Assuming userData.linkedin is already populated with the LinkedIn URL
    const linkedinUsername = getLinkedInUsername(userData.linkedin);
    const githubUsername = userData.github.substring(userData.github.lastIndexOf('/') + 1);
    
    // Place each icon with text
    addIconWithText(icons.email, userData.email, `mailto:${userData.email}`, startX, currentY);
    startX += doc.getTextWidth(userData.email) + 15;
    addIconWithText(icons.phone, userData.phone, `tel:${userData.phone}`, startX, currentY);
    startX += doc.getTextWidth(userData.phone) + 15;
    addIconWithText(icons.linkedin, linkedinUsername, userData.linkedin, startX, currentY);
    startX += doc.getTextWidth(linkedinUsername) + 15;
    addIconWithText(icons.github, githubUsername, userData.github, startX, currentY);
    currentY += 8;

    doc.line(10, currentY, pageWidth - 10, currentY);
    currentY += 10;
    // Calculating column widths and positions
    const leftColumnWidth = pageWidth * 0.66;
    const rightColumnWidth = pageWidth * 0.34;
    const leftColumnStartX = 10;
    const rightColumnStartX = leftColumnStartX + leftColumnWidth;
    let rightColumnY = currentY;  // Initialize right column Y to match left after icons

    // Skills Section in left column
    doc.setFontSize(14).setFont("helvetica", 'bold');
    doc.text("Skills & Technologies", leftColumnStartX, currentY);
    currentY += 8;
    userData.skills.forEach(skill => {
        doc.setFontSize(10).setFont("helvetica", 'bold'); // Skill name in bold
        doc.text(`${skill.name} | `, leftColumnStartX, currentY); // Changed ':' to '|'
        const skillNameWidth = doc.getTextWidth(skill.name + ' | '); // Width of the bold part
        doc.setFontSize(10).setFont("helvetica", 'normal'); // Technologies in normal font
        const technologies = skill.technologies.split(',').map(tech => tech.trim());
        if (technologies.length > 0) {
            doc.text(technologies[0], leftColumnStartX + skillNameWidth, currentY);
            if (technologies.length > 1) {
                doc.text(technologies.slice(1).map(tech => `• ${tech}`).join(' '), leftColumnStartX + skillNameWidth + doc.getTextWidth(technologies[0] + ' '), currentY, { maxWidth: leftColumnWidth - 20 - skillNameWidth });
            }
        }
        currentY += 6;
    });
    currentY += 4;
    /// Experience Section in left column
    doc.setFontSize(14).setFont("helvetica", 'bold');
    doc.text("Experience", leftColumnStartX, currentY);
    currentY += 6;

    userData.experience.forEach(exp => {
        // Set font size and style for the position with technologies in normal font
        let positionTechPart = `${exp.position} (${exp.technologies})`;
        doc.setFontSize(10).setFont("helvetica", 'bold');
        doc.text(positionTechPart, leftColumnStartX, currentY);
        let posTechWidth = doc.getTextWidth(positionTechPart);
        doc.line(leftColumnStartX, currentY + 2, leftColumnStartX + posTechWidth, currentY + 2);  // Underline

        currentY += 6; // Move to the next line

        // Set font size and style for the company name in bold
        doc.setFontSize(10).setFont("helvetica", 'normal');
        let companyPart = `${exp.companyName}, ${exp.duration}, ${exp.city}`; // Combine company name, duration, and city
        doc.text(companyPart, leftColumnStartX, currentY); // Print company name, duration, and city
        currentY += 6; // Move to the next line

        // Set font size and style for the software name in bold
        doc.setFont("helvetica", 'bold');
        doc.text(`${exp.softwareName}`, leftColumnStartX, currentY); // Software Name
        currentY += 6; // Move to the next line

        // Print duties in normal font with text wrapping and indentation for wrapped lines
        doc.setFontSize(10).setFont("helvetica", 'normal');
        exp.duties.forEach(duty => {
            const bullet = '• ';
            const dutyText = duty;
            const bulletWidth = doc.getTextWidth(bullet);
            const dutyX = leftColumnStartX + 5; // Starting X for bullet
            const textX = dutyX + bulletWidth; // Starting X for text after bullet
            const maxWidth = leftColumnWidth - textX; // Maximum width for text

            // Split text to fit within maxWidth, and handle indent for wrapped lines
            const lines = doc.splitTextToSize(dutyText, maxWidth);
            for (let i = 0; i < lines.length; i++) {
                if (i === 0) {
                    // First line with bullet
                    doc.text(bullet + lines[i], dutyX, currentY);
                } else {
                    // Subsequent lines indented beneath the bullet
                    doc.text(lines[i], textX, currentY);
                }
                currentY += 4; // Increment Y position for each line
            }
        });
        currentY += 10; // Space before next experience entry
    });

    // Education Section in right column, starting at the same Y as skills
    doc.setFontSize(14).setFont("helvetica", 'bold');
    doc.text("Education", rightColumnStartX, rightColumnY);
    rightColumnY += 8;
    userData.education.forEach(edu => {
        doc.setFontSize(12).setFont("helvetica", 'bold'); // Degree in bold and big
        doc.text(`${edu.degree}`, rightColumnStartX, rightColumnY); // Degree
        rightColumnY += 4;
        doc.setFontSize(10).setFont("helvetica", 'bold'); // Institution in less bold
        doc.text(`${edu.institution}`, rightColumnStartX, rightColumnY); // Institution
        rightColumnY += 4;
        doc.setFont("helvetica", 'normal'); // Year completed and CGPA
        doc.text(`${edu.yearCompleted} | CGPA: ${edu.cgpa}`, rightColumnStartX, rightColumnY); // Year Completed and CGPA
        rightColumnY += 10; // Increase Y position for the next entry
    });

    // Honors and Awards Section in the right column
    doc.setFontSize(14).setFont("helvetica", 'bold');
    doc.text("Honors and Awards", rightColumnStartX, rightColumnY);
    rightColumnY += 6;

    userData.honorsAndAwards.forEach(honor => {
        doc.setFontSize(10).setFont("helvetica", 'bold'); // Honor name in bold
        doc.text(honor.name, rightColumnStartX, rightColumnY);
        rightColumnY += 4;

        doc.setFont("helvetica", 'normal'); // Year and location in normal font
        doc.text(`${honor.year} | ${honor.location}`, rightColumnStartX, rightColumnY);
        rightColumnY += 6; // Space before the next entry

        doc.setFont("helvetica", 'normal'); // Details in normal font
        const projecthonorsDescLines = doc.splitTextToSize(honor.detail, rightColumnWidth - 10); // Handle text wrapping
        projecthonorsDescLines.forEach((line: string) => {
            doc.text(line, rightColumnStartX, rightColumnY);
            rightColumnY += 4;
        });
    });
    rightColumnY += 2;

    // Personal Projects Section in the right column
    doc.setFontSize(14).setFont("helvetica", 'bold');
    doc.text("Personal Projects", rightColumnStartX, rightColumnY);
    rightColumnY += 8;

    userData.personalProjects.forEach(project => {
        doc.setFontSize(10).setFont("helvetica", 'bold'); // Project name in bold
        doc.text(project.projectName, rightColumnStartX, rightColumnY);
        rightColumnY += 4;

        doc.setFontSize(10).setFont("helvetica", 'normal'); // Project description in normal font
        const projectDescLines = doc.splitTextToSize(project.description, rightColumnWidth - 10); // Handle text wrapping
        projectDescLines.forEach((line: string) => {
            doc.text(line, rightColumnStartX, rightColumnY);
            rightColumnY += 4;
        });

        rightColumnY += 4; // Additional space before the next project
    });

    // Save the PDF
    doc.save('Resume.pdf');

    
}
