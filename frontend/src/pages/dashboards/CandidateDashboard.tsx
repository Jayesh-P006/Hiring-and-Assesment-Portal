import { useUser, useLogout } from "@/hooks/use-auth";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { CyberInput } from "@/components/CyberInput";
import {
  Loader2,
  User,
  Briefcase,
  FileText,
  LogOut,
  Star,
  ClipboardList,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "@/lib/api";
import { Link } from "wouter";
import { useMemo, useState } from "react";

type CandidateAssessmentsResponse = {
  assessments: Array<{
    id: number;
    status: string;
    created_at: string;
    job_title: string | null;
  }>;
};

type CandidateJobsResponse = {
  jobs: Array<{
    id: number;
    title: string;
    description: string | null;
    skills: string[];
    company_name: string | null;
    created_at: string;
  }>;
};

type CandidateApplicationsResponse = {
  applications: Array<{
    id: number;
    status: string;
    created_at: string;
    job_id: number | null;
    job_title: string | null;
    company_name: string | null;
  }>;
};

export default function CandidateDashboard() {
  const { data: user, isLoading } = useUser();
  const logout = useLogout();
  const queryClient = useQueryClient();

  const [jobSearch, setJobSearch] = useState("");

  const { data: assessmentsData } = useQuery({
    queryKey: ["/api/candidate/assessments"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/candidate/assessments"), {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load assessments");
      return (await res.json()) as CandidateAssessmentsResponse;
    },
    enabled: !!user,
  });

  const { data: jobsData } = useQuery({
    queryKey: ["/api/candidate/jobs"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/candidate/jobs"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load jobs");
      return (await res.json()) as CandidateJobsResponse;
    },
    enabled: !!user,
  });

  const { data: applicationsData } = useQuery({
    queryKey: ["/api/candidate/applications"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/candidate/applications"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load applications");
      return (await res.json()) as CandidateApplicationsResponse;
    },
    enabled: !!user,
  });

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

  const assessments = assessmentsData?.assessments ?? [];
  const applications = applicationsData?.applications ?? [];
  const jobs = jobsData?.jobs ?? [];

  const pendingAssessmentsCount = useMemo(() => {
    return assessments.filter((a) => !String(a.status || "").toLowerCase().includes("completed")).length;
  }, [assessments]);

  const profileCompletion = useMemo(() => {
    // Keep this simple + deterministic.
    let score = 0;
    if (user?.username) score += 30;
    if (user?.email) score += 30;
    if ((user as any)?.faceEmbedding) score += 40;
    return Math.min(100, score);
  }, [user]);

  const filteredJobs = useMemo(() => {
    const q = jobSearch.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((j) => {
      const skills = (j.skills || []).join(" ").toLowerCase();
      return (
        j.title.toLowerCase().includes(q) ||
        (j.company_name || "").toLowerCase().includes(q) ||
        skills.includes(q)
      );
    });
  }, [jobs, jobSearch]);

  const appliedJobIds = useMemo(() => {
    const set = new Set<number>();
    for (const a of applications) {
      if (typeof a.job_id === "number") set.add(a.job_id);
    }
    return set;
  }, [applications]);

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
          <h1 className="text-3xl font-display text-primary tracking-widest">CANDIDATE PORTAL</h1>
          <p className="font-mono text-xs text-muted-foreground">JOB SEEKER DASHBOARD // V.1.0.0</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="font-mono text-sm text-primary">{user.username}</p>
            <p className="font-mono text-xs text-muted-foreground">CANDIDATE</p>
          </div>
          <div className="w-10 h-10 rounded bg-primary/20 border border-primary flex items-center justify-center font-display font-bold text-primary">
            {user.username[0].toUpperCase()}
          </div>
        </div>
      </header>

      <main className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* KPI row */}
        <CyberCard glow="accent" className="md:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">PROFILE</h2>
            <User className="text-accent" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between font-mono text-sm">
              <span className="text-muted-foreground">STATUS</span>
              <span className="text-green-500">ACTIVE</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-muted-foreground">APPLICATIONS</span>
              <span className="text-accent">{applications.length}</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-muted-foreground">ASSESSMENTS</span>
              <span className="text-primary">{pendingAssessmentsCount}</span>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs font-mono text-muted-foreground mb-2">PROFILE COMPLETION</p>
              <div className="h-2 w-full bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-accent relative" style={{ width: `${profileCompletion}%` }}>
                  <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_5px_white]" />
                </div>
              </div>
              <p className="text-xs font-mono text-muted-foreground mt-2">{profileCompletion}% complete</p>
            </div>
          </div>
        </CyberCard>

        <CyberCard glow="primary" className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">MY TASKS</h2>
            <ClipboardList className="text-primary" />
          </div>
          <div className="space-y-3">
            {assessments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-display">No assessments yet</p>
                <p className="text-xs font-mono mt-2">When HR invites you, it will appear here.</p>
              </div>
            ) : (
              assessments.slice(0, 5).map((a) => (
                <div
                  key={a.id}
                  className="p-3 border border-white/10 rounded flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <p className="font-display text-sm text-primary">{a.job_title || `Assessment #${a.id}`}</p>
                    <p className="font-mono text-xs text-muted-foreground">STATUS: {a.status}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link href="/candidate/lobby">
                      <CyberButton variant="outline">LOBBY</CyberButton>
                    </Link>
                    <Link href={`/candidate/assessment/${a.id}/coding`}>
                      <CyberButton>CODING</CyberButton>
                    </Link>
                    <Link href={`/candidate/assessment/${a.id}/interview`}>
                      <CyberButton variant="secondary">INTERVIEW</CyberButton>
                    </Link>
                  </div>
                </div>
              ))
            )}
            {assessments.length > 5 ? (
              <p className="text-xs font-mono text-muted-foreground">Showing latest 5 assessments.</p>
            ) : null}
          </div>
        </CyberCard>

        {/* Recommended jobs */}
        <CyberCard className="md:col-span-2">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-secondary" />
              <div>
                <h2 className="font-display text-lg">RECOMMENDED JOBS</h2>
                <p className="text-xs font-mono text-muted-foreground">BROWSE + APPLY</p>
              </div>
            </div>
            <div className="w-[280px]">
              <CyberInput placeholder="Search by title, company, skill" value={jobSearch} onChange={(e) => setJobSearch(e.target.value)} />
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p className="font-display">No jobs found</p>
              <p className="text-xs font-mono mt-2">Ask HR/Admin to create a job.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.slice(0, 6).map((j) => {
                const alreadyApplied = appliedJobIds.has(j.id);
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
                          {(j.skills || []).slice(0, 5).map((s) => (
                            <span key={s} className="px-2 py-1 bg-primary/10 border border-primary/30 text-primary text-xs font-mono rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <CyberButton
                          variant={alreadyApplied ? "outline" : undefined}
                          disabled={alreadyApplied || applyMutation.isPending}
                          onClick={() => applyMutation.mutate(j.id)}
                          className="gap-2"
                        >
                          {alreadyApplied ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" /> APPLIED
                            </>
                          ) : (
                            "APPLY"
                          )}
                        </CyberButton>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredJobs.length > 6 ? (
                <p className="text-xs font-mono text-muted-foreground">Showing top 6 matches.</p>
              ) : null}
              {applyMutation.isError ? (
                <p className="text-xs font-mono text-destructive">{(applyMutation.error as Error).message}</p>
              ) : null}
            </div>
          )}
        </CyberCard>

        {/* Applications */}
        <CyberCard className="md:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">MY APPLICATIONS</h2>
            <FileText className="text-accent" />
          </div>
          {applications.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p className="font-display">No applications yet</p>
              <p className="text-xs font-mono mt-2">Apply to jobs to track progress.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
              {applications.slice(0, 12).map((a) => (
                <div key={a.id} className="border border-white/10 rounded p-3">
                  <p className="font-display text-sm text-primary truncate">{a.job_title || "Job"}</p>
                  <p className="text-xs font-mono text-muted-foreground truncate">{a.company_name || "—"}</p>
                  <p className="text-xs font-mono text-secondary mt-2">STATUS: {a.status}</p>
                </div>
              ))}
              {applications.length > 12 ? (
                <p className="text-xs font-mono text-muted-foreground">Showing latest 12 applications.</p>
              ) : null}
            </div>
          )}
        </CyberCard>

        {/* Quick Actions Card */}
        <CyberCard className="md:col-span-3">
          <div className="flex items-center gap-4 mb-6">
            <FileText className="w-8 h-8 text-secondary" />
            <div>
              <h2 className="font-display text-xl">QUICK ACTIONS</h2>
              <p className="text-xs font-mono text-muted-foreground">MANAGE YOUR JOB SEARCH</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Focus on what matters: complete your profile, apply to jobs, and finish assessments.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-primary/20 border border-primary/50 text-primary text-xs font-mono rounded">FACE_VERIFIED</span>
                <span className="px-2 py-1 bg-secondary/20 border border-secondary/50 text-secondary text-xs font-mono rounded">CANDIDATE</span>
              </div>
            </div>
            <div className="flex justify-end items-end gap-2">
              <Link href="/candidate/lobby">
                <CyberButton variant="outline" className="gap-2">
                  <Star className="w-4 h-4" /> SYSTEM CHECK
                </CyberButton>
              </Link>
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
