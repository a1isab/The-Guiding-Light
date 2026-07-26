import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";

interface ProofEntry {
  email: string;
  code: string;
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

export function getProofCode(token: string, email: string): string | null {
  const entry = proofs.get(token);
  if (!entry) return null;
  if (entry.email !== email) return null;
  if (entry.expiresAt < Date.now()) {
    proofs.delete(token);
    return null;
  }
  return entry.code;
}

function generateCode(): string {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
}

async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set. Cannot send verification email.");
    return false;
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "The Guiding Light <onboarding@resend.dev>",
      to: email,
      subject: "Your verification code",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 32px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Verify your email</h1>
          <p style="color: #555; margin-bottom: 24px;">Enter this 6-digit code to verify your account:</p>
          <div style="background: #f5f5f5; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; font-family: monospace; color: #0A0D12;">${code}</span>
          </div>
          <p style="color: #999; font-size: 13px;">This code expires in 15 minutes. If you didn't create an account, you can ignore this email.</p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("Failed to send verification email:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const token = randomBytes(32).toString("hex");
    const code = generateCode();
    proofs.set(token, { email, code, expiresAt: Date.now() + PROOF_TTL_MS });

    const emailSent = await sendVerificationEmail(email, code);
    if (!emailSent) {
      proofs.delete(token);
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, token });
  } catch (err) {
    console.error("generate-code error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
