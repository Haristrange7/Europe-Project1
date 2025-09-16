import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, User, Mail, Phone, FileText, Award } from 'lucide-react';
import { CandidateProfile } from '@/types';

interface CandidateViewerProps {
  profiles: CandidateProfile[];
  onUpdate: () => void;
}

export const CandidateViewer: React.FC<CandidateViewerProps> = ({ profiles, onUpdate }) => {
  const [selectedProfile, setSelectedProfile] = useState<CandidateProfile | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const getStatusColor = (status: string) => {
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

  const handleViewProfile = (profile: CandidateProfile) => {
    setSelectedProfile(profile);
    setShowDialog(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Candidate Management</h3>
        <p className="text-sm text-muted-foreground">View and manage candidate profiles</p>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Candidates</h3>
            <p className="text-muted-foreground">
              No candidates have registered yet.
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
                    <CardTitle className="text-lg">
                      {profile.personal.firstName} {profile.personal.lastName}
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {profile.personal.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {profile.personal.contactNumber}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(profile.status)}>
                      {profile.status.replace('_', ' ')}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => handleViewProfile(profile)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nationality:</span>
                    <div className="font-medium">{profile.passport.nationality || 'Not provided'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quiz Score:</span>
                    <div className="font-medium flex items-center">
                      {profile.quizScore !== undefined ? (
                        <>
                          <Award className="h-4 w-4 mr-1 text-yellow-500" />
                          {profile.quizScore}%
                        </>
                      ) : (
                        'Not taken'
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Documents:</span>
                    <div className="font-medium">
                      {profile.documents.experienceCertificate ? 'Uploaded' : 'Pending'}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Passport:</span>
                    <div className="font-medium">{profile.passport.number || 'Not provided'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Profile Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Candidate Profile Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedProfile?.personal.firstName} {selectedProfile?.personal.lastName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProfile && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <div className="font-medium">
                      {selectedProfile.personal.firstName} {selectedProfile.personal.lastName}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <div className="font-medium">{selectedProfile.personal.email}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <div className="font-medium">{selectedProfile.personal.contactNumber}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Passport Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Passport Number:</span>
                    <div className="font-medium">{selectedProfile.passport.number}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nationality:</span>
                    <div className="font-medium">{selectedProfile.passport.nationality}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date of Birth:</span>
                    <div className="font-medium">{selectedProfile.passport.dateOfBirth}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Place of Birth:</span>
                    <div className="font-medium">{selectedProfile.passport.placeOfBirth}</div>
                  </div>
                </div>
              </div>

              {selectedProfile.quizScore !== undefined && (
                <div>
                  <h4 className="font-semibold mb-3">Quiz Results</h4>
                  <div className="flex items-center space-x-4">
                    <Badge variant={selectedProfile.quizScore >= 70 ? 'default' : 'destructive'}>
                      Score: {selectedProfile.quizScore}%
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {selectedProfile.quizScore >= 70 ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-3">Application Status</h4>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(selectedProfile.status)}>
                    {selectedProfile.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {selectedProfile.completedAt && (
                    <span className="text-sm text-muted-foreground">
                      Completed: {new Date(selectedProfile.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};