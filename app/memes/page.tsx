import Image from "next/image";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { DeleteMemeButton } from "@/components/delete-meme-button";
import { requireAdmin } from "@/lib/auth";

type Meme = Record<string, unknown>;
export default async function MemesPage() {
  const { supabase, profile } = await requireAdmin();
  const { data } = await supabase.from("memes").select("*").order("created_at", { ascending: false });
  const rows = (data || []) as Meme[]; const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  return <AdminShell active="/memes" name={name}><header className="page-header"><div><p className="eyebrow">FULL CONTROL</p><h1>Meme records</h1><p>Create, inspect, edit, or remove AI-generated media.</p></div><Link className="primary-button" href="/memes/new">+ New record</Link></header>
    <section className="record-list">{rows.map(meme => <article key={String(meme.id)} className="meme-row">{typeof meme.image_url === "string" && <Image src={meme.image_url} alt="Meme" width={170} height={128} unoptimized />}<div className="record-copy"><span className="eyebrow">EVIDENCE_{String(meme.id).padStart(3,"0")}</span><h2>{String(meme.caption || "Untitled")}</h2><p>{String(meme.prompt || meme.explanation || "No supporting context")}</p><small>{meme.created_at ? new Date(String(meme.created_at)).toLocaleString() : "Unknown date"}</small></div><div className="record-actions"><Link className="secondary-button" href={`/memes/${meme.id}/edit`}>Edit</Link><DeleteMemeButton id={Number(meme.id)} /></div></article>)}</section>
  </AdminShell>;
}
