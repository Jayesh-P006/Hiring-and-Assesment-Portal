import { useUser, useLogout } from "@/hooks/use-auth";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Loader2, Users, Briefcase, Building2, LogOut, ClipboardList, UserPlus } from "lucide-react";

export default function CompanyHRDashboard() {
  const { data: user, isLoading } = useUser();
  const logout = useLogout();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-primary">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <CyberCard className="text-center">
          <h1 className="text-xl text-red-500 font-display mb-4">ACCESS DENIED</h1>
          <p className="text-muted-foreground mb-4">Session expired or invalid.</p>
          <CyberButton onClick={logout}>RETURN TO LOGIN</CyberButton>
        </CyberCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-display text-primary tracking-widest">HR PORTAL</h1>
          <p className="font-mono text-xs text-muted-foreground">HIRING MANAGEMENT SYSTEM // V.1.0.0</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="font-mono text-sm text-primary">{user.username}</p>
            <p className="font-mono text-xs text-muted-foreground">COMPANY HR</p>
          </div>
          <div className="w-10 h-10 rounded bg-green-500/20 border border-green-500 flex items-center justify-center font-display font-bold text-green-500">
            {user.username[0].toUpperCase()}
          </div>
        </div>
      </header>

      <main className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Hiring Stats Card */}
        <CyberCard glow="accent" className="md:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">HIRING STATS</h2>
            <Users className="text-accent" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between font-mono text-sm">
              <span className="text-muted-foreground">OPEN POSITIONS</span>
              <span className="text-green-500">0</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-muted-foreground">CANDIDATES</span>
              <span className="text-accent">0</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-muted-foreground">PENDING INTERVIEWS</span>
              <span className="text-primary">0</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs font-mono text-muted-foreground mb-2">HIRING PIPELINE</p>
              <div className="h-2 w-full bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-green-500 w-[0%] relative">
                  <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_5px_white]" />
                </div>
              </div>
            </div>
          </div>
        </CyberCard>

        {/* Recent Applications Card */}
        <CyberCard glow="primary" className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">RECENT APPLICATIONS</h2>
            <ClipboardList className="text-primary" />
          </div>
          <div className="space-y-2 font-mono text-xs md:text-sm">
            <div className="text-center text-muted-foreground py-8">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No applications received yet.</p>
              <p className="text-xs mt-2">Post a job to start receiving applications!</p>
            </div>
          </div>
        </CyberCard>

        {/* Quick Actions Card */}
        <CyberCard className="md:col-span-3">
          <div className="flex items-center gap-4 mb-6">
            <Building2 className="w-8 h-8 text-secondary" />
            <div>
              <h2 className="font-display text-xl">HR ACTIONS</h2>
              <p className="text-xs font-mono text-muted-foreground">MANAGE HIRING ACTIVITIES</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Welcome to your HR dashboard. From here you can post job openings,
                review applications, schedule interviews, and manage candidates.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-green-500/20 border border-green-500/50 text-green-500 text-xs font-mono rounded">FACE_VERIFIED</span>
                <span className="px-2 py-1 bg-secondary/20 border border-secondary/50 text-secondary text-xs font-mono rounded">COMPANY_HR</span>
              </div>
            </div>
            <div className="flex justify-end items-end gap-2">
              <CyberButton variant="outline" className="gap-2">
                <UserPlus className="w-4 h-4" /> POST JOB
              </CyberButton>
              <CyberButton variant="secondary" onClick={logout} className="gap-2">
                <LogOut className="w-4 h-4" /> SIGN OUT
              </CyberButton>
            </div>
          </div>
        </CyberCard>
      </main>
    </div>
  );
}
