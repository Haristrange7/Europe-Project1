import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Toaster } from "sonner";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { AdminLogin } from "./pages/AdminLogin";
import { CandidateAuth } from "./pages/CandidateAuth";
import { WelderAuth } from "./pages/WelderAuth";
import { CandidateDashboard } from "./pages/candidate/Dashboard";
import { ProfileSetup } from "./pages/candidate/ProfileSetup";
import { Quiz } from "./pages/candidate/Quiz";
import { Practice } from "./pages/candidate/Practice";
import { Documents } from "./pages/candidate/Documents";
import { WelderDashboard } from "./pages/welder/Dashboard";
import { WelderProfileSetup } from "./pages/welder/ProfileSetup";
import { WelderQuiz } from "./pages/welder/Quiz";
import { WelderPractice } from "./pages/welder/Practice";
import { WelderDocuments } from "./pages/welder/Documents";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { Jobs } from "./pages/admin/Jobs";
import { QuizManagement } from "./pages/admin/QuizManagement";
import { DocumentsManagement } from "./pages/admin/DocumentsManagement";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/candidate/auth" element={<CandidateAuth />} />
            <Route path="/welder/auth" element={<WelderAuth />} />

            {/* Protected Candidate Routes */}
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute requiredRole="candidate">
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/profile"
              element={
                <ProtectedRoute requiredRole="candidate">
                  <ProfileSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/documents"
              element={
                <ProtectedRoute requiredRole="candidate">
                  <Documents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/quiz"
              element={
                <ProtectedRoute requiredRole="candidate">
                  <Quiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/practice"
              element={
                <ProtectedRoute requiredRole="candidate">
                  <Practice />
                </ProtectedRoute>
              }
            />

            {/* Protected Welder Routes */}
            <Route
              path="/welder/dashboard"
              element={
                <ProtectedRoute requiredRole="welder">
                  <WelderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/welder/profile"
              element={
                <ProtectedRoute requiredRole="welder">
                  <WelderProfileSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/welder/documents"
              element={
                <ProtectedRoute requiredRole="welder">
                  <WelderDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/welder/quiz"
              element={
                <ProtectedRoute requiredRole="welder">
                  <WelderQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/welder/practice"
              element={
                <ProtectedRoute requiredRole="welder">
                  <WelderPractice />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Jobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quiz"
              element={
                <ProtectedRoute requiredRole="admin">
                  <QuizManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/documents"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DocumentsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/candidates"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quizzes"
              element={
                <ProtectedRoute requiredRole="admin">
                  <QuizManagement />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster richColors position="top-right" />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
