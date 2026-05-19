export const dynamic = "force-dynamic";

import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

type TokenPayload = { userId: string; newEmail: string; exp: number };

function verifyToken(token: string): TokenPayload | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;

  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const secret = process.env.BETTER_AUTH_SECRET ?? "dev-secret";
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  if (sig !== expected) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as TokenPayload;
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const base = new URL(request.url).origin;
  const token = request.nextUrl.searchParams.get("token");

  if (!token) return NextResponse.redirect(`${base}/account`);

  const data = verifyToken(token);
  if (!data) return NextResponse.redirect(`${base}/account`);

  await prisma.user.update({
    where: { id: data.userId },
    data: { email: data.newEmail },
  });

  return NextResponse.redirect(`${base}/account/email-updated`);
}
