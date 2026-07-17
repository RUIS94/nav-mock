import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/admin/solutions")({
  component: () => <PageStub title="Solutions" description="Company-wide solution templates." />,
});
