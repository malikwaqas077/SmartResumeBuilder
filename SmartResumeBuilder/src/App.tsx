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
  entries: (Skill | Education | Experience)[];
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
    hobbies: ''
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
    let newEntry: Skill | Education | Experience;

    if (section === 'skills') {
      newEntry = { name: '', technologies: '' }; // This matches the Skill interface
    } else if (section === 'education') {
      newEntry = { institution: '', degree: '', yearCompleted: '', cgpa: '' }; // This matches the Education interface
    } else if (section === 'experience') {
      newEntry = { companyName: '', technologies: '', position: '', duration: '', city: '', softwareName: '', duties: [''] }; // This matches the Experience interface
    } else {
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

function DynamicSection({ title, section, entries, handleChange, handleAdd, handleAddDuty }: DynamicSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {entries.map((entry, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 mb-2">
          {section === "education" ? (
            <>
              <input className="border p-2 rounded" type="text" placeholder="Degree" name="degree" value={(entry as Education).degree} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Institution" name="institution" value={(entry as Education).institution} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Year Completed" name="yearCompleted" value={(entry as Education).yearCompleted} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="CGPA" name="cgpa" value={(entry as Education).cgpa} onChange={(e) => handleChange(e, index, section)} />
            </>
          ) : section === "skills" ? (
            <>
              <input className="border p-2 rounded" type="text" placeholder="Title or Name" name="name" value={(entry as Skill).name} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Details or Technologies" name="technologies" value={(entry as Skill).technologies} onChange={(e) => handleChange(e, index, section)} />
            </>
          ) : section === "experience" ? (
            <>
              <input className="border p-2 rounded" type="text" placeholder="Company Name" name="companyName" value={(entry as Experience).companyName} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Technologies" name="technologies" value={(entry as Experience).technologies} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Position" name="position" value={(entry as Experience).position} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Duration" name="duration" value={(entry as Experience).duration} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="City" name="city" value={(entry as Experience).city} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Software Name" name="softwareName" value={(entry as Experience).softwareName} onChange={(e) => handleChange(e, index, section)} />

              {entry.duties.map((duty, dutyIndex) => (
                <textarea key={dutyIndex} className="border p-2 rounded" placeholder="Duty Detail" name={`duties`} value={duty} onChange={(e) => handleChange(e, index, 'experience', dutyIndex)} />
              ))}
              <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2" onClick={() => handleAddDuty(index)}>Add Duty</button>
            </>
          ) : null}
        </div>
      ))}
      <button type="button" onClick={handleAdd} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4">Add Another {section}</button>
    </div>
  );
}



export default App;
