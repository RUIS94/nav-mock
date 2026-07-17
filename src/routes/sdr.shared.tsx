import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/sdr/shared")({
  component: () => <PageStub title="Shared Calls" description="Calls shared with you and shared by you." />,
});
