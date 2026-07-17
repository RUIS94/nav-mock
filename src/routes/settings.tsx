import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/settings")({
  component: () => <PageStub title="Settings" description="Personal preferences and notifications." />,
});
