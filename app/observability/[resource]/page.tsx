import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { DeleteResourceButton } from "@/components/delete-resource-button";
import { openSignupToEveryone } from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import { getAdminResource } from "@/lib/admin-resources";

type Row = Record<string, unknown>;

function display(value: unknown) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) return new Date(value).toLocaleString();
  return String(value);
}

export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource: slug } = await params;
  const resource = getAdminResource(slug);
  if (!resource) notFound();
  const { supabase, profile } = await requireAdmin();
  const { data, error } = await supabase.from(resource.table).select("*").order(resource.orderBy || "id", { ascending: false });
  const rows = (data || []) as Row[];
  const signupOpen = slug === "signup-domains" && rows.some(row => row.domain === "*" && row.enabled === true);
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  return <AdminShell active={`/observability/${slug}`} name={name}>
    <header className="page-header"><div><p className="eyebrow">{resource.eyebrow}</p><h1>{resource.title}</h1><p>{resource.description}</p></div>{resource.mode === "crud" && <Link className="primary-button" href={`/observability/${slug}/new`}>+ New {resource.singular}</Link>}</header>
    {!error && slug === "signup-domains" && <section className="panel setup-notice"><p className="eyebrow">REGISTRATION STATUS</p><h2>{signupOpen ? "Open to everyone" : "Limited by e-mail domain"}</h2><p>{signupOpen ? "Any Google e-mail domain may sign up for the user website. Admin access is still limited to superadmins." : "Add the wildcard rule to allow anyone with a Google account to sign up."}</p>{!signupOpen && <form action={openSignupToEveryone}><button className="primary-button" type="submit">Allow all e-mail domains</button></form>}</section>}
    {error ? <section className="panel setup-notice"><p className="eyebrow danger">DATABASE SETUP REQUIRED</p><h2>{resource.title} is not available yet.</h2><p>Run <code>supabase/week-7-observability.sql</code> in the Supabase SQL Editor, then refresh this page.</p><small>{error.message}</small></section> :
      <section className="panel table-panel"><table><thead><tr>{resource.columns.map(column => <th key={column.name}>{column.label}</th>)}{resource.mode !== "read" && <th>Actions</th>}</tr></thead><tbody>{rows.map((row, index) => <tr key={String(row.id ?? index)}>{resource.columns.map(column => <td key={column.name} className={column.name.includes("prompt") || column.name.includes("response") || column.name.includes("url") ? "mono wide" : ""}>{display(row[column.name])}</td>)}{resource.mode !== "read" && <td><div className="record-actions"><Link className="secondary-button" href={`/observability/${slug}/${row.id}/edit`}>Edit</Link>{resource.mode === "crud" && <DeleteResourceButton resource={slug} id={Number(row.id)} />}</div></td>}</tr>)}</tbody></table>{rows.length === 0 && <p className="empty table-empty">No records yet.</p>}</section>}
  </AdminShell>;
}
