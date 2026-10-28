import { notFound } from "next/navigation";
import { updateResource } from "@/app/actions";
import { AdminShell } from "@/components/admin-shell";
import { ResourceForm } from "@/components/resource-form";
import { requireAdmin } from "@/lib/auth";
import { getAdminResource } from "@/lib/admin-resources";

export default async function EditResourcePage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource: slug, id } = await params; const resource = getAdminResource(slug);
  if (!resource || resource.mode === "read") notFound();
  const { supabase, profile } = await requireAdmin(); const { data } = await supabase.from(resource.table).select("*").eq("id", id).single();
  if (!data) notFound();
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  return <AdminShell active={`/observability/${slug}`} name={name}><header className="page-header"><div><p className="eyebrow">EDIT RECORD #{id}</p><h1>Edit {resource.singular}</h1><p>{resource.description}</p></div></header><section className="panel editor-panel"><ResourceForm resource={resource} row={data} action={updateResource.bind(null, slug, Number(id))} submitLabel="Save changes" /></section></AdminShell>;
}
