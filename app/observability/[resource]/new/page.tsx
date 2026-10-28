import { notFound } from "next/navigation";
import { createResource } from "@/app/actions";
import { AdminShell } from "@/components/admin-shell";
import { ResourceForm } from "@/components/resource-form";
import { requireAdmin } from "@/lib/auth";
import { getAdminResource } from "@/lib/admin-resources";

export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource: slug } = await params; const resource = getAdminResource(slug);
  if (!resource || resource.mode !== "crud") notFound();
  const { profile } = await requireAdmin(); const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  return <AdminShell active={`/observability/${slug}`} name={name}><header className="page-header"><div><p className="eyebrow">NEW RECORD</p><h1>Create {resource.singular}</h1><p>{resource.description}</p></div></header><section className="panel editor-panel"><ResourceForm resource={resource} action={createResource.bind(null, slug)} submitLabel={`Create ${resource.singular}`} /></section></AdminShell>;
}
