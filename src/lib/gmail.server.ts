const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64");
const header = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);

export async function sendGmail(to: string, subject: string, body: string, html?: string) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const gmailKey = process.env["GOOGLE_MAIL_API_KEY"];
  if (!lovableKey || !gmailKey) throw new Error("Gmail is not connected");
  const boundary = `ps_${Date.now().toString(36)}`;
  const lines = html
    ? [
        `To: ${to}`,
        `From: ${header("Prison Stream")} <me>`.replace(" <me>", ""),
        `Subject: ${header(subject)}`,
        "MIME-Version: 1.0",
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        "",
        `--${boundary}`,
        'Content-Type: text/plain; charset="UTF-8"',
        "Content-Transfer-Encoding: base64",
        "",
        b64(body),
        `--${boundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        "Content-Transfer-Encoding: base64",
        "",
        b64(html),
        `--${boundary}--`,
      ].filter((l) => !l.startsWith("From:"))
    : [`To: ${to}`, `Subject: ${header(subject)}`, "MIME-Version: 1.0", 'Content-Type: text/plain; charset="UTF-8"', "", body];
  const raw = b64(lines.join("\r\n")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": gmailKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Gmail send failed [${res.status}]: ${text}`);
    throw new Error(`Email failed to send [${res.status}]`);
  }
}
