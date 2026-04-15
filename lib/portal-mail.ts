import nodemailer from "nodemailer"

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASSWORD &&
      process.env.SMTP_FROM?.trim()
  )
}

export function isSmtpConfigured() {
  return smtpConfigured()
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function buildPortalOtpHtml(code: string) {
  const safeCode = escapeHtml(code)
  const bg = "#FFF8F3"
  const card = "#FFFFFF"
  const text = "#5C5F62"
  const muted = "#7A7D80"
  const accent = "#B8956A"
  const border = "#EAD8DC"
  const heading = "#3D4043"

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Azure Botanicals</title>
</head>
<body style="margin:0;padding:0;background-color:${bg};-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${bg};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:${card};border-radius:16px;border:1px solid ${border};overflow:hidden;box-shadow:0 4px 24px rgba(61,64,67,0.06);">
          <tr>
            <td style="padding:36px 40px 28px 40px;text-align:center;border-bottom:1px solid ${border};">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;letter-spacing:0.02em;color:${heading};line-height:1.3;">
                Azure Botanicals
              </p>
              <p style="margin:10px 0 0 0;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${accent};">
                Admin portal
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px 40px 40px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
              <p style="margin:0 0 16px 0;font-size:16px;line-height:1.55;color:${text};">
                Use this one-time code to finish signing in:
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding:24px 16px;background-color:${bg};border-radius:12px;border:1px solid ${border};">
                    <p style="margin:0;font-family:ui-monospace,'Cascadia Code',Consolas,monospace;font-size:28px;font-weight:600;letter-spacing:0.35em;color:${heading};">
                      ${safeCode}
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0 0;font-size:14px;line-height:1.55;color:${muted};">
                This code expires in <strong style="color:${text};font-weight:600;">10 minutes</strong>. If you did not request access to the portal, you can ignore this message.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 32px 40px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
              <p style="margin:0;padding-top:20px;border-top:1px solid ${border};font-size:12px;line-height:1.5;color:${muted};text-align:center;">
                Azure Botanicals · Luxury plants &amp; flowers
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendPortalOtpEmail(to: string, code: string) {
  if (!smtpConfigured()) {
    throw new Error("SMTP is not configured.")
  }
  const host = process.env.SMTP_HOST!.trim()
  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10)
  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465
  const user = process.env.SMTP_USER!.trim()
  const pass = process.env.SMTP_PASSWORD!
  const from = process.env.SMTP_FROM!.trim()

  const transporter = nodemailer.createTransport({
    host,
    port: Number.isFinite(port) ? port : 587,
    secure,
    auth: { user, pass },
  })

  const textBody = `Azure Botanicals — portal sign-in\n\nYour one-time code is: ${code}\n\nIt expires in 10 minutes. If you did not request this, ignore this email.`

  await transporter.sendMail({
    from,
    to,
    subject: "Azure Botanicals — Your portal sign-in code",
    text: textBody,
    html: buildPortalOtpHtml(code),
  })
}
