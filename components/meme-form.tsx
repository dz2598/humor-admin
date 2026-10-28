import Link from "next/link";
import { AdminImageField } from "@/components/admin-image-field";

type Meme = { image_url?: string | null; caption?: string | null; prompt?: string | null; explanation?: string | null; user_id?: string | null };

export function MemeForm({ action, meme, submitLabel }: { action: (data: FormData) => void | Promise<void>; meme?: Meme; submitLabel: string }) {
  return <form action={action} className="editor-form">
    <AdminImageField defaultValue={meme?.image_url || ""} />
    <label>Caption<textarea required name="caption" rows={3} defaultValue={meme?.caption || ""} /></label>
    <label>Description <span>(recommended, but optional)</span><textarea name="prompt" rows={3} defaultValue={meme?.prompt || ""} /></label>
    <label>Explanation<textarea name="explanation" rows={4} defaultValue={meme?.explanation || ""} /></label>
    {!meme && <label>Creator user ID <span>(optional)</span><input name="user_id" defaultValue="" placeholder="Defaults to your administrator ID" /></label>}
    <div className="form-actions"><button className="primary-button" type="submit">{submitLabel}</button><Link className="secondary-button" href="/memes">Cancel</Link></div>
  </form>;
}
