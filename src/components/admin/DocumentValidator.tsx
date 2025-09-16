import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, FileText, User, Mail } from 'lucide-react';
import { CandidateProfile } from '@/types';
import { storageUtils } from '@/utils/storage';
import { toast } from 'sonner';

interface DocumentValidatorProps {
  profiles: CandidateProfile[];
  onUpdate: () => void;
}

export const DocumentValidator: React.FC<DocumentValidatorProps> = ({ profiles, onUpdate }) => {
  const handleApprove = (profile: CandidateProfile) => {
    const updatedProfile = {
      ...profile,
      status: 'approved' as const,
    };
    
    storageUtils.saveProfile(updatedProfile);
    
    // Simulate sending congratulations email
    setTimeout(() => {
      toast.success(`🎉 Congratulations email sent to ${profile.personal.firstName}!`);
      
      // Update status to employee after approval
      const employeeProfile = {
        ...updatedProfile,
        status: 'employee' as const,
      };
      storageUtils.saveProfile(employeeProfile);
      onUpdate();
    }, 1000);
    
    toast.success(`Documents approved for ${profile.personal.firstName} ${profile.personal.lastName}`);
    onUpdate();
  };

  const handleReject = (profile: CandidateProfile) => {
    const updatedProfile = {
      ...profile,
      status: 'rejected' as const,
    };
    
    storageUtils.saveProfile(updatedProfile);
    
    // Simulate sending rejection email
    setTimeout(() => {
      toast.error(`Better luck next time email sent to ${profile.personal.firstName}`);
    }, 1000);
    
    toast.success(`Documents rejected for ${profile.personal.firstName} ${profile.personal.lastName}`);
    onUpdate();
  };

  const getDocumentStatus = (profile: CandidateProfile) => {
    const requiredDocs = [
      'experienceCertificate',
      'pcc',
      'itr',
      'healthCertificates'
    ];
    
    const uploadedDocs = requiredDocs.filter(doc => 
      profile.documents[doc as keyof typeof profile.documents]
    );
    
    return {
      uploaded: uploadedDocs.length,
      total: requiredDocs.length,
      missing: requiredDocs.filter(doc => 
        !profile.documents[doc as keyof typeof profile.documents]
      )
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Document Validation</h3>
        <p className="text-sm text-muted-foreground">Review and approve candidate documents</p>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Documents to Review</h3>
            <p className="text-muted-foreground">
              No candidates have submitted documents for review yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {profiles.map((profile) => {
            const docStatus = getDocumentStatus(profile);
            
            return (
              <Card key={profile.userId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        {profile.personal.firstName} {profile.personal.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Mail className="h-4 w-4 mr-1" />
                        {profile.personal.email}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      Under Review
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Document Status */}
                  <div>
                    <h4 className="font-medium mb-3">Document Status</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Experience Certificate:</span>
                        <div className={`font-medium ${profile.documents.experienceCertificate ? 'text-green-600' : 'text-red-600'}`}>
                          {profile.documents.experienceCertificate ? '✓ Uploaded' : '✗ Missing'}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Police Clearance:</span>
                        <div className={`font-medium ${profile.documents.pcc ? 'text-green-600' : 'text-red-600'}`}>
                          {profile.documents.pcc ? '✓ Uploaded' : '✗ Missing'}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tax Return:</span>
                        <div className={`font-medium ${profile.documents.itr ? 'text-green-600' : 'text-red-600'}`}>
                          {profile.documents.itr ? '✓ Uploaded' : '✗ Missing'}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Health Certificate:</span>
                        <div className={`font-medium ${profile.documents.healthCertificates ? 'text-green-600' : 'text-red-600'}`}>
                          {profile.documents.healthCertificates ? '✓ Uploaded' : '✗ Missing'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quiz Score */}
                  <div>
                    <h4 className="font-medium mb-2">Quiz Performance</h4>
                    <Badge variant={profile.quizScore && profile.quizScore >= 70 ? 'default' : 'destructive'}>
                      {profile.quizScore}% - {profile.quizScore && profile.quizScore >= 70 ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </div>

                  {/* Agreements */}
                  <div>
                    <h4 className="font-medium mb-2">Agreements Status</h4>
                    <div className="space-y-1 text-sm">
                      <div className={profile.agreements.workContract ? 'text-green-600' : 'text-red-600'}>
                        {profile.agreements.workContract ? '✓' : '✗'} Work Contract Agreement
                      </div>
                      <div className={profile.agreements.accommodation ? 'text-green-600' : 'text-red-600'}>
                        {profile.agreements.accommodation ? '✓' : '✗'} Accommodation Agreement
                      </div>
                      <div className={profile.agreements.invitation ? 'text-green-600' : 'text-red-600'}>
                        {profile.agreements.invitation ? '✓' : '✗'} Invitation Letter Agreement
                      </div>
                    </div>
                  </div>

                  {/* Status Alert */}
                  {docStatus.missing.length > 0 && (
                    <Alert>
                      <AlertDescription>
                        Missing documents: {docStatus.missing.join(', ')}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Actions */}
                  <div className="border-t pt-4">
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleApprove(profile)}
                        disabled={docStatus.missing.length > 0 || !profile.agreements.workContract || !profile.agreements.accommodation || !profile.agreements.invitation}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Application
                      </Button>
                      
                      <Button 
                        variant="destructive"
                        onClick={() => handleReject(profile)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Application
                      </Button>
                    </div>
                    
                    {(docStatus.missing.length > 0 || !profile.agreements.workContract || !profile.agreements.accommodation || !profile.agreements.invitation) && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Approval is disabled until all requirements are met.
                      </p>
                    )}
                  </div>

                  {/* Completion Summary */}
                  <div className="bg-muted p-3 rounded-lg">
                    <h5 className="font-medium mb-2">Application Summary</h5>
                    <div className="text-sm space-y-1">
                      <div>Quiz Score: {profile.quizScore}%</div>
                      <div>Documents: {docStatus.uploaded}/{docStatus.total} uploaded</div>
                      <div>Agreements: {Object.values(profile.agreements).filter(Boolean).length}/3 accepted</div>
                      <div>Submitted: {profile.completedAt ? new Date(profile.completedAt).toLocaleDateString() : 'In progress'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};