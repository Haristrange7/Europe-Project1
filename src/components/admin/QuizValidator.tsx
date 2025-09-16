import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Award, User } from 'lucide-react';
import { CandidateProfile } from '@/types';
import { storageUtils } from '@/utils/storage';
import { toast } from 'sonner';

interface QuizValidatorProps {
  profiles: CandidateProfile[];
  onUpdate: () => void;
}

export const QuizValidator: React.FC<QuizValidatorProps> = ({ profiles, onUpdate }) => {
  const handleApprove = (profile: CandidateProfile) => {
    const updatedProfile = {
      ...profile,
      status: 'documents_pending' as const,
    };
    
    storageUtils.saveProfile(updatedProfile);
    toast.success(`Quiz approved for ${profile.personal.firstName} ${profile.personal.lastName}`);
    onUpdate();
  };

  const handleReject = (profile: CandidateProfile) => {
    const updatedProfile = {
      ...profile,
      status: 'quiz_pending' as const,
    };
    
    storageUtils.saveProfile(updatedProfile);
    toast.success(`Quiz rejection noted for ${profile.personal.firstName} ${profile.personal.lastName}`);
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Quiz Validation</h3>
        <p className="text-sm text-muted-foreground">Review and validate candidate quiz results</p>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quiz Results</h3>
            <p className="text-muted-foreground">
              No candidates have completed the quiz yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {profiles.map((profile) => (
            <Card key={profile.userId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      {profile.personal.firstName} {profile.personal.lastName}
                    </CardTitle>
                    <CardDescription>{profile.personal.email}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={profile.quizScore && profile.quizScore >= 70 ? 'default' : 'destructive'}>
                      {profile.quizScore}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Quiz Score:</span>
                      <div className="font-medium flex items-center">
                        <Award className="h-4 w-4 mr-1 text-yellow-500" />
                        {profile.quizScore}%
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Result:</span>
                      <div className={`font-medium ${profile.quizScore && profile.quizScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                        {profile.quizScore && profile.quizScore >= 70 ? 'PASSED' : 'FAILED'}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="font-medium">{profile.status.replace('_', ' ')}</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex space-x-2">
                      {profile.quizScore && profile.quizScore >= 70 ? (
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(profile)}
                          disabled={profile.status === 'documents_pending'}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {profile.status === 'documents_pending' ? 'Already Approved' : 'Approve Quiz'}
                        </Button>
                      ) : (
                        <div className="text-sm text-red-600 font-medium">
                          Score below passing threshold (70%)
                        </div>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReject(profile)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reset Quiz
                      </Button>
                    </div>
                  </div>

                  {profile.quizScore && profile.quizScore >= 70 && profile.status === 'documents_pending' && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        ✓ Quiz approved. Candidate can now proceed to document upload.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};