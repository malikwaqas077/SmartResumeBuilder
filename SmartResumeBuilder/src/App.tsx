import { useState } from 'react';
import './App.css';  // Ensure Tailwind CSS is correctly imported
import { generatePDF } from './generatePdf';

function App() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    skills: [{ name: '', technologies: '' }],
    experience: [{ title: '', details: '' }],
    education: [{ institution: '', degree: '' }],
    honors: '',
    coursework: '',
    hobbies: ''
  });

  const handleChange = (e, index, section) => {
    const { name, value } = e.target;
    if (section) {
      const updatedSection = [...userData[section]];
      updatedSection[index][name] = value;
      setUserData({ ...userData, [section]: updatedSection });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleAddSection = (section) => {
    const newEntry = section === 'skills' ? { name: '', technologies: '' } :
                     section === 'experience' ? { title: '', details: '' } :
                     { institution: '', degree: '' }; // Extendable for other sections
    setUserData(prev => ({ ...prev, [section]: [...prev[section], newEntry] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF(userData);
  };

  return (
    <div className="App">
      <h1 className="text-xl font-bold text-center my-4">Welcome to Smart CV Builder</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        {/* Basic Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-2 rounded" type="text" placeholder="Name" name="name" value={userData.name} onChange={handleChange} />
          <input className="border p-2 rounded" type="email" placeholder="Email" name="email" value={userData.email} onChange={handleChange} />
          <input className="border p-2 rounded" type="text" placeholder="Phone" name="phone" value={userData.phone} onChange={handleChange} />
          <input className="border p-2 rounded" type="text" placeholder="LinkedIn Profile" name="linkedin" value={userData.linkedin} onChange={handleChange} />
          <input className="border p-2 rounded" type="text" placeholder="GitHub Profile" name="github" value={userData.github} onChange={handleChange} />
        </div>

        {/* Dynamic Skill Entries */}
        <DynamicSection title="Skills and Technologies" section="skills" entries={userData.skills} handleChange={handleChange} handleAdd={() => handleAddSection('skills')} />
        
        {/* Dynamic Experience Entries */}
        <DynamicSection title="Experience" section="experience" entries={userData.experience} handleChange={handleChange} handleAdd={() => handleAddSection('experience')} />

        {/* Dynamic Education Entries */}
        <DynamicSection title="Education" section="education" entries={userData.education} handleChange={handleChange} handleAdd={() => handleAddSection('education')} />

        {/* Single Entry Sections */}
        <textarea className="border p-2 rounded" placeholder="Honors and Awards" name="honors" value={userData.honors} onChange={handleChange} />
        <textarea className="border p-2 rounded" placeholder="Relevant Coursework" name="coursework" value={userData.coursework} onChange={handleChange} />
        <textarea className="border p-2 rounded" placeholder="Hobbies" name="hobbies" value={userData.hobbies} onChange={handleChange} />

        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Generate PDF</button>
      </form>
    </div>
  );
}

function DynamicSection({ title, section, entries, handleChange, handleAdd }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {entries.map((entry, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 mb-2">
          <input className="border p-2 rounded" type="text" placeholder="Title or Name" name="name" value={entry.name} onChange={(e) => handleChange(e, index, section)} />
          <input className="border p-2 rounded" type="text" placeholder="Details or Technologies" name="technologies" value={entry.technologies} onChange={(e) => handleChange(e, index, section)} />
        </div>
      ))}
      <button type="button" onClick={handleAdd} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Another Entry</button>
    </div>
  );
}

export default App;
