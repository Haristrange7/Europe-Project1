import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, FileText, Award, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storageUtils } from '@/utils/storage';
import { CandidateProfile } from '@/types';
import gsap from 'gsap';

export const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (user) {
      const userProfile = storageUtils.getProfile(user.id);
      setProfile(userProfile);
      
      // Calculate progress
      if (userProfile) {
        let completedSteps = 0;
        const totalSteps = 5;
        
        if (userProfile.personal.firstName) completedSteps++;
        if (userProfile.passport.number) completedSteps++;
        if (userProfile.experience.introVideo) completedSteps++;
        if (userProfile.quizScore !== undefined) completedSteps++;
        if (userProfile.documents.experienceCertificate) completedSteps++;
        
        setProgress((completedSteps / totalSteps) * 100);
      }
    }

    // Animate cards
    gsap.fromTo('.dashboard-card', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );
  }, [user]);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
      case 'employee':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'under_review':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'incomplete':
        return 'Profile Incomplete';
      case 'quiz_pending':
        return 'Quiz Pending';
      case 'documents_pending':
        return 'Documents Pending';
      case 'under_review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'employee':
        return 'Employee';
      default:
        return 'Not Started';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
      case 'employee':
        return 'bg-green-500';
      case 'under_review':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      case 'documents_pending':
      case 'quiz_pending':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout title="Driver Dashboard">
      <div className="space-y-8">
        {/* Status Overview */}
        <div className="dashboard-card">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Application Status</span>
              </CardTitle>
              <CardDescription>
                Track your progress through the Europe Truck Project application process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(profile?.status)}
                  <span className="font-medium">{getStatusText(profile?.status)}</span>
                </div>
                <Badge className={getStatusColor(profile?.status)}>
                  {Math.round(progress)}% Complete
                </Badge>
              </div>
              <Progress value={progress} className="mb-4" />
              <div className="text-sm text-muted-foreground">
                Complete all steps to submit your application for review
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Setup</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {profile?.personal.firstName 
                  ? 'Update your personal and passport information'
                  : 'Complete your personal and passport information'
                }
              </CardDescription>
              <Button 
                onClick={() => navigate('/candidate/profile')}
                variant={profile?.personal.firstName ? 'outline' : 'default'}
                className="w-full"
              >
                {profile?.personal.firstName ? 'Edit Profile' : 'Start Profile'}
              </Button>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Driving Quiz</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {profile?.quizScore !== undefined 
                  ? `Score: ${profile.quizScore}%`
                  : 'Test your driving knowledge'
                }
              </CardDescription>
              <Button 
                onClick={() => navigate('/candidate/quiz')}
                disabled={!profile?.personal.firstName || !profile?.passport.number}
                variant={profile?.quizScore !== undefined ? 'outline' : 'default'}
                className="w-full"
              >
                {profile?.quizScore !== undefined ? 'Retake Quiz' : 'Take Quiz'}
              </Button>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {profile?.documents.experienceCertificate 
                  ? 'Manage your uploaded documents'
                  : 'Upload required documents'
                }
              </CardDescription>
              <Button 
                onClick={() => navigate('/candidate/documents')}
                disabled={!profile?.quizScore || profile?.quizScore < 70}
                variant={profile?.documents.experienceCertificate ? 'outline' : 'default'}
                className="w-full"
              >
                {profile?.documents.experienceCertificate ? 'View Documents' : 'Upload Documents'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Application Timeline */}
        {profile && (
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Application Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className={`h-3 w-3 rounded-full ${profile.personal.firstName ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className="flex-1">
                    <div className="font-medium">Profile Setup</div>
                    <div className="text-sm text-muted-foreground">Personal and passport information</div>
                  </div>
                  {profile.personal.firstName && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`h-3 w-3 rounded-full ${profile.quizScore !== undefined ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className="flex-1">
                    <div className="font-medium">Driving Quiz</div>
                    <div className="text-sm text-muted-foreground">
                      {profile.quizScore !== undefined ? `Completed with ${profile.quizScore}%` : 'Not completed'}
                    </div>
                  </div>
                  {profile.quizScore !== undefined && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`h-3 w-3 rounded-full ${profile.documents.experienceCertificate ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className="flex-1">
                    <div className="font-medium">Document Upload</div>
                    <div className="text-sm text-muted-foreground">Required certificates and proofs</div>
                  </div>
                  {profile.documents.experienceCertificate && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`h-3 w-3 rounded-full ${profile.status === 'under_review' || profile.status === 'approved' || profile.status === 'employee' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <div className="flex-1">
                    <div className="font-medium">Review Process</div>
                    <div className="text-sm text-muted-foreground">Admin verification of your application</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};