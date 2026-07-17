import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/integrations")({
  component: () => <PageStub title="Integrations" description="Connect Teams, Zoom, Hubspot, Salesforce, Gmail, Slack and more." />,
});
