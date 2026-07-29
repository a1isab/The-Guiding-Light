#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { parse } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read env from .env.local
const envPath = resolve(__dirname, "..", ".env.local");
let SUPA_URL = "https://vpqfvranmdhsxfsynvbw.supabase.co";
let SUPA_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWZ2cmFubWRoc3hmc3ludmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4ODQxMDAsImV4cCI6MjA5NzQ2MDEwMH0.6QF9SFBcl_c5xFVKxYBduVZuXGRjDqrA_AtFyX4O_gM";
if (existsSync(envPath)) {
  try {
    const env = parse(readFileSync(envPath, "utf-8"));
    if (env.NEXT_PUBLIC_SUPABASE_URL) SUPA_URL = env.NEXT_PUBLIC_SUPABASE_URL;
    if (env.NEXT_PUBLIC_SUPABASE_ANON_KEY) SUPA_ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  } catch {}
}

const ACCOUNTS = [
  { email: "student@theguidinglight.com", password: "Student123!" },
  { email: "teacher@theguidinglight.com", password: "Teacher123!" },
  { email: "admin@theguidinglight.com", password: "Admin123!" },
];

async function cacheTokens() {
  const fixturesPath = resolve(__dirname, "..", "tests", "e2e", "fixtures", "auth-tokens.json");
  const supabase = createClient(SUPA_URL, SUPA_ANON);
  const tokens = {};

  for (const { email, password } of ACCOUNTS) {
    process.stdout.write(`Logging in as ${email}... `);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      console.error(`FAILED: ${error?.message ?? "no session"}`);
      tokens[email] = null;
      continue;
    }
    tokens[email] = {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user_id: data.session.user.id,
      expires_at: data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
    };
    console.log("OK");
  }

  writeFileSync(fixturesPath, JSON.stringify(tokens, null, 2) + "\n");
  console.log(`\nWrote ${fixturesPath}`);
}

cacheTokens().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
