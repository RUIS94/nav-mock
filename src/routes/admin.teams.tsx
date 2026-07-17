import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/admin/teams")({
  component: () => <PageStub title="Teams" />,
});
