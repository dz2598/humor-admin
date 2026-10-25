"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

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
