import { CandidateProfile, WelderProfile, Job, Application, QuizQuestion } from '@/types';

export const storageUtils = {
  // Profile operations
  saveProfile: (profile: CandidateProfile) => {
    const profiles: CandidateProfile[] = JSON.parse(localStorage.getItem('profiles') || '[]');
    const existingIndex = profiles.findIndex(p => p.userId === profile.userId);
    
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }
    
    localStorage.setItem('profiles', JSON.stringify(profiles));
  },

  getProfile: (userId: string): CandidateProfile | null => {
    const profiles: CandidateProfile[] = JSON.parse(localStorage.getItem('profiles') || '[]');
    return profiles.find(p => p.userId === userId) || null;
  },

  getAllProfiles: (): CandidateProfile[] => {
    return JSON.parse(localStorage.getItem('profiles') || '[]');
  },

  // Welder Profile operations
  saveWelderProfile: (profile: WelderProfile) => {
    const profiles: WelderProfile[] = JSON.parse(localStorage.getItem('welderProfiles') || '[]');
    const existingIndex = profiles.findIndex(p => p.userId === profile.userId);
    
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }
    
    localStorage.setItem('welderProfiles', JSON.stringify(profiles));
  },

  getWelderProfile: (userId: string): WelderProfile | null => {
    const profiles: WelderProfile[] = JSON.parse(localStorage.getItem('welderProfiles') || '[]');
    return profiles.find(p => p.userId === userId) || null;
  },

  getAllWelderProfiles: (): WelderProfile[] => {
    return JSON.parse(localStorage.getItem('welderProfiles') || '[]');
  },
  // Job operations
  saveJob: (job: Job) => {
    const jobs: Job[] = JSON.parse(localStorage.getItem('jobs') || '[]');
    const existingIndex = jobs.findIndex(j => j.id === job.id);
    
    if (existingIndex >= 0) {
      jobs[existingIndex] = job;
    } else {
      jobs.push(job);
    }
    
    localStorage.setItem('jobs', JSON.stringify(jobs));
  },

  getAllJobs: (): Job[] => {
    return JSON.parse(localStorage.getItem('jobs') || '[]');
  },

  deleteJob: (jobId: string) => {
    const jobs: Job[] = JSON.parse(localStorage.getItem('jobs') || '[]');
    const filteredJobs = jobs.filter(j => j.id !== jobId);
    localStorage.setItem('jobs', JSON.stringify(filteredJobs));
  },

  // Quiz Question operations
  saveQuizQuestion: (question: QuizQuestion) => {
    const questions: QuizQuestion[] = JSON.parse(localStorage.getItem('quizQuestions') || '[]');
    const existingIndex = questions.findIndex(q => q.id === question.id);
    
    if (existingIndex >= 0) {
      questions[existingIndex] = question;
    } else {
      questions.push(question);
    }
    
    localStorage.setItem('quizQuestions', JSON.stringify(questions));
  },

  getAllQuizQuestions: (type?: 'driver' | 'welder'): QuizQuestion[] => {
    const questions: QuizQuestion[] = JSON.parse(localStorage.getItem('quizQuestions') || '[]');
    return type ? questions.filter(q => q.type === type) : questions;
  },

  deleteQuizQuestion: (questionId: string) => {
    const questions: QuizQuestion[] = JSON.parse(localStorage.getItem('quizQuestions') || '[]');
    const filteredQuestions = questions.filter(q => q.id !== questionId);
    localStorage.setItem('quizQuestions', JSON.stringify(filteredQuestions));
  },
  // Application operations
  saveApplication: (application: Application) => {
    const applications: Application[] = JSON.parse(localStorage.getItem('applications') || '[]');
    const existingIndex = applications.findIndex(a => a.id === application.id);
    
    if (existingIndex >= 0) {
      applications[existingIndex] = application;
    } else {
      applications.push(application);
    }
    
    localStorage.setItem('applications', JSON.stringify(applications));
  },

  getAllApplications: (): Application[] => {
    return JSON.parse(localStorage.getItem('applications') || '[]');
  },
};