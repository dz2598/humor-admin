"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
  }

  return (
    <main className="auth-shell">
      <section className="login-card">
        <p className="eyebrow">RESTRICTED SYSTEM</p>
        <h1>Campus LOL<br />Admin Archive</h1>
        <p className="muted">Moderate evidence, inspect activity, and manage the meme database.</p>
        <button className="primary-button" onClick={signIn} disabled={loading}>
          {loading ? "Connecting…" : "Continue with Google"}
        </button>
        <p className="microcopy">Authorized superadmins only.</p>
      </section>
    </main>
  );
}
