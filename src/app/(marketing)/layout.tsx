import { ThreeColumnLayout } from "@/components/layout";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThreeColumnLayout>{children}</ThreeColumnLayout>;
}
