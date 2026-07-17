import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/profile")({
  component: () => <PageStub title="Profile" description="Your account info and activity log." />,
});
