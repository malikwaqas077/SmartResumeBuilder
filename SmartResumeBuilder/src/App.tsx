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
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  const handleUseSampleData = () => {
    const sample: UserData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 890',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      skills: [
        { name: 'Frontend', technologies: 'React, TypeScript, Tailwind CSS' },
        { name: 'Backend', technologies: 'Node.js, Express, MongoDB' },
      ],
      education: [
        {
          institution: 'Example University',
          degree: 'BSc Computer Science',
          yearCompleted: '2024',
          cgpa: '3.8/4.0',
        },
      ],
      experience: [
        {
          companyName: 'TechCorp',
          technologies: 'React, Node.js, AWS',
          position: 'Software Engineer',
          duration: '2022 - Present',
          city: 'Remote',
          project: 'Smart Resume Builder',
          duties: [
            'Built and maintained modern React applications.',
            'Collaborated with designers to create delightful user experiences.',
          ],
        },
      ],
      honors: '',
      coursework: '',
      hobbies: 'Reading, Hiking, Open Source',
      honorsAndAwards: [],
      personalProjects: [
        {
          projectName: 'Portfolio Website',
          description: 'Personal portfolio built with React and Tailwind CSS.',
        },
      ],
    };

    setJsonInput(JSON.stringify(sample, null, 2));
    setError('');
  };

  const handleGeneratePDFPreview = async () => {
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

      setIsGenerating(true);
      setUserData(mergedData);
      setError('');

      const doc: any = await generatePDF(mergedData, 'preview');
      if (doc) {
        // Use a blob URL for more reliable PDF preview rendering
        const blobUrl = doc.output('bloburl');
        setPdfPreviewUrl(blobUrl);
      }
    } catch (err) {
      console.error('Error parsing JSON:', err);
      setError('Invalid JSON input. Please check your data.');
      setPdfPreviewUrl(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!userData) {
      // If userData is not yet set, try to parse from the current JSON
      try {
        const parsedData = JSON.parse(jsonInput);
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
        await generatePDF(mergedData, 'download');
      } catch (err) {
        console.error('Error parsing JSON:', err);
        setError('Invalid JSON input. Please check your data before downloading.');
      }
      return;
    }

    await generatePDF(userData, 'download');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100">
      <header className="border-b border-white/5 bg-slate-950/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Smart Resume Builder
            </h1>
            <p className="mt-1 text-sm md:text-base text-slate-300">
              Paste your JSON data, preview your resume instantly, and download a polished PDF.
            </p>
          </div>
          <span className="hidden md:inline-flex items-center rounded-full border border-emerald-400/50 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
            PDF Preview Enabled
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] items-start">
          {/* Left: JSON editor */}
          <section className="bg-slate-900/60 border border-white/5 rounded-2xl shadow-xl shadow-black/40 overflow-hidden">
            <div className="px-5 pt-5 pb-3 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-[0.16em]">
                  Input
                </h2>
                <p className="mt-1 text-xs text-slate-300">
                  Provide your resume data in JSON format. You can start from the sample below.
                </p>
              </div>
              <button
                type="button"
                onClick={handleUseSampleData}
                className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100 hover:bg-emerald-400/20 transition-colors"
              >
                Use sample data
              </button>
            </div>

            <div className="p-4 md:p-5">
              <textarea
                value={jsonInput}
                onChange={handleInputChange}
                placeholder="Paste your JSON CV data here..."
                rows={18}
                className="w-full text-sm font-mono bg-slate-950/80 text-slate-50 rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-400/70 px-3 py-3 resize-vertical placeholder:text-slate-500"
              />
              {error && <p className="mt-2 text-xs font-medium text-red-400">{error}</p>}

              <div className="mt-4 flex flex-wrap gap-3 justify-between items-center">
                <p className="text-xs text-slate-400 max-w-xs">
                  Tip: Make sure your JSON keys match the structure used by the PDF template
                  (name, email, skills, education, experience, etc.).
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleGeneratePDFPreview}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {isGenerating ? (
                      <span>Generating preview…</span>
                    ) : (
                      <>
                        <span>Preview PDF</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-500/70 bg-slate-800/70 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700 transition"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Right: PDF preview */}
          <section className="relative bg-slate-900/60 border border-white/5 rounded-2xl shadow-xl shadow-black/40 overflow-hidden">
            <div className="px-5 pt-5 pb-3 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-[0.16em]">
                  Live Preview
                </h2>
                <p className="mt-1 text-xs text-slate-300">
                  See exactly how your generated PDF resume will look.
                </p>
              </div>
              {pdfPreviewUrl && (
                <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-100">
                  Updated
                </span>
              )}
            </div>

            <div className="p-4 md:p-5">
              {pdfPreviewUrl ? (
                <div className="relative bg-slate-950/70 border border-slate-700/70 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/80">
                    <span className="text-[11px] font-medium text-slate-200">
                      Resume.pdf
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow shadow-emerald-500/60" />
                  </div>
                  <iframe
                    title="Resume PDF Preview"
                    src={pdfPreviewUrl}
                    className="w-full h-[420px] md:h-[520px] bg-slate-900"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[360px] md:h-[480px] rounded-xl border border-dashed border-slate-700/70 bg-slate-950/40 text-center px-6">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-700/70 shadow-inner shadow-black/60">
                    <span className="text-2xl">📄</span>
                  </div>
                  <p className="text-sm font-medium text-slate-100">
                    No preview yet
                  </p>
                  <p className="mt-1 text-xs text-slate-400 max-w-xs">
                    Paste or load your JSON data on the left and click
                    <span className="font-semibold text-emerald-300"> Preview PDF</span> to
                    generate a live, interactive preview of your resume.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
