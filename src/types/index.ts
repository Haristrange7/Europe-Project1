export interface User {
  id: string;
  email: string;
  phone?: string;
  password: string;
  role: 'candidate' | 'welder' | 'admin';
  createdAt: string;
}

export interface CandidateProfile {
  userId: string;
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
  };
  passport: {
    type: string;
    countryCode: string;
    number: string;
    fullName: string;
    photograph?: File;
    nationality: string;
    dateOfBirth: string;
    placeOfBirth: string;
    sex: 'male' | 'female' | 'other';
    dateOfIssue: string;
    dateOfExpiry: string;
    placeOfIssue: string;
    fatherName: string;
    spouseName?: string;
    address: string;
    signature?: File;
  };
  experience: {
    introVideo?: File;
    drivingProofVideo?: File;
  };
  quizScore?: number;
  agreements: {
    workContract: boolean;
    accommodation: boolean;
    invitation: boolean;
  };
  documents: {
    experienceCertificate?: File;
    pcc?: File;
    itr?: File;
    travelTickets?: File;
    healthCertificates?: File;
    vsfProof?: File;
  };
  status: 'incomplete' | 'documents_pending' | 'documents_under_review' | 'documents_approved' | 'quiz_pending' | 'under_review' | 'approved' | 'rejected' | 'employee';
  completedAt?: string;
  documentsStatus?: 'pending' | 'approved' | 'rejected';
  documentsRejectionReason?: string;
}

export interface WelderProfile {
  userId: string;
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
  };
  passport: {
    type: string;
    countryCode: string;
    number: string;
    fullName: string;
    photograph?: File;
    nationality: string;
    dateOfBirth: string;
    placeOfBirth: string;
    sex: 'male' | 'female' | 'other';
    dateOfIssue: string;
    dateOfExpiry: string;
    placeOfIssue: string;
    fatherName: string;
    spouseName?: string;
    address: string;
    signature?: File;
  };
  experience: {
    introVideo?: File;
    weldingProofVideo?: File;
  };
  quizScore?: number;
  agreements: {
    workContract: boolean;
    accommodation: boolean;
    invitation: boolean;
  };
  documents: {
    experienceCertificate?: File;
    pcc?: File;
    itr?: File;
    travelTickets?: File;
    healthCertificates?: File;
    vsfProof?: File;
    weldingCertificates?: File;
  };
  status: 'incomplete' | 'documents_pending' | 'documents_under_review' | 'documents_approved' | 'quiz_pending' | 'under_review' | 'approved' | 'rejected' | 'employee';
  completedAt?: string;
  documentsStatus?: 'pending' | 'approved' | 'rejected';
  documentsRejectionReason?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  createdBy: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface QuizQuestion {
  id: string;
  question: string;
  image?: string; // URL or base64 string
  options: string[];
  correctAnswer: number;
  type: 'driver' | 'welder';
  createdBy: string;
  createdAt: string;
}