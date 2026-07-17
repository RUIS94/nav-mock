import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/sdr/reports")({
  component: () => <PageStub title="SDR Reports" description="Win rates, trends and call performance analytics." />,
});
