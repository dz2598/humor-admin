import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export function AdminShell({ children, active, name }: { children: React.ReactNode; active: string; name?: string }) {
  const groups = [
    { label: "Archive", links: [["/", "Overview"], ["/profiles", "Users / profiles"], ["/memes", "AI media"], ["/votes", "Vote log"]] },
    { label: "Prompt system", links: [["/observability/prompt-chains", "Prompt chains"], ["/observability/prompt-chain-steps", "Chain steps"], ["/observability/prompt-chain-mix", "Chain mix"], ["/observability/terms", "Terms"]] },
    { label: "Generation", links: [["/observability/generation-requests", "Requests"], ["/observability/generation-examples", "Examples"], ["/observability/llm-responses", "LLM responses"]] },
    { label: "Models & access", links: [["/observability/llm-models", "LLM models"], ["/observability/llm-providers", "LLM providers"], ["/observability/signup-domains", "Signup domains"], ["/observability/whitelisted-emails", "Allowed e-mails"]] },
  ];
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div>
          <p className="brand-mark">C//LOL</p>
          <p className="brand-sub">ADMIN ARCHIVE</p>
        </div>
        <nav>{groups.map(group => <div className="nav-group" key={group.label}><span>{group.label}</span>{group.links.map(([href, label]) => <Link key={href} className={active === href ? "active" : ""} href={href}>{label}</Link>)}</div>)}</nav>
        <div className="sidebar-foot"><span>{name || "Administrator"}</span><LogoutButton /></div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
