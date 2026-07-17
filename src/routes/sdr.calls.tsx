import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/sdr/calls")({
  component: () => <PageStub title="Calls" description="Sales calls pulled from your CRM, ready to analyze." />,
});
