import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "sonner";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { AdminLogin } from "./pages/AdminLogin";
import { CandidateAuth } from "./pages/CandidateAuth";
import { CandidateDashboard } from "./pages/candidate/Dashboard";
import { ProfileSetup } from "./pages/candidate/ProfileSetup";
import { Quiz } from "./pages/candidate/Quiz";
import { Documents } from "./pages/candidate/Documents";
import { AdminDashboard } from "./pages/admin/Dashboard";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground w-full">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/candidate/auth" element={<CandidateAuth />} />

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
              path="/candidate/quiz"
              element={
                <ProtectedRoute requiredRole="candidate">
                  <Quiz />
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

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Toaster richColors position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
