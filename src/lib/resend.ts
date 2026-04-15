import { Resend } from "resend";

let resendClient: Resend | null = null;

function getClient(): Resend {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    resendClient = new Resend(key);
  }
  return resendClient;
}

export async function sendAuditEmail(
  to: string,
  firstName: string,
  businessName: string,
  htmlReport: string
): Promise<{ success: boolean; error?: string }> {
  const resend = getClient();

  const { error } = await resend.emails.send({
    from: "Ryan @ Organically <ryan@organicallyseo.com>",
    to,
    subject: `${firstName}, your free SEO audit for ${businessName} is ready`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <p>Hey ${firstName},</p>
        <p>Thanks for requesting your free SEO audit. Your personalized report for <strong>${businessName}</strong> is attached.</p>
        <p>Inside you'll find:</p>
        <ul>
          <li>Your Domain Rating and how it compares</li>
          <li>How much organic traffic you're getting (and leaving on the table)</li>
          <li>Your biggest keyword opportunity</li>
          <li>A look at what your top competitor is doing</li>
        </ul>
        <p>Take a look, and when you're ready to turn these insights into real growth, let's talk:</p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="https://calendly.com/organically/30min" style="background-color: #7ec700; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Book Your Free Strategy Call</a>
        </p>
        <p>— Ryan Scanlon<br/>Organically</p>
      </div>
    `,
    attachments: [
      {
        filename: `${businessName.replace(/[^a-zA-Z0-9]/g, "-")}-SEO-Audit.html`,
        content: Buffer.from(htmlReport).toString("base64"),
        contentType: "text/html",
      },
    ],
  });

  if (error) {
    console.error("Resend error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
