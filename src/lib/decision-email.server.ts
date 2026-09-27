const PUBLIC_ORIGIN = "https://project--73781519-bd03-4c41-87d9-5a00cd943a4d.lovable.app";
const LOGO_URL = `${PUBLIC_ORIGIN}/email/ps-logo-dark.png`;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export type Decision = "ACCEPTED" | "REJECTED";

export function firstName(fullName: string | null | undefined) {
  const f = (fullName ?? "").trim().split(/\s+/)[0] ?? "";
  return f ? f.charAt(0).toUpperCase() + f.slice(1) : "";
}

export function buildDecisionEmail(decision: Decision, fullName: string | null | undefined, ref?: string) {
  const first = firstName(fullName);
  const greet = first ? `Hi ${first},` : "Hi there,";
  const ok = decision === "ACCEPTED";
  const accent = ok ? "#3f9a5c" : "#8f2a2a";
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
  const fileNo = `PS-${(ref ?? "").replace(/-/g, "").slice(0, 6).toUpperCase() || "000000"}`;

  const text = [
    "PRISON STREAM", "", "APPLICATION STATUS", headline, "", greet, "",
    ...paras.flatMap((p) => [p, ""]),
    `STATUS: ${status[0]}`, `CLEARANCE: ${status[1]}`, `FILE: ${fileNo}`, "", closing, "", "— PRISON STREAM", "", "LAUNCHING 19 OCTOBER 2026",
  ].join("\n");

  const mono = "font-family:'Courier New',Courier,monospace;";
  const sans = "font-family:Arial,Helvetica,sans-serif;";
  const cell = (label: string, value: string, color: string) =>
    `<td width="33%" valign="top" style="padding:14px 12px;border:1px solid #2a2a2a;background:#0a0a0a;">
<div style="${mono}color:#6f6f6f;font-size:9px;letter-spacing:3px;">${label}</div>
<div style="${mono}color:${color};font-size:13px;font-weight:bold;letter-spacing:2px;padding-top:6px;">${value}</div></td>`;

  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>
<body style="margin:0;padding:0;background:#000000;">
<div style="display:none;max-height:0;overflow:hidden;">${esc(headline)} — your Prison Stream application has been reviewed.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#000000;"><tr><td align="center" style="padding:28px 10px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
<tr><td style="padding:0 4px 10px;${mono}color:#5a5a5a;font-size:10px;letter-spacing:3px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="${mono}color:#5a5a5a;font-size:10px;letter-spacing:3px;">// SECURE TRANSMISSION</td>
<td align="right" style="${mono}color:#5a5a5a;font-size:10px;letter-spacing:3px;">FILE ${fileNo}</td></tr></table></td></tr>
<tr><td style="background:#0d0d0d;border:1px solid #2e2e2e;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="height:3px;background:${accent};font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td align="center" style="padding:36px 28px 22px;background:#000000;">
<img src="${LOGO_URL}" alt="PRISON STREAM" width="380" style="display:block;width:100%;max-width:380px;height:auto;border:0;">
</td></tr>
<tr><td style="background:#000;padding:0 28px 26px;" align="center">
<div style="${mono}color:#8a8a8a;font-size:10px;letter-spacing:6px;">▪ ▪ ▪ &nbsp;FACILITY RECORDS&nbsp; ▪ ▪ ▪</div></td></tr>
<tr><td style="height:1px;background:#2e2e2e;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td align="center" style="padding:34px 28px 6px;${mono}color:#8a8a8a;font-size:11px;letter-spacing:5px;">APPLICATION STATUS</td></tr>
<tr><td align="center" style="padding:6px 28px 30px;">
<table role="presentation" cellpadding="0" cellspacing="0" style="border:2px solid ${accent};"><tr>
<td style="padding:12px 26px;${mono}color:${accent};font-size:24px;font-weight:bold;letter-spacing:6px;">${headline}</td></tr></table></td></tr>
<tr><td style="padding:6px 36px 6px;${sans}color:#eeeae2;font-size:15px;line-height:1.75;">
<p style="margin:0 0 18px;font-weight:bold;">${esc(greet)}</p>
${paras.map((p) => `<p style="margin:0 0 18px;color:#cfcac2;">${esc(p)}</p>`).join("")}
</td></tr>
<tr><td style="padding:10px 28px 30px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>
${cell("STATUS", status[0]!, accent)}${cell("CLEARANCE", status[1]!, accent)}${cell("FILE", fileNo, "#eeeae2")}
</tr></table></td></tr>
<tr><td align="center" style="padding:0 28px 8px;${mono}color:#ffffff;font-size:15px;font-weight:bold;letter-spacing:4px;">${esc(closing)}</td></tr>
<tr><td align="center" style="padding:14px 28px 34px;${mono}color:#8a8a8a;font-size:11px;letter-spacing:4px;line-height:1.9;">— PRISON STREAM</td></tr>
<tr><td style="height:3px;background:${accent};font-size:0;line-height:0;">&nbsp;</td></tr>
</table></td></tr>
<tr><td align="center" style="padding:18px 8px 0;${mono}color:#4a4a4a;font-size:10px;letter-spacing:4px;line-height:1.8;">LAUNCHING 19 OCTOBER 2026<br>NOTHING LEAVES THE FACILITY EARLY.</td></tr>
</table></td></tr></table></body></html>`;

  return { subject, text, html };
}
