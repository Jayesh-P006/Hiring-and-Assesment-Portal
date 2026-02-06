import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { CyberButton } from "@/components/CyberButton";
import { useLogout, useUser } from "@/hooks/use-auth";
import { Loader2, LogOut } from "lucide-react";

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
      <div className="min-h-screen bg-black flex items-center justify-center text-primary">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="border border-white/10 rounded p-6 max-w-md w-full text-center">
          <p className="font-display text-xl text-red-500 mb-2">ACCESS DENIED</p>
          <p className="text-sm text-muted-foreground mb-4">Session expired or invalid.</p>
          <CyberButton onClick={logout}>RETURN TO LOGIN</CyberButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6">
        <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-display text-primary tracking-widest">{props.title}</h1>
            <p className="font-mono text-xs text-muted-foreground">{props.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="font-mono text-sm text-primary">{user.username}</p>
              <p className="font-mono text-xs text-muted-foreground">{props.roleLabel}</p>
            </div>
            <div className="w-10 h-10 rounded bg-primary/20 border border-primary flex items-center justify-center font-display font-bold text-primary">
              {user.username[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-[260px_1fr] gap-6">
          <aside className="border border-white/10 rounded p-3 h-fit">
            <nav className="flex flex-col gap-2">
              {props.nav.map((item) => {
                const active = location === item.href || location.startsWith(item.href + "/");
                return (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={
                        "flex items-center gap-3 rounded px-3 py-2 border font-mono text-xs " +
                        (active
                          ? "border-primary/50 bg-primary/10 text-primary"
                          : "border-white/10 hover:border-white/20 text-muted-foreground")
                      }
                    >
                      <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
                      <span className="tracking-wider">{item.label}</span>
                    </a>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-white/10">
              <CyberButton variant="secondary" onClick={logout} className="w-full gap-2">
                <LogOut className="w-4 h-4" /> SIGN OUT
              </CyberButton>
            </div>
          </aside>

          <section className="min-w-0">{props.children}</section>
        </div>
      </div>
    </div>
  );
}
