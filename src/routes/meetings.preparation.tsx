import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/meetings/preparation")({
  component: () => <PageStub title="Meeting Preparation" description="AI-assisted prep notes and customer briefings." />,
});
