import React, { useState, ChangeEvent } from 'react';
import './App.css';  // Ensure Tailwind CSS is correctly imported
import { generatePDF } from './generatePdf';

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
  honorsAndAwards: Honor[];  // Add this new array for honors and awards
  personalProjects: Project[];  // Add this new array for personal projects
}
interface Project {
  projectName: string;
  description: string;
}
interface Honor {
  name: string;
  detail: string;
  year: string;
  location: string;
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
  softwareName: string;
  duties: string[];
}

interface DynamicSectionProps {
  title: string;
  section: keyof UserData;
  entries: (Skill | Education | Experience | Honor | Project)[];
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, section: keyof UserData, subIndex?: number) => void;
  handleAdd: () => void;
  handleAddDuty?: (index: number) => void;  // Make this optional since it's not used by all sections
}





function App() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    skills: [{ name: '', technologies: '' }],
    education: [{ institution: '', degree: '', yearCompleted: '', cgpa: '' }],
    experience: [{ companyName: '', technologies: '', position: '', duration: '', city: '', softwareName: '', duties: [''] }],
    honors: '',
    coursework: '',
    hobbies: '',
    honorsAndAwards: [{ name: '', detail: '', year: '', location: '' }],  // Initialize with an empty entry
    personalProjects : [{ projectName: '', description: ''}]

  });

  const handleNonArrayChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof UserData) => {
    const { value } = e.target;
    setUserData({ ...userData, [field]: value });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, section: keyof UserData, subIndex?: number) => {
    const { name, value } = e.target;

    const updatedSection = [...userData[section]] as Skill[] | Education[] | Experience[];

    if (section === 'experience') {
      // Handle nested duties within the experience entries
      if (name === 'duties' && subIndex !== undefined) {
        const updatedDuties = [...(updatedSection[index] as Experience).duties];
        updatedDuties[subIndex] = value;
        (updatedSection[index] as Experience).duties = updatedDuties;
      } else {
        (updatedSection[index] as any)[name] = value;
      }
    } else {
      // For non-experience sections, or non-duty fields in experience
      (updatedSection[index] as any)[name] = value;
    }

    setUserData({ ...userData, [section]: updatedSection });
  };


  function handleAddDuty(index: number) {
    setUserData(prevUserData => {
      const newDuties = [...prevUserData.experience[index].duties, '']; // Add a new empty duty
      const updatedExperience = { ...prevUserData.experience[index], duties: newDuties };
      const updatedExperiences = [...prevUserData.experience];
      updatedExperiences[index] = updatedExperience;
      return { ...prevUserData, experience: updatedExperiences };
    });
  }


  function handleAddSection(section: keyof UserData) {
    let newEntry: Skill | Education | Experience | Honor | Project;
    
    switch (section) {
      case 'skills':
        newEntry = { name: '', technologies: '' };
        break;
      case 'education':
        newEntry = { institution: '', degree: '', yearCompleted: '', cgpa: '' };
        break;
      case 'experience':
        newEntry = { companyName: '', technologies: '', position: '', duration: '', city: '', softwareName: '', duties: [''] };
        break;
      case 'honorsAndAwards':
        newEntry = { name: '', detail: '', year: '', location: '' };
        break;
      case 'personalProjects':
        newEntry = { projectName: '', description: '' };
        break;
      default:
        throw new Error("Unsupported section type");
    }
    
    setUserData(prev => ({
      ...prev,
      [section]: [...prev[section], newEntry]
    }));
  }
  





  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generatePDF(userData);
  };

  return (
    <div className="App">
      <h1 className="text-xl font-bold text-center my-4">Welcome to Smart CV Builder</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        {/* Inputs for name, email, phone, LinkedIn, and GitHub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-2 rounded" type="text" placeholder="Name" name="name" value={userData.name} onChange={(e) => handleNonArrayChange(e, 'name')} />
          <input className="border p-2 rounded" type="email" placeholder="Email" name="email" value={userData.email} onChange={(e) => handleNonArrayChange(e, 'email')} />
          <input className="border p-2 rounded" type="text" placeholder="Phone" name="phone" value={userData.phone} onChange={(e) => handleNonArrayChange(e, 'phone')} />
          <input className="border p-2 rounded" type="text" placeholder="LinkedIn Profile" name="linkedin" value={userData.linkedin} onChange={(e) => handleNonArrayChange(e, 'linkedin')} />
          <input className="border p-2 rounded" type="text" placeholder="GitHub Profile" name="github" value={userData.github} onChange={(e) => handleNonArrayChange(e, 'github')} />

        </div>

        {/* Dynamic sections for skills, education, and experience */}
        <DynamicSection
          title="Skills and Technologies"
          section="skills"
          entries={userData.skills}
          handleChange={handleChange}
          handleAdd={() => handleAddSection('skills')}
        />
        <DynamicSection
          title="Education"
          section="education"
          entries={userData.education}
          handleChange={handleChange}
          handleAdd={() => handleAddSection('education')}
        />
        <DynamicSection
          title="Experience"
          section="experience"
          entries={userData.experience}
          handleChange={handleChange}
          handleAdd={() => handleAddSection('experience')}
          handleAddDuty={handleAddDuty}  // Include handleAddDuty here
        />
        <DynamicSection
          title="Honors and Awards"
          section="honorsAndAwards"
          entries={userData.honorsAndAwards as (Skill | Education | Experience | Honor | Project)[]}
          handleChange={handleChange}
          handleAdd={() => handleAddSection('honorsAndAwards')}
        />

<DynamicSection
          title="Personal Projects"
          section="personalProjects"
          entries={userData.personalProjects as (Skill | Education | Experience | Honor | Project)[]}
          handleChange={handleChange}
          handleAdd={() => handleAddSection('personalProjects')}
        />

        {/* Textareas for honors, coursework, and hobbies */}
        <textarea className="border p-2 rounded" placeholder="Honors and Awards" name="honors" value={userData.honors} onChange={(e) => handleNonArrayChange(e, 'honors')} />
        <textarea className="border p-2 rounded" placeholder="Relevant Coursework" name="coursework" value={userData.coursework} onChange={(e) => handleNonArrayChange(e, 'coursework')} />
        <textarea className="border p-2 rounded" placeholder="Hobbies" name="hobbies" value={userData.hobbies} onChange={(e) => handleNonArrayChange(e, 'hobbies')} />

        {/* Submit button */}
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Generate PDF</button>
      </form>
    </div>
  );
}
function isExperience(entry: Skill | Education | Experience | Honor | Project): entry is Experience {
  return (entry as Experience).duties !== undefined && (entry as Experience).companyName !== undefined;
}

function isSkill(entry: Skill | Education | Experience | Honor | Project): entry is Skill {
  return (entry as Skill).technologies !== undefined && (entry as Skill).name !== undefined;
}

function isEducation(entry: Skill | Education | Experience | Honor | Project): entry is Education {
  return (entry as Education).degree !== undefined && (entry as Education).institution !== undefined;
}

function isHonor(entry: Skill | Education | Experience | Honor | Project): entry is Honor {
  return (entry as Honor).detail !== undefined && (entry as Honor).name !== undefined;
}

function isProject(entry: Skill | Education | Experience | Honor | Project): entry is Project {
  return (entry as Project).projectName !== undefined && (entry as Project).description !== undefined;
}



function DynamicSection({ title, section, entries, handleChange, handleAdd, handleAddDuty }: DynamicSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {entries.map((entry, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 mb-2">
          {section === "experience" && isExperience(entry) ? (
            <>
              <input className="border p-2 rounded" type="text" placeholder="Company Name" name="companyName" value={entry.companyName} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Technologies" name="technologies" value={entry.technologies} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Position" name="position" value={entry.position} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Duration" name="duration" value={entry.duration} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="City" name="city" value={entry.city} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Software Name" name="softwareName" value={entry.softwareName} onChange={(e) => handleChange(e, index, section)} />
              {entry.duties.map((duty, dutyIndex) => (
                <textarea key={dutyIndex} className="border p-2 rounded" placeholder="Duty Detail" name="duties" value={duty} onChange={(e) => handleChange(e, index, 'experience', dutyIndex)} />
              ))}
              <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2" onClick={() => handleAddDuty!(index)}>Add Duty</button>
            </>
          ) : section === "education" && isEducation(entry) ? (
            <>
              <input className="border p-2 rounded" type="text" placeholder="Degree" name="degree" value={entry.degree} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Institution" name="institution" value={entry.institution} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Year Completed" name="yearCompleted" value={entry.yearCompleted} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="CGPA" name="cgpa" value={entry.cgpa} onChange={(e) => handleChange(e, index, section)} />
            </>
          ) : section === "skills" && isSkill(entry) ? (
            <>
              <input className="border p-2 rounded" type="text" placeholder="Skill Name" name="name" value={entry.name} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Technologies" name="technologies" value={entry.technologies} onChange={(e) => handleChange(e, index, section)} />
            </>
          ) : isHonor(entry) && section === "honorsAndAwards" ? (
            <>
              <input className="border p-2 rounded" type="text" placeholder="Award Name" name="name" value={entry.name} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Detail" name="detail" value={entry.detail} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Year" name="year" value={entry.year} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Location" name="location" value={entry.location} onChange={(e) => handleChange(e, index, section)} />
            </>
          ) : isProject(entry) && section === "personalProjects" ? (
            <>
              <input
                className="border p-2 rounded"
                type="text"
                placeholder="Project Name"
                name="projectName"
                value={entry.projectName}
                onChange={(e) => handleChange(e, index, section)}
              />
              <textarea
                className="border p-2 rounded"
                placeholder="Project Description"
                name="description"
                value={entry.description}
                onChange={(e) => handleChange(e, index, section)}
              />
            </>
          ) : null}
        </div>
      ))}
      <button type="button" onClick={handleAdd} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4">Add Another {section}</button>
    </div>
  );
}





export default App;
