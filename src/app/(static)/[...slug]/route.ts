import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  // Look for static HTML in public/
  const possiblePaths = [
    path.join(process.cwd(), "public", slugPath, "index.html"),
    path.join(process.cwd(), "public", `${slugPath}.html`),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, "utf-8");
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
  }

  // 404
  return new Response("Not Found", { status: 404 });
}
