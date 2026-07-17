import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/dashboard")({
  component: () => <PageStub title="Dashboard" description="Overview of meetings, tasks, deals and key sales metrics." />,
});
