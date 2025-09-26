import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  FileText,
  UserCheck,
} from "lucide-react";
import { storageUtils } from "@/utils/storage";
import { CandidateProfile, Job } from "@/types";
import { Link } from "react-router-dom";
import gsap from "gsap";

export const AdminDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    pendingReview: 0,
    approved: 0,
    activeJobs: 0,
    completedQuizzes: 0,
    documentsSubmitted: 0,
  });

  useEffect(() => {
    loadData();

    // Animate dashboard cards
    gsap.fromTo(
      ".dashboard-card",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
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
      pendingReview: allProfiles.filter((p) => p.status === "under_review")
        .length,
      approved: allProfiles.filter(
        (p) => p.status === "approved" || p.status === "employee"
      ).length,
      activeJobs: allJobs.filter((j) => j.status === "active").length,
      completedQuizzes: allProfiles.filter((p) => p.quizScore !== undefined)
        .length,
      documentsSubmitted: allProfiles.filter(
        (p) => p.documents.experienceCertificate
      ).length,
    });
  };

  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    color,
    trend,
    link,
  }: {
    title: string;
    value: number;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    trend?: string;
    link?: string;
  }) => (
    <Card className="dashboard-card shadow-soft hover:shadow-medium transition-all cursor-pointer">
      <Link to={link || "#"}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-foreground mb-1">{title}</p>
              <p className="text-3xl font-bold text-primary mb-1">{value}</p>
              <p className="text-sm text-primary-foreground/60">{description}</p>
              {trend && (
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-success-600 mr-1" />
                  <span className="text-sm text-success-600">{trend}</span>
                </div>
              )}
            </div>
            <div className={`p-4 rounded-full ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );

  const recentCandidates = profiles
    .sort(
      (a, b) =>
        new Date(b.completedAt || "").getTime() -
        new Date(a.completedAt || "").getTime()
    )
    .slice(0, 5);

  const recentJobs = jobs
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="dashboard-card">
          <Card className="bg-gradient-to-l from-primary to-primary text-white shadow-large">
            <CardContent className="p-8">
              <div className="flex items-center text-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Welcome back, Admin!
                  </h2>
                  <p className="text-brand-100 text-lg">
                    Here's what's happening with your recruitment platform
                    today.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Candidates"
            value={stats.totalCandidates}
            description="Registered drivers"
            icon={Users}
            color="bg-brand-600"
            trend="+12% from last month"
            link="/admin/candidates"
          />
          <StatCard
            title="Pending Review"
            value={stats.pendingReview}
            description="Awaiting approval"
            icon={Clock}
            color="bg-warning-600"
            link="/admin/documents"
          />
          <StatCard
            title="Approved Drivers"
            value={stats.approved}
            description="Ready for employment"
            icon={CheckCircle}
            color="bg-success-600"
            trend="+8% from last month"
            link="/admin/candidates"
          />
          <StatCard
            title="Active Jobs"
            value={stats.activeJobs}
            description="Open positions"
            icon={Briefcase}
            color="bg-purple-600"
            link="/admin/jobs"
          />
          <StatCard
            title="Quiz Completed"
            value={stats.completedQuizzes}
            description="Knowledge assessments"
            icon={Award}
            color="bg-blue-600"
            link="/admin/quizzes"
          />
          <StatCard
            title="Documents Submitted"
            value={stats.documentsSubmitted}
            description="For verification"
            icon={FileText}
            color="bg-indigo-600"
            link="/admin/documents"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Candidates */}
          <Card className="dashboard-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-brand-600" />
                Recent Candidates
              </CardTitle>
              <CardDescription>
                Latest candidate applications and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentCandidates.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-primary-foreground mb-4" />
                  <p className="text-primary-foreground/80">No candidates yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCandidates.map((candidate) => (
                    <div
                      key={candidate.userId}
                      className="flex items-center justify-between p-3 bg-primary rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-brand-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-brand-600" />
                        </div>
                        <div>
                          <p className="font-medium text-primary-foreground">
                            {candidate.personal.firstName}{" "}
                            {candidate.personal.lastName}
                          </p>
                          <p className="text-sm text-primary-foreground/80">
                            {candidate.personal.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            candidate.status === "approved" ||
                            candidate.status === "employee"
                              ? "bg-success-100 text-success-800"
                              : candidate.status === "under_review"
                              ? "bg-warning-100 text-warning-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {candidate.status.replace("_", " ")}
                        </div>
                        {candidate.quizScore && (
                          <p className="text-xs text-gray-500 mt-1">
                            Quiz: {candidate.quizScore}%
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Jobs */}
          <Card className="dashboard-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-brand-600" />
                Recent Job Postings
              </CardTitle>
              <CardDescription>
                Latest job opportunities created
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No jobs posted yet</p>
                  <Link to="/admin/jobs">
                    <button className="text-brand-600 hover:text-brand-700 font-medium">
                      Create your first job →
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 border border-ring rounded-lg hover:bg-primary transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-primary-foreground mb-1">
                            {job.title}
                          </h4>
                          <p className="text-sm text-primary-foreground/80 mb-2">
                            {job.location}
                          </p>
                          <p className="text-xs text-primary-foreground/60">
                            Created{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.status === "active"
                              ? "bg-primary text-primary-foreground"
                              : "bg-destructive text-destructive-foreground"
                          }`}
                        >
                          {job.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
