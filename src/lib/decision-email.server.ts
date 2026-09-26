import logo from "@/assets/ps-email-logo.png.asset.json";

const PUBLIC_ORIGIN = "https://project--73781519-bd03-4c41-87d9-5a00cd943a4d.lovable.app";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export type Decision = "ACCEPTED" | "REJECTED";

export function buildDecisionEmail(decision: Decision, fullName: string | null | undefined) {
  const first = (fullName ?? "").trim().split(/\s+/)[0] ?? "";
  const greet = first ? `Hi ${first},` : "Hi there,";
  const ok = decision === "ACCEPTED";
  const accent = ok ? "#3f9a5c" : "#9a3a3a";
  const subject = ok ? "PRISON STREAM — APPLICATION ACCEPTED" : "PRISON STREAM — APPLICATION UPDATE";
  const headline = ok ? "ACCESS APPROVED" : "ACCESS DENIED";
  const paras = ok
    ? [
        "Your application has been reviewed.",
        "Your application to Prison Stream has been ACCEPTED.",
        "You've successfully made it through the application process and have been selected to move forward with the project.",
        "Further information regarding the next steps will be sent to you separately.",
        "Until then, please keep any information you receive regarding Prison Stream private unless you are told otherwise.",
      ]
    : [
        "Thank you for taking the time to apply for Prison Stream.",
        "Your application has now been reviewed.",
        "Unfortunately, your application has not been selected to move forward on this occasion.",
        "We appreciate your interest in being part of the project and the time you put into your application.",
      ];
  const status = ok ? ["ACCEPTED", "APPROVED"] : ["REJECTED", "DENIED"];
  const closing = ok ? "WELCOME INSIDE." : "Thank you for your interest in Prison Stream.";

  const text = [
    "PRISON STREAM", "", "APPLICATION STATUS", headline, "", greet, "",
    ...paras.flatMap((p) => [p, ""]),
    `STATUS: ${status[0]}`, `CLEARANCE: ${status[1]}`, "", closing, "", "— PRISON STREAM", "", "AUTUMN 2026",
  ].join("\n");

  const mono = "font-family:'Courier New',Courier,monospace;";
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"></head>
<body style="margin:0;padding:0;background:#000000;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#000000;"><tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#141414;border:1px solid #3a3a3a;">
<tr><td style="height:4px;background:${accent};font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td align="center" style="padding:40px 32px 24px;background:#ffffff;">
<img src="${PUBLIC_ORIGIN}${logo.url}" alt="PRISON STREAM" width="320" style="display:block;width:100%;max-width:320px;height:auto;border:0;">
</td></tr>
<tr><td style="padding:32px 32px 8px;${mono}color:#8a8a8a;font-size:11px;letter-spacing:4px;">APPLICATION STATUS</td></tr>
<tr><td style="padding:0 32px 24px;${mono}color:${accent};font-size:26px;font-weight:bold;letter-spacing:5px;">${headline}</td></tr>
<tr><td style="padding:0 32px;"><div style="border-top:1px solid #333;"></div></td></tr>
<tr><td style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;color:#eeeae2;font-size:15px;line-height:1.7;">
<p style="margin:0 0 18px;">${esc(greet)}</p>
${paras.map((p) => `<p style="margin:0 0 18px;">${esc(p)}</p>`).join("")}
</td></tr>
<tr><td style="padding:8px 32px 28px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;border:1px solid #333;border-left:3px solid ${accent};">
<tr><td style="padding:18px 20px;${mono}color:#eeeae2;font-size:13px;letter-spacing:3px;line-height:2;">
STATUS: <span style="color:${accent};font-weight:bold;">${status[0]}</span><br>CLEARANCE: <span style="color:${accent};font-weight:bold;">${status[1]}</span>
</td></tr></table></td></tr>
<tr><td style="padding:0 32px 8px;${mono}color:#eeeae2;font-size:14px;letter-spacing:3px;">${esc(closing)}</td></tr>
<tr><td style="padding:16px 32px 36px;${mono}color:#8a8a8a;font-size:12px;letter-spacing:3px;line-height:1.9;">— PRISON STREAM<br>AUTUMN 2026</td></tr>
<tr><td style="height:4px;background:${accent};font-size:0;line-height:0;">&nbsp;</td></tr>
</table></td></tr></table></body></html>`;

  return { subject, text, html };
}
