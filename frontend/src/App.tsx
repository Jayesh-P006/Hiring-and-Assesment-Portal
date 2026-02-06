import { Switch, Route } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import FaceLogin from "@/pages/FaceLogin";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import { CandidateDashboard, CompanyHRDashboard, CompanyAdminDashboard } from "@/pages/dashboards";
import Lobby from "@/pages/candidate/Lobby";
import CodingAssessment from "@/pages/candidate/CodingAssessment";
import InterviewAssessment from "@/pages/candidate/InterviewAssessment";
import CandidateProfileSection from "@/pages/candidate/sections/Profile";
import CandidateJobPostsSection from "@/pages/candidate/sections/JobPosts";
import CandidateAIInterviewSection from "@/pages/candidate/sections/AIInterview";
import CandidatePracticeSection from "@/pages/candidate/sections/PracticeQuestions";
import CandidateTrackSection from "@/pages/candidate/sections/TrackApplications";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/face-login" component={FaceLogin} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/candidate" component={CandidateProfileSection} />
      <Route path="/dashboard/candidate/profile" component={CandidateProfileSection} />
      <Route path="/dashboard/candidate/jobs" component={CandidateJobPostsSection} />
      <Route path="/dashboard/candidate/ai-interview" component={CandidateAIInterviewSection} />
      <Route path="/dashboard/candidate/practice" component={CandidatePracticeSection} />
      <Route path="/dashboard/candidate/track" component={CandidateTrackSection} />
      <Route path="/dashboard/hr" component={CompanyHRDashboard} />
      <Route path="/dashboard/admin" component={CompanyAdminDashboard} />
      <Route path="/candidate/lobby" component={Lobby} />
      <Route path="/candidate/assessment/:id/coding" component={CodingAssessment} />
      <Route path="/candidate/assessment/:id/interview" component={InterviewAssessment} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
