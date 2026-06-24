"use server";

import { createHmac } from "crypto";
import { headers } from "next/headers";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { sendEmail } from "../../../lib/email";

function createToken(userId: string, newEmail: string): string {
  const payload = Buffer.from(
    JSON.stringify({ userId, newEmail, exp: Date.now() + 15 * 60 * 1000 })
  ).toString("base64url");

  const secret = process.env.BETTER_AUTH_SECRET ?? "dev-secret";
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export async function requestEmailChange(newEmail: string): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");

  const token = createToken(session.user.id, newEmail);
  const base = process.env.BASE_URL ?? "http://localhost:3000";
  const url = `${base}/api/confirm-email?token=${token}`;

  await sendEmail({
    to: session.user.email,
    subject: "Confirm your email change – CRA Solutions",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <tr>
          <td style="background:#111111;padding:28px 40px;">
            <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-.3px;">CRA Solutions</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 32px;">
            <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#111;letter-spacing:-.3px;">Confirm your email change</h1>
            <p style="margin:0 0 10px;font-size:15px;color:#444;line-height:1.65;">Hi <strong>${session.user.name ?? "there"}</strong>,</p>
            <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.65;">
              We received a request to change your account email to
              <strong style="color:#111;">${newEmail}</strong>.
              Click the button below to confirm this change.
            </p>
            <a href="${url}" style="display:inline-block;background:#111111;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;">
              Confirm email change
            </a>
            <p style="margin:28px 0 0;font-size:13px;color:#888;line-height:1.6;">
              This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 32px;">
            <p style="margin:0;font-size:12px;color:#aaa;">Or copy this link:<br>
              <span style="color:#666;word-break:break-all;">${url}</span>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8f8f8;padding:20px 40px;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#aaa;text-align:center;">
              © ${new Date().getFullYear()} CRA Solutions &nbsp;·&nbsp; This email was sent because you requested an email change.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function deleteAccount(): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");

  await prisma.user.delete({ where: { id: session.user.id } });
}
