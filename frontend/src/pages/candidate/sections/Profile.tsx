import { User, ShieldCheck } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { CyberCard } from "@/components/CyberCard";
import { useUser } from "@/hooks/use-auth";

export default function CandidateProfileSection() {
  const { data: user } = useUser();

  const completion = (() => {
    let score = 0;
    if (user?.username) score += 30;
    if (user?.email) score += 30;
    if ((user as any)?.faceEmbedding) score += 40;
    return Math.min(100, score);
  })();

  return (
    <PortalLayout
      title="CANDIDATE PORTAL"
      subtitle="PROFESSIONAL DASHBOARD // V.1.0.0"
      roleLabel="CANDIDATE"
      nav={[
        { label: "PROFILE", href: "/dashboard/candidate/profile", icon: <User className="w-4 h-4" /> },
        { label: "JOB POSTS", href: "/dashboard/candidate/jobs", icon: <ShieldCheck className="w-4 h-4" /> },
        { label: "AI INTERVIEW", href: "/dashboard/candidate/ai-interview", icon: <ShieldCheck className="w-4 h-4" /> },
        { label: "PRACTICE", href: "/dashboard/candidate/practice", icon: <ShieldCheck className="w-4 h-4" /> },
        { label: "TRACK", href: "/dashboard/candidate/track", icon: <ShieldCheck className="w-4 h-4" /> },
      ]}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <CyberCard glow="accent" className="lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">PROFILE</h2>
            <User className="text-accent" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between font-mono text-sm">
              <span className="text-muted-foreground">USERNAME</span>
              <span className="text-primary">{user?.username ?? "—"}</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-muted-foreground">EMAIL</span>
              <span className="text-primary truncate">{user?.email ?? "—"}</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-muted-foreground">FACE</span>
              <span className="text-green-500">{(user as any)?.faceEmbedding ? "VERIFIED" : "NOT SET"}</span>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs font-mono text-muted-foreground mb-2">PROFILE COMPLETION</p>
              <div className="h-2 w-full bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-accent relative" style={{ width: `${completion}%` }}>
                  <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_5px_white]" />
                </div>
              </div>
              <p className="text-xs font-mono text-muted-foreground mt-2">{completion}% complete</p>
            </div>
          </div>
        </CyberCard>

        <CyberCard glow="primary" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">NEXT STEPS</h2>
            <ShieldCheck className="text-primary" />
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="border border-white/10 rounded p-4">
              <p className="font-display text-primary">1) Browse Job Posts</p>
              <p className="font-mono text-xs">Apply to roles and track status.</p>
            </div>
            <div className="border border-white/10 rounded p-4">
              <p className="font-display text-primary">2) Complete AI Interview</p>
              <p className="font-mono text-xs">Use the Lobby for system checks.</p>
            </div>
            <div className="border border-white/10 rounded p-4">
              <p className="font-display text-primary">3) Practice Questions</p>
              <p className="font-mono text-xs">Warm up before assessments.</p>
            </div>
          </div>
        </CyberCard>
      </div>
    </PortalLayout>
  );
}
