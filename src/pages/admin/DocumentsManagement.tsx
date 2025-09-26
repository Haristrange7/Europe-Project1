import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, CircleCheck as CheckCircle, Circle as XCircle, Clock, Users, Eye, User, Wrench } from "lucide-react";
import { storageUtils } from "@/utils/storage";
import { CandidateProfile, WelderProfile } from "@/types";
import { toast } from "sonner";
import gsap from "gsap";

export const DocumentsManagement: React.FC = () => {
  const [candidateProfiles, setCandidateProfiles] = useState<CandidateProfile[]>([]);
  const [welderProfiles, setWelderProfiles] = useState<WelderProfile[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'candidate' | 'welder'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<CandidateProfile | WelderProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    loadData();

    // Animate cards
    gsap.fromTo(
      ".document-card",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const loadData = () => {
    const allCandidateProfiles = storageUtils.getAllProfiles();
    const allWelderProfiles = storageUtils.getAllWelderProfiles();
    
    // Filter profiles that have submitted documents
    const candidatesWithDocs = allCandidateProfiles.filter(
      p => p.documents.experienceCertificate && 
           (p.status === 'documents_pending' || p.status === 'documents_under_review' || 
            p.status === 'documents_approved' || p.documentsStatus)
    );
    
    const weldersWithDocs = allWelderProfiles.filter(
      p => p.documents.experienceCertificate && 
           (p.status === 'documents_pending' || p.status === 'documents_under_review' || 
            p.status === 'documents_approved' || p.documentsStatus)
    );

    setCandidateProfiles(candidatesWithDocs);
    setWelderProfiles(weldersWithDocs);
  };

  const handleApprove = (profile: CandidateProfile | WelderProfile, type: 'candidate' | 'welder') => {
    const updatedProfile = {
      ...profile,
      documentsStatus: 'approved' as const,
      status: 'documents_approved' as const,
      documentsRejectionReason: undefined,
    };

    if (type === 'candidate') {
      storageUtils.saveProfile(updatedProfile as CandidateProfile);
    } else {
      storageUtils.saveWelderProfile(updatedProfile as WelderProfile);
    }

    toast.success("Documents approved successfully!");
    loadData();
  };

  const handleReject = () => {
    if (!selectedProfile || !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    const isCandidate = 'experience' in selectedProfile && 'drivingProofVideo' in selectedProfile.experience;
    
    const updatedProfile = {
      ...selectedProfile,
      documentsStatus: 'rejected' as const,
      status: 'documents_pending' as const,
      documentsRejectionReason: rejectionReason,
    };

    if (isCandidate) {
      storageUtils.saveProfile(updatedProfile as CandidateProfile);
    } else {
      storageUtils.saveWelderProfile(updatedProfile as WelderProfile);
    }

    toast.success("Documents rejected with feedback!");
    setShowDialog(false);
    setSelectedProfile(null);
    setRejectionReason("");
    loadData();
  };

  const openRejectDialog = (profile: CandidateProfile | WelderProfile) => {
    setSelectedProfile(profile);
    setRejectionReason("");
    setShowDialog(true);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      case 'pending':
      default:
        return 'bg-yellow-500 text-white';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Combine and filter profiles
  const allProfiles = [
    ...candidateProfiles.map(p => ({ ...p, type: 'candidate' as const })),
    ...welderProfiles.map(p => ({ ...p, type: 'welder' as const }))
  ];

  const filteredProfiles = allProfiles.filter(profile => {
    const typeMatch = selectedType === 'all' || profile.type === selectedType;
    const statusMatch = selectedStatus === 'all' || 
      (profile.documentsStatus || 'pending') === selectedStatus;
    return typeMatch && statusMatch;
  });

  const pendingCount = allProfiles.filter(p => (p.documentsStatus || 'pending') === 'pending').length;
  const approvedCount = allProfiles.filter(p => p.documentsStatus === 'approved').length;
  const rejectedCount = allProfiles.filter(p => p.documentsStatus === 'rejected').length;

  return (
    <Layout title="Document Management">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-start">
          <h2 className="text-2xl font-bold text-primary-foreground">
            Document Verification
          </h2>
          <p className="text-primary-foreground/60 mt-1">
            Review and approve candidate and welder documents
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="document-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-foreground">
                    Total Submissions
                  </p>
                  <p className="text-3xl font-bold text-chart-2">
                    {allProfiles.length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="document-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-foreground">
                    Pending Review
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {pendingCount}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="document-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-foreground">
                    Approved
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {approvedCount}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="document-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-foreground">
                    Rejected
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {rejectedCount}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label>Type:</Label>
            <Select
              value={selectedType}
              onValueChange={(value: 'all' | 'candidate' | 'welder') => setSelectedType(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="candidate">Candidates</SelectItem>
                <SelectItem value="welder">Welders</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Label>Status:</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value: 'all' | 'pending' | 'approved' | 'rejected') => setSelectedStatus(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Documents List */}
        {filteredProfiles.length === 0 ? (
          <Card className="document-card">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Documents to Review
              </h3>
              <p className="text-primary-foreground mb-6 max-w-md mx-auto">
                No document submissions match your current filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredProfiles.map((profile) => (
              <Card
                key={`${profile.type}-${profile.userId}`}
                className="document-card shadow-soft hover:shadow-medium transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          {profile.type === 'candidate' ? (
                            <User className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Wrench className="h-4 w-4 text-orange-600" />
                          )}
                          <Badge
                            variant={profile.type === "candidate" ? "default" : "secondary"}
                            className={
                              profile.type === "candidate"
                                ? "bg-blue-500 text-white"
                                : "bg-orange-500 text-white"
                            }
                          >
                            {profile.type}
                          </Badge>
                        </div>
                        <Badge
                          className={getStatusColor(profile.documentsStatus || 'pending')}
                        >
                          {getStatusIcon(profile.documentsStatus || 'pending')}
                          <span className="ml-1">
                            {(profile.documentsStatus || 'pending').toUpperCase()}
                          </span>
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-primary-foreground">
                        {profile.personal.firstName} {profile.personal.lastName}
                      </CardTitle>
                      <p className="text-sm text-primary-foreground/80">
                        {profile.personal.email}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {(profile.documentsStatus || 'pending') === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(profile, profile.type)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openRejectDialog(profile)}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-primary-foreground mb-2">
                        Submitted Documents:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(profile.documents).map(([key, value]) => (
                          value && (
                            <div
                              key={key}
                              className="flex items-center p-2 bg-gray-50 rounded text-sm"
                            >
                              <FileText className="h-4 w-4 mr-2 text-gray-600" />
                              <span className="capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    {profile.documentsRejectionReason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <h5 className="font-medium text-red-800 mb-1">
                          Rejection Reason:
                        </h5>
                        <p className="text-sm text-red-700">
                          {profile.documentsRejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 text-xs text-gray-500">
                      <span>
                        Submitted on{" "}
                        {profile.completedAt 
                          ? new Date(profile.completedAt).toLocaleDateString()
                          : 'N/A'
                        }
                      </span>
                      <span>ID: {profile.userId}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Rejection Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Documents</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting the documents. This will be shown to the user.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Rejection Reason *</Label>
                <Textarea
                  id="reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please specify what needs to be corrected or resubmitted..."
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reject Documents
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};