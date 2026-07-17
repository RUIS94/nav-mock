import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/admin/billing")({
  component: () => <PageStub title="Billing" description="Plans, invoices and payment history." />,
});
