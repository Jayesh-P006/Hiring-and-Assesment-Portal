import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Bot, Video } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { apiUrl } from "@/lib/api";

type CandidateAssessmentsResponse = {
  assessments: Array<{ id: number; status: string; created_at: string; job_title: string | null }>;
};

export default function CandidateAIInterviewSection() {
  const { data } = useQuery({
    queryKey: ["/api/candidate/assessments"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/candidate/assessments"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load assessments");
      return (await res.json()) as CandidateAssessmentsResponse;
    },
  });

  const assessments = data?.assessments ?? [];

  return (
    <PortalLayout
      title="CANDIDATE PORTAL"
      subtitle="AI INTERVIEW // PROCTORED"
      roleLabel="CANDIDATE"
      nav={[
        { label: "PROFILE", href: "/dashboard/candidate/profile", icon: <Bot className="w-4 h-4" /> },
        { label: "JOB POSTS", href: "/dashboard/candidate/jobs", icon: <Bot className="w-4 h-4" /> },
        { label: "AI INTERVIEW", href: "/dashboard/candidate/ai-interview", icon: <Bot className="w-4 h-4" /> },
        { label: "PRACTICE", href: "/dashboard/candidate/practice", icon: <Bot className="w-4 h-4" /> },
        { label: "TRACK", href: "/dashboard/candidate/track", icon: <Bot className="w-4 h-4" /> },
      ]}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <CyberCard glow="primary" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">AVAILABLE INTERVIEWS</h2>
            <Video className="text-primary" />
          </div>

          {assessments.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p className="font-display">No assessments yet</p>
              <p className="text-xs font-mono mt-2">When HR invites you, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assessments.slice(0, 10).map((a) => (
                <div key={a.id} className="border border-white/10 rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-display text-sm text-primary">{a.job_title || `Assessment #${a.id}`}</p>
                    <p className="text-xs font-mono text-muted-foreground">STATUS: {a.status}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link href="/candidate/lobby">
                      <CyberButton variant="outline">SYSTEM CHECK</CyberButton>
                    </Link>
                    <Link href={`/candidate/assessment/${a.id}/interview`}>
                      <CyberButton>START INTERVIEW</CyberButton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CyberCard>

        <CyberCard glow="accent" className="lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">GUIDELINES</h2>
            <Bot className="text-accent" />
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="border border-white/10 rounded p-3">
              <p className="font-mono text-xs">Use full-screen mode when prompted.</p>
            </div>
            <div className="border border-white/10 rounded p-3">
              <p className="font-mono text-xs">Keep camera active for proctoring.</p>
            </div>
            <div className="border border-white/10 rounded p-3">
              <p className="font-mono text-xs">Avoid switching tabs or copying content.</p>
            </div>
          </div>
        </CyberCard>
      </div>
    </PortalLayout>
  );
}
