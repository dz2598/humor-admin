import { createMeme } from "@/app/actions";
import { AdminShell } from "@/components/admin-shell";
import { MemeForm } from "@/components/meme-form";
import { requireAdmin } from "@/lib/auth";

export default async function NewMemePage() { const { profile } = await requireAdmin(); const name = [profile.first_name, profile.last_name].filter(Boolean).join(" "); return <AdminShell active="/memes" name={name}><header className="page-header"><div><p className="eyebrow">NEW EVIDENCE</p><h1>Create meme record</h1><p>Add an item directly to the shared Campus LOL database.</p></div></header><section className="panel editor-panel"><MemeForm action={createMeme} submitLabel="Create record" /></section></AdminShell>; }
