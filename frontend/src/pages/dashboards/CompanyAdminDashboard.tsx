import { useUser, useLogout } from "@/hooks/use-auth";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Loader2, Shield, Users, Settings, LogOut, Activity, Building2 } from "lucide-react";

export default function CompanyAdminDashboard() {
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
          <h1 className="text-3xl font-display text-primary tracking-widest">ADMIN PORTAL</h1>
          <p className="font-mono text-xs text-muted-foreground">COMPANY ADMINISTRATION // V.1.0.0</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="font-mono text-sm text-primary">{user.username}</p>
            <p className="font-mono text-xs text-muted-foreground">COMPANY ADMIN</p>
          </div>
          <div className="w-10 h-10 rounded bg-yellow-500/20 border border-yellow-500 flex items-center justify-center font-display font-bold text-yellow-500">
            {user.username[0].toUpperCase()}
          </div>
        </div>
      </header>

      <main className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Company Stats Card */}
        <CyberCard glow="accent" className="md:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">COMPANY OVERVIEW</h2>
            <Building2 className="text-accent" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between font-mono text-sm">
              <span className="text-muted-foreground">HR MEMBERS</span>
              <span className="text-green-500">0</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-muted-foreground">ACTIVE JOBS</span>
              <span className="text-accent">0</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-muted-foreground">TOTAL HIRES</span>
              <span className="text-primary">0</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs font-mono text-muted-foreground mb-2">SYSTEM HEALTH</p>
              <div className="h-2 w-full bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-yellow-500 w-[100%] relative">
                  <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_5px_white]" />
                </div>
              </div>
            </div>
          </div>
        </CyberCard>

        {/* Activity Feed Card */}
        <CyberCard glow="primary" className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">ACTIVITY FEED</h2>
            <Activity className="text-primary" />
          </div>
          <div className="space-y-2 font-mono text-xs md:text-sm">
            <div className="flex gap-4 p-2 bg-primary/10 border-l-2 border-primary">
              <span className="text-muted-foreground">NOW</span>
              <span className="text-accent">[SYSTEM]</span>
              <span className="text-foreground">Admin dashboard initialized successfully</span>
            </div>
            <div className="text-center text-muted-foreground py-4">
              <p className="text-xs">No other recent activity</p>
            </div>
          </div>
        </CyberCard>

        {/* Admin Actions Card */}
        <CyberCard className="md:col-span-3">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-8 h-8 text-secondary" />
            <div>
              <h2 className="font-display text-xl">ADMIN CONTROLS</h2>
              <p className="text-xs font-mono text-muted-foreground">FULL SYSTEM ACCESS GRANTED</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Welcome to your admin dashboard. As a Company Admin, you have full control 
                over HR member management, company settings, and hiring oversight.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-500 text-xs font-mono rounded">FACE_VERIFIED</span>
                <span className="px-2 py-1 bg-secondary/20 border border-secondary/50 text-secondary text-xs font-mono rounded">COMPANY_ADMIN</span>
                <span className="px-2 py-1 bg-red-500/20 border border-red-500/50 text-red-500 text-xs font-mono rounded">FULL_ACCESS</span>
              </div>
            </div>
            <div className="flex justify-end items-end gap-2">
              <CyberButton variant="outline" className="gap-2">
                <Users className="w-4 h-4" /> MANAGE HR
              </CyberButton>
              <CyberButton variant="outline" className="gap-2">
                <Settings className="w-4 h-4" /> SETTINGS
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
