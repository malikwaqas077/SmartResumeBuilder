import React, { useState, ChangeEvent } from 'react';
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
  project: string;
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

function App() {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  const handleGeneratePDF = () => {
    try {
      const parsedData = JSON.parse(jsonInput);

      // Optional: Validate parsedData here

      const defaultUserData: UserData = {
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        skills: [],
        education: [],
        experience: [],
        honors: '',
        coursework: '',
        hobbies: '',
        honorsAndAwards: [],
        personalProjects: [],
      };
      const mergedData = { ...defaultUserData, ...parsedData };

      setUserData(mergedData);
      setError('');
      generatePDF(mergedData);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      setError('Invalid JSON input. Please check your data.');
    }
  };

  return (
    <div className="App">
      <h1 className="text-xl font-bold text-center my-2">Welcome to Smart CV Builder</h1>
      <div className="flex justify-center">
        <div className="w-2/3 p-4">
          <textarea
            value={jsonInput}
            onChange={handleInputChange}
            placeholder="Paste your JSON CV data here..."
            rows={20}
            className="w-full p-2 border rounded mb-4"
          ></textarea>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <button
            onClick={handleGeneratePDF}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
