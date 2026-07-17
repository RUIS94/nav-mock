import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/meetings/")({
  component: () => <PageStub title="All Meetings" description="Calendar and table view of every meeting." />,
});
