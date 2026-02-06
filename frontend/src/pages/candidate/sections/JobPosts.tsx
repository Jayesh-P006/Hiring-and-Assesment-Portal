import { useMemo, useState } from "react";
import { Briefcase, Search, CheckCircle2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PortalLayout from "@/components/PortalLayout";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { CyberInput } from "@/components/CyberInput";
import { apiUrl } from "@/lib/api";

type JobsResponse = {
  jobs: Array<{
    id: number;
    title: string;
    description: string | null;
    skills: string[];
    company_name: string | null;
    created_at: string;
  }>;
};

type ApplicationsResponse = {
  applications: Array<{ id: number; job_id: number | null; status: string }>;
};

export default function CandidateJobPostsSection() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");

  const { data: jobsData } = useQuery({
    queryKey: ["/api/candidate/jobs"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/candidate/jobs"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load jobs");
      return (await res.json()) as JobsResponse;
    },
  });

  const { data: appsData } = useQuery({
    queryKey: ["/api/candidate/applications"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/candidate/applications"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load applications");
      return (await res.json()) as ApplicationsResponse;
    },
  });

  const appliedIds = useMemo(() => {
    const set = new Set<number>();
    for (const a of appsData?.applications ?? []) {
      if (typeof a.job_id === "number") set.add(a.job_id);
    }
    return set;
  }, [appsData?.applications]);

  const applyMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const res = await fetch(apiUrl("/api/candidate/apply"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ job_id: jobId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to apply");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/candidate/applications"] });
    },
  });

  const jobs = jobsData?.jobs ?? [];
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return jobs;
    return jobs.filter((j) => {
      const skills = (j.skills || []).join(" ").toLowerCase();
      return (
        j.title.toLowerCase().includes(query) ||
        (j.company_name || "").toLowerCase().includes(query) ||
        skills.includes(query)
      );
    });
  }, [jobs, q]);

  return (
    <PortalLayout
      title="CANDIDATE PORTAL"
      subtitle="JOB POSTS // BROWSE + APPLY"
      roleLabel="CANDIDATE"
      nav={[
        { label: "PROFILE", href: "/dashboard/candidate/profile", icon: <Briefcase className="w-4 h-4" /> },
        { label: "JOB POSTS", href: "/dashboard/candidate/jobs", icon: <Briefcase className="w-4 h-4" /> },
        { label: "AI INTERVIEW", href: "/dashboard/candidate/ai-interview", icon: <Briefcase className="w-4 h-4" /> },
        { label: "PRACTICE", href: "/dashboard/candidate/practice", icon: <Briefcase className="w-4 h-4" /> },
        { label: "TRACK", href: "/dashboard/candidate/track", icon: <Briefcase className="w-4 h-4" /> },
      ]}
    >
      <CyberCard>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-secondary" />
            <div>
              <h2 className="font-display text-lg">JOB POSTS</h2>
              <p className="text-xs font-mono text-muted-foreground">SEARCH AND APPLY</p>
            </div>
          </div>
          <div className="w-[320px]">
            <CyberInput placeholder="Search by title, company, skill" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p className="font-display">No job posts found</p>
            <p className="text-xs font-mono mt-2">Ask HR/Admin to create a job.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((j) => {
              const applied = appliedIds.has(j.id);
              return (
                <div key={j.id} className="border border-white/10 rounded p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-display text-base text-primary truncate">{j.title}</p>
                      <p className="text-xs font-mono text-muted-foreground">{j.company_name || "—"}</p>
                      {j.description ? (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{j.description}</p>
                      ) : null}
                      <div className="flex gap-2 flex-wrap mt-3">
                        {(j.skills || []).slice(0, 8).map((s) => (
                          <span key={s} className="px-2 py-1 bg-primary/10 border border-primary/30 text-primary text-xs font-mono rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <CyberButton
                        variant={applied ? "outline" : undefined}
                        disabled={applied || applyMutation.isPending}
                        onClick={() => applyMutation.mutate(j.id)}
                        className="gap-2"
                      >
                        {applied ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> APPLIED
                          </>
                        ) : (
                          "APPLY"
                        )}
                      </CyberButton>
                    </div>
                  </div>
                  {applyMutation.isError ? (
                    <p className="text-xs font-mono text-destructive mt-2">{(applyMutation.error as Error).message}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </CyberCard>
    </PortalLayout>
  );
}
