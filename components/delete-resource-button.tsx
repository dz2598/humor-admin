"use client";

import { useTransition } from "react";
import { deleteResource } from "@/app/actions";

export function DeleteResourceButton({ resource, id }: { resource: string; id: number }) {
  const [pending, startTransition] = useTransition();
  return <button className="danger-button" type="button" disabled={pending} onClick={() => {
    if (!window.confirm("Delete this record permanently?")) return;
    startTransition(() => deleteResource(resource, id));
  }}>{pending ? "Deleting…" : "Delete"}</button>;
}
