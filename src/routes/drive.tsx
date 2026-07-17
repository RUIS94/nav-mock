import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";
export const Route = createFileRoute("/drive")({
  component: () => <PageStub title="Sam Drive" description="All your meeting media, transcripts, emails and customer docs." />,
});
