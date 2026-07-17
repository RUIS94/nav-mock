import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/onboarding")({
  component: () => <PageStub title="Get Started" description="A quick tour of how to use Sam." />,
});
