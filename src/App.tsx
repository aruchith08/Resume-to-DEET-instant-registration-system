import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  Loader2, 
  Plus, 
  Trash2,
  ArrowRight,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell
} from 'lucide-react';
import { parseResume } from './services/geminiService';
import { ResumeData } from './types';

const INITIAL_DATA: ResumeData = {
  fullName: '',
  surname: '',
  email: '',
  phone: '',
  location: '',
  role: '',
  skills: [],
  experience: [],
  education: [],
  summary: '',
  isLocalTelangana: false,
  dateOfBirth: '',
  gender: 'M',
  isPhysicallyChallenged: false,
  disabilityType: '',
  disabilityPercentage: 0,
  socialStatus: '',
  religion: '',
  district: '',
  residenceType: 'Urban',
  mandal: '',
  village: '',
  houseNo: '',
  street: '',
  pincode: '',
  howDidYouHear: ''
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const data = await parseResume(base64, file.type);
        
        if (data.isValidResume === false) {
          setError("Invalid file. Please upload a valid resume.");
          setIsParsing(false);
          return;
        }

        // Check for required fields to determine if details are sufficient
        const requiredFields: (keyof ResumeData)[] = [
          'fullName', 'surname', 'email', 'phone', 'dateOfBirth', 
          'socialStatus', 'district', 'pincode'
        ];
        
        const isMissingRequired = requiredFields.some(field => !data[field]);

        if (data.isInsufficient || isMissingRequired) {
          setError("insufficient details in resume please add them manually to continue");
          setResumeData(prev => ({ ...prev, ...data }));
          setIsParsing(false);
          return;
        }

        setResumeData(prev => ({ ...prev, ...data }));
        setIsParsing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error parsing resume:', error);
      setError("Failed to parse resume. Please try again.");
      setIsParsing(false);
    }
  };

  if (!isLoggedIn) {
    return <SignupPage onSignup={(data) => {
      setResumeData(data);
      setIsLoggedIn(true);
    }} />;
  }

  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      {/* Slim Sidebar */}
      <aside className="w-20 bg-deet-blue text-white flex flex-col items-center py-6 gap-8">
        <img src="https://deet.telangana.gov.in/employer/images/web-v2c-text.png" alt="Logo" className="h-8 brightness-0 invert object-contain" />
        <nav className="flex flex-col gap-4">
          <SidebarIcon icon={<LayoutDashboard size={22} />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarIcon icon={<User size={22} />} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          <SidebarIcon icon={<Briefcase size={22} />} active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} />
          <SidebarIcon icon={<Bell size={22} />} active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
        </nav>
        <div className="mt-auto flex flex-col gap-4">
          <SidebarIcon icon={<Settings size={22} />} onClick={() => {}} />
          <SidebarIcon icon={<LogOut size={22} />} onClick={() => setIsLoggedIn(false)} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white px-6 py-3 flex justify-between items-center border-b border-slate-200">
          <h1 className="text-lg font-bold text-slate-700">Candidate Profile</h1>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-100"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-deet-accent hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm"
            >
              {isParsing ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
              {isParsing ? 'Processing...' : 'Update via AI'}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx,image/*" />
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
              {resumeData.fullName?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            
            {/* Left: Main Profile Card (Inspired by the phone mockup) */}
            <div className="lg:col-span-4 space-y-4">
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="h-24 deet-gradient relative">
                  <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl bg-white p-1 shadow-md">
                    <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <User size={32} />
                    </div>
                  </div>
                </div>
                <div className="pt-12 px-6 pb-6">
                  <h2 className="text-xl font-bold text-slate-800">{resumeData.fullName || 'New Candidate'}</h2>
                  <p className="text-deet-blue font-semibold text-sm mb-4">{resumeData.role || 'Professional'}</p>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <CompactInfo icon={<Mail size={14} />} label="Email" value={resumeData.email} />
                    <CompactInfo icon={<Phone size={14} />} label="Phone" value={resumeData.phone} />
                    <CompactInfo icon={<MapPin size={14} />} label="Location" value={resumeData.location} />
                    <CompactInfo icon={<Briefcase size={14} />} label="Exp" value={resumeData.experience[0]?.duration || 'N/A'} />
                  </div>
                </div>
              </section>

              <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-deet-blue" />
                  Skills Required
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold border border-slate-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Right: Experience & Education */}
            <div className="lg:col-span-8 space-y-4">
              <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Briefcase size={16} className="text-deet-blue" />
                    Professional Experience
                  </h3>
                </div>
                <div className="space-y-4">
                  {resumeData.experience.slice(0, 3).map((exp, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-deet-blue shrink-0 border border-slate-100">
                        <Briefcase size={18} />
                      </div>
                      <div className="flex-1 min-w-0 border-b border-slate-50 pb-3 group-last:border-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-800 text-sm truncate">{exp.role}</h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{exp.duration}</span>
                        </div>
                        <p className="text-deet-blue text-xs font-medium mb-1">{exp.company}</p>
                        <p className="text-slate-500 text-xs line-clamp-2">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                  {resumeData.experience.length === 0 && (
                    <p className="text-center text-slate-400 py-4 text-xs italic">Upload a resume to see experience.</p>
                  )}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <User size={16} className="text-deet-blue" />
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    <CompactInfo icon={<User size={12} />} label="Gender" value={resumeData.gender === 'M' ? 'Male' : resumeData.gender === 'F' ? 'Female' : resumeData.gender || '---'} />
                    <CompactInfo icon={<Bell size={12} />} label="DOB" value={resumeData.dateOfBirth} />
                    <CompactInfo icon={<MapPin size={12} />} label="District" value={resumeData.district} />
                    <CompactInfo icon={<CheckCircle2 size={12} />} label="Social" value={resumeData.socialStatus} />
                  </div>
                </section>

                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <GraduationCap size={16} className="text-deet-blue" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    {resumeData.education.slice(0, 2).map((edu, i) => (
                      <div key={i} className="border-l-2 border-slate-100 pl-3">
                        <h4 className="font-bold text-slate-800 text-xs">{edu.degree}</h4>
                        <p className="text-slate-500 text-[11px]">{edu.institution}</p>
                        <p className="text-slate-400 text-[10px]">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-deet-blue" />
                    Summary
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-5">
                    {resumeData.summary || 'No summary available. Use the AI update feature to extract a professional summary from your resume.'}
                  </p>
                </section>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarIcon({ icon, active, onClick }: { icon: React.ReactNode, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
        active 
          ? 'bg-white text-deet-blue shadow-lg' 
          : 'text-white/50 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
    </button>
  );
}

function CompactInfo({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
        {icon}
        {label}
      </div>
      <p className="text-xs font-bold text-slate-700 truncate">{value || '---'}</p>
    </div>
  );
}

function SignupPage({ onSignup }: { onSignup: (data: ResumeData) => void }) {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ResumeData>(INITIAL_DATA);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const data = await parseResume(base64, file.type);
        
        if (data.isValidResume === false) {
          setError("Invalid file. Please upload a valid resume.");
          setIsParsing(false);
          return;
        }

        // Check for required fields to determine if details are sufficient
        const requiredFields: (keyof ResumeData)[] = [
          'fullName', 'surname', 'email', 'phone', 'dateOfBirth', 
          'socialStatus', 'district', 'pincode'
        ];
        
        const isMissingRequired = requiredFields.some(field => !data[field]);

        if (data.isInsufficient || isMissingRequired) {
          setError("insufficient details in resume please add them manually to continue");
          setFormData(prev => ({ ...prev, ...data }));
          setIsParsing(false);
          return;
        }

        setFormData(prev => ({ ...prev, ...data }));
        setIsParsing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error parsing resume:', error);
      setError("Failed to parse resume. Please try again.");
      setIsParsing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fafafa]">
      {/* Left Side: Form */}
      <div className="w-full md:w-[550px] bg-white shadow-xl z-10 overflow-y-auto">
        {/* Top Bar / Marquee */}
        <div className="bg-deet-blue text-white py-2 px-4 text-[11px] overflow-hidden whitespace-nowrap">
          <motion.div 
            animate={{ x: [500, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            DEET never asks for money or fees for jobs. Beware of fraud — do not pay anyone claiming to represent DEET. DEET is not responsible for such payments.
          </motion.div>
        </div>

        <div className="p-8 md:p-12">
          <div className="text-center mb-8">
            <img src="https://deet.telangana.gov.in/employer/images/web-v2c-text.png" alt="DEET Logo" className="h-12 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-slate-800">Sign up for free.</h1>
            <p className="text-slate-500 text-sm mt-1">Let's build your Profile and Future</p>
          </div>

          {/* AI Upload Section */}
          <div className="mb-8">
            <div 
              className={`p-5 bg-slate-50 rounded-2xl border-2 border-dashed transition-all group cursor-pointer ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-deet-blue hover:bg-blue-50/30'}`} 
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform ${error ? 'text-red-500' : 'text-deet-blue'}`}>
                  {isParsing ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${error ? 'text-red-700' : 'text-slate-700'}`}>Auto-fill with AI</h3>
                  <p className={`text-xs ${error ? 'text-red-500' : 'text-slate-400'}`}>
                    {error || 'Upload your resume to fill the form instantly'}
                  </p>
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx,image/*" />
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSignup(formData); }}>
            {/* Local Candidate */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Are you a Local Candidate of Telangana? *</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="isLocalTelangana" 
                    checked={formData.isLocalTelangana === true}
                    onChange={() => setFormData({...formData, isLocalTelangana: true})}
                    className="w-4 h-4 text-deet-blue"
                  />
                  <span className="text-sm text-slate-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="isLocalTelangana" 
                    checked={formData.isLocalTelangana === false}
                    onChange={() => setFormData({...formData, isLocalTelangana: false})}
                    className="w-4 h-4 text-deet-blue"
                  />
                  <span className="text-sm text-slate-700">No</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Name *" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm" 
                  required 
                />
              </div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Surname *" 
                  value={formData.surname}
                  onChange={(e) => setFormData({...formData, surname: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm" 
                  required 
                />
              </div>
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="tel" 
                placeholder="Mobile No *" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm" 
                required 
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                placeholder="Mail ID *" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm" 
                required 
              />
            </div>

            <div className="relative">
              <input 
                type="date" 
                placeholder="Date of Birth *" 
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm" 
                required 
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender *</label>
              <div className="flex gap-6">
                {['M', 'F', 'Others'].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="gender" 
                      checked={formData.gender === g}
                      onChange={() => setFormData({...formData, gender: g as any})}
                      className="w-4 h-4 text-deet-blue"
                    />
                    <span className="text-sm text-slate-700">{g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Others'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Physically Challenged */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Physically challenged *</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="isPhysicallyChallenged" 
                    checked={formData.isPhysicallyChallenged === true}
                    onChange={() => setFormData({...formData, isPhysicallyChallenged: true})}
                    className="w-4 h-4 text-deet-blue"
                  />
                  <span className="text-sm text-slate-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="isPhysicallyChallenged" 
                    checked={formData.isPhysicallyChallenged === false}
                    onChange={() => setFormData({...formData, isPhysicallyChallenged: false})}
                    className="w-4 h-4 text-deet-blue"
                  />
                  <span className="text-sm text-slate-700">No</span>
                </label>
              </div>
            </div>

            {formData.isPhysicallyChallenged && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
                <select 
                  value={formData.disabilityType}
                  onChange={(e) => setFormData({...formData, disabilityType: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm"
                >
                  <option value="">Select Disability *</option>
                  <option value="Locomotor Disability">Locomotor Disability</option>
                  <option value="Blindness">Blindness</option>
                  <option value="Hearing Impairment">Hearing Impairment</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Percentage (%) *" 
                  value={formData.disabilityPercentage || ''}
                  onChange={(e) => setFormData({...formData, disabilityPercentage: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm"
                />
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <select 
                value={formData.socialStatus}
                onChange={(e) => setFormData({...formData, socialStatus: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm"
                required
              >
                <option value="">Social Status *</option>
                <option value="OC">Open Category (OC)</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="Minority">Minority</option>
              </select>

              <select 
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm"
                required
              >
                <option value="">District *</option>
                <option value="ADILABAD">ADILABAD</option>
                <option value="BHADRADRI KOTHAGUDEM">BHADRADRI KOTHAGUDEM</option>
                <option value="HANUMAKONDA">HANUMAKONDA</option>
                <option value="HYDERABAD">HYDERABAD</option>
                <option value="JAGTIAL">JAGTIAL</option>
                <option value="JANGAON">JANGAON</option>
                <option value="JAYASHANKAR BHUPALPALLY">JAYASHANKAR BHUPALPALLY</option>
                <option value="JOGULAMBA GADWAL">JOGULAMBA GADWAL</option>
                <option value="KAMAREDDY">KAMAREDDY</option>
                <option value="KARIMNAGAR">KARIMNAGAR</option>
                <option value="KHAMMAM">KHAMMAM</option>
                <option value="KOMARAM BHEEM ASIFABAD">KOMARAM BHEEM ASIFABAD</option>
                <option value="MAHABUBABAD">MAHABUBABAD</option>
                <option value="MAHABUBNAGAR">MAHABUBNAGAR</option>
                <option value="MANCHERIAL">MANCHERIAL</option>
                <option value="MEDAK">MEDAK</option>
                <option value="MEDCHAL">MEDCHAL</option>
                <option value="MULUGU">MULUGU</option>
                <option value="NAGARKURNOOL">NAGARKURNOOL</option>
                <option value="NALGONDA">NALGONDA</option>
                <option value="NARAYANPET">NARAYANPET</option>
                <option value="NIRMAL">NIRMAL</option>
                <option value="NIZAMABAD">NIZAMABAD</option>
                <option value="PEDDAPALLI">PEDDAPALLI</option>
                <option value="RAJANNA SIRCILLA">RAJANNA SIRCILLA</option>
                <option value="RANGA REDDY">RANGA REDDY</option>
                <option value="SANGAREDDY">SANGAREDDY</option>
                <option value="SIDDIPET">SIDDIPET</option>
                <option value="SURYAPET">SURYAPET</option>
                <option value="VIKARABAD">VIKARABAD</option>
                <option value="WANAPARTHY">WANAPARTHY</option>
                <option value="WARANGAL">WARANGAL</option>
                <option value="YADADRI BHUVANAGIRI">YADADRI BHUVANAGIRI</option>
              </select>
            </div>

            {/* Residence Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Residence Type *</label>
              <div className="flex gap-6">
                {['Rural', 'Urban'].map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="residenceType" 
                      checked={formData.residenceType === t}
                      onChange={() => setFormData({...formData, residenceType: t as any})}
                      className="w-4 h-4 text-deet-blue"
                    />
                    <span className="text-sm text-slate-700">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="H.No" 
                value={formData.houseNo}
                onChange={(e) => setFormData({...formData, houseNo: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm" 
              />
              <input 
                type="text" 
                placeholder="Street" 
                value={formData.street}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm" 
              />
              <input 
                type="text" 
                placeholder="PIN Code *" 
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm" 
                required
              />
            </div>

            <div className="relative">
              <Settings className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                placeholder="Password *" 
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm" 
                required 
              />
            </div>

            <div className="space-y-1">
              <select 
                value={formData.howDidYouHear}
                onChange={(e) => setFormData({...formData, howDidYouHear: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-deet-blue outline-none transition-all text-sm"
                required
              >
                <option value="">How did you come across DEET? *</option>
                <option value="TASK">TASK</option>
                <option value="Social Media">Social Media</option>
                <option value="Friends">Friends</option>
                <option value="OTHERS">OTHERS</option>
              </select>
              <p className="text-[10px] text-slate-400 pl-1 italic">Note: This field must be filled manually as it is not in your resume.</p>
            </div>
            
            <button type="submit" className="w-full bg-deet-blue text-white py-4 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/10 mt-6">
              Register
            </button>
          </form>
          
          <p className="text-center text-sm text-slate-400 mt-8">
            Already have an account? <a href="#" className="text-deet-blue font-bold hover:underline">Login</a>
          </p>
        </div>
      </div>
      
      {/* Right Side: Hero */}
      <div className="hidden md:flex flex-1 bg-[#b9cedf] p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-deet-blue rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 text-center max-w-lg">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto mb-10 w-[320px]"
          >
            <img src="https://deet.telangana.gov.in/employer/images/applicant-1.png" alt="Applicant Illustration" className="w-full drop-shadow-2xl" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">Find a job that fits your profile!</h2>
          <p className="text-white/90 text-lg mb-10 leading-relaxed">Great jobs inside. Is your profile up, yet?</p>
          
          <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-xl inline-flex items-center gap-8">
            <span className="text-slate-600 font-bold text-sm">Get the app</span>
            <div className="flex gap-5">
              <img src="https://deet.telangana.gov.in/employer/images/icons/ios.svg" alt="iOS" className="h-8 cursor-pointer hover:scale-110 transition-transform" />
              <img src="https://deet.telangana.gov.in/employer/images/icons/android.svg" alt="Android" className="h-8 cursor-pointer hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
