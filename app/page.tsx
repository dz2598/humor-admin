import Image from "next/image";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";

type Row = Record<string, unknown>;
const value = (n: unknown) => typeof n === "number" ? n : Number(n) || 0;

export default async function Dashboard() {
  const { supabase, profile } = await requireAdmin();
  const [{ data: profiles }, { data: memes }, { data: votes }] = await Promise.all([
    supabase.from("profiles").select("*"),
    supabase.from("memes").select("*").order("created_at", { ascending: false }),
    supabase.from("votes").select("*"),
  ]);
  const memeRows = (memes || []) as Row[];
  const voteRows = (votes || []) as Row[];
  const scores = new Map<string, { up: number; down: number }>();
  voteRows.forEach(v => {
    const id = String(v.meme_id); const score = scores.get(id) || { up: 0, down: 0 };
    if (value(v.vote_value) > 0) score.up++;
    else score.down++;
    scores.set(id, score);
  });
  const ranked = [...scores.entries()].sort((a, b) => (b[1].up - b[1].down) - (a[1].up - a[1].down));
  const bestId = ranked[0]?.[0];
  const best = memeRows.find(m => String(m.id) === bestId);
  const averageEngagement = memeRows.length ? voteRows.length / memeRows.length : 0;
  const activeMemes = new Set(voteRows.map(v => String(v.meme_id))).size;
  const activeRate = memeRows.length ? Math.round(activeMemes / memeRows.length * 100) : 0;
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  return <AdminShell active="/" name={name}>
    <header className="page-header"><div><p className="eyebrow">LIVE DATABASE</p><h1>Archive overview</h1><p>Signals from the Campus LOL evidence collection.</p></div><Link className="primary-button" href="/memes/new">+ New meme record</Link></header>
    <section className="stats-grid">
      <article><span>Profiles</span><strong>{profiles?.length || 0}</strong><small>registered identities</small></article>
      <article><span>Meme records</span><strong>{memeRows.length}</strong><small>stored evidence</small></article>
      <article><span>Avg. engagement / meme</span><strong>{averageEngagement.toFixed(1)}</strong><small>{voteRows.length} interactions across all memes</small></article>
      <article><span>Active memes</span><strong>{activeRate}%</strong><small>{activeMemes} of {memeRows.length} received interaction</small></article>
    </section>
    <section className="dashboard-grid">
      <article className="panel"><div className="panel-heading"><div><p className="eyebrow">TOP SIGNAL</p><h2>Most approved evidence</h2></div><Link href="/votes">View vote log →</Link></div>
        {best ? <div className="featured-meme">{typeof best.image_url === "string" && <Image src={best.image_url} alt="Top voted meme" width={260} height={190} unoptimized />}<div><p>{String(best.caption || "Untitled")}</p><span>Score: {(scores.get(String(best.id))?.up || 0) - (scores.get(String(best.id))?.down || 0)}</span></div></div> : <p className="empty">No votes have been recorded yet.</p>}
      </article>
      <article className="panel"><div className="panel-heading"><div><p className="eyebrow">RECENT INTAKE</p><h2>Latest records</h2></div><Link href="/memes">Manage all →</Link></div>
        <div className="activity-list">{memeRows.slice(0, 5).map(m => <Link key={String(m.id)} href={`/memes/${m.id}/edit`}><span>#{String(m.id).padStart(3,"0")}</span><b>{String(m.caption || "Untitled")}</b><time>{m.created_at ? new Date(String(m.created_at)).toLocaleDateString() : "—"}</time></Link>)}</div>
      </article>
    </section>
  </AdminShell>;
}
