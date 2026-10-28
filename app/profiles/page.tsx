import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";

type Profile = Record<string, unknown>;
export default async function ProfilesPage() {
  const { supabase, profile } = await requireAdmin();
  const { data } = await supabase.from("profiles").select("*").order("updated_at", { ascending: false });
  const rows = (data || []) as Profile[];
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  return <AdminShell active="/profiles" name={name}><header className="page-header"><div><p className="eyebrow">READ ONLY</p><h1>Users / profiles</h1><p>{rows.length} identities connected to the archive.</p></div></header>
    <section className="panel table-panel"><table><thead><tr><th>User</th><th>ID</th><th>Last updated</th><th>Access</th></tr></thead><tbody>{rows.map(row => <tr key={String(row.id)}><td><b>{[row.first_name, row.last_name].filter(Boolean).join(" ") || "Unnamed user"}</b></td><td className="mono">{String(row.id)}</td><td>{row.updated_at ? new Date(String(row.updated_at)).toLocaleString() : "—"}</td><td>{row.is_superadmin ? <span className="badge admin">Superadmin</span> : <span className="badge">User</span>}</td></tr>)}</tbody></table></section>
  </AdminShell>;
}
