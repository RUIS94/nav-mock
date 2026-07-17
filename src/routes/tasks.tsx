import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/tasks")({
  component: () => <PageStub title="Tasks" description="Manage tasks created manually or by AI from meetings." />,
});
