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

interface DynamicSectionProps {
  title: string;
  section: keyof UserData;
  entries: Skill[] | Education[];
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, section: keyof UserData) => void;
  handleAdd: () => void;
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
    honors: '',
    coursework: '',
    hobbies: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, section: keyof UserData) => {
    const { name, value } = e.target;
    if (section === 'skills' || section === 'education') {
      const updatedSection = [...userData[section]] as Skill[] | Education[];
      (updatedSection[index] as any)[name] = value;
      setUserData({ ...userData, [section]: updatedSection });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  function handleAddSection(section: keyof UserData) {
    let newEntry: Skill | Education;
  
    if (section === 'skills') {
      newEntry = { name: '', technologies: '' }; // This matches the Skill interface
    } else if (section === 'education') {
      newEntry = { institution: '', degree: '', yearCompleted: '', cgpa: '' }; // This matches the Education interface
    } else {
      // Handle other cases or throw an error if the section is not expected
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-2 rounded" type="text" placeholder="Name" name="name" value={userData.name} onChange={(e) => handleChange(e, 0, 'name')} />
          <input className="border p-2 rounded" type="email" placeholder="Email" name="email" value={userData.email} onChange={(e) => handleChange(e, 0, 'email')} />
          <input className="border p-2 rounded" type="text" placeholder="Phone" name="phone" value={userData.phone} onChange={(e) => handleChange(e, 0, 'phone')} />
          <input className="border p-2 rounded" type="text" placeholder="LinkedIn Profile" name="linkedin" value={userData.linkedin} onChange={(e) => handleChange(e, 0, 'linkedin')} />
          <input className="border p-2 rounded" type="text" placeholder="GitHub Profile" name="github" value={userData.github} onChange={(e) => handleChange(e, 0, 'github')} />
        </div>

        <DynamicSection title="Skills and Technologies" section="skills" entries={userData.skills} handleChange={handleChange} handleAdd={() => handleAddSection('skills')} />
        <DynamicSection title="Education" section="education" entries={userData.education} handleChange={handleChange} handleAdd={() => handleAddSection('education')} />

        <textarea className="border p-2 rounded" placeholder="Honors and Awards" name="honors" value={userData.honors} onChange={(e) => handleChange(e, 0, 'honors')} />
        <textarea className="border p-2 rounded" placeholder="Relevant Coursework" name="coursework" value={userData.coursework} onChange={(e) => handleChange(e, 0, 'coursework')} />
        <textarea className="border p-2 rounded" placeholder="Hobbies" name="hobbies" value={userData.hobbies} onChange={(e) => handleChange(e, 0, 'hobbies')} />

        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Generate PDF</button>
      </form>
    </div>
  );
}

function DynamicSection({ title, section, entries, handleChange, handleAdd }: DynamicSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {entries.map((entry, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 mb-2">
          <input className="border p-2 rounded" type="text" placeholder="Title or Name" name="name" value={(entry as Skill).name} onChange={(e) => handleChange(e, index, section)} />
          {section === "education" ? (
            <>
              <input className="border p-2 rounded" type="text" placeholder="Degree" name="degree" value={(entry as Education).degree} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Institution" name="institution" value={(entry as Education).institution} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Year Completed" name="yearCompleted" value={(entry as Education).yearCompleted} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="CGPA" name="cgpa" value={(entry as Education).cgpa} onChange={(e) => handleChange(e, index, section)} />
            </>
          ) : (
            <input className="border p-2 rounded" type="text" placeholder="Details or Technologies" name="technologies" value={(entry as Skill).technologies} onChange={(e) => handleChange(e, index, section)} />
          )}
        </div>
      ))}
      <button type="button" onClick={handleAdd} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Another Entry</button>
    </div>
  );
}

export default App;
