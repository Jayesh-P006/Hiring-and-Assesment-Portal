import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { CyberButton } from "@/components/CyberButton";
import { useLogout, useUser } from "@/hooks/use-auth";
import { Loader2, LogOut, ChevronRight, Shield } from "lucide-react";

export type PortalNavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
};

export default function PortalLayout(props: {
  title: string;
  subtitle: string;
  roleLabel: string;
  nav: PortalNavItem[];
  children: ReactNode;
}) {
  const { data: user, isLoading } = useUser();
  const logout = useLogout();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1529] to-[#0a0f1e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
          <p className="font-mono text-xs text-slate-400 animate-pulse">LOADING PORTAL...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1529] to-[#0a0f1e] flex items-center justify-center p-6">
        <div className="border border-red-500/30 bg-red-500/10 rounded-xl p-8 max-w-md w-full text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="font-display text-xl text-red-400 mb-2">ACCESS DENIED</p>
          <p className="text-sm text-slate-400 mb-6">Your session has expired. Please sign in again.</p>
          <CyberButton onClick={logout}>RETURN TO LOGIN</CyberButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1529] to-[#0a0f1e]">
      {/* Top bar */}
      <div className="border-b border-white/[0.08] bg-[#0c1322]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-blue-400/40 flex items-center justify-center">
              <span className="font-display text-blue-300 text-sm font-bold">H</span>
            </div>
            <div>
              <h1 className="text-sm font-display text-blue-300 tracking-widest leading-none">{props.title}</h1>
              <p className="font-mono text-[11px] text-slate-400 leading-none mt-0.5">{props.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-8 h-8 rounded-lg border border-white/[0.1] flex items-center justify-center cursor-pointer hover:border-white/20 transition-colors">
              <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]" />
            </div>
            <div className="h-8 w-px bg-white/[0.08]" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-mono text-xs text-slate-200 leading-none">{user.username}</p>
                <p className="font-mono text-[11px] text-cyan-400 leading-none mt-0.5">{props.roleLabel}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 border border-blue-400/50 flex items-center justify-center font-display font-bold text-blue-200 text-sm shadow-[0_0_12px_rgba(96,165,250,0.2)]">
                {user.username[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="grid md:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="md:sticky md:top-[88px] h-fit">
            <nav className="flex flex-col gap-1">
              {props.nav.map((item) => {
                const active =
                  location === item.href ||
                  (item.href !== "/dashboard/candidate/profile" && location.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={
                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-mono transition-all duration-200 " +
                        (active
                          ? "bg-blue-500/15 text-blue-300 border border-blue-400/30 shadow-[0_0_16px_rgba(96,165,250,0.1)]"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-transparent")
                      }
                    >
                      <span
                        className={
                          "w-5 h-5 flex items-center justify-center transition-colors " +
                          (active ? "text-blue-300" : "text-slate-500 group-hover:text-slate-300")
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="tracking-wider flex-1">{item.label}</span>
                      {active && <ChevronRight className="w-3.5 h-3.5 text-blue-400/70" />}
                    </a>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-mono text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/25 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="tracking-wider">SIGN OUT</span>
              </button>
            </div>

            {/* Mini info */}
            <div className="mt-6 border border-white/[0.08] rounded-lg p-3 bg-slate-800/30">
              <p className="font-mono text-[11px] text-slate-400 mb-2 tracking-wider">QUICK INFO</p>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Face ID</span>
                  <span className={(user as any)?.faceEmbedding ? "text-emerald-400" : "text-amber-400"}>
                    {(user as any)?.faceEmbedding ? "Verified" : "Not Set"}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Role</span>
                  <span className="text-cyan-400">{props.roleLabel}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="min-w-0 min-h-[calc(100vh-128px)]">{props.children}</main>
        </div>
      </div>
    </div>
  );
}
