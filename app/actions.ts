"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAdminResource } from "@/lib/admin-resources";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createMeme(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("memes").insert({
    image_url: text(formData, "image_url"),
    caption: text(formData, "caption"),
    prompt: text(formData, "prompt") || null,
    explanation: text(formData, "explanation") || null,
    user_id: text(formData, "user_id") || user.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/"); revalidatePath("/memes");
  redirect("/memes");
}

export async function updateMeme(id: number, formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("memes").update({
    image_url: text(formData, "image_url"),
    caption: text(formData, "caption"),
    prompt: text(formData, "prompt") || null,
    explanation: text(formData, "explanation") || null,
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/"); revalidatePath("/memes");
  redirect("/memes");
}

export async function deleteMeme(id: number) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("memes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/"); revalidatePath("/memes"); revalidatePath("/votes");
}

function resourcePayload(slug: string, formData: FormData) {
  const resource = getAdminResource(slug);
  if (!resource || resource.mode === "read") throw new Error("This resource is read only.");
  return Object.fromEntries(resource.fields.map(field => {
    const raw = formData.get(field.name);
    if (field.kind === "checkbox") return [field.name, raw === "on"];
    if (field.kind === "number") return [field.name, raw === "" || raw === null ? null : Number(raw)];
    const normalized = typeof raw === "string" ? raw.trim() : "";
    return [field.name, normalized || null];
  }));
}

export async function createResource(slug: string, formData: FormData) {
  const resource = getAdminResource(slug);
  if (!resource || resource.mode !== "crud") throw new Error("This resource cannot be created.");
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(resource.table).insert(resourcePayload(slug, formData));
  if (error) throw new Error(error.message);
  revalidatePath(`/observability/${slug}`);
  redirect(`/observability/${slug}`);
}

export async function updateResource(slug: string, id: number, formData: FormData) {
  const resource = getAdminResource(slug);
  if (!resource || resource.mode === "read") throw new Error("This resource cannot be updated.");
  const { supabase } = await requireAdmin();
  const payload = resource.table === "prompt_chain_steps"
    ? resourcePayload(slug, formData)
    : { ...resourcePayload(slug, formData), updated_at: new Date().toISOString() };
  const { error } = await supabase.from(resource.table).update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/observability/${slug}`);
  redirect(`/observability/${slug}`);
}

export async function deleteResource(slug: string, id: number) {
  const resource = getAdminResource(slug);
  if (!resource || resource.mode !== "crud") throw new Error("This resource cannot be deleted.");
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(resource.table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/observability/${slug}`);
}

export async function openSignupToEveryone() {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("allowed_signup_domains")
    .upsert({ domain: "*", enabled: true }, { onConflict: "domain" });
  if (error) throw new Error(error.message);
  revalidatePath("/observability/signup-domains");
  redirect("/observability/signup-domains");
}
