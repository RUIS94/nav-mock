import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/income-calculator")({
  component: () => <PageStub title="Income Calculator" description="Project earnings and required pipeline to hit your target." />,
});
