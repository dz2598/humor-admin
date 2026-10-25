"use client";

import { useTransition } from "react";
import { deleteMeme } from "@/app/actions";

export function DeleteMemeButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();
  return <button className="danger-button" disabled={pending} onClick={() => {
    if (window.confirm("Delete this meme record? This cannot be undone.")) startTransition(() => deleteMeme(id));
  }}>{pending ? "Deleting…" : "Delete"}</button>;
}
