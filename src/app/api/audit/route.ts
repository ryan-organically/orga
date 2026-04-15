import { NextRequest, NextResponse } from "next/server";
import { fetchAuditData } from "@/lib/ahrefs";
import { sendAuditEmail } from "@/lib/resend";
import { generateAuditReportHTML } from "@/templates/audit-report";
import { extractDomain } from "@/lib/utils/domain";
import type { LeadData } from "@/types/ahrefs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { first_name, business_name, email, website } = body;
    if (!first_name || !business_name || !email || !website) {
      return NextResponse.json(
        {
          error: "Missing required fields: first_name, business_name, email, website",
        },
        { status: 400 }
      );
    }

    const lead: LeadData = {
      first_name: String(body.first_name),
      business_name: String(body.business_name),
      email: String(body.email),
      website: String(body.website),
      trade: String(body.trade || "contracting"),
      city: String(body.city || ""),
      state: String(body.state || ""),
    };

    const domain = extractDomain(lead.website);

    // Fetch Ahrefs data
    console.log(`[audit] Fetching Ahrefs data for ${domain}...`);
    const auditData = await fetchAuditData(domain);
    console.log(
      `[audit] Data fetched: hasData=${auditData.hasData}, DR=${auditData.domainRating?.domain_rating ?? "N/A"}`
    );

    // Generate HTML report
    const htmlReport = generateAuditReportHTML(lead, auditData);

    // Send email
    console.log(`[audit] Sending report to ${lead.email}...`);
    const emailResult = await sendAuditEmail(
      lead.email,
      lead.first_name,
      lead.business_name,
      htmlReport
    );

    if (!emailResult.success) {
      console.error(`[audit] Email failed: ${emailResult.error}`);
      return NextResponse.json(
        { error: "Failed to send email", detail: emailResult.error },
        { status: 500 }
      );
    }

    console.log(`[audit] Report sent successfully to ${lead.email}`);

    return NextResponse.json({
      success: true,
      domain,
      hasData: auditData.hasData,
      domainRating: auditData.domainRating?.domain_rating ?? null,
      emailSent: true,
    });
  } catch (err) {
    console.error("[audit] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
