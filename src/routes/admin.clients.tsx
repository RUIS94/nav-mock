import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/admin/clients")({
  component: () => <PageStub title="Clients" />,
});
