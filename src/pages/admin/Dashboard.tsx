import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { storageUtils } from '@/utils/storage';
import { CandidateProfile, Job } from '@/types';
import { JobManager } from '@/components/admin/JobManager';
import { CandidateViewer } from '@/components/admin/CandidateViewer';
import { QuizValidator } from '@/components/admin/QuizValidator';
import { DocumentValidator } from '@/components/admin/DocumentValidator';
import gsap from 'gsap';

export const AdminDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    pendingReview: 0,
    approved: 0,
    activeJobs: 0,
  });

  useEffect(() => {
    loadData();

    // Animate dashboard cards
    gsap.fromTo('.dashboard-card', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  const loadData = () => {
    const allProfiles = storageUtils.getAllProfiles();
    const allJobs = storageUtils.getAllJobs();

    setProfiles(allProfiles);
    setJobs(allJobs);

    // Calculate stats
    setStats({
      totalCandidates: allProfiles.length,
      pendingReview: allProfiles.filter(p => p.status === 'under_review').length,
      approved: allProfiles.filter(p => p.status === 'approved' || p.status === 'employee').length,
      activeJobs: allJobs.filter(j => j.status === 'active').length,
    });
  };

  const StatCard = ({ title, value, description, icon: Icon, color }: {
    title: string;
    value: number;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
  }) => (
    <Card className="dashboard-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Candidates"
            value={stats.totalCandidates}
            description="Registered drivers"
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Pending Review"
            value={stats.pendingReview}
            description="Awaiting approval"
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            description="Verified drivers"
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Active Jobs"
            value={stats.activeJobs}
            description="Open positions"
            icon={Briefcase}
            color="bg-purple-500"
          />
        </div>

        {/* Main Content Tabs */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Management Console</CardTitle>
            <CardDescription>
              Manage jobs, candidates, and applications
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="candidates" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="candidates">Candidates</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="candidates" className="mt-6">
                <CandidateViewer 
                  profiles={profiles} 
                  onUpdate={loadData}
                />
              </TabsContent>
              
              <TabsContent value="jobs" className="mt-6">
                <JobManager 
                  jobs={jobs}
                  onUpdate={loadData}
                />
              </TabsContent>
              
              <TabsContent value="quizzes" className="mt-6">
                <QuizValidator 
                  profiles={profiles.filter(p => p.quizScore !== undefined)}
                  onUpdate={loadData}
                />
              </TabsContent>
              
              <TabsContent value="documents" className="mt-6">
                <DocumentValidator 
                  profiles={profiles.filter(p => p.status === 'under_review')}
                  onUpdate={loadData}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};