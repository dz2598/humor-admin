import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export function AdminShell({ children, active, name }: { children: React.ReactNode; active: string; name?: string }) {
  const links = [["/", "Overview"], ["/profiles", "Profiles"], ["/memes", "Meme records"], ["/votes", "Vote log"]];
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div>
          <p className="brand-mark">C//LOL</p>
          <p className="brand-sub">ADMIN ARCHIVE</p>
        </div>
        <nav>{links.map(([href, label]) => <Link key={href} className={active === href ? "active" : ""} href={href}>{label}</Link>)}</nav>
        <div className="sidebar-foot"><span>{name || "Administrator"}</span><LogoutButton /></div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
