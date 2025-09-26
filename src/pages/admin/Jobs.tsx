import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Eye,
} from "lucide-react";
import { storageUtils } from "@/utils/storage";
import { Job, CandidateProfile } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import gsap from "gsap";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Jobs: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    type: "full-time",
    experience: "entry",
  });

  useEffect(() => {
    loadData();

    // Animate cards
    gsap.fromTo(
      ".job-card",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const loadData = () => {
    const allJobs = storageUtils.getAllJobs();
    const allProfiles = storageUtils.getAllProfiles();
    setJobs(allJobs);
    setProfiles(allProfiles);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      requirements: "",
      location: "",
      salary: "",
      type: "full-time",
      experience: "entry",
    });
    setEditingJob(null);
  };

  const handleCreate = () => {
    resetForm();
    setShowDialog(true);
  };

  const handleEdit = (job: Job) => {
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      salary: job.salary,
      type: (job as any).type || "full-time",
      experience: (job as any).experience || "entry",
    });
    setEditingJob(job);
    setShowDialog(true);
  };

  const handleSave = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.requirements ||
      !formData.location
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const jobData: Job = {
      id: editingJob?.id || `job-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      salary: formData.salary,
      createdBy: user?.id || "",
      createdAt: editingJob?.createdAt || new Date().toISOString(),
      status: "active",
      ...(formData.type && { type: formData.type }),
      ...(formData.experience && { experience: formData.experience }),
    };

    storageUtils.saveJob(jobData);
    toast.success(
      editingJob ? "Job updated successfully" : "Job created successfully"
    );

    setShowDialog(false);
    resetForm();
    loadData();
  };

  const handleDelete = (jobId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      storageUtils.deleteJob(jobId);
      toast.success("Job deleted successfully");
      loadData();
    }
  };

  const toggleJobStatus = (job: Job) => {
    const updatedJob = {
      ...job,
      status:
        job.status === "active" ? ("inactive" as const) : ("active" as const),
    };

    storageUtils.saveJob(updatedJob);
    toast.success(
      `Job ${
        updatedJob.status === "active" ? "activated" : "deactivated"
      } successfully`
    );
    loadData();
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-brand-100 text-brand-800 border border-brand-200";
      case "part-time":
        return "bg-warning-100 text-warning-800 border border-warning-200";
      case "contract":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case "entry":
        return "bg-success-100 text-success-800 border border-success-200";
      case "mid":
        return "bg-warning-100 text-warning-800 border border-warning-200";
      case "senior":
        return "bg-danger-100 text-danger-800 border border-danger-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <Layout title="Job Management">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center ">
          <div className="text-start">
            <h2 className="text-2xl font-bold text-primary-foreground">
              Job Postings
            </h2>
            <p className="text-primary-foreground/60 mt-1">
              Create and manage job opportunities for drivers
            </p>
          </div>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button
                onClick={handleCreate}
                className="bg-brand-600 hover:bg-brand-700 border border-ring hover:scale-105 transition-transform hover:bg-primary text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-hidden ">
              <ScrollArea className="max-h-[80vh]  pr-4">
                <DialogHeader className="mt-3">
                  <DialogTitle className="text-xl">
                    {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingJob
                      ? "Update the job details below"
                      : "Fill in the job information to create a new posting"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="e.g., Long-Distance Truck Driver"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="e.g., Germany, France, Netherlands"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input
                        id="salary"
                        value={formData.salary}
                        onChange={(e) =>
                          setFormData({ ...formData, salary: e.target.value })
                        }
                        placeholder="e.g., €2000-2500/month"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Job Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select
                        value={formData.experience}
                        onValueChange={(value) =>
                          setFormData({ ...formData, experience: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the job role, responsibilities, and what makes this opportunity attractive..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements *</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: e.target.value,
                        })
                      }
                      placeholder="List the required qualifications, licenses, experience, and skills..."
                      rows={4}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    className="border hover:border-destructive hover:bg-destructive mb-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-brand-600 border border-ring hover:bg-primary"
                  >
                    {editingJob ? "Update Job" : "Create Job"}
                  </Button>
                </DialogFooter>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="job-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between ">
                <div>
                  <p className="text-sm font-medium text-primary-foreground">
                    Total Jobs
                  </p>
                  <p className="text-3xl font-bold text-chart-2">
                    {jobs.length}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="job-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-forground">
                    Active Jobs
                  </p>
                  <p className="text-3xl font-bold text-chart-4">
                    {jobs.filter((j) => j.status === "active").length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-chart-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="job-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-forground">
                    Total Candidates
                  </p>
                  <p className="text-3xl font-bold text-chart-3">
                    {profiles.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="job-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-forground">
                    Qualified
                  </p>
                  <p className="text-3xl font-bold text-chart-5">
                    {
                      profiles.filter(
                        (p) =>
                          p.status === "approved" || p.status === "employee"
                      ).length
                    }
                  </p>
                </div>
                <Users className="h-8 w-8 text-chart-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        {jobs.length === 0 ? (
          <Card className="job-card">
            <CardContent className="p-12 text-center">
              <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Jobs Posted Yet
              </h3>
              <p className="text-primary-forground mb-6 max-w-md mx-auto">
                Create your first job posting to start attracting qualified
                truck drivers to your company.
              </p>
              <Button
                onClick={handleCreate}
                className="bg-brand-600 hover:bg-brand-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="job-card shadow-soft hover:shadow-medium transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-xl text-primary-foreground font-semibold">
                          {job.title}
                        </CardTitle>
                        <Badge
                          variant={
                            job.status === "active" ? "default" : "secondary"
                          }
                          className={
                            job.status === "active"
                              ? "bg-green-500 text-background"
                              : "bg-red-500 text-background"
                          }
                        >
                          {job.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-primary-forground">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        {job.salary && (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </div>
                        )}
                        <div className="flex items-center space-x-2 ">
                          <Badge
                            className={getJobTypeColor(
                              (job as any).type || "full-time"
                            )}
                          >
                            {(job as any).type || "Full Time "}
                          </Badge>
                          <Badge
                            className={getExperienceColor(
                              (job as any).experience || "entry"
                            )}
                          >
                            {(job as any).experience || "Entry"} Level
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleJobStatus(job)}
                        className={
                          job.status === "active"
                            ? "text-red-600 hover:text-red-700"
                            : "text-green-600 hover:text-green-700"
                        }
                      >
                        {job.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(job)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(job.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-primary-foreground font-bold mb-2">
                        Description
                      </h4>
                      <p className="text-primary-foreground/70 text-sm leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-primary-foreground mb-2">
                        Requirements
                      </h4>
                      <p className="text-primary-foreground/70 text-sm leading-relaxed">
                        {job.requirements}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 text-xs text-gray-500">
                      <span>
                        Created on{" "}
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <span>Job ID: {job.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
