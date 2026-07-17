import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/crm/contacts")({
  component: () => <PageStub title="Contacts" />,
});
