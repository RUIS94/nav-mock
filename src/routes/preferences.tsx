import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/preferences")({
  component: () => <PageStub title="Preferences" description="Personalize notifications, language, theme and default views." />,
});
