import React from 'react';
import axios from 'axios';

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

function CvList({ cvList, handleCvClick, handleDeleteClick }: { cvList: UserData[], handleCvClick: (id: string) => void, handleDeleteClick: (id: string) => void }) {
  return (
    <div className="w-1/3 p-2">
      <h2 className="text-lg font-semibold mb-2">Saved CVs</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {cvList.map(cv => (
            <li key={cv._id} className="p-2 hover:bg-gray-100 flex justify-between items-center cursor-pointer">
              <div onClick={() => handleCvClick(cv._id!)}>
                <div className="flex items-center space-x-2">
                  <div className="text-lg font-medium text-gray-900">{cv.name}</div>
                  <div className="text-sm text-gray-500">{cv.email}</div>
                </div>
                <div className="mt-1 text-sm text-gray-500">{cv.phone}</div>
              </div>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();  // Prevent triggering the click event for handleCvClick
                  handleDeleteClick(cv._id!);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CvList;
