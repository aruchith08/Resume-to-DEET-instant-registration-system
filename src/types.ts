export interface ResumeData {
  fullName: string;
  surname?: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  summary: string;
  isValidResume?: boolean;
  isInsufficient?: boolean;
  // New DEET fields
  isLocalTelangana?: boolean;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | 'Others';
  isPhysicallyChallenged?: boolean;
  disabilityType?: string;
  disabilityPercentage?: number;
  socialStatus?: string;
  religion?: string;
  district?: string;
  residenceType?: 'Rural' | 'Urban';
  mandal?: string;
  village?: string;
  houseNo?: string;
  street?: string;
  pincode?: string;
  howDidYouHear?: string;
}
