
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { GDProvider } from "@/context/GDContext";
import Navbar from "@/components/layout/Navbar";
import { useEffect } from "react";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import Profile from "./pages/Profile";
import CreateSession from "./pages/CreateSession";
import SessionDetails from "./pages/SessionDetails";
import EvaluateSession from "./pages/EvaluateSession";
import SessionResults from "./pages/SessionResults";
import Analytics from "./pages/Analytics";
import ExportReports from "./pages/ExportReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ProtectedRoute component to handle auth checks
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If we're not loading and there's no user, redirect to login
    if (!isLoading && !user) {
      console.log("No authenticated user, redirecting to login");
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [user, isLoading, navigate, location]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return null; // useEffect will handle redirection
  }
  
  return <>{children}</>;
};

// InstructorRoute component to restrict access to instructors only
const InstructorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        console.log("No authenticated user for instructor route, redirecting to login");
        navigate("/login", { replace: true, state: { from: location } });
      } else if (user.role !== "instructor") {
        console.log("User is not an instructor, redirecting to dashboard");
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, isLoading, navigate, location]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user || user.role !== "instructor") {
    return null; // useEffect will handle redirection
  }
  
  return <>{children}</>;
};

// AuthRoute for login/register pages - redirects to dashboard if already logged in
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading && user) {
      console.log("User already logged in, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (user) {
    return null; // useEffect will handle redirection
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    
    {/* Auth Routes */}
    <Route path="/login" element={
      <AuthRoute>
        <LoginPage />
      </AuthRoute>
    } />
    
    <Route path="/register" element={
      <AuthRoute>
        <RegisterPage />
      </AuthRoute>
    } />
    
    {/* Protected Routes */}
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    } />
    
    <Route path="/profile" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } />
    
    <Route path="/create-session" element={
      <InstructorRoute>
        <CreateSession />
      </InstructorRoute>
    } />
    
    <Route path="/session/:id" element={
      <ProtectedRoute>
        <SessionDetails />
      </ProtectedRoute>
    } />
    
    <Route path="/session/:id/evaluate" element={
      <ProtectedRoute>
        <EvaluateSession />
      </ProtectedRoute>
    } />
    
    <Route path="/session/:id/results" element={
      <InstructorRoute>
        <SessionResults />
      </InstructorRoute>
    } />
    
    <Route path="/analytics" element={
      <InstructorRoute>
        <Analytics />
      </InstructorRoute>
    } />
    
    <Route path="/export-reports" element={
      <InstructorRoute>
        <ExportReports />
      </InstructorRoute>
    } />
    
    {/* 404 Route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <GDProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <AppRoutes />
              </main>
            </div>
          </BrowserRouter>
        </GDProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
