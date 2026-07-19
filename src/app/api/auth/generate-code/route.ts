import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

interface ProofEntry {
  email: string;
  expiresAt: number;
}

const proofs = new Map<string, ProofEntry>();

const PROOF_TTL_MS = 15 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [token, entry] of proofs) {
    if (entry.expiresAt < now) proofs.delete(token);
  }
}, 60_000);

export function consumeProof(token: string, email: string): boolean {
  const entry = proofs.get(token);
  if (!entry) return false;
  if (entry.email !== email) return false;
  if (entry.expiresAt < Date.now()) {
    proofs.delete(token);
    return false;
  }
  proofs.delete(token);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const token = randomBytes(32).toString("hex");
    proofs.set(token, { email, expiresAt: Date.now() + PROOF_TTL_MS });

    return NextResponse.json({ success: true, token });
  } catch (err) {
    console.error("generate-code error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
