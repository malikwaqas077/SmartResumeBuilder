import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import './App.css';  // Ensure Tailwind CSS is correctly imported
import { generatePDF } from './generatePdf';
import CvList from './CvList';

interface UserData {
  _id?: string;
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

interface Project {
  projectName: string;
  description: string;
  _id?: string;
}

interface Honor {
  name: string;
  detail: string;
  year: string;
  location: string;
  _id?: string;
}

interface Skill {
  name: string;
  technologies: string;
  _id?: string;
}

interface Education {
  institution: string;
  degree: string;
  yearCompleted: string;
  cgpa: string;
  _id?: string;
}

interface Experience {
  companyName: string;
  technologies: string;
  position: string;
  duration: string;
  city: string;
  softwareName: string;
  duties: string[];
  _id?: string;
}

interface DynamicSectionProps {
  title: string;
  section: keyof UserData;
  entries: (Skill | Education | Experience | Honor | Project)[];
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, section: keyof UserData, subIndex?: number) => void;
  handleAdd: () => void;
  handleAddDuty?: (index: number) => void;
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
    honorsAndAwards: [{ name: '', detail: '', year: '', location: '' }],
    personalProjects: [{ projectName: '', description: '' }]
  });

  const [cvList, setCvList] = useState<UserData[]>([]);

  useEffect(() => {
    fetchCvList();
  }, []);

  const fetchCvList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cvs');
      console.log('CV List Response:', response.data);
      setCvList(response.data);
    } catch (error) {
      console.error('Error fetching CV list:', error);
    }
  };

  const handleNonArrayChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof UserData) => {
    const { value } = e.target;
    setUserData({ ...userData, [field]: value });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    section: keyof UserData,
    subIndex?: number
  ) => {
    const { name, value } = e.target;
  
    const sectionData = userData[section];
  
    if (Array.isArray(sectionData)) {
      const updatedSection = [...sectionData] as (Skill | Education | Experience | Honor | Project)[];
  
      if (section === 'experience') {
        if (name === 'duties' && subIndex !== undefined) {
          const updatedDuties = [...(updatedSection[index] as Experience).duties];
          updatedDuties[subIndex] = value;
          (updatedSection[index] as Experience).duties = updatedDuties;
        } else {
          (updatedSection[index] as any)[name] = value;
        }
      } else {
        (updatedSection[index] as any)[name] = value;
      }
  
      setUserData({ ...userData, [section]: updatedSection });
    }
  };
  
  

  function handleAddDuty(index: number) {
    setUserData(prevUserData => {
      const newDuties = [...prevUserData.experience[index].duties, ''];
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

  const handleCvClick = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cvs/${id}`);
      const fetchedCv: UserData = response.data;
      setUserData({
        ...fetchedCv,
        skills: fetchedCv.skills || [{ name: '', technologies: '' }],
        education: fetchedCv.education || [{ institution: '', degree: '', yearCompleted: '', cgpa: '' }],
        experience: fetchedCv.experience || [{ companyName: '', technologies: '', position: '', duration: '', city: '', softwareName: '', duties: [''] }],
        honorsAndAwards: fetchedCv.honorsAndAwards || [{ name: '', detail: '', year: '', location: '' }],
        personalProjects: fetchedCv.personalProjects || [{ projectName: '', description: '' }],
        honors: fetchedCv.honors || '',
        coursework: fetchedCv.coursework || '',
        hobbies: fetchedCv.hobbies || ''
      });
    } catch (error) {
      console.error('Error fetching CV:', error);
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/cvs/${id}`);
      setCvList(cvList.filter(cv => cv._id !== id));
    } catch (error) {
      console.error('Error deleting CV:', error);
    }
  };

  const sanitizeData = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map(item => sanitizeData(item));
    } else if (typeof data === 'object' && data !== null) {
      const { _id, __v, ...rest } = data;
      const sanitizedObject: any = {};
      for (const key in rest) {
        sanitizedObject[key] = sanitizeData(rest[key]);
      }
      return sanitizedObject;
    } else {
      return data;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const sanitizedUserData: UserData = sanitizeData(userData);
  
    try {
      // Log the sanitized data being sent to the server
      console.log("Sending sanitized data to server:", sanitizedUserData);
  
      // Save the CV to the database
      await axios.post('http://localhost:5000/api/cvs', sanitizedUserData);
      console.log('CV saved to database successfully');
      
      // Fetch the updated CV list
      fetchCvList();
  
      // Generate the PDF
      generatePDF(userData);
    } catch (error) {
      // Type guard to check if error is an AxiosError
      if (axios.isAxiosError(error)) {
        console.error('Error saving CV:', error.response?.data || error.message);
      } else {
        console.error('Error saving CV:', error);
      }
    }
  };
  

  return (
    <div className="App">
      <h1 className="text-xl font-bold text-center my-2">Welcome to Smart CV Builder</h1>  {/* Reduced margin here */}
      <div className="flex">
        <CvList cvList={cvList} handleCvClick={handleCvClick} handleDeleteClick={handleDeleteClick} />
        <div className="w-1/2 p-2">  {/* Reduced padding here */}
          <form onSubmit={handleSubmit} className="space-y-4">  {/* Reduced spacing here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">  {/* Reduced gap here */}
              <input className="border p-2 rounded" type="text" placeholder="Name" name="name" value={userData.name || ''} onChange={(e) => handleNonArrayChange(e, 'name')} />
              <input className="border p-2 rounded" type="email" placeholder="Email" name="email" value={userData.email || ''} onChange={(e) => handleNonArrayChange(e, 'email')} />
              <input className="border p-2 rounded" type="text" placeholder="Phone" name="phone" value={userData.phone || ''} onChange={(e) => handleNonArrayChange(e, 'phone')} />
              <input className="border p-2 rounded" type="text" placeholder="LinkedIn Profile" name="linkedin" value={userData.linkedin || ''} onChange={(e) => handleNonArrayChange(e, 'linkedin')} />
              <input className="border p-2 rounded" type="text" placeholder="GitHub Profile" name="github" value={userData.github || ''} onChange={(e) => handleNonArrayChange(e, 'github')} />
            </div>

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
              handleAddDuty={handleAddDuty}
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

            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Generate PDF</button>
          </form>
        </div>
        <div className="w-1/6 p-2">  {/* Reduced padding here */}
          <h2 className="text-lg font-semibold mb-2">Suggestions</h2>  {/* Reduced margin here */}
          <div className="text-gray-500">Here you will see suggestions for improving your CV based on the job description.</div>
        </div>
      </div>
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
  // Ensure entries is always an array
  entries = entries || [];

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {entries.map((entry, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {section === "experience" && isExperience(entry) ? (
            <>
              <input className="border p-2 rounded" type="text" placeholder="Company Name" name="companyName" value={entry.companyName} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Technologies" name="technologies" value={entry.technologies} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Position" name="position" value={entry.position} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Duration" name="duration" value={entry.duration} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="City" name="city" value={entry.city} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Software Name" name="softwareName" value={entry.softwareName} onChange={(e) => handleChange(e, index, section)} />
              {entry.duties.map((duty, dutyIndex) => (
                <textarea key={dutyIndex} className="border p-2 rounded col-span-2" placeholder="Duty Detail" name="duties" value={duty} onChange={(e) => handleChange(e, index, 'experience', dutyIndex)} />
              ))}
              <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2 col-span-2" onClick={() => handleAddDuty!(index)}>Add Duty</button>
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
          ) : section === "honorsAndAwards" && isHonor(entry) ? (
            <>
              <input className="border p-2 rounded" type="text" placeholder="Award Name" name="name" value={entry.name} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Detail" name="detail" value={entry.detail} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Year" name="year" value={entry.year} onChange={(e) => handleChange(e, index, section)} />
              <input className="border p-2 rounded" type="text" placeholder="Location" name="location" value={entry.location} onChange={(e) => handleChange(e, index, section)} />
            </>
          ) : section === "personalProjects" && isProject(entry) ? (
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
                className="border p-2 rounded col-span-2"
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
