import { notFound } from "next/navigation";
import { updateMeme } from "@/app/actions";
import { AdminShell } from "@/components/admin-shell";
import { MemeForm } from "@/components/meme-form";
import { requireAdmin } from "@/lib/auth";

export default async function EditMemePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const { supabase, profile } = await requireAdmin(); const { data } = await supabase.from("memes").select("*").eq("id", id).single(); if (!data) notFound(); const name = [profile.first_name, profile.last_name].filter(Boolean).join(" "); const action = updateMeme.bind(null, Number(id)); return <AdminShell active="/memes" name={name}><header className="page-header"><div><p className="eyebrow">EVIDENCE_{id.padStart(3,"0")}</p><h1>Edit meme record</h1><p>Changes will appear in the main meme board.</p></div></header><section className="panel editor-panel"><MemeForm action={action} meme={data} submitLabel="Save changes" /></section></AdminShell>; }
