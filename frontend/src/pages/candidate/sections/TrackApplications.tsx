import { useQuery } from "@tanstack/react-query";
import { ClipboardCheck, FileText } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { CyberCard } from "@/components/CyberCard";
import { apiUrl } from "@/lib/api";

type ApplicationsResponse = {
  applications: Array<{
    id: number;
    status: string;
    created_at: string;
    job_id: number | null;
    job_title: string | null;
    company_name: string | null;
  }>;
};

export default function CandidateTrackSection() {
  const { data } = useQuery({
    queryKey: ["/api/candidate/applications"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/candidate/applications"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load applications");
      return (await res.json()) as ApplicationsResponse;
    },
  });

  const apps = data?.applications ?? [];

  return (
    <PortalLayout
      title="CANDIDATE PORTAL"
      subtitle="TRACK APPLICATIONS // STATUS"
      roleLabel="CANDIDATE"
      nav={[
        { label: "PROFILE", href: "/dashboard/candidate/profile", icon: <FileText className="w-4 h-4" /> },
        { label: "JOB POSTS", href: "/dashboard/candidate/jobs", icon: <FileText className="w-4 h-4" /> },
        { label: "AI INTERVIEW", href: "/dashboard/candidate/ai-interview", icon: <FileText className="w-4 h-4" /> },
        { label: "PRACTICE", href: "/dashboard/candidate/practice", icon: <FileText className="w-4 h-4" /> },
        { label: "TRACK", href: "/dashboard/candidate/track", icon: <FileText className="w-4 h-4" /> },
      ]}
    >
      <CyberCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg">TRACK APPLICATIONS</h2>
          <ClipboardCheck className="text-primary" />
        </div>

        {apps.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p className="font-display">No applications yet</p>
            <p className="text-xs font-mono mt-2">Apply to jobs to track progress.</p>
          </div>
        ) : (
          <div className="border border-white/10 rounded overflow-auto">
            <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-mono text-muted-foreground border-b border-white/10">
              <div className="col-span-4">JOB</div>
              <div className="col-span-4">COMPANY</div>
              <div className="col-span-2">STATUS</div>
              <div className="col-span-2">DATE</div>
            </div>
            {apps.map((a) => (
              <div key={a.id} className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-mono border-b border-white/5">
                <div className="col-span-4 text-primary truncate">{a.job_title || "—"}</div>
                <div className="col-span-4 text-muted-foreground truncate">{a.company_name || "—"}</div>
                <div className="col-span-2 text-secondary truncate">{a.status}</div>
                <div className="col-span-2 text-muted-foreground truncate">{String(a.created_at || "").slice(0, 10)}</div>
              </div>
            ))}
          </div>
        )}
      </CyberCard>
    </PortalLayout>
  );
}
