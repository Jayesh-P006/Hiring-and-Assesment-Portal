import { useUser, useLogout } from "@/hooks/use-auth";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { CyberInput } from "@/components/CyberInput";
import { Loader2, Shield, LogOut, Activity, Building2, Users, RefreshCw, Trash2, Database } from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "@/lib/api";

export default function CompanyAdminDashboard() {
  const { data: user, isLoading } = useUser();
  const logout = useLogout();
  const queryClient = useQueryClient();

  const [companyName, setCompanyName] = useState("");
  const [companyError, setCompanyError] = useState<string | null>(null);

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["/admin/stats"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/admin/stats"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load stats");
      return (await res.json()) as {
        companies: number;
        jobs: number;
        assessments: number;
        proctor_events: number;
        server_health: string;
      };
    },
    enabled: !!user,
  });

  const [userSearch, setUserSearch] = useState("");

  const { data: dbUsers } = useQuery({
    queryKey: ["/admin/db-users"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/admin/db-users"), { credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to load users");
      }
      return (await res.json()) as {
        users: Array<{ id: number; username: string; email: string; role: string; created_at: string }>;
      };
    },
    enabled: !!user,
  });

  const { data: faceUsers } = useQuery({
    queryKey: ["/admin/users"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/admin/users?limit=100"), { credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load face registry");
      return json as {
        success: boolean;
        users: Array<{ user_id: string; name?: string | null; registered_at?: string | null; face_status?: string | null }>;
        next_cursor?: string | null;
      };
    },
    enabled: !!user,
    retry: false,
  });

  const deleteFaceMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(apiUrl(`/admin/users/${encodeURIComponent(userId)}/face`), {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to delete face");
      return json as { success: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/admin/users"] });
    },
  });

  const filteredDbUsers = useMemo(() => {
    const all = dbUsers?.users ?? [];
    const q = userSearch.trim().toLowerCase();
    if (!q) return all;
    return all.filter((u) => {
      return (
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });
  }, [dbUsers?.users, userSearch]);

  async function createCompany() {
    setCompanyError(null);
    const res = await fetch(apiUrl("/admin/create-company"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: companyName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setCompanyError(data?.message || "Failed to create company");
      return;
    }

    setCompanyName("");
    void refetchStats();
  }

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

        {/* Global Analytics (basic) */}
        <CyberCard glow="primary" className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">GLOBAL ANALYTICS</h2>
            <Activity className="text-primary" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-white/10 rounded p-4">
              <p className="font-mono text-xs text-muted-foreground">COMPANIES</p>
              <p className="font-display text-2xl text-primary">{stats?.companies ?? 0}</p>
            </div>
            <div className="border border-white/10 rounded p-4">
              <p className="font-mono text-xs text-muted-foreground">JOBS</p>
              <p className="font-display text-2xl text-primary">{stats?.jobs ?? 0}</p>
            </div>
            <div className="border border-white/10 rounded p-4">
              <p className="font-mono text-xs text-muted-foreground">ASSESSMENTS</p>
              <p className="font-display text-2xl text-primary">{stats?.assessments ?? 0}</p>
            </div>
            <div className="border border-white/10 rounded p-4">
              <p className="font-mono text-xs text-muted-foreground">PROCTOR EVENTS</p>
              <p className="font-display text-2xl text-primary">{stats?.proctor_events ?? 0}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <CyberButton variant="outline" onClick={() => refetchStats()}>REFRESH</CyberButton>
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
            <div className="flex flex-col md:items-end gap-2">
              <div className="flex gap-2 justify-end">
                <CyberButton variant="secondary" onClick={logout} className="gap-2">
                  <LogOut className="w-4 h-4" /> SIGN OUT
                </CyberButton>
              </div>

              <div className="w-full md:w-auto border border-white/10 rounded p-3 mt-2">
                <p className="font-display text-sm mb-2">ORGANIZATION MANAGEMENT</p>
                <div className="flex gap-2">
                  <CyberInput
                    placeholder="Company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  <CyberButton
                    variant="outline"
                    onClick={createCompany}
                    disabled={!companyName.trim()}
                  >
                    CREATE
                  </CyberButton>
                </div>
                {companyError ? (
                  <p className="text-xs font-mono text-destructive mt-2">{companyError}</p>
                ) : null}
                <p className="text-xs font-mono text-muted-foreground mt-2">
                  Role management and detailed settings are UI stubs for now.
                </p>
              </div>
            </div>
          </div>
        </CyberCard>

        {/* User Management */}
        <CyberCard className="md:col-span-3">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <h2 className="font-display text-xl">USER MANAGEMENT</h2>
                <p className="text-xs font-mono text-muted-foreground">DATABASE USERS + FACE REGISTRY</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CyberButton variant="outline" className="gap-2" onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["/admin/db-users"] });
                queryClient.invalidateQueries({ queryKey: ["/admin/users"] });
              }}>
                <RefreshCw className="w-4 h-4" /> REFRESH
              </CyberButton>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-white/10 rounded p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="font-display text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-secondary" /> PLATFORM USERS
                </p>
                <div className="w-[220px]">
                  <CyberInput placeholder="Search username/email/role" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                </div>
              </div>

              <div className="max-h-[360px] overflow-auto border border-white/10 rounded">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-mono text-muted-foreground border-b border-white/10">
                  <div className="col-span-2">ID</div>
                  <div className="col-span-4">USERNAME</div>
                  <div className="col-span-4">EMAIL</div>
                  <div className="col-span-2">ROLE</div>
                </div>
                {(filteredDbUsers.length === 0) ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">No users found.</div>
                ) : (
                  filteredDbUsers.map((u) => (
                    <div key={u.id} className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-mono border-b border-white/5">
                      <div className="col-span-2 text-muted-foreground">{u.id}</div>
                      <div className="col-span-4 text-primary truncate">{u.username}</div>
                      <div className="col-span-4 text-muted-foreground truncate">{u.email}</div>
                      <div className="col-span-2 text-secondary truncate">{u.role}</div>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs font-mono text-muted-foreground mt-2">
                Role changes are not implemented yet (read-only list).
              </p>
            </div>

            <div className="border border-white/10 rounded p-4">
              <p className="font-display text-sm flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-accent" /> FACE REGISTRY
              </p>
              <div className="max-h-[360px] overflow-auto border border-white/10 rounded">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-mono text-muted-foreground border-b border-white/10">
                  <div className="col-span-4">USER_ID</div>
                  <div className="col-span-4">NAME</div>
                  <div className="col-span-2">STATUS</div>
                  <div className="col-span-2">ACTION</div>
                </div>
                {(faceUsers?.users?.length ?? 0) === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    {faceUsers ? "No registered faces yet." : "Face registry unavailable (missing Pinecone config)."}
                  </div>
                ) : (
                  faceUsers!.users.map((fu) => (
                    <div key={fu.user_id} className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-mono border-b border-white/5 items-center">
                      <div className="col-span-4 text-primary truncate">{fu.user_id}</div>
                      <div className="col-span-4 text-muted-foreground truncate">{fu.name || "—"}</div>
                      <div className="col-span-2 text-secondary truncate">{fu.face_status || "active"}</div>
                      <div className="col-span-2">
                        <CyberButton
                          variant="outline"
                          className="gap-2"
                          disabled={deleteFaceMutation.isPending}
                          onClick={() => deleteFaceMutation.mutate(fu.user_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </CyberButton>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs font-mono text-muted-foreground mt-2">
                Deleting a face removes the biometric record from Pinecone.
              </p>
            </div>
          </div>
        </CyberCard>
      </main>
    </div>
  );
}
