// lib/auth.ts

import { prisma } from './prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { sendEmail } from './email';

export const auth = betterAuth({
  baseURL: process.env.BASE_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [
    process.env.BASE_URL ?? 'http://localhost:3000',
  ],
  plugins: [
    nextCookies(),
  ],
  emailVerification: {
    // Sends the verification link to the NEW email address — clicking it finalises the change.
    sendVerificationEmail: async ({ user, url }) => {
      // In the changeEmail flow, better-auth passes the NEW email as user.email.
      // The DB still holds the current email — use it so Resend accepts the send.
      const currentUser = await prisma.user.findUnique({ where: { id: user.id } });
      const sendTo = currentUser?.email ?? user.email;
      await sendEmail({
        to: sendTo,
        subject: 'Verify your new email address – CRA Solutions',
        html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:28px 40px;">
            <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-.3px;">CRA Solutions</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#111;letter-spacing:-.3px;">Verify your new email</h1>
            <p style="margin:0 0 10px;font-size:15px;color:#444;line-height:1.65;">Hi <strong>${user.name ?? 'there'}</strong>,</p>
            <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.65;">
              Click the button below to finalise the change. Your account email will be updated to
              <strong style="color:#111;">${user.email}</strong>.
            </p>
            <a href="${url}"
               style="display:inline-block;background:#111111;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;">
              Confirm new email
            </a>
            <p style="margin:28px 0 0;font-size:13px;color:#888;line-height:1.6;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </td>
        </tr>

        <!-- URL fallback -->
        <tr>
          <td style="padding:0 40px 32px;">
            <p style="margin:0;font-size:12px;color:#aaa;">Or copy this link:<br>
              <span style="color:#666;word-break:break-all;">${url}</span>
            </p>
          </td>
        </tr>

        <!-- Footer -->
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
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        await sendEmail({
          to: user.email,
          subject: 'Confirm your email change – CRA Solutions',
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
            <p style="margin:0 0 10px;font-size:15px;color:#444;line-height:1.65;">Hi <strong>${user.name ?? 'there'}</strong>,</p>
            <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.65;">
              We received a request to change your account email to
              <strong style="color:#111;">${newEmail}</strong>.
              Click below to approve — a verification link will then be sent to your new address.
            </p>
            <a href="${url}" style="display:inline-block;background:#111111;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;">
              Approve email change
            </a>
            <p style="margin:28px 0 0;font-size:13px;color:#888;line-height:1.6;">
              If you didn't request this, you can safely ignore this email.
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
      },
    },
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'MEMBER',
      },
    },
  },
});
