"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AdminImageField({ defaultValue = "" }: { defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [status, setStatus] = useState("");

  async function upload(file: File | undefined) {
    if (!file) return;
    setStatus("Uploading image…");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setStatus("Please log in again."); return; }
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
    const path = `${user.id}/admin-${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from("memes").upload(path, file);
    if (error) { setStatus(error.message); return; }
    const { data } = supabase.storage.from("memes").getPublicUrl(path);
    setUrl(data.publicUrl); setStatus("Upload complete. The new URL is ready to save.");
  }

  return <label>Image
    <span>Upload a new PNG, JPG, WEBP, or GIF, or paste an existing public URL.</span>
    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={event => upload(event.target.files?.[0])} />
    <input required name="image_url" type="url" value={url} onChange={event => setUrl(event.target.value)} placeholder="https://…" />
    {status && <small className="field-status">{status}</small>}
  </label>;
}
